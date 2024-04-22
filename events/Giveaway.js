const { Events, EmbedBuilder, Colors } = require("discord.js");

const GiveawaySchemas = require('../Schemas/Giveaway');
const GiveawayStatusType = require('../configs/GiveawayStatusType.json');

function random(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        setInterval(async () => {
            const giveawayList = await GiveawaySchemas.find({
                Status: GiveawayStatusType.Online
            });

            giveawayList.forEach(async giveaway => {
                const now = Date.now();
                if (giveaway.Status != GiveawayStatusType.Online || giveaway.EndsAt >= now) return

                const guild = await client.guilds.fetch(giveaway.GuildId);
                const channel = await guild.channels.fetch(giveaway.ChannelId);
                const message = await channel.messages.fetch(giveaway.MessageId);

                const winnerList = [];

                if (!message) return await GiveawaySchemas.updateOne({
                    MessageId: giveaway.MessageId
                }, {
                    Status: GiveawayStatusType.Ended
                });

                const reactions = message.reactions.cache;

                reactions.forEach(async reaction => {
                    if (reaction.emoji.name != "🎉") return

                    await reaction.users.fetch()
                        .then(users => {
                            const userlist = users.map(user => user.id);

                            const playerList = userlist.filter(user => !client.user.id.includes(user));

                            if (playerList.length <= giveaway.Winner) {
                                winnerList.push(...playerList);
                            } else {
                                const shuffledPlayers = playerList.sort(() => Math.random() - 0.5);
                                winnerList.push(...shuffledPlayers.slice(0, giveaway.Winner));
                            }
                        });

                    await GiveawaySchemas.deleteOne({
                        MessageId: giveaway.MessageId
                    });

                    const mentions = winnerList.map(userId => `<@${userId}>`);

                    await channel.send({ content: `🎉 ขอแสดงความยินดีกับ ${mentions.join(', ')}! ได้รับ **${giveaway.Reward}**` });

                    const oldEmbed = new EmbedBuilder(message.embeds[0]);

                    await message.edit({
                        embeds: [
                            oldEmbed.setColor(Colors.NotQuiteBlack).addFields(
                                {
                                    name: "ผู้ชนะ (The Winners)",
                                    value: `${mentions.join(', ')}`
                                }
                            )
                        ]
                    });

                    winnerList.forEach(async userId => {
                        const user = await client.users.fetch(userId);

                        const embed = new EmbedBuilder()
                            .setColor(Colors.Purple)
                            .setTitle(`ยินดีด้วยคุณคือผู้โชคดีได้รับ ${giveaway.Reward}`)
                            .setThumbnail('https://cdn.jsdelivr.net/gh/DekPua/storage@main/reward.png')
                            .setDescription('สามารถติดต่อ **[DekPua Support](https://discord.com/channels/1213126282921902230/1224718613131563028)** เพื่อรับรางวัลได้เลย');

                        if (giveaway.Description) embed.setDescription(`${giveaway.Description}\n\n${embed.data.description}`);

                        try {
                            await user.send({
                                embeds: [
                                    embed
                                ]
                            });
                        } catch (err) { }
                    })
                })

            })
        }, 2 * 1000)
    }
}