const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String
    },
    googleId: String
}, { timestamps: true })


module.exports = mongoose.model('user', userSchema, 'users')