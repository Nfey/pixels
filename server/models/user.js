const { Schema } = require('../config/mongoose');
var mongoose = require('../config/mongoose');
const ROLES = require('../config/roles');
var { io } = require('../config/sockets');
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
    pixels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pixel" }],
    maps: [{ type: mongoose.Schema.Types.ObjectId, ref: "Map" }],
    colors: [{ type: String }]
}, { timestamps: true });

UserSchema.methods.isAdjacent = function (myPixel) {
    var pixelList = this.pixels.filter(pixel => String(pixel.map_pos.map) == String(myPixel.map_pos.map)) //filters list of pixels to only pixels from the map we're working with
    var isAdjacent = false;
    pixelList.forEach(pixel => {
        if ((pixel.map_pos.x - myPixel.map_pos.x >= -1 && pixel.map_pos.x - myPixel.map_pos.x <= 1) && (pixel.map_pos.y - myPixel.map_pos.y >= -1 && pixel.map_pos.y - myPixel.map_pos.y <= 1))
            isAdjacent = true;
    })
    return isAdjacent;
}

UserSchema.methods.claimPixel = async function (pixelData) {
    var pixel = await mongoose.model('Pixel').findById(pixelData._id)
    if (this.isAdjacent(pixel) || this.pixels.filter(userPixel => String(userPixel.map_pos.map) == String(pixel.map_pos.map)).length == 0) {
        pixel.color = pixelData.color;
        await User.findByIdAndUpdate(pixel.owner, { $pull: { pixels: pixel._id } }, { useFindAndModify: false })
        pixel.owner = this._id;
        await pixel.save();
        if (!this.pixels.includes(pixel._id)) {
            this.pixels.push(pixel);
            await this.save();
        }
        io.to(String(pixel.map_pos.map)).emit('pixelClaimed', pixel);
        return pixel
    }
    else {
        // res.status(418).send("ERROR: Pixel placed is not adjacent");
        throw Error("ERROR: Pixel placed is not adjacent");
    }
}
const User = mongoose.model("User", UserSchema);
module.exports = User;
