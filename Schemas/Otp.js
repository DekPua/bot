const { Schema, model } = require('mongoose');

module.exports = model("otp", new Schema({
    DiscordId: String,
    Ref: String,
    Email: String,
    Otp: String,
    Verified: String
}, {
    timestamps: true,
}))