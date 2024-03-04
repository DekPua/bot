const { default: axios } = require("axios");
const { Events, ChannelType } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        setInterval(async () => {
            try {
                const response = await axios.get(`${process.env.API_HOST}/dekpua/voicechannel`).catch(error => { });
                
                if (response.data) {
                    for (const channel of response.data) {
                        const voiceChannel = client.channels.cache.get(channel.channel.id);

                        if (voiceChannel && voiceChannel.type === ChannelType.GuildVoice && voiceChannel.members.size == 0) {
                            await axios({
                                method: "delete",
                                url: `${process.env.API_HOST}/dekpua/voicechannel`,
                                data: {
                                    channelId: channel.channel.id
                                }
                            });

                            await voiceChannel.delete();
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }, 1000 * 10);

        setInterval(async () => {
            try {
                const response = await axios.get(`${process.env.API_HOST}/dekpua/voicechannel`).catch(error => { });
                
                if (response.data) {
                    for (const channel of response.data) {
                        const voiceChannel = client.channels.cache.get(channel.channel.id);

                        if (voiceChannel && voiceChannel.type === ChannelType.GuildVoice && voiceChannel.members.size > 0) {
                            await axios({
                                method: "put",
                                url: `${process.env.API_HOST}/dekpua/voicechannel`,
                                data: {
                                    channel: {
                                        id: voiceChannel.id,
                                        name: voiceChannel.name,
                                        type: channel.channel.type
                                    },
                                    owner: {
                                        id: channel.owner.id,
                                        username: channel.owner.username
                                    },
                                    permissions: JSON.parse(channel.permissions),
                                    online: voiceChannel.members.size
                                }
                            });
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }, 1000 * 10);
    }
}