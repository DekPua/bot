const { default: axios } = require("axios");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

function isEmailValid(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}

module.exports = {
    async execute(interaction, client) {
        const email = interaction.fields.getTextInputValue(
            "modal_gateway_login_form_input_email"
        );

        if (isEmailValid(email)) {
            const login = await axios.post(
                "https://dekpua-api.hewkawar.xyz/dekpua/login",
                {
                    email: email,
                    discordId: interaction.member.id,
                }
            );

            if (login.status == 502)
                return await interaction.reply({
                    content:
                        "⚠️ บอทไม่สามารถเชื่อมต่อกับฐานข้อมูลได้ กรุณาลองอีกครั้งภายหลัง",
                    ephemeral: true,
                });

            if (login.data.detail.activate) {
                let member;
                const verifyRole = await interaction.guild.roles.cache.get("1213365646667157514");

                const hasVerify = await interaction.member.roles.cache.has(verifyRole);

                if (!hasVerify) await interaction.member.roles.add(verifyRole);

                const embed = new EmbedBuilder()
                    .setColor("Purple")
                    .setTitle("✅ ยืนยันตัวตนสำเร็จ")
                    .setDescription(`ยินดีต้อนรับกลับ ${email}`);

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            } else {
                if (!login.data.detail.ref)
                    return await interaction.reply({
                        content: "⚠️ เกิดข้อผิดพลาดขึ้น โปรดลองอีกครั้งภายหลัง",
                        ephemeral: true,
                    });

                const enter_otp = new ButtonBuilder()
                    .setCustomId(`gateway_enter_otp_${login.data.detail.ref}`)
                    .setLabel('Enter OTP')
                    .setStyle(ButtonStyle.Success);

                const row = new ActionRowBuilder()
                    .addComponents(enter_otp);

                const message = await interaction.reply({ content: `📨 เราได้ส่งอีเมลล์ไปยัง ${email} แล้ว กรุณาตรวจสอบในกล่องจดหมาย หากไม่พบกรุณาตรวจสอบในจดหมายขยะ (Junk Mail)`, components: [row], ephemeral: true });

                if (!client.userData) {
                    client.userData = {};
                }

                if (!client.userData[interaction.user.id]) {
                    client.userData[interaction.user.id] = {};
                }

                client.userData[interaction.user.id].message = {
                    enter_otp_message: message,
                };
            }
        }
    },
};
