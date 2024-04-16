const { Schema, model, models } = require('mongoose');

const schema = new Schema({
    Url: String,
    Malicious: Number
}, {
    timestamps: true
});

module.exports = models.blacklist_url || model("blacklist_url", schema);
