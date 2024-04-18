const { EmbedBuilder, Colors } = require("discord.js")
const moment = require('moment');

const GiveawaySchemas = require('../Schemas/Giveaway');
const GiveawayStatusType = require('../configs/GiveawayStatusType.json');

function convertStringToDate(inputString) {
    const [number, unit] = inputString.split(' ');

    const num = parseInt(number);

    const futureDate = moment().add(num, unit);

    const dateString = futureDate.format('YYYY-MM-DD HH:mm:ss');

    return {
        date: futureDate.toDate(),
        dateString: dateString
    };
}

module.exports = {
    async execute(interaction, client) {
        const duration = interaction.fields.getTextInputValue("duration");
        const winners = parseInt(interaction.fields.getTextInputValue("winners"));
        const reward = interaction.fields.getTextInputValue("reward");
        const description = interaction.fields.getTextInputValue("description");

        const ends = convertStringToDate(duration);

        const embed = new EmbedBuilder()
            .setTitle(`🎉 ${reward}`)
            .setColor(Colors.Purple)
            .addFields(
                {
                    name: "สิ้นสุดใน (Ends)",
                    value: `<t:${Math.floor(ends.date / 1000)}:R> (<t:${Math.floor(ends.date / 1000)}:f>)`
                },
                {
                    name: "จำนวนผู้ชนะ (Winners)",
                    value: `${winners}`
                },
                {
                    name: "สร้างโดย (Hosted by)",
                    value: `${interaction.user}`
                }
            )
            .setThumbnail('https://cdn.jsdelivr.net/gh/DekPua/storage@main/tada.png')
            .setTimestamp(ends.date)

        if (description) embed.setDescription(description);

        const message = await interaction.channel.send({
            embeds: [
                embed
            ]
        });

        await interaction.reply({ content: `สร้างกิจกรรมแล้ว Message Id: \`${message.id}\``, ephemeral: true });

        await GiveawaySchemas.create({
            Reward: reward,
            Winner: winners,
            Description: description,
            MessageId: message.id,
            ChannelId: message.channel.id,
            GuildId: message.guild.id,
            EndsAt: ends.date,
            Status: GiveawayStatusType.Online,
            CreateBy: interaction.user.id
        });

        await message.react("🎉");
    }
}