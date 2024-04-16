const { Schema, model, models } = require('mongoose');

const schema = new Schema({
    Url: String,
    Type: String
}, {
    timestamps: true
});

module.exports = models.whitelist_url || model("whitelist_url", schema);
