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

// BOT READY
client.on('ready', async () => {
    console.log(`✅ Bot online als ${client.user.tag}`);

    const channelId = "1487375222092075109"; // ❗ HIER ÄNDERN

    setInterval(async () => {
        try {
            console.log("🔄 Update Leaderboard...");

            const channel = await client.channels.fetch(channelId);
            if (!channel) return console.log("❌ Channel nicht gefunden");

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

            if (!description) description = "Keine Daten";

            const embed = new EmbedBuilder()
                .setTitle("🏆 Leaderboard")
                .setDescription(description)
                .setColor("#5865F2");

            let messageId = await db.get("leaderboardMessage");

            if (!messageId) {
                const msg = await channel.send({ embeds: [embed] });
                await db.set("leaderboardMessage", msg.id);
                console.log("📩 Neue Nachricht gesendet");
            } else {
                try {
                    const msg = await channel.messages.fetch(messageId);
                    await msg.edit({ embeds: [embed] });
                    console.log("✏️ Nachricht aktualisiert");
                } catch {
                    const msg = await channel.send({ embeds: [embed] });
                    await db.set("leaderboardMessage", msg.id);
                    console.log("♻️ Nachricht neu erstellt");
                }
            }

        } catch (err) {
            console.error("❌ Fehler:", err);
        }

    }, 30000); // alle 30 Sekunden
});

// Nachrichten zählen
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    await db.add(`messages_${message.author.id}`, 1);
});

client.login(process.env.TOKEN);
