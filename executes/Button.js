const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");

const langs = {
    "th": {
        "error": "บอทไม่สามารถเชื่อมต่อกับฐานข้อมูลได้ กรุณาลองอีกครั้งภายหลัง",
        "modal.verify.title": "ยืนยันตัวตนผ่านอีเมล"
    },
    "en-us": {
        "error": "The bot was unable to connect to the database. Please try again later.",
        "modal.verify.title": "Verify your identity via email"
    }
}

module.exports = async (interaction, client) => {
    const lang = langs[interaction.locale] ?? langs["en-us"];

    const id = interaction.customId;

    if (
        id == "gateway_profile" ||
        id == "gateway_login" ||
        id == "gateway_logout"
    ) {
        try {
            await require(`../buttons/${id}`).execute(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    } else if (id.startsWith('gateway_enter_otp')) {
        const ref = id.slice(18);

        const modal = new ModalBuilder()
            .setCustomId(`modal_gateway_login_enter_otp_form_ref_${ref}`)
            .setTitle(lang["modal.verify.title"]);

        const favoriteColorInput = new TextInputBuilder()
            .setCustomId('modal_gateway_login_enter_otp_form_input_otp')
            .setLabel(`OTP (Ref: ${ref})`)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("xxxxxx")
            .setMaxLength(6)
            .setMinLength(6)
            .setRequired(true);

        const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);

        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);
    }
}