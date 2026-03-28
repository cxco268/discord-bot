const { generateLeaderboard } = require('./utils/leaderboardCard');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const { QuickDB } = require("quick.db");

const db = new QuickDB();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

// Commands laden
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// READY EVENT
client.on('ready', async () => {
    console.log(`Bot ist online als ${client.user.tag}`);

    const channelId = "1487375222092075109"; // ✅ DEIN CHANNEL
    const messageIdKey = "leaderboardMessage";

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

        const buffer = await generateLeaderboard(users);

        let messageId = await db.get(messageIdKey);

        if (!messageId) {
            const msg = await channel.send({
                files: [{ attachment: buffer, name: "leaderboard.png" }]
            });
            await db.set(messageIdKey, msg.id);
        } else {
            try {
                const msg = await channel.messages.fetch(messageId);
                await msg.edit({
                    files: [{ attachment: buffer, name: "leaderboard.png" }]
                });
            } catch {
                const msg = await channel.send({
                    files: [{ attachment: buffer, name: "leaderboard.png" }]
                });
                await db.set(messageIdKey, msg.id);
            }
        }

    }, 10000); // ⏱️ 10 Sekunden zum testen
});

// 📊 Nachrichten zählen
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    await db.add(`messages_${message.author.id}`, 1);
});

// ⚙️ COMMAND HANDLER
const prefix = "!";

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('❌ Error!');
    }
});

client.login('MTQ4NzMzNDgzMDk4MjMwMzgyNg.G1ZBUS.6j2MDO-BrSXtFRhfPPEtl-lr4Mk6TrjnQZDeGw');