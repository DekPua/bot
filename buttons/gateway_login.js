const { default: axios } = require("axios");
const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder } = require("discord.js");

module.exports = {
    async execute(interaction, client) {
        const profileUrl = new URL(`${process.env.API_HOST}/dekpua/profile`);
        profileUrl.searchParams.set("discordId", interaction.user.id);

        const vcheck = await axios.get(profileUrl.toString());

        if (vcheck.data.activate) {
            const embed = new EmbedBuilder()
                .setColor("Purple")
                .setThumbnail(interaction.user.displayAvatarURL({ extension: "png" }))
                .setTitle("✅ คุณเข้าสู่ระบบอยู่แล้ว")
                .addFields(
                    { name: "Email", value: `\`\`\`${vcheck.data.account.email}\`\`\``, inline: false },
                    { name: "Discord ID", value: `\`\`\`${vcheck.data.account.discordId}\`\`\``, inline: false }
                );

            return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
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

            await interaction.showModal(modal);
        }
    },
};
