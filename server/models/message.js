var mongoose = require('../config/mongoose');

var MessageSchema = new mongoose.Schema({
    body: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    map: { type: mongoose.Schema.Types.ObjectId, ref: "Map" }
}, { timestamps: true });

const Message = mongoose.model("Message", MessageSchema);

module.exports = {
    schema: MessageSchema,
    model: Message
}