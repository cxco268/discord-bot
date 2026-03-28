module.exports = {
    name: 'kick',
    async execute(message, args) {

        if (!message.member.permissions.has("KickMembers")) {
            return message.reply("❌ No Rights!");
        }

        const user = message.mentions.members.first();

        if (!user) {
            return message.reply("❗ Please ping user!");
        }

        await user.kick();
        message.channel.send(`👢 ${user.user.tag} got kicked!`);
    }
};