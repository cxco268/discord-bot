const { createCanvas, loadImage } = require('canvas');

async function generateLeaderboard(users) {
    const canvas = createCanvas(1000, 700);
    const ctx = canvas.getContext('2d');

    // Hintergrund
    const gradient = ctx.createLinearGradient(0, 0, 1000, 700);
    gradient.addColorStop(0, "#0f172a");
    gradient.addColorStop(1, "#020617");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Titel
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px Arial";
    ctx.fillText("🏆 Leaderboard", canvas.width / 2, 50);

    // 🌈 PULSIERENDER GLOW (nur visuell, beeinflusst nichts)
    function drawGlow(x, y, radius) {
        const colors = [
            "#ff0000",
            "#ff7f00",
            "#ffff00",
            "#00ff00",
            "#00ffff",
            "#0000ff",
            "#8f00ff"
        ];

        const time = Date.now() / 300;
        const pulse = Math.sin(time) * 10;

        for (let i = 0; i < colors.length; i++) {
            const offset = Math.sin(time + i) * 6;

            ctx.shadowColor = colors[i];
            ctx.shadowBlur = 40 + pulse + i * 5;

            ctx.beginPath();
            ctx.arc(x + offset, y, radius + pulse / 4, 0, Math.PI * 2);
            ctx.fillStyle = colors[i];
            ctx.fill();
        }

        ctx.shadowBlur = 0;
    }

    // 🥇🥈🥉 Positionen
    const positions = [
        { x: 500, y: 180, size: 70 },
        { x: 250, y: 220, size: 50 },
        { x: 750, y: 220, size: 50 }
    ];

    for (let i = 0; i < 3; i++) {
        if (!users[i]) continue;

        const user = users[i];

        try {
            const avatarURL = user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                : "https://cdn.discordapp.com/embed/avatars/0.png";

            const avatar = await loadImage(avatarURL);

            // 🌈 Glow nur Platz 1
            if (i === 0) {
                drawGlow(positions[i].x, positions[i].y, positions[i].size);
            }

            // Avatar
            ctx.save();
            ctx.beginPath();
            ctx.arc(positions[i].x, positions[i].y, positions[i].size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(
                avatar,
                positions[i].x - positions[i].size,
                positions[i].y - positions[i].size,
                positions[i].size * 2,
                positions[i].size * 2
            );
            ctx.restore();

            // 👑 KRONE (STABIL + KEIN WACKELN)
            if (i === 0) {
                const crown = await loadImage('./assets/crown.png');

                const crownWidth = 110;
                const crownHeight = 65;

                ctx.save();

                // 👉 feste Position (KEIN OFFSET BUG MEHR)
                const cx = positions[i].x;
                const cy = positions[i].y - positions[i].size - 25;

                ctx.translate(cx, cy);

                // leichte Drehung
                ctx.rotate(-0.15);

                ctx.drawImage(
                    crown,
                    -crownWidth / 2,
                    -crownHeight / 2,
                    crownWidth,
                    crownHeight
                );

                ctx.restore();
            }

            // Username
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 20px Arial";
            ctx.fillText(user.username, positions[i].x, positions[i].y + positions[i].size + 30);

            // Nachrichten
            ctx.fillStyle = "#38bdf8";
            ctx.font = "18px Arial";
            ctx.fillText(`${user.messages} Messages`, positions[i].x, positions[i].y + positions[i].size + 55);

        } catch (e) {
            console.log(e);
        }
    }

    // 🔽 Top 4–10
    let y = 400;

    for (let i = 3; i < users.length; i++) {
        const user = users[i];

        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fillRect(200, y - 30, 600, 50);

        try {
            const avatarURL = user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                : "https://cdn.discordapp.com/embed/avatars/0.png";

            const avatar = await loadImage(avatarURL);

            ctx.save();
            ctx.beginPath();
            ctx.arc(230, y - 5, 20, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(avatar, 210, y - 25, 40, 40);
            ctx.restore();
        } catch (e) {}

        ctx.textAlign = "left";
        ctx.fillStyle = "#ffffff";
        ctx.font = "18px Arial";
        ctx.fillText(`${i + 1}. ${user.username}`, 270, y);

        ctx.textAlign = "right";
        ctx.fillStyle = "#38bdf8";
        ctx.fillText(`${user.messages} messages`, 770, y);

        y += 60;
    }

    return canvas.toBuffer();
}

module.exports = { generateLeaderboard };