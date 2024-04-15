const { Schema, model, models } = require('mongoose');

const schema = new Schema({
    ChannelId: String,
    Reaction: String,
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = models.auto_publish || model("auto_publish", schema);
