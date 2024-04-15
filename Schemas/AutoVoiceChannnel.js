const { Schema, model, models } = require('mongoose');

let schema = new Schema({
    ChannelId: String,
    OwnerId: String,
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = models.auto_voice_channel || model("auto_voice_channel", schema);