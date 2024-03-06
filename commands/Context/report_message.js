const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

const langs = {
    "th": {
        "modal.report_system.message.title": "รายงานข้อความ",
        "modal.report_system.message.input.detail": "รายละเอียดของปัญหา",
        "modal.report_system.message.input.detail.placeholder": "ตัวอย่าง: เนื้อหาทางเพศ"
    },
    "en-us": {
        "modal.report_system.message.title": "Message Report",
        "modal.report_system.message.input.detail": "Details",
        "modal.report_system.message.input.detail.placeholder": "Example: Sexual Content"
    }
}

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Report Message')
    .setType(ApplicationCommandType.Message)
    .setNameLocalizations({
        th: "รายงานข้อความ"
    }),
    async execute(interaction, client) {
        const lang = langs[interaction.locale] ?? langs["en-us"];
        const modal = new ModalBuilder()
        .setCustomId(`report_system_message_${interaction.targetMessage.channel.id}_${interaction.targetMessage.id}_${interaction.targetMessage.author.id}`)
        .setTitle(lang["modal.report_system.message.title"]);

        const detail = new TextInputBuilder()
        .setCustomId('report_system_message_detail')
        .setLabel(lang["modal.report_system.message.input.detail"])
        .setMinLength(6)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder(lang["modal.report_system.message.input.detail.placeholder"])
        .setRequired(true);

        const row = new ActionRowBuilder().addComponents(detail);

        modal.addComponents(row);

        await interaction.showModal(modal);
    }
}