const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = async (interaction, client) => {
    if (interaction.customId.startsWith('admin_panel_action_reported')) {
        const id = interaction.customId.slice(33);
        const value = interaction.values[0];

        const parts = interaction.customId.split('_');

        // Extract the guild, channel, and message IDs
        const channelId = parts.slice(-3)[0];
        const messageId = parts.slice(-2)[0];

        const userId = parts.slice(-1)[0];


        console.log(channelId, messageId, userId);

        if (value == 'ban') {
            const modal = new ModalBuilder()
                .setCustomId(`admin_panel_action_ban_${userId}_${interaction.message.id}`)
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
        } else if (value == 'send-message') {
            const modal = new ModalBuilder()
                .setCustomId(`admin_panel_action_send_message_${userId}_${interaction.message.id}`)
                .setTitle("แผงควบคุมการตักเตือน");

            const message = new TextInputBuilder()
                .setCustomId('message')
                .setLabel('ข้อความ')
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph);

            const firstRow = new ActionRowBuilder().addComponents(message);

            modal.addComponents(firstRow);

            await interaction.showModal(modal)
        } else if (value == 'do-noting') {
            const message = interaction.message;

            const originalStaffEmbed = new EmbedBuilder(message.embeds[0])
                .setColor('Green')
                .addFields([
                    {
                        name: "ดำเนินการโดย",
                        value: `<@${interaction.member.id}>`,
                        inline: true
                    },
                    {
                        name: "Action",
                        value: "✅ Do Noting",
                        inline: true
                    }
                ])
                .setTimestamp(Date.now());

            await message.edit({
                content: '',
                embeds: [originalStaffEmbed],
                components: []
            })
        } else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            })
        }
    }
}