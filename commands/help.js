module.exports = {
    name: 'help',
    execute(message) {
        message.reply(`
📜 **Commands:**
!ping
!help
!kick @user
!timeout @user time
!untimeout @user
!ban @user
!clear number
!role @user role
        `);
    }
};