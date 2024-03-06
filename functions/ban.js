const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {
    client.ban = async (member, reasons, banBy = null) => {
        await member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`⛔ คุณถูกแบน\n\`\`\`${reasons.th ?? null}\`\`\`\nหากคิดว่าเป็นเรื่องเข้าใจผิดกรุณาส่งเรื่องไปยัง **[Dek Pua Support](https://www.dekpua.com/support?action=ticket)**.\n\n⛔ You have been banned\n\`\`\`${reasons.en ?? null}\`\`\`\n If there must be a misunderstanding, please send the matter to **[Dek Pua Support](https://www.dekpua.com/support?action=ticket)**.${banBy != null ? `\n\nBan by Moderator ${banBy}` : ''}`)
                    .setTimestamp(Date.now())
            ]
        });

        await member.ban({
            reason: `TH: ${reasons.th ?? null} | ENG: ${reasons.en ?? null}`,
            deleteMessageSeconds: 60 * 60 * 24,
        });

        return true;
    }
}