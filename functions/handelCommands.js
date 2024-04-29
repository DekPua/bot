const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require('dotenv').config();

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }

        const rest = new REST({
            version: '10'
        }).setToken(process.env.TOKEN);

        (async () => {
            try {
                console.log(`[${client.shard.ids}] Started refreshing application (/) commands.`);

                await rest.put(
                    Routes.applicationCommands(process.env.CLIENT_ID, "935463490427179049"), {
                    body: client.commandArray
                },
                );

                console.log(`[${client.shard.ids}] Successfully reloaded ${client.commandArray.length} application (/) commands.`);

                if (!process.env.IS_DEV) return;

                await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, "1213126282921902230"), { body: [] })
                    .then(() => console.log(`[${client.shard.ids}] Successfully deleted all guild commands.`))
                    .catch(console.error);
            } catch (error) {
                console.error(error);
            }
        })();
    };
};