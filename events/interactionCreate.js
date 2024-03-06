const { Events } = require("discord.js");
const Command = require("../executes/Commands");
const Button = require("../executes/Button");
const ModalSubmit = require("../executes/ModalSubmit");
const StringSelectMenu = require("../executes/StringSelectMenu");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.isCommand()) await Command(interaction, client);
        else if (interaction.isButton()) await Button(interaction, client);
        else if (interaction.isModalSubmit()) await ModalSubmit(interaction, client);
        else if (interaction.isStringSelectMenu()) await StringSelectMenu(interaction, client);
        else {
            await interaction.reply({
                content: "There was an error while executing!",
                ephemeral: true,
            });
        }
    },
};
