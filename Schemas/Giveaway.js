const { Schema, model, models } = require('mongoose');

const schema = new Schema({
    Reward: String,
    Winner: Number,
    Description: String,
    WinnerList: [String],
    MessageId: String,
    ChannelId: String,
    GuildId: String,
    Status: String,
    EndsAt: Date,
    CreateBy: String,
}, {
    timestamps: true
});

module.exports = model("Giveaway", schema);