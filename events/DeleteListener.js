const { Events, EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (process.env.IS_DEV) return;
        if (!message.guild || !message.author || message.author.bot || !message) return;

        if (message.guild.id != '1213126282921902230') return;

        if (message.channel.parent.id == '1213130644314660934') return;

        const sendChannel = await message.guild.channels.fetch('1226941337304305765');

        let attachments = await message.attachments.map(attachment => attachment.url);

        let member = message.author;

        let deleteAt = Date.now();

        let deleteUi = `<t:${Math.floor(deleteAt / 1000)}:R>`

        const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle(`⚠️ มีข้อความถูกลบใหม่!`)
            .setDescription(`ข้อความถูกลบเมื่อ ${deleteUi}`)
            .addFields(
                {
                    name: "เนื้อหา",
                    value: `${message.content || "(No Content)"}`
                },
                {
                    name: "ช่อง",
                    value: `${`<#${message.channel.id}> - (${message.channel.name})` || "(Some Where)"}`
                },
                {
                    name: "เจ้าของ",
                    value: `\`\`\`Username: ${member.username}\nId: ${member.id}\`\`\``
                }
            )
            .setFooter({ text: "Delete Log System" })
            .setTimestamp(deleteAt);

        const files = [];

        if (attachments.length > 0) {
            embed.addFields({
                name: "แนบไฟล์",
                value: attachments.join(' , ')
            });

            attachments.forEach(attachmentUrl => {
                const file = new AttachmentBuilder(attachmentUrl);

                files.push(file);
            });
        }

        await sendChannel.send({ embeds: [embed], files: files });
    }
}