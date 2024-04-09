const axios = require("axios");
const { Events, ChannelType } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.channel.type != ChannelType.GuildAnnouncement) return;
        if (message.author.bot) return;
        if (message.content.startsWith('.')) return;

        try {
            const response = await axios.get(`${process.env.API_HOST}/autopublish/list`);

            if (response.data.status === 0) {
                const channels = response.data.channels.map(channel => channel.channelId);
                if (!channels.includes(message.channel.id)) return;

                message.crosspost();
            } else {
                console.error("API Error:", response.data.error);
            }
        } catch (error) {
            console.error("Error fetching channel list:", error);
        }
    }
}
