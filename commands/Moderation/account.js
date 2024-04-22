const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Colors, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require("discord.js");
const AccountSchema = require('../../Schemas/Account');

function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('account')
        .setDescription('Account')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub =>
            sub.setName('check-active-user')
                .setDescription('Check Active Account List')
        ),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case "check-active-user":
                const accounts = await AccountSchema.find({
                    Activate: true
                });

                // Chunking the array into arrays of 10 items each for pagination
                const chunks = chunkArray(accounts, 10);

                // Initial page
                let currentPage = 0;

                const first = new ButtonBuilder()
                    .setCustomId('pagefirst')
                    .setEmoji('⏪')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true);

                const prev = new ButtonBuilder()
                    .setCustomId('pageprev')
                    .setEmoji('◀️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true);

                const pagec = new ButtonBuilder()
                    .setCustomId('pagecount')
                    .setLabel(`${currentPage + 1}/${chunks.length}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true);

                const next = new ButtonBuilder()
                    .setCustomId('pagenext')
                    .setEmoji('▶️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(false);

                const last = new ButtonBuilder()
                    .setCustomId('pagelast')
                    .setEmoji('⏩')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(false);

                const buttons = new ActionRowBuilder().addComponents([first, prev, pagec, next, last]);

                const embeds = chunks.map((chunk, index) => {
                    return new EmbedBuilder()
                        .setColor(Colors.Green)
                        .setTitle(`ผู้ใช้ที่เข้าสู่ระบบแล้ว - ${accounts.length}`)
                        .setDescription(chunk.map(account => `- <@${account.DiscordId}> - ${account.Email}`).join('\n'));
                });

                const msg = await interaction.editReply({
                    embeds: [embeds[currentPage]],
                    components: [buttons],
                    fetchReply: true
                });

                const collector = msg.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 60000 // 1 minute timeout
                });

                collector.on('collect', async (button) => {
                    if (button.user.id !== interaction.user.id) return button.reply({ content: `Only <@${interaction.user.id}> can use these Buttons!`, ephemeral: true });
                    
                    await button.deferUpdate();

                    if (button.customId == 'pagefirst') {
                        currentPage = 0;
                    } else if (button.customId == 'pageprev') {
                        if (currentPage > 0) currentPage--;
                    } else if (button.customId == 'pagenext') {
                        if (currentPage < chunks.length - 1) {
                            currentPage++;
                        }
                    } else if (button.customId == 'pagelast') {
                        currentPage = chunks.length - 1;
                    }

                    pagec.setLabel(`${currentPage + 1}/${chunks.length}`);

                    if (currentPage == 0) {
                        first.setDisabled(true);
                        prev.setDisabled(true);
                    } else {
                        first.setDisabled(false);
                        prev.setDisabled(false);
                    }

                    if (currentPage == chunks.length - 1) {
                        next.setDisabled(true);
                        last.setDisabled(true);
                    } else {
                        next.setDisabled(false);
                        last.setDisabled(false);
                    }

                    await interaction.editReply({ embeds: [embeds[currentPage]], components: [buttons] });

                    collector.resetTimer();
                });

                collector.on('end', async () => {
                    await interaction.editReply({
                        content: '⌛ เนื้อหาหมดอายุแล้ว กรุณาใช้คำสั่งอีกครั้ง',
                        embeds: [embeds[currentPage]],
                        components: []
                    });
                });

                break;
        }
    }
}