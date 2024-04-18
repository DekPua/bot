const axios = require("axios");
const { Events, ChannelType } = require("discord.js");

const AutoPublishSchemas = require('../Schemas/AutoPublish');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (process.env.IS_DEV) return;
        try {
            if (message.channel.type !== ChannelType.GuildAnnouncement || message.author.bot || message.content.startsWith('.')) {
                return;
            }

            const data = await AutoPublishSchemas.find({ ChannelId: message.channel.id });

            const promises = data.map(async (channel) => {
                await Promise.all([
                    message.crosspost(),
                    message.react(channel.Reaction)
                ]);
            });

            await Promise.all(promises);
        } catch (err) { }
    }
}
