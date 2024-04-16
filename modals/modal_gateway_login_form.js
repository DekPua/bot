const { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder, Colors } = require("discord.js");
const AccountSchema = require('../Schemas/Account');
const OtpSchema = require('../Schemas/Otp');

const roles = require('../configs/Roles.json');
const OtpStatusType = require('../configs/OtpStatus.json');

function isEmailValid(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}

function generateEmailOTP(otpLength = 6) {
    let otp = "";

    for (let i = 0; i < otpLength; i++) {
        otp += Math.floor(Math.random() * 10);
    }

    return otp;
}

function generateRandomString(length) {
    const characterPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characterPool.length);
        randomString += characterPool.charAt(randomIndex);
    }

    return randomString;
}

module.exports = {
    async execute(interaction, client) {
        const email = interaction.fields.getTextInputValue(
            "modal_gateway_login_form_input_email"
        );

        if (isEmailValid(email)) {
            const account = await AccountSchema.findOne({
                DiscordId: interaction.member.id,
                Email: email
            })

            if (account != null) {
                account.Activate = true;
                await account.save();

                await client.autoGiveRoles(interaction.member, email);

                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setTitle("✅ ยืนยันตัวตนสำเร็จ")
                                .setDescription(`ยินดีต้อนรับกลับ ${email}`)
                        ],
                        ephemeral: true
                    });
            } else {
                const otp = generateEmailOTP();
                const ref = generateRandomString(6);

                client.sendEmail(
                    email,
                    `${otp} ยืนยันอีเมลล์ - Dek Pua Official`,
                    `สวัสดี\nคุณได้ทำการยืนยันอีเมลล์ โดยรหัสยืนยันของคุณคือ ${otp}\nรหัสอ้างอิง : ${ref}\nDekPua Official\nอีเมลนี้ถูกส่งด้วยระบบอัตโนมัติ กรุณาอย่าตอบกลับอีเมลนี้`,
                    `สวัสดี<br>คุณได้ทำการยืนยันอีเมลล์ โดยรหัสยืนยันของคุณคือ <span>${otp}</span><br>รหัสอ้งอิง : ${ref}<br>DekPua Official<br>อีเมลนี้ถูกส่งด้วยระบบอัตโนมัติ กรุณาอย่าตอบกลับอีเมลนี้`
                )

                await OtpSchema.create({
                    DiscordId: interaction.member.id,
                    Ref: ref,
                    Email: email,
                    Otp: otp,
                    Verified: OtpStatusType.WaitForVerify
                });

                const enter_otp = new ButtonBuilder()
                    .setCustomId(`gateway_enter_otp_${ref}`)
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
        } else return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setTitle("❌ รูปแบบของอีเมล์ไม่ถูกต้อง")
            ],
            ephemeral: true
        });
    },
};
