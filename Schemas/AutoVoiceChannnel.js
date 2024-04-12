const { Schema, model } = require('mongoose');

let schema = new Schema({
    ChannelId: String,
    OwnerId: String,
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("auto_voice_channel", schema);