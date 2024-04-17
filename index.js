const { ShardingManager } = require('discord.js');
require('dotenv').config();

const manager = new ShardingManager('./bot.js', {
    token: process.env.TOKEN,
});

manager.on('shardCreate', shard => {
    shard.on('death', () => {
        console.log(`[${shard.id}] is Death`);
        console.log(`[${shard.id}] Reswawning...`);
    });
    console.log(`Launched shard ${shard.id}`);
});

const envList = [
    "CLIENT_ID",
    "CLIENT_SECRET",
    "PUBLIC_KEY",
    "TOKEN",
    "API_HOST",
    "MONGODB_URI",
    "VIRUSTOTAL_API_KEY",
    "EMAIL_HOST",
    "EMAIL_PORT",
    "EMAIL_USER",
    "EMAIL_PASS",
    "EMAIL_SENDER",
    "EMAIL_SENDER_NAME",
];

const env = process.env;

const missingEnv = envList.filter(variable => !(variable in env));

console.log(`Getting Start...`);

if (missingEnv.length > 0) {
    console.error(`Missing environment variables: ${missingEnv.join(', ')}`);
    process.exit();
} else {
    manager.spawn();
}

module.exports = manager;