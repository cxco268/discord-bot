const { createCanvas, loadImage } = require('canvas');

async function generateLeaderboard(users) {

    const canvas = createCanvas(1000, 600);
    const ctx = canvas.getContext('2d');

    // Hintergrund
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Titel
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Leaderboard', canvas.width / 2, 50);

    if (!users.length) return canvas.toBuffer();

    // 🥇 Platz 1
    const first = users[0];
    const avatar = await loadImage(`https://cdn.discordapp.com/avatars/${first.id}/${first.avatar}.png`);

    const x = canvas.width / 2;
    const y = 200;
    const size = 80;

    // Glow
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 50;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(avatar, x - size, y - size, size * 2, size * 2);

    ctx.shadowBlur = 0;

    // Username
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(first.username, x, y + 120);

    // Messages
    ctx.fillStyle = '#38bdf8';
    ctx.font = '20px sans-serif';
    ctx.fillText(`${first.messages} Messages`, x, y + 150);

    // Liste
    let startY = 100;

    for (let i = 1; i < users.length; i++) {
        const u = users[i];

        ctx.textAlign = 'left';

        ctx.fillStyle = '#ffffff';
        ctx.font = '20px sans-serif';
        ctx.fillText(`#${i + 1} ${u.username}`, 80, startY);

        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`${u.messages}`, 400, startY);

        startY += 35;
    }

    return canvas.toBuffer();
}

module.exports = { generateLeaderboard };
