var mongoose = require('../config/mongoose');
var MapSchema = new mongoose.Schema({
    theme: { type: String, required: true },
    height: { type: Number, required: true, default: 10 },
    width: { type: Number, required: true, default: 10 },
    pixels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pixel" }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    phase: { type: String, default: "turn" },
    tickTime: {type: Number, required: true, default: 30},
    tickTotal: {type: Number, required: true, default: 4},
    currentTick: {type: Number, required: true, default: 1},
}, { timestamps: true });
const Map = mongoose.model("Map", MapSchema);
module.exports = {
    schema: MapSchema,
    model: Map
}
