const { Events, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        } else if (interaction.isButton()) {
            const server_status = await axios.get(
                `${process.env.API_HOST}/dekpua`
            );

            if (!server_status.data.status == "ok")
                return await interaction.reply({
                    content:
                        "⚠️ บอทไม่สามารถเชื่อมต่อกับฐานข้อมูลได้ กรุณาลองอีกครั้งภายหลัง",
                    ephemeral: true,
                });

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
                    .setTitle('ยืนยันตัวตนผ่านอีเมล์');

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
        } else if (interaction.isModalSubmit()) {
            const server_status = await axios.get(
                `${process.env.API_HOST}/dekpua`
            );

            if (!server_status.data.status == "ok")
                return await interaction.reply({
                    content:
                        "⚠️ บอทไม่สามารถเชื่อมต่อกับฐานข้อมูลได้ กรุณาลองอีกครั้งภายหลัง",
                    ephemeral: true,
                });

            const id = interaction.customId;

            if (id == "modal_gateway_login_form") {
                try {
                    await require(`../modals/${id}`).execute(interaction, client);
                } catch (error) {
                    console.log(error);
                    await interaction.reply({
                        content: "There was an error while executing this command!",
                        ephemeral: true,
                    });
                }
            } else if (id.startsWith('modal_gateway_login_enter_otp_form_ref')) {
                const otp = interaction.fields.getTextInputValue('modal_gateway_login_enter_otp_form_input_otp');
                const ref = id.slice(39);

                const storedData = client.userData[interaction.user.id];

                if (storedData) {
                    const { enter_otp_message } = storedData.message;

                    if (enter_otp_message) await enter_otp_message.delete();

                    const otpVerify = await axios.post(`${process.env.API_HOST}/dekpua/login/otp`, {
                        discordId: interaction.user.id,
                        otp: otp,
                        ref: ref,
                    });

                    if (otpVerify.data.verify) return await interaction.reply({ content: "✅ ยืนยันตัวตนสำเร็จ", ephemeral: true });
                    else return await interaction.reply({ content: "❌ ยืนยันตัวตนไม่สำเร็จ\nOTP ไม่ถูกต้อง", ephemeral: true });
                }
            }
        }
    },
};
