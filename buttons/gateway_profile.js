const { default: axios } = require("axios");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    async execute(interaction, client) {
        const server_status = await axios.get(
            `${process.env.API_HOST}/dekpua`
        );

        if (!server_status.data.status == "ok")
            return await interaction.reply({
                content:
                    "⚠️ บอทไม่สามารถเชื่อมต่อกับฐานข้อมูลได้ กรุณาลองอีกครั้งภายหลัง",
                ephemeral: true,
            });

        const profileUrl = new URL(`${process.env.API_HOST}/dekpua/profile`);
        profileUrl.searchParams.set("discordId", interaction.user.id);

        const vcheck = await axios.get(profileUrl.toString());

        if (vcheck.data.activate) {
            const embed = new EmbedBuilder()
            .setColor("Purple")
            .setTitle("💳 ข้อมูลสมาชิก")
            .setThumbnail(interaction.user.displayAvatarURL({ extension: "png" }))
            .addFields(
                { name: "Email", value: `\`\`\`${vcheck.data.account.email}\`\`\``, inline: false },
                { name: "Discord ID", value: `\`\`\`${vcheck.data.account.discordId}\`\`\``, inline: false }
            );

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("❌ คุณยังไม่ได้เข้าสู่ระบบ")
            .setDescription("กรุณาเข้าสู่ระบบก่อนทำรายการ");

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}