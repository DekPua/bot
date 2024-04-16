const { EmbedBuilder, Colors } = require("discord.js");
const AccountSchema = require('../Schemas/Account');
const OtpSchema = require('../Schemas/Otp');

const roles = require('../configs/Roles.json');

module.exports = {
    async execute(interaction, client) {
        const logined = await AccountSchema.findOne({
            DiscordId: interaction.member.id,
            Activate: true
        });

        if (logined != null) {
            logined.Activate = false;
            await logined.save();

            await client.removeRoles(interaction.member);

            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Green)
                        .setTitle("✅ ออกจากระบบแล้ว")
                ],
                ephemeral: true
            });
        } else return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setTitle("❌ คุณยังไม่ได้เข้าสู่ระบบ")
                    .setDescription("กรุณาเข้าสู่ระบบก่อนทำรายการ")
            ],
            ephemeral: true
        });
    },
};
