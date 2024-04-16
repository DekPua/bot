const { Schema, model, models } = require('mongoose');

const schema = new Schema({
    Url: String,
    Malicious: Number
}, {
    timestamps: true
});

module.exports = models.whitelist_url || model("whitelist_url", schema);
