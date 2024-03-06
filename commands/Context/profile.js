const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

const langs = {
    "th": {
        "embed.profile": "รูปโปรไฟล์ของ",
        "embed.type": "รูปแบบ",
    },
    "en-us": {
        "embed.profile": "Profile",
        "embed.type": "Type",
    }
};

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Profile')
    .setType(ApplicationCommandType.User)
    .setNameLocalizations({
        th: "โปรไฟล์"
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const lang = langs[interaction.locale] ?? langs["en-us"];

        const targetMember = await interaction.guild.members.fetch({
            user: interaction.targetId,
            cache: false
        });

        const profilePng = await targetMember.displayAvatarURL({ extension: "png", size: 2048 });
        const profileJpg = await targetMember.displayAvatarURL({ extension: "jpg", size: 2048 });
        const profileWebp = await targetMember.displayAvatarURL({ extension: "webp", size: 2048 });

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Purple')
                .setDescription(`> ${lang["embed.profile"]} <@${interaction.targetId}>\n> ${lang["embed.type"]}: [PNG](${profilePng}) | [JPG](${profileJpg}) | [WEBP](${profileWebp})`)
                .setImage(profilePng)
            ],
            ephemeral: true,
        });
    }
}