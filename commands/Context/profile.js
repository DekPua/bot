const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Profile')
    .setType(ApplicationCommandType.User)
    .setNameLocalizations({
        th: "โปรไฟล์"
    }),
    async execute(interaction, client) {
        const targetMember = await interaction.guild.members.fetch({
            user: interaction.targetId,
            cache: false
        });
        console.log(targetMember);

        const profilePng = await targetMember.displayAvatarURL({ extension: "png", size: 2048 });
        const profileJpg = await targetMember.displayAvatarURL({ extension: "jpg", size: 2048 });
        const profileWebp = await targetMember.displayAvatarURL({ extension: "webp", size: 2048 });

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Purple')
                .setDescription(`> รูปโปรไฟล์ของ <@${interaction.targetId}>\n> รูปแบบ: [PNG](${profilePng}) | [JPG](${profileJpg}) | [WEBP](${profileWebp})`)
                .setImage(profilePng)
            ]
        })
    }
}