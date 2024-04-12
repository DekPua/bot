const { Schema, model } = require('mongoose');

let schema = new Schema({
    ChannelId: String,
    Reaction: String,
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("auto_publish", schema);