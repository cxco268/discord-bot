const { EmbedBuilder } = require("discord.js");
const db = require("quick.db");

const CHANNEL_ID = "1487375222092075109"; // ⚠️ hier einsetzen

async function updateLeaderboard(client) {
  const channel = await client.channels.fetch(CHANNEL_ID).catch(() => null);
  if (!channel) return;

  const data = db.all()
    .filter(x => x.ID.startsWith("xp_"))
    .sort((a, b) => b.data - a.data)
    .slice(0, 10);

  let desc = "";

  for (let i = 0; i < data.length; i++) {
    const userId = data[i].ID.split("_")[1];
    const user = await client.users.fetch(userId).catch(() => null);

    const name = user ? user.username : "Unknown";
    const medals = ["🥇", "🥈", "🥉"];

    desc += `${medals[i] || `**${i + 1}.**`} **${name}** — \`${data[i].data} XP\`\n`;
  }

  const embed = new EmbedBuilder()
    .setTitle("🏆 ORBIT Leaderboard")
    .setDescription(desc || "no data.")
    .setColor("#a855f7")
    .setFooter({ text: "Auto Update Leaderboard" })
    .setTimestamp();

  let messageId = db.get("leaderboardMessage");

  if (!messageId) {
    const msg = await channel.send({ embeds: [embed] });
    db.set("leaderboardMessage", msg.id);
  } else {
    const msg = await channel.messages.fetch(messageId).catch(() => null);

    if (!msg) {
      const newMsg = await channel.send({ embeds: [embed] });
      db.set("leaderboardMessage", newMsg.id);
    } else {
      msg.edit({ embeds: [embed] });
    }
  }
}

module.exports = { updateLeaderboard };