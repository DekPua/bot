const { Schema, model, models } = require('mongoose');

const schema = new Schema({
    Url: String,
    Type: String
}, {
    timestamps: true
});

module.exports = models.blacklist_url || model("blacklist_url", schema);
