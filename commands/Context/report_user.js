const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

const langs = {
    "th": {
        "modal.report_system.user.title": "รายงานผู้ใช้",
        "modal.report_system.user.input.detail": "รายละเอียดของปัญหา",
        "modal.report_system.user.input.detail.placeholder": "ตัวอย่าง: เนื้อหาทางเพศ"
    },
    "en-us": {
        "modal.report_system.user.title": "User Report",
        "modal.report_system.user.input.detail": "Details",
        "modal.report_system.user.input.detail.placeholder": "Example: Spam messages"
    }
}

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Report User')
    .setType(ApplicationCommandType.User)
    .setNameLocalizations({
        th: "รายงานผู้ใช้"
    }),
    async execute(interaction, client) {
        const lang = langs[interaction.locale] ?? langs["en-us"];
        const modal = new ModalBuilder()
        .setCustomId(`report_system_user_${interaction.targetUser.id}`)
        .setTitle(lang['modal.report_system.user.title']);

        const detail = new TextInputBuilder()
        .setCustomId('report_system_user_detail')
        .setLabel(lang['modal.report_system.user.input.detail'])
        .setMinLength(6)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder(lang['modal.report_system.user.input.detail.placeholder'])
        .setRequired(true);

        const row = new ActionRowBuilder().addComponents(detail);

        modal.addComponents(row);

        await interaction.showModal(modal);
    }
}