const { Schema, model } = require('mongoose');

module.exports = model("account", new Schema({
    DiscordId: String,
    Email: String,
    Activate: Boolean,
}, {
    timestamps: true,
}))