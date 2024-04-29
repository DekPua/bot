const { Events, EmbedBuilder, Colors } = require("discord.js");
const NeedHelpConfig = require('../configs/NeedHelpConfig.json');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState, client) {
        NeedHelpConfig.channels.forEach(async (channel) => {
            if (newState.channelId != channel.voiceChannel) return;

            const hasAdmin = await newState.member.roles.cache.has("1213411732391723068");
            const hasMod = await newState.member.roles.cache.has("1213126421875269652");
            const hasStaff = await newState.member.roles.cache.has("1213126482730291291");
            
            if (hasAdmin || hasMod || hasStaff) return;

            try {
                const notiftChannel = await client.channels.fetch(channel.notifyChannel);

                if (!notiftChannel) return;

                await notiftChannel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Yellow)
                            .setTitle(`📞 ${newState.member.user.username} (${newState.member.user.id}) ต้องการความช่วยเหลือ!`)
                            .setDescription('กรุณาช่วยเหลือโดยเร็ว!')
                            .setTimestamp()
                    ],
                    content: "<@&1213411732391723068>, <@&1213126421875269652>, <@&1213126482730291291>"
                });
            } catch (err) {
                
            }
        });
    }
}