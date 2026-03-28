module.exports = {
    name: 'untimeout',
    async execute(message, args) {

        if (!message.member.permissions.has("ModerateMembers")) {
            return message.reply("❌ No Rights!");
        }

        const user = message.mentions.members.first();
        if (!user) return message.reply("❗ Please ping user!");

        try {
            await user.timeout(null);

            message.channel.send(`🔓 ${user.user.tag} has been removed from timeout!.`);
        } catch (error) {
            console.error(error);
            message.reply("❌ Error!");
        }
    }
};