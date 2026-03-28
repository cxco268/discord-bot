const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");

const db = new QuickDB();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', async () => {
    console.log(`Bot online als ${client.user.tag}`);

    const channelId = "DEIN_CHANNEL_ID";
    const messageKey = "leaderboardMessage";

    setInterval(async () => {

        const channel = await client.channels.fetch(channelId);
        if (!channel) return;

        const data = await db.all();

        const top = data
            .filter(e => e.id.startsWith("messages_"))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);

        let description = "";

        for (let i = 0; i < top.length; i++) {
            const userId = top[i].id.split("_")[1];
            const user = await client.users.fetch(userId);

            description += `**#${i + 1}** ${user.username} — \`${top[i].value} msgs\`\n`;
        }

        const embed = new EmbedBuilder()
            .setTitle("🏆 Leaderboard")
            .setColor("#38bdf8")
            .setDescription(description || "Keine Daten");

        let messageId = await db.get(messageKey);

        if (!messageId) {
            const msg = await channel.send({ embeds: [embed] });
            await db.set(messageKey, msg.id);
        } else {
            try {
                const msg = await channel.messages.fetch(messageId);
                await msg.edit({ embeds: [embed] });
            } catch {
                const msg = await channel.send({ embeds: [embed] });
                await db.set(messageKey, msg.id);
            }
        }

    }, 60000);

});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    await db.add(`messages_${message.author.id}`, 1);
});

client.login(process.env.TOKEN);
