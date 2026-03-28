module.exports = {
    name: 'role',
    async execute(message, args) {

        if (!message.member.permissions.has("ManageRoles")) {
            return message.reply("❌ No Rights!");
        }

        const user = message.mentions.members.first();
        if (!user) return message.reply("❗ Please ping user!");

        const roleName = args.slice(1).join(" ");
        if (!roleName) return message.reply("❗ Please give me the name of the role!");

        const role = message.guild.roles.cache.find(r => r.name === roleName);
        if (!role) return message.reply("❗ role not found!");

        try {
            await user.roles.add(role);

            message.channel.send(`🎭 ${user.user.tag} received **${role.name}** role!`);
        } catch (error) {
            console.error(error);
            message.reply("❌ Error!");
        }
    }
};