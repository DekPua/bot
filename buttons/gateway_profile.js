const { EmbedBuilder } = require("discord.js");
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
                    .setColor("Purple")
                    .setTitle("💳 ข้อมูลสมาชิก")
                    .setThumbnail(interaction.user.displayAvatarURL({ extension: "png" }))
                    .addFields(
                        { name: "Email", value: `\`\`\`${logined.Email}\`\`\``, inline: false },
                        { name: "Discord ID", value: `\`\`\`${logined.DiscordId}\`\`\``, inline: false }
                    )
            ],
            ephemeral: true
        });
        else return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("❌ คุณยังไม่ได้เข้าสู่ระบบ")
                    .setDescription("กรุณาเข้าสู่ระบบก่อนทำรายการ")
            ],
            ephemeral: true
        });
    }
}