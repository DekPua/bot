const { default: axios } = require("axios");
const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

const AutoPublishSchemas = require('../../Schemas/AutoPublish');


module.exports = {
  data: new SlashCommandBuilder()
    .setName("autopublisher")
    .setDescription("Setup and disable your auto publisher system")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((command) =>
      command
        .setName("add")
        .setDescription("Add a Channel to the auto publisher channel list")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The Channel you want to auto publish")
            .addChannelTypes(ChannelType.GuildAnnouncement)
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('emoji')
            .setDescription("The Emoji is Auto React")
            .setMaxLength(1)
            .required(false)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("remove")
        .setDescription("Remove a channel from the auto publisher list")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel you want to remove from the list")
            .addChannelTypes(ChannelType.GuildAnnouncement)
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.editReply({
        content: "You don't have perms to manage the auto publish system",
        ephemeral: true,
      });

    const sub = interaction.options.getSubcommand();
    const channel = await interaction.options.getChannel("channel");
    const emoji = await interaction.options.getString("emoji");

    switch (sub) {
      case "add":
        await AutoPublishSchemas.create({
          ChannelId: channel.id,
          Reaction: emoji
        })

        const aembed = new EmbedBuilder()
          .setColor("Purple")
          .setDescription(
            `All message sent in ${channel} will be auto published!`
          );

        await interaction.editReply({
          embeds: [aembed],
          ephemeral: true,
        });
        break;
      case "remove":
        await AutoPublishSchemas.deleteOne({
          ChannelId: channel.id
        });

        const rembed = new EmbedBuilder()
          .setColor("Purple")
          .setDescription(
            `${channel} have been removed off of your auto publish list`
          );

        await interaction.editReply({
          embeds: [rembed],
          ephemeral: true,
        });

        break;
    }
  },
};
