const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

const { updateLeaderboard } = require("./leaderboardSystem");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();
const prefix = "!";


// 📂 Commands laden
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}


// ✅ Bot ready
client.once("ready", () => {
  console.log(`Bot ist online als ${client.user.tag}`);

  // 🔄 Auto Leaderboard
  setInterval(() => {
    updateLeaderboard(client);
  }, 30000);
});


// 💬 Message Handler
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  // ⭐ XP System
  await db.add(`xp_${message.author.id}`, 10);

  // 🔄 Leaderboard updaten
  updateLeaderboard(client);

  // ❗ Commands
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();

  const command = client.commands.get(cmdName);
  if (!command) return;

  try {
    command.execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply("❌ Fehler beim Command");
  }
});


client.login(process.env.TOKEN);
