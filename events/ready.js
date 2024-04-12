const { ActivityType, Events } = require("discord.js");
const { version } = require('../package.json');

const mongoose = require('mongoose');
const mongodbUri = process.env.MONGODB_URI;

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`[${client.shard.ids}] Ready! Logged in as ${client.user.tag}`);

        client.user.setPresence({ activities: [{ name: `DekPua | V${version}`, type: ActivityType.Playing }] });

        setInterval(async () => {
            client.user.setPresence({ activities: [{ name: `DekPua | V${version}`, type: ActivityType.Playing }] });
        }, 60 * 1000);

        if (!mongodbUri) return;

        await mongoose.connect(mongodbUri || '', {});

        if (mongoose.connect) {
            console.log(`[${client.shard.ids}] DekPua have connected to database!`);
        } else {
            console.log(`[${client.shard.ids}] DekPua cannot connect to database right now...`);
        };
        
    },
};