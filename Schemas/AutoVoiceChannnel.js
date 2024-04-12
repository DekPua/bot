const { Schema, model } = require('mongoose');

let AutoVoiceChannel = new Schema({
    ChannelId: String,
    OwnerId: String,
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("auto_voice_channel", AutoVoiceChannel);