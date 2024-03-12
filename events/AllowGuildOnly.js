const { Events } = require("discord.js");
const guildList = require('../configs/AllowGuild.json');

module.exports = {
    name: Events.GuildCreate,
    async execute(guild, client) {
        if (guildList.includes(guild.id)) return;

        guild.leave().catch(console.error);
    }
}