const { default: axios } = require("axios");
const { Events, ChannelType } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.channel.type != ChannelType.GuildAnnouncement) return;
        if (message.author.bot) return;
        if (message.content.startsWith('.')) return;

        const channelList = await axios.get(`${process.env.API_HOST}/autopublish/list`);
        
        try {
            if (!channelList.data.channels.includes(message.channel.id)) return;

            message.crosspost();
        } catch (error) {
            return;
        }
    }
}