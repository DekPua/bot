const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.channelId != '1213789140555137025') return

        await message.delete();

        await message.member.send({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription('⛔ คุณถูกแบนเนื่องจากสงสัยว่าเป็นสแปม\nหากคิดว่าเป็นเรื่องเข้าใจผิดกรุณาส่งเรื่องไปยัง **[Dek Pua Support](https://www.dekpua.com/support?action=ticket)**.\n\n⛔ You have been banned due to suspicion of spam.\nIf you believe this is a misunderstanding, please submit a ticket to **[Dek Pua Support](https://www.dekpua.com/support?action=ticket)**.')
            ]
        });

        await message.member.ban({
            deleteMessageSeconds: 60 * 60 * 24,
            reason: "[AntiScam] สงสัยว่าเป็นสแปม Suspected of spam"
        });
    }
}