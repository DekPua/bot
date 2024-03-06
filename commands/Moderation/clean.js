const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

function getTimeAgoString(timeDifference) {
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    if (months > 0) {
        return months === 1 ? "1_month" : `${months}_month`;
    } else if (days > 0) {
        return days === 1 ? "1_day" : `${days}_day`;
    } else if (hours > 0) {
        return hours === 1 ? "1_hour" : `${hours}_hour`;
    } else if (minutes > 0) {
        return minutes === 1 ? "1_minute" : `${minutes}_minute`;
    } else {
        return "Just now";
    }
}

async function deleteMessageIfWithinLastHour(message) {
    const now = Date.now();
    const messageTimestamp = message.createdTimestamp;
    const timeDifference = now - messageTimestamp;
    const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours

    if (hoursDifference <= 1) {
        try {
            await message.delete();
            console.log("Message deleted.");
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    } else {
        console.log("Message is not within the last hour.");
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clean")
        .setDescription('Clean Channel')
        .setDescriptionLocalizations({ th: "ทำความสะอาดห้อง (ลบข้อความ)" })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addIntegerOption((option) => option.setName("count").setDescription('Message Count').setDescriptionLocalizations({ th: "จำนวนข้อความ" }).setRequired(true))
        // .addStringOption((option) =>
        //     option
        //         .setName("time")
        //         .setDescription("Started time")
        //         .setRequired(false)
        //         .addChoices(
        //             { name: "From the beginning", name_localizations: { th: "ตั้งแต่ต้น" }, value: "start" },
        //             { name: "1 Hour", name_localizations: { th: "1 ชั่วโมงที่แล้ว" }, value: "1_hour" },
        //             { name: "2 Hours", name_localizations: { th: "2 ชั่วโมงที่แล้ว" }, value: "2_hour" },
        //             { name: "3 Hours", name_localizations: { th: "3 ชั่วโมงที่แล้ว" }, value: "3_hour" },
        //             { name: "4 Hours", name_localizations: { th: "4 ชั่วโมงที่แล้ว" }, value: "4_hour" },
        //             { name: '5 Hours', name_localizations: { th: "5 ชั่วโมงที่แล้ว" }, value: '5_hour' },
        //             { name: '6 Hours', name_localizations: { th: "6 ชั่วโมงที่แล้ว" }, value: '6_hour' },
        //             { name: '7 Hours', name_localizations: { th: "7 ชั่วโมงที่แล้ว" }, value: '7_hour' },
        //             { name: '8 Hours', name_localizations: { th: "8 ชั่วโมงที่แล้ว" }, value: '8_hour' },
        //             { name: '9 Hours', name_localizations: { th: "9 ชั่วโมงที่แล้ว" }, value: '9_hour' },
        //             { name: '10 Hours', name_localizations: { th: "10 ชั่วโมงที่แล้ว" }, value: '10_hour' },
        //             { name: '11 Hours', name_localizations: { th: "11 ชั่วโมงที่แล้ว" }, value: '11_hour' },
        //             { name: '12 Hours', name_localizations: { th: "12 ชั่วโมงที่แล้ว" }, value: '12_hour' },
        //             { name: '1 Day', name_localizations: { th: "1 วันที่แล้ว" }, value: '1_day' },
        //             { name: '2 Days', name_localizations: { th: "2 วันที่แล้ว" }, value: '2_day' },
        //             { name: '3 Days', name_localizations: { th: "3 วันที่แล้ว" }, value: '3_day' },
        //             { name: '4 Days', name_localizations: { th: "4 วันที่แล้ว" }, value: '4_day' },
        //             { name: '5 Days', name_localizations: { th: "5 วันที่แล้ว" }, value: '5_day' },
        //             { name: '6 Days', name_localizations: { th: "6 วันที่แล้ว" }, value: '6_day' },
        //             { name: '7 Days', name_localizations: { th: "7 วันที่แล้ว" }, value: '7_day' },
        //             { name: '1 Month', name_localizations: { th: "1 เดือนที่แล้ว" }, value: '1_month' },
        //             { name: '2 Months', name_localizations: { th: "2 เดือนที่แล้ว" }, value: '2_month' },
        //             { name: '3 Months', name_localizations: { th: "3 เดือนที่แล้ว" }, value: '3_month' },
        //             { name: '4 Months', name_localizations: { th: "4 เดือนที่แล้ว" }, value: '4_month' },
        //             { name: '5 Months', name_localizations: { th: "5 เดือนที่แล้ว" }, value: '5_month' },
        //         )
        //         .setDescriptionLocalizations({ th: "เวลาที่เริ่ม" })
        ,
    async execute(interaction, client) {
        const { options } = interaction;
        const count = options.getInteger('count');

        console.log(count);

        await interaction.deferReply({ ephemeral: true });

        try {
            const messages = await interaction.channel.messages.fetch({ limit: count, cache: false });

        console.log(messages.length);
        
        messages.forEach(async (message, index) => {
            message.delete();
        });

        await interaction.editReply({
            content: `กำลังลบ ${count} ข้อความ!\nหากมีข้อความเยอะอาจใช้เวลาซักครู่`
        });
        } catch (error) {
            await interaction.editReply({
                content: `ไม่สามารถลบข้อความได้`
            });
        }




        // const timeOption = options.getString("time");

        // const now = Date.now();
        // const messages = await interaction.channel.messages.fetch({ limit: 100, cache: false });
        // messages.forEach(async (message) => {
        //     const messageTimestamp = message.createdTimestamp;
        //     const timeDifference = now - messageTimestamp;

        //     console.log(getTimeAgoString(timeDifference));
        // });



        // // Your logic based on the selected time option
        // switch (timeOption) {
        //     case "start":
        //         // Clean channel from the beginning
        //         console.log("Cleaning channel from the beginning...");
        //         break;
        //     case "1_hour":
        //         // Clean messages from 1 hour ago
        //         console.log("Cleaning messages from 1 hour ago...");
        //         break;
        //     case "2_hour":
        //         // Clean messages from 2 hours ago
        //         console.log("Cleaning messages from 2 hours ago...");
        //         break;
        //     case "3_hour":
        //         // Clean messages from 3 hours ago
        //         console.log("Cleaning messages from 3 hours ago...");
        //         break;
        //     case "4_hour":
        //         // Clean messages from 4 hours ago
        //         console.log("Cleaning messages from 4 hours ago...");
        //         break;
        //     case "5_hour":
        //         // Clean messages from 5 hours ago
        //         console.log("Cleaning messages from 5 hours ago...");
        //         break;
        //     case "6_hour":
        //         // Clean messages from 6 hours ago
        //         console.log("Cleaning messages from 6 hours ago...");
        //         break;
        //     case "7_hour":
        //         // Clean messages from 7 hours ago
        //         console.log("Cleaning messages from 7 hours ago...");
        //         break;
        //     case "8_hour":
        //         // Clean messages from 8 hours ago
        //         console.log("Cleaning messages from 8 hours ago...");
        //         break;
        //     case "9_hour":
        //         // Clean messages from 9 hours ago
        //         console.log("Cleaning messages from 9 hours ago...");
        //         break;
        //     case "10_hour":
        //         // Clean messages from 10 hours ago
        //         console.log("Cleaning messages from 10 hours ago...");
        //         break;
        //     case "11_hour":
        //         // Clean messages from 11 hours ago
        //         console.log("Cleaning messages from 11 hours ago...");
        //         break;
        //     case "12_hour":
        //         // Clean messages from 12 hours ago
        //         console.log("Cleaning messages from 12 hours ago...");
        //         break;
        //     case "1_day":
        //         // Clean messages from 1 day ago
        //         console.log("Cleaning messages from 1 day ago...");
        //         break;
        //     case "2_day":
        //         // Clean messages from 2 days ago
        //         console.log("Cleaning messages from 2 days ago...");
        //         break;
        //     case "3_day":
        //         // Clean messages from 3 days ago
        //         console.log("Cleaning messages from 3 days ago...");
        //         break;
        //     case "4_day":
        //         // Clean messages from 4 days ago
        //         console.log("Cleaning messages from 4 days ago...");
        //         break;
        //     case "5_day":
        //         // Clean messages from 5 days ago
        //         console.log("Cleaning messages from 5 days ago...");
        //         break;
        //     case "6_day":
        //         // Clean messages from 6 days ago
        //         console.log("Cleaning messages from 6 days ago...");
        //         break;
        //     case "7_day":
        //         // Clean messages from 7 days ago
        //         console.log("Cleaning messages from 7 days ago...");
        //         break;
        //     case "1_month":
        //         // Clean messages from 1 month ago
        //         console.log("Cleaning messages from 1 month ago...");
        //         break;
        //     case "2_month":
        //         // Clean messages from 2 months ago
        //         console.log("Cleaning messages from 2 months ago...");
        //         break;
        //     case "3_month":
        //         // Clean messages from 3 months ago
        //         console.log("Cleaning messages from 3 months ago...");
        //         break;
        //     case "4_month":
        //         // Clean messages from 4 months ago
        //         console.log("Cleaning messages from 4 months ago...");
        //         break;
        //     case "5_month":
        //         // Clean messages from 5 months ago
        //         console.log("Cleaning messages from 5 months ago...");
        //         break;
        //     case "6_month":
        //         // Clean messages from 6 months ago
        //         console.log("Cleaning messages from 6 months ago...");
        //         break;
        //     case "7_month":
        //         // Clean messages from 7 months ago
        //         console.log("Cleaning messages from 7 months ago...");
        //         break;
        //     case "8_month":
        //         // Clean messages from 8 months ago
        //         console.log("Cleaning messages from 8 months ago...");
        //         break;
        //     case "9_month":
        //         // Clean messages from 9 months ago
        //         console.log("Cleaning messages from 9 months ago...");
        //         break;
        //     case "10_month":
        //         // Clean messages from 10 months ago
        //         console.log("Cleaning messages from 10 months ago...");
        //         break;
        //     case "11_month":
        //         // Clean messages from 11 months ago
        //         console.log("Cleaning messages from 11 months ago...");
        //         break;
        //     case "12_month":
        //         // Clean messages from 12 months ago
        //         console.log("Cleaning messages from 12 months ago...");
        //         break;
        //     default:
        //         // Handle invalid options
        //         console.log("Invalid time option selected.");
        //         break;
        // }
    }

};
