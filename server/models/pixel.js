var mongoose = require('../config/mongoose');

var PixelSchema = new mongoose.Schema({
    map_pos: {
        type: {
            map: { type: mongoose.Schema.Types.ObjectId, ref: "Map", required: true },
            x: { type: Number },
            y: { type: Number },
        },
        required: true,
        default: { x: 0, y: 0 },
        unique: true
    },
    color: { type: String, required: true, default: "white" },
    heat: { type: Number, default: 0 },
    effect: { type: String, default: "none" },
    strength: { type: Number, default: 1 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const Pixel = mongoose.model("Pixel", PixelSchema);

module.exports = {
    schema: PixelSchema,
    model: Pixel
}