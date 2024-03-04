const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  mod: true,
  data: new SlashCommandBuilder()
    .setName("login-gateway")
    .setDescription("Login Gateway Form")
    .setDescriptionLocalizations({
      th: "ฟอร์มเข้าสู่ระบบ",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName("send")
        .setDescription("Send Login Form")
        .addChannelOption((option) =>
          option
            .setName("target")
            .setDescription("Target Channel")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    const targetChannel = await interaction.options.getChannel("target");

    if (!targetChannel.type == ChannelType.GuildText)
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setDescription(`⚠️ ไม่สามารถส่งในช่อง ${targetChannel} ได้`),
        ],
        ephemeral: true,
      });

    const formEmbed = new EmbedBuilder()
      .setColor("Purple")
      .setTitle("Login With Pua Authenticator")
      .setDescription("หมายเหตุ : กรุณายืนยันด้วยอีเมลล์")
      .setThumbnail('https://cdn.jsdelivr.net/gh/hewkawar/Dek-Pua-Storage@main/pua_school.jpg');

    const profileBtn = new ButtonBuilder()
      .setCustomId("gateway_profile")
      .setLabel("Profile")
      .setStyle(ButtonStyle.Primary);

    const loginBtn = new ButtonBuilder()
      .setCustomId("gateway_login")
      .setLabel("Login")
      .setStyle(ButtonStyle.Success);

    const logoutBtn = new ButtonBuilder()
      .setCustomId("gateway_logout")
      .setLabel("Logout")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(
      profileBtn,
      loginBtn,
      logoutBtn
    );

    await targetChannel.send({
      embeds: [formEmbed],
      components: [row],
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Purple")
          .setDescription(`✅ ส่งในช่อง ${targetChannel} แล้ว`),
      ],
      ephemeral: true,
    });
  },
};
