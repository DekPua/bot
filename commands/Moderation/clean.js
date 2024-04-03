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
        .addIntegerOption((option) => option.setName("count").setDescription('Message Count').setDescriptionLocalizations({ th: "จำนวนข้อความ" }).setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const count = options.getInteger('count');

        try {
            const messages = await interaction.channel.messages.fetch({ limit: count, cache: false });
            
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
    }

};
