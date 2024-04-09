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
                    const monthlyJoins = {};
                    joinatlist.forEach((joinDate) => {
                        const joinMonth = joinDate.getMonth() + 1; // January is 0
                        const joinYear = joinDate.getFullYear();
                        const monthYear = `${joinMonth}-${joinYear}`;
                        if (!monthlyJoins[monthYear]) {
                            monthlyJoins[monthYear] = 1;
                        } else {
                            monthlyJoins[monthYear]++;
                        }
                    });

                    // Convert monthlyJoins object to chart data format
                    const labels = Object.keys(monthlyJoins).sort(); // Sort the labels in chronological order
                    const data = {
                        labels: labels,
                        datasets: [
                            {
                                label: "User Count",
                                data: labels.map((monthYear) => monthlyJoins[monthYear]),
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
                    createdAtList.forEach((createDate) => {
                        // Extract day, month, and year from the creation date
                        const createDay = createDate.getDate();
                        const createMonth = createDate.getMonth() + 1; // January is 0
                        const createYear = createDate.getFullYear();
                    
                        // Combine day, month, and year to create a unique key for each day
                        const dayKey = `${createYear}-${createMonth}-${createDay}`;
                    
                        // Increment the count for the corresponding day
                        if (!dailyCreates[dayKey]) {
                            dailyCreates[dayKey] = 1;
                        } else {
                            dailyCreates[dayKey]++;
                        }
                    });
                    
                    // Convert dailyCreates object to chart data format
                    const labels = Object.keys(dailyCreates).sort(); // Sort the labels in chronological order
                    const data = {
                        labels: labels,
                        datasets: [
                            {
                                label: "User Count",
                                data: labels.map((dayKey) => dailyCreates[dayKey]),
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
