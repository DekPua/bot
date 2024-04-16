const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder, Colors } = require("discord.js");
const AccountSchema = require('../Schemas/Account');
const OtpSchema = require('../Schemas/Otp');

module.exports = {
    async execute(interaction, client) {
        const logined = await AccountSchema.findOne({
            DiscordId: interaction.member.id,
            Activate: true
        });

        if (logined != null) return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setThumbnail(interaction.user.displayAvatarURL({ extension: "png" }))
                    .setTitle("✅ คุณเข้าสู่ระบบอยู่แล้ว")
                    .addFields(
                        { name: "Email", value: `\`\`\`${logined.Email}\`\`\``, inline: false },
                        { name: "Discord ID", value: `\`\`\`${logined.DiscordId}\`\`\``, inline: false }
                    )
            ],
            ephemeral: true
        });
        else {
            const modal = new ModalBuilder()
                .setCustomId("modal_gateway_login_form")
                .setTitle("ยืนยันตัวตนผ่านอีเมล์");

            const emailInput = new TextInputBuilder()
                .setCustomId("modal_gateway_login_form_input_email")
                .setLabel("ระบุอีเมลล์")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("2xxxx@pua.ac.th")
                .setRequired(true);

            const row = new ActionRowBuilder().addComponents(emailInput);

            modal.addComponents(row);

            return await interaction.showModal(modal);
        }
    },
};
