const { default: axios } = require("axios");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    async execute(interaction, client) {
        const profileUrl = new URL(`${process.env.API_HOST}/dekpua/profile`);
        const logoutUrl = new URL(`${process.env.API_HOST}/dekpua/logout`);
        profileUrl.searchParams.set("discordId", interaction.user.id);

        const vcheck = await axios.get(profileUrl.toString());

        if (vcheck.data.activate) {
            await axios.put(logoutUrl.toString(), {
                discordId: vcheck.data.account.discordId,
                email: vcheck.data.account.email,
            }).then(async response => {
                const embed = new EmbedBuilder()
                    .setColor("Purple")
                    .setTitle("✅ ออกจากระบบแล้ว")

                const verifyRole = await interaction.guild.roles.cache.get("1213365646667157514");

                const hasVerify = await interaction.member.roles.cache.has(verifyRole.id);

                if (hasVerify) await interaction.member.roles.remove(verifyRole);

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }).catch(async error => {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("⚠️ ไม่สามารถดำเนินการตามคำขอได้ มีบางอย่างไม่ถูกต้อง")

                await interaction.reply({ embeds: [embed], ephemeral: true })
            })
        } else {
            const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("❌ คุณยังไม่ได้เข้าสู่ระบบ")
            .setDescription("กรุณาเข้าสู่ระบบก่อนทำรายการ");

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
