const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    AttachmentBuilder,
    ChannelType,
} = require("discord.js");
const Chart = require("chart.js");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

const plugin = {
    id: "customCanvasBackgroundColor",
    beforeDraw: (chart, args, options) => {
        const { ctx } = chart;
        ctx.save();
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = options.color || "#99ffff";
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    },
};

async function generateChart(data, chartType) {
    // Configure chart options
    const options = {
        type: chartType,
        data: data,
        options: {
            plugins: {
                customCanvasBackgroundColor: {
                    color: "white",
                },
            },
        },
        plugins: [plugin],
    };

    // Use chartjs-node-canvas to render the chart
    const canvasRenderService = new ChartJSNodeCanvas({
        width: 800,
        height: 600,
    });

    const chart = await canvasRenderService.renderToBuffer(options);

    return chart;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("analytic")
        .setDescription("Statistical analysis")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((sub) =>
            sub
                .setName("user")
                .setDescription("User statistics")
                .setDescriptionLocalization("th", "สถิติผู้ใช้")
                .addStringOption((option) =>
                    option
                        .setName("chart")
                        .setDescription("Type of Chart")
                        .addChoices(
                            {
                                name: "Line Chart",
                                value: "line",
                                name_localizations: { th: "แผนภูมิเส้น" },
                            },
                            {
                                name: "Bar Chart",
                                value: "bar",
                                name_localizations: { th: "แผนภูมิแท่ง" },
                            }
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub
                .setName("message")
                .setDescription("Message statistics")
                .setDescriptionLocalization("th", "สถิติผู้ใช้")
                .addChannelOption((option) =>
                    option.setName("channel").setDescription("Channel").setRequired(true).addChannelTypes(ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.AnnouncementThread, ChannelType.GuildStageVoice)
                )
                .addStringOption((option) =>
                    option
                        .setName("chart")
                        .setDescription("Type of Chart")
                        .addChoices(
                            {
                                name: "Line Chart",
                                value: "line",
                                name_localizations: { th: "แผนภูมิเส้น" },
                            },
                            {
                                name: "Bar Chart",
                                value: "bar",
                                name_localizations: { th: "แผนภูมิแท่ง" },
                            }
                        )
                        .setRequired(true)
                )
        ),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        if (interaction.guild.id != "1213126282921902230")
            return await interaction.editReply({
                content: "❌ ไม่สามารถสร้างการสรุปได้ กรุณาลองอีกครั้งภายหลัง",
                ephemeral: true,
            });

        const guild = interaction.guild;

        const sub = interaction.options.getSubcommand();
        const chart = await interaction.options.getString("chart");

        switch (sub) {
            case "user":
                try {
                    const members = await guild.members.fetch();

                    const joinatlist = await members.map((member) => member.joinedAt);

                    // Count the number of joins for each month
                    const dailyJoins = {};
                    joinatlist.forEach((joinDate) => {
                        const joinDay = joinDate.toISOString().split('T')[0]; // Extract the date without time
                        if (!dailyJoins[joinDay]) {
                            dailyJoins[joinDay] = 1;
                        } else {
                            dailyJoins[joinDay]++;
                        }
                    });

                    // Convert dailyJoins object to chart data format
                    const labels = Object.keys(dailyJoins).sort(); // Sort the labels in chronological order
                    const data = {
                        labels: labels,
                        datasets: [
                            {
                                label: "User Count",
                                data: labels.map((joinDay) => dailyJoins[joinDay]),
                                fill: false,
                                borderColor: "rgb(75, 192, 192)",
                                backgroundColor: "rgb(75, 192, 192)",
                                tension: 0.1,
                            },
                        ],
                    };

                    const chartImage = await generateChart(data, chart);

                    const file = new AttachmentBuilder(chartImage);

                    await interaction.editReply({
                        files: [file],
                        ephemeral: true,
                    });
                } catch (error) {
                    await interaction.editReply({
                        content: "❌ ไม่สามารถสร้างการสรุปได้ กรุณาลองอีกครั้งภายหลัง",
                        ephemeral: true,
                    });
                }
                break;
            case "message":
                try {
                    const channel = await interaction.options.getChannel('channel')
                    const messages = await channel.messages.fetch();

                    const createdAtList = await messages.map(message => message.createdAt);

                    // Count the number of joins for each month
                    const monthlyCreates = {};
                    createdAtList.forEach((createDate) => {
                        const createMonth = createDate.getMonth() + 1; // January is 0
                        const createYear = createDate.getFullYear();
                        const monthYear = `${createMonth}-${createYear}`;
                        if (!monthlyCreates[monthYear]) {
                            monthlyCreates[monthYear] = 1;
                        } else {
                            monthlyCreates[monthYear]++;
                        }
                    });

                    // Convert monthlyJoins object to chart data format
                    const labels = Object.keys(monthlyCreates).sort(); // Sort the labels in chronological order
                    const data = {
                        labels: labels,
                        datasets: [
                            {
                                label: "Message Count",
                                data: labels.map((monthYear) => monthlyCreates[monthYear]),
                                fill: false,
                                borderColor: "rgb(75, 192, 192)",
                                backgroundColor: "rgb(75, 192, 192)",
                                tension: 0.1,
                            },
                        ],
                    };

                    const chartImage = await generateChart(data, chart);

                    const file = new AttachmentBuilder(chartImage);

                    await interaction.editReply({
                        files: [file],
                        ephemeral: true,
                    });
                } catch (error) {
                    await interaction.editReply({
                        content: "❌ ไม่สามารถสร้างการสรุปได้ กรุณาลองอีกครั้งภายหลัง",
                        ephemeral: true,
                    });
                }
                break;
        }
    },
};
