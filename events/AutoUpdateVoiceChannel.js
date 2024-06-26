const { Events, ChannelType } = require("discord.js");

const AutoVoiceChannelSchemas = require('../Schemas/AutoVoiceChannnel');

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        if (process.env.IS_DEV) return;
        setInterval(async () => {
            try {
                const OnlineChannelLists = await AutoVoiceChannelSchemas.find();

                OnlineChannelLists.forEach(async raw => {
                    const voiceChannel = await client.channels.fetch(raw.ChannelId);

                    if (voiceChannel && voiceChannel.type == ChannelType.GuildVoice && voiceChannel.members.size == 0) {
                        await AutoVoiceChannelSchemas.deleteOne({ ChannelId: voiceChannel.id });

                        await voiceChannel.delete();
                    }
                })
            } catch (error) { }
        }, 5 * 1000);
    }
}