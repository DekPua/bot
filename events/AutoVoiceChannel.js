const { Events, PermissionFlagsBits, ChannelType } = require("discord.js");
const AutoVoiceChannel = require('../configs/AutoVoiceChannels.json');

const AutoVoiceChannelSchemas = require('../Schemas/AutoVoiceChannnel');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState, client) {
        AutoVoiceChannel.Channels.forEach(async (channel) => {
            const { id, type, category, title, permission  } = channel;

            if (newState.channelId == id) {

                const EveryoneAllowPermission = [];
                const EveryoneDenyPermission = [];

                const BannedAllowPermission = [
                    PermissionFlagsBits.ReadMessageHistory
                ];

                const BannedDenyPermission = [
                    // general
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ManageChannels,
                    PermissionFlagsBits.ManageWebhooks,

                    // membership
                    PermissionFlagsBits.CreateInstantInvite,

                    // text
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.SendMessagesInThreads,
                    PermissionFlagsBits.CreatePublicThreads,
                    PermissionFlagsBits.CreatePrivateThreads,
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.AttachFiles,
                    PermissionFlagsBits.AddReactions,
                    PermissionFlagsBits.UseExternalEmojis,
                    PermissionFlagsBits.UseExternalStickers,
                    PermissionFlagsBits.MentionEveryone,
                    PermissionFlagsBits.ManageMessages,
                    PermissionFlagsBits.ManageThreads,
                    PermissionFlagsBits.SendTTSMessages,
                    PermissionFlagsBits.UseApplicationCommands,
                    PermissionFlagsBits.SendVoiceMessages,
                    
                    // voice
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.Speak,
                    PermissionFlagsBits.UseVAD,
                    PermissionFlagsBits.UseSoundboard,
                    PermissionFlagsBits.UseExternalSounds,
                    PermissionFlagsBits.PrioritySpeaker,
                    PermissionFlagsBits.MuteMembers,
                    PermissionFlagsBits.DeafenMembers,
                    PermissionFlagsBits.MoveMembers,
                    
                    // stage
                    PermissionFlagsBits.RequestToSpeak,
                    PermissionFlagsBits.MentionEveryone,
                    
                    // event
                    PermissionFlagsBits.ManageEvents
                ]

                const VoiceBannedAllowPermission = [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory
                ];

                const VoiceBannedDenyPermission = [
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.Speak,
                    PermissionFlagsBits.UseVAD,
                    PermissionFlagsBits.UseSoundboard,
                    PermissionFlagsBits.UseExternalSounds,
                    PermissionFlagsBits.PrioritySpeaker,
                    PermissionFlagsBits.MuteMembers,
                    PermissionFlagsBits.DeafenMembers,
                    PermissionFlagsBits.MoveMembers,
                ];     
    
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
                                PermissionFlagsBits.ManageChannels
                            ]
                        },
                        {
                            id: newState.guild.roles.everyone,
                            allow: EveryoneAllowPermission,
                            deny: EveryoneDenyPermission
                        },
                        {
                            id: "1224776064769720371",
                            allow: BannedAllowPermission,
                            deny: BannedDenyPermission
                        },
                        {
                            id: "1224777468116865085",
                            allow: VoiceBannedAllowPermission,
                            deny: VoiceBannedDenyPermission
                        }
                    ]
                });

                await AutoVoiceChannelSchemas.create({
                    ChannelId: voiceChannel.id,
                    OwnerId: newState.member.user.id,
                });

                await newState.member.edit({ channel: voiceChannel });
            }
        })
    }
}