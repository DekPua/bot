const { SlashCommandBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, ModalBuilder, EmbedBuilder } = require("discord.js");

function isDiscordMessageLink(str) {
  const discordMessageLinkRegex = /^https:\/\/discord\.com\/channels\/\d+\/\d+\/\d+$/;
  return discordMessageLinkRegex.test(str);
}

function getChannelAndMessageIdsFromLink(link) {
  const regex = /^https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)$/;
  const match = link.match(regex);
  if (match) {
    const [, serverId, channelId, messageId] = match;
    return { serverId, channelId, messageId };
  } else {
    return null;
  }
}

const langs = {
  "th": {
    "modal.report_system.user.title": "รายงานผู้ใช้",
    "modal.report_system.user.input.detail": "รายละเอียดของปัญหา",
    "modal.report_system.user.input.detail.placeholder": "ตัวอย่าง: เนื้อหาทางเพศ",
    "modal.report_system.message.title": "รายงานข้อความ",
    "modal.report_system.message.input.detail": "รายละเอียดของปัญหา",
    "modal.report_system.message.input.detail.placeholder": "ตัวอย่าง: เนื้อหาทางเพศ",
    "error.please_try_again": "กรุณาตรวจสอบอีกครั้ง",
    "error.that_text_is_not_message_link": "ข้อความดังกล่าวไม่ใช่ลิ้งค์ของข้อความ",
    "error.can_t_check_message_from_outside_dekpua": "ไม่สามารถตรวจสอบข้อความที่ไม่ได้อยู่ใน DekPua Official ได้",
    "error.not_found_that_message": "ไม่พบข้อความดังกล่าว"
  },
  "en-us": {
    "modal.report_system.user.title": "User Report",
    "modal.report_system.user.input.detail": "Details",
    "modal.report_system.user.input.detail.placeholder": "Example: Spam messages",
    "modal.report_system.message.title": "Message Report",
    "modal.report_system.message.input.detail": "Details",
    "modal.report_system.message.input.detail.placeholder": "Example: Sexual Content",
    "error.please_try_again": "Please try again.",
    "error.that_text_is_not_message_link": "The text provided is not a message link.",
    "error.can_t_check_message_from_outside_dekpua": "Cannot check messages from outside DekPua Official.",
    "error.not_found_that_message": "The message was not found."
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Report User or Message")
    .setDescriptionLocalizations({
      th: "รายงานผู้ใช้หรือข้อความ",
    })
    .addSubcommand((sub) =>
      sub
        .setName("user")
        .setDescription("Report User")
        .setDescriptionLocalizations({ th: "รายงานผู้ใช้" })
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User wants to report")
            .setDescriptionLocalizations({ th: "ผู้ใช้ที่ต้องการรายงาน" })
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("message")
        .setDescription("Report Message")
        .setDescriptionLocalizations({ th: "รายงานข้อความ" })
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Message Link")
            .setDescriptionLocalizations({ th: "ลิ้งค์ของข้อความ" })
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    const sub = await interaction.options.getSubcommand();

    const lang = langs[interaction.locale] ?? langs["en-us"];

    const reportUser = await interaction.member;

    const user = await interaction.options.getUser("user");
    const messageString = await interaction.options.getString("message");

    switch (sub) {
      case 'user':
        const modal = new ModalBuilder()
          .setCustomId(`report_system_user_${user.id}`)
          .setTitle(lang['modal.report_system.user.title']);

        const detail = new TextInputBuilder()
          .setCustomId('report_system_user_detail')
          .setLabel(lang['modal.report_system.user.input.detail'])
          .setMinLength(6)
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder(lang['modal.report_system.user.input.detail.placeholder'])
          .setRequired(true);

        const row = new ActionRowBuilder().addComponents(detail);

        modal.addComponents(row);

        await interaction.showModal(modal);
        break;
      case 'message':
        if (!isDiscordMessageLink(messageString)) return await interaction.reply({
          embeds: [new EmbedBuilder()
            .setColor('Yellow')
            .setDescription(`⚠️ ${lang["error.that_text_is_not_message_link"]}\n${lang["error.please_try_again"]}`)
          ],
          ephemeral: true,
        });

        const ids = getChannelAndMessageIdsFromLink(messageString);

        const { serverId, channelId, messageId } = ids;

        try {
          if (serverId != '1213126282921902230') return await interaction.reply({
            embeds: [new EmbedBuilder()
              .setColor('Yellow')
              .setDescription(`⚠️ ${lang["error.can_t_check_message_from_outside_dekpua"]}`)
            ],
            ephemeral: true,
          });

          const channel = await client.channels.fetch(channelId);

          const message = await channel.messages.fetch(messageId);

          if (!message) return await interaction.reply({
            embeds: [new EmbedBuilder()
              .setColor('Yellow')
              .setDescription(`⚠️ ${lang["error.not_found_that_message"]}\n${lang["error.please_try_again"]}`)
            ],
            ephemeral: true,
          });

          const modal = new ModalBuilder()
            .setCustomId(`report_system_message_${channelId}_${messageId}_${message.author.id}`)
            .setTitle(lang["modal.report_system.message.title"]);

          const detail = new TextInputBuilder()
            .setCustomId('report_system_message_detail')
            .setLabel(lang["modal.report_system.message.input.detail"])
            .setMinLength(6)
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder(lang["modal.report_system.message.input.detail.placeholder"])
            .setRequired(true);

          const row = new ActionRowBuilder().addComponents(detail);

          modal.addComponents(row);

          await interaction.showModal(modal);
        } catch (err) {
          console.log(err);
          await interaction.deferReply({ ephemeral: true });

          await interaction.editReply({
            content: "There was an error while executing!",
            ephemeral: true,
          });
        }
        break;
    }
  }
};
