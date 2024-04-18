const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = Schema({
    state: String,
    createdUser: {
        type: String,
        required: true,
    },
    sharedTo: {
        type: Array,
        required: true
    },
    isReadOnly: Boolean
}, { timestamps: true })


module.exports = mongoose.model('board', boardSchema, 'boards')