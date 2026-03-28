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
client.on('ready', async () => {
    console.log(`Bot ist online als ${client.user.tag}`);

    const channelId = "1487375222092075109";
    const messageKey = "leaderboardMessage";

    setInterval(async () => {

        const channel = await client.channels.fetch(channelId);
        if (!channel) return;

        const data = await db.all();

        const filtered = data
            .filter(e => e.id.startsWith("messages_"))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);

        const users = [];

        for (const entry of filtered) {
            const userId = entry.id.split("_")[1];
            const user = await client.users.fetch(userId);

            users.push({
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                messages: entry.value
            });
        }

        const buffer = await generateLeaderboard(users);
        const attachment = new AttachmentBuilder(buffer, { name: 'leaderboard.png' });

        let messageId = await db.get(messageKey);

        if (!messageId) {
            const msg = await channel.send({ files: [attachment] });
            await db.set(messageKey, msg.id);
        } else {
            try {
                const msg = await channel.messages.fetch(messageId);
                await msg.edit({ files: [attachment] });
            } catch {
                const msg = await channel.send({ files: [attachment] });
                await db.set(messageKey, msg.id);
            }
        }

    }, 60000); // 1 Minute

});

// 📊 Nachrichten zählen
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    await db.add(`messages_${message.author.id}`, 1);
});

client.login(process.env.TOKEN);
