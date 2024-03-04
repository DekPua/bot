const { Events, PermissionFlagsBits, ChannelType } = require("discord.js");
const AutoVoiceChannel = require('../configs/AutoVoiceChannels.json');
const { default: axios } = require("axios");

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState, client) {
        AutoVoiceChannel.Channels.forEach(async (channel) => {
            const { id, type, category, title, permission  } = channel;

            if (newState.channelId == id) {

                const EveryoneAllowPermission = [];
                const EveryoneDenyPermission = [];
    
                // View
                if (permission.everyone.View) {
                    EveryoneAllowPermission.push(PermissionFlagsBits.ViewChannel);
                } else {
                    EveryoneDenyPermission.push(PermissionFlagsBits.ViewChannel);
                }
    
                // Connect
                if (permission.everyone.Connect) {
                    EveryoneAllowPermission.push(PermissionFlagsBits.Connect);
                } else {
                    EveryoneDenyPermission.push(PermissionFlagsBits.Connect);
                }
    
                // Speak
                if (permission.everyone.Speak) {
                    EveryoneAllowPermission.push(PermissionFlagsBits.Speak);
                } else {
                    EveryoneDenyPermission.push(PermissionFlagsBits.Speak);
                }
        
                const channelName = title.replace("%username%", newState.member.user.username).replace("%user_id%", newState.member.id);
        
                const voiceChannel = await newState.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildVoice,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: newState.member.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.Speak,
                                PermissionFlagsBits.ManageChannels,
                            ]
                        },
                        {
                            id: newState.guild.roles.everyone,
                            allow: EveryoneAllowPermission,
                            deny: EveryoneDenyPermission,
                        }
                    ]
                });

                await axios.post(`${process.env.API_HOST}/dekpua/voicechannel`, {
                    channel: {
                        id: voiceChannel.id,
                        name: voiceChannel.name,
                        type: channel.type
                    },
                    owner: {
                        id: newState.member.user.id,
                        username: newState.member.user.username
                    },
                    permissions: [
                        {
                            id: newState.member.id,
                            allow: {
                                View: true,
                                Connect: true,
                                Speak: true,
                                ManageChannel: true
                            }
                        },
                        {
                            id: newState.guild.roles.everyone,
                            allow: {
                                View: true,
                                Connect: true,
                                Speak: true,
                                ManageChannel: false
                            }
                        }
                    ],
                    online: 1
                });

                await newState.member.edit({ channel: voiceChannel });
            }
        })
    }
}