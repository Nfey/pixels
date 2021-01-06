var mongoose = require('../config/mongoose');
var MapSchema = new mongoose.Schema({
    theme: { type: String, required: true },
    height: { type: Number, required: true, default: 10 },
    width: { type: Number, required: true, default: 10 },
    pixels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pixel" }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    phase: { type: String, default: "turn" },

}, { timestamps: true });
const Map = mongoose.model("Map", MapSchema);
module.exports = {
    schema: MapSchema,
    model: Map
}
