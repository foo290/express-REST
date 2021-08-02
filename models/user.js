const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: false
    },
    last_name: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: Array,
        required: false,
        default: []
    },
    permissions: {
        type: Array,
        required: false
    },
    joinedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        required: true,
        default: Date.now
    },
    isSuperUser: {
        type: Boolean,
        required: true,
        default: false
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model("User", UserSchema)
