const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {
    client.ban = async (member, reasons) => {
        await member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`⛔ คุณถูกแบน\n\`\`\`${reasons.th ?? null}\`\`\`\nหากคิดว่าเป็นเรื่องเข้าใจผิดกรุณาส่งเรื่องไปยัง **[DekPua Support](https://discord.com/channels/1213126282921902230/1224718613131563028)**.\n\n⛔ You have been banned\n\`\`\`${reasons.en ?? null}\`\`\`\n If there must be a misunderstanding, please send the matter to **[DekPua Support](https://discord.com/channels/1213126282921902230/1224718613131563028)**.`)
                    .setTimestamp(Date.now())
            ]
        });

        const BannedRole = await member.guild.roles.cache.get('1224776064769720371');

        const hasBanned = await member.roles.cache.has(BannedRole);

        if (!hasBanned) await member.roles.add(BannedRole);

        return true;
    }

    client.timeout = async (member, time, reasons) => {
        await member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`⛔ บัญชีถูกปิดใช้งานชั่วคราว\n\`\`\`${reasons.th ?? null}\`\`\`\nหากคิดว่าเป็นเรื่องเข้าใจผิดกรุณาส่งเรื่องไปยัง **[DekPua Support](https://discord.com/channels/1213126282921902230/1224718613131563028)**.\n\n⛔ You have been timeout\n\`\`\`${reasons.en ?? null}\`\`\`\n If there must be a misunderstanding, please send the matter to **[DekPua Support](https://discord.com/channels/1213126282921902230/1224718613131563028)**.`)
                    .setTimestamp(Date.now())
            ]
        });

        await member.timeout(time, `\`\`\`TH: ${reasons.th}\nEN: ${reasons.en}\`\`\``);

        return true;
    }
}