module.exports = {
    name: 'ban',
    async execute(message, args) {

        if (!message.member.permissions.has("BanMembers")) {
            return message.reply("❌ No Rights nga!");
        }

        const user = message.mentions.members.first();

        if (!user) {
            return message.reply("❗ please ping user!");
        }

        await user.ban();
        message.channel.send(`🔨 ${user.user.tag} got banned!`);
    }
};