const { SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('broadcast')
    .setDescription("Create Broadcast for all user in this server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescriptionLocalizations({ th: "ส่งข้อความส่วนตัวไปยังทุกๆคนในเซิฟเวอร์" }),
    async execute(interaction, client) {
        const modal = new ModalBuilder()
        .setCustomId('broadcast_create')
        .setTitle("Create Broadcast (สร้างบรอดแคสต์)");

        const text = new TextInputBuilder()
        .setCustomId('text')
        .setLabel('Message (ข้อความ)')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('ข้อความ...')
        .setRequired(true);

        const access_text = new TextInputBuilder()
        .setCustomId('access')
        .setLabel('หากเข้าใจการุณากรอก "ยอมรับ"')
        .setRequired(true)
        .setPlaceholder('การส่งบรอดแคสต์อาจใช้เวลานานขึ้นอยู่กับจำนวนสมาชิกและเมื่อกดส่งแล้วไม่สามารถยกเลิกได้')
        .setStyle(TextInputStyle.Paragraph);

        const textAction = new ActionRowBuilder().addComponents(text);
        const accessAction = new ActionRowBuilder().addComponents(access_text);

        modal.addComponents(textAction, accessAction);

        await interaction.showModal(modal);
    }
}