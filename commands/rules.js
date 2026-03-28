const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "rules",
    description: "Sendet die Server Regeln",

    async execute(message) {

        const embed = new EmbedBuilder()
            .setColor("#0f172a") // passt zu deinem Leaderboard Style
            .setTitle("📜 ORBIT RULES")
            .setDescription("Follow these rules to stay safe on the server.")

            .addFields(
                {
                    name: "⚖️ Moderate",
                    value:
`• Respect Staff  
• Flooding / Spamming  
• No unnecessary pings  
• Use channels correctly  
• No troll pics`,
                    inline: true
                },
                {
                    name: "🚫 Major",
                    value:
`• No Advertising  
• No NSFW content  
• No rule bypassing  
• No hate speech`,
                    inline: true
                },
                {
                    name: "🎤 Voice",
                    value:
`• No ear rape  
• No sexism  
• No voice changers  
• No trolling`,
                    inline: true
                },
                {
                    name: "🛡️ Punishment",
                    value:
`NSFW Content results in a Timeout
Repeated NSFW content = permanent ban`,
                    inline: false
                }
            )

            // 🎥 HIER DEIN GIF REIN!
            .setImage("https://media.discordapp.net/attachments/1432805772856791070/1487301251069902859/5dd80fe00a06651f3200aea753987f50.gif?ex=69c8a4ba&is=69c7533a&hm=bdf4479e7c4ff4fe987520e6f879921c1f735fe842a5e92937220b2141b3dfd0&=")

            .setFooter({ text: "Orbit Community • Stay respectful" });

        await message.channel.send({ embeds: [embed] });
    }
};