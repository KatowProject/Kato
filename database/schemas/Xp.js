const { Schema, model, models } = require('mongoose');

const XPSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    data: {
        type: Array,
        required: true,
    }
});

module.exports = models.XP_PLAYER || model('XP_PLAYER', XPSchema);