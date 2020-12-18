const { Schema } = require('../config/mongoose');
var mongoose = require('../config/mongoose');
const ROLES = require('../config/roles');
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        default: ROLES.BASIC
    },
    passwordHash: {
        type: String,
    },
    coins: {
        type: Number,
        default: 0
    },
    pixels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pixel"}],
    maps: [{ type: mongoose.Schema.Types.ObjectId, ref: "Map" }],
    colors: [{ type: String }]
}, { timestamps: true });
const User = mongoose.model("User", UserSchema);
module.exports = User;
