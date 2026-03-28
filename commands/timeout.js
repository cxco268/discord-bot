module.exports = {
    name: 'timeout',
    async execute(message, args) {

        if (!message.member.permissions.has("ModerateMembers")) {
            return message.reply("❌ HAHAHA, NO RIGHTS!");
        }

        const user = message.mentions.members.first();
        if (!user) return message.reply("❗ Please ping user!");

        const time = args[1];
        if (!time) return message.reply("❗ Please put time (10m, 1h)");

        let ms;

        if (time.endsWith("m")) {
            ms = parseInt(time) * 60 * 1000;
        } else if (time.endsWith("h")) {
            ms = parseInt(time) * 60 * 60 * 1000;
        } else {
            return message.reply("❗ Format: 10m or 1h");
        }

        await user.timeout(ms);

        message.channel.send(`🔇 ${user.user.tag} got timeouted for ${time}.`);
    }
};