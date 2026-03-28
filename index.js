const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const { generateLeaderboard } = require('./utils/leaderboardCard');

const db = new QuickDB();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// READY
client.on('ready', () => {
    console.log(`Bot ist online als ${client.user.tag}`);

    const channelId = "1487375222092075109"; // 👈 ändern!

    setInterval(async () => {

        const channel = await client.channels.fetch(channelId);
        if (!channel) return;

        const data = await db.all();

        const filtered = data
            .filter(entry => entry.id.startsWith("messages_"))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);

        const users = [];

        for (let i = 0; i < filtered.length; i++) {
            const userId = filtered[i].id.split("_")[1];
            const user = await client.users.fetch(userId);

            users.push({
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                messages: filtered[i].value
            });
        }

        const buffer = await generateLeaderboard(users, client);
        const attachment = new AttachmentBuilder(buffer, { name: 'leaderboard.png' });

        // alte Nachricht löschen & neu senden (einfacher)
        const messages = await channel.messages.fetch({ limit: 10 });
        const botMsg = messages.find(m => m.author.id === client.user.id);

        if (botMsg) {
            await botMsg.delete().catch(() => {});
        }

        await channel.send({ files: [attachment] });

    }, 60000); // jede Minute

});

// 📊 Nachrichten zählen
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    await db.add(`messages_${message.author.id}`, 1);
});

client.login(process.env.TOKEN);
