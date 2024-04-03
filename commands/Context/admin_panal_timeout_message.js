const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Timeout Message')
        .setType(ApplicationCommandType.Message)
        .setNameLocalizations({
            th: "หมดเวลาผู้ใช้"
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {

        const modal = new ModalBuilder()
            .setCustomId(`admin_panel_action_timeout_${interaction.targetMessage.author.id}_none`)
            .setTitle("แผงควบคุมการหมดเวลา");

        const time_input = new TextInputBuilder()
            .setCustomId('time_input')
            .setLabel('ระยะเวลา (นาที)')
            .setPlaceholder('180')
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        const reason_th = new TextInputBuilder()
            .setCustomId('reason_th')
            .setMaxLength(1000)
            .setLabel('สาเหตุ')
            .setPlaceholder('ตัวอย่าง: ตั้งชื่อไม่เหมาะสม, ส่งข้อความที่เกี่ยวกับเนื้อหาทางเพศ')
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

        const reason_en = new TextInputBuilder()
            .setCustomId('reason_en')
            .setMaxLength(1000)
            .setLabel('Reason')
            .setPlaceholder('Examples: Inappropriate naming, sending sexually explicit messages')
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

        const timeRow = new ActionRowBuilder().addComponents(time_input);
        const firstRow = new ActionRowBuilder().addComponents(reason_th);
        const secondRow = new ActionRowBuilder().addComponents(reason_en);

        modal.addComponents(timeRow, firstRow, secondRow);

        await interaction.showModal(modal)
    }
}