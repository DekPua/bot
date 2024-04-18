const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Giveaway')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescriptionLocalizations({
            th: "กิจกรรมแจกของ"
        })
        .addSubcommand(sub => sub
            .setName('create')
            .setDescription("Create new Giveaway")
            .setDescriptionLocalizations({ th: "สร้างกิจกรรมแจกของใหม่" })
        ),
    async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId('giveaway_create')
            .setTitle("สร้างกิจกรรมแจกของใหม่ (Create new Giveaway)");

        const duration = new TextInputBuilder()
            .setCustomId('duration')
            .setLabel("ระยะเวลา (Duration)")
            .setPlaceholder("10 seconds, 30 minutes, 24 hours, 1 day, 2 weeks, 3 months or 1 years")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const winners = new TextInputBuilder()
            .setCustomId('winners')
            .setLabel("จำนวนผู้ชนะ (Winners)")
            .setPlaceholder("ตัวอย่าง: 1")
            .setValue("1")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const reward = new TextInputBuilder()
            .setCustomId('reward')
            .setLabel("ของรางวัล (Reward)")
            .setPlaceholder("ตัวอย่าง: ซองอั่งเปามูลค่า 100 บาท")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const description = new TextInputBuilder()
            .setCustomId('description')
            .setLabel("รายละเอียด (Description)")
            .setPlaceholder("ตัวอย่าง: ซองอั่งเปาทรูมันนี่มูลค่า 100 บาท จำนวน 1 รางวัล")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        const durationActionRow = new ActionRowBuilder().addComponents(duration);
        const winnersActionRow = new ActionRowBuilder().addComponents(winners);
        const rewardActionRow = new ActionRowBuilder().addComponents(reward);
        const descriptionActionRow = new ActionRowBuilder().addComponents(description);

        modal.addComponents(durationActionRow, winnersActionRow, rewardActionRow, descriptionActionRow);

        await interaction.showModal(modal);
    }
}