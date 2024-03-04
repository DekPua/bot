const { ActivityType, Events } = require("discord.js");
const { version } = require('../package.json');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`[${client.shard.ids}] Ready! Logged in as ${client.user.tag}`);

        client.user.setPresence({ activities: [{ name: `Dek Pua | V${version}`, type: ActivityType.Playing }] });

        setInterval(async () => {
            client.user.setPresence({ activities: [{ name: `Dek Pua | V${version}`, type: ActivityType.Playing }] });
        }, 60 * 1000);
    },
};