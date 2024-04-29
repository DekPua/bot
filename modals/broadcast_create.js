const { EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    async execute(interaction, client) {
        const text = await interaction.fields.getTextInputValue('text');
        const access = await interaction.fields.getTextInputValue('access');

        if (access != "ยอมรับ") return await interaction.reply({ embeds: [ new EmbedBuilder().setColor(Colors.Yellow).setTitle('กรุณากรอก "ยอมรับ" หากเข้าใจแล้ว').setDescription(`\`\`\`${text}\`\`\``)], ephemeral: true });

        const members = await interaction.guild.members.fetch();

        const memberErrorList = [];
        let successMember = 0;

        await interaction.deferReply({ ephemeral: true });

        await members.forEach(async member => {
            if (member.user.bot || member.user.system) return memberErrorList.push(member);;

            try {
                await member.send({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(Colors.Purple)
                        .setDescription(text)
                        .setTimestamp(),
                    ]
                });
            } catch (err) {
                memberErrorList.push(member);
            }
        });

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle(`บรอดแคสต์ไปยัง ${interaction.guild.memberCount - memberErrorList.length} แล้ว`)
            ]
        })
    }
}