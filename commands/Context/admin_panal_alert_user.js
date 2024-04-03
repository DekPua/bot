const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Alert User')
        .setType(ApplicationCommandType.User)
        .setNameLocalizations({
            th: "แจ้งเตือนผู้ใช้"
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId(`admin_panel_action_send_message_${interaction.targetId}_none`)
            .setTitle("แผงควบคุมการตักเตือน");

        const message = new TextInputBuilder()
            .setCustomId('message')
            .setLabel('ข้อความ')
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

        const firstRow = new ActionRowBuilder().addComponents(message);

        modal.addComponents(firstRow);

        await interaction.showModal(modal);
    }
}