const mongoose = require('../config/mongoose');
var TokenSchema = mongoose.Schema({
    value: String,
    userId: String
})
var RefreshToken = mongoose.model("RefreshToken", TokenSchema);
module.exports = RefreshToken;