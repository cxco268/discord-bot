module.exports = {
    name: 'clear',
    async execute(message, args) {

        if (!message.member.permissions.has("ManageMessages")) {
            return message.reply("❌ No Rights!");
        }

        const amount = args[0];

        if (!amount || isNaN(amount)) {
            return message.reply("❗ Please give me a number!");
        }

        if (amount > 100) {
            return message.reply("❗ only up to 100 messages nga!");
        }

        await message.channel.bulkDelete(amount, true);
        message.channel.send(`🧹 ${amount} messages got deleted, good boy!`);
    }
};