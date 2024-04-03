const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Ban Message')
        .setType(ApplicationCommandType.Message)
        .setNameLocalizations({
            th: "แบนผู้ใช้"
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId(`admin_panel_action_ban_${interaction.targetMessage.author.id}_none`)
            .setTitle("แผงควบคุมการแบน");

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

        const firstRow = new ActionRowBuilder().addComponents(reason_th);
        const secondRow = new ActionRowBuilder().addComponents(reason_en);

        modal.addComponents(firstRow, secondRow);

        await interaction.showModal(modal)
    }
}