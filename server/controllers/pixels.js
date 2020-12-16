const mongoose = require('../../server/config/mongoose');
const Pixel = require('../models/pixel').model;
const Map = require('../models/map').model;
const User = require('../models/user');

module.exports = io => {
    return {
        getAll: (req, res) => {
            Pixel.find()
                .then(pixels => res.json(pixels))
                .catch(e => res.status(422).json(e));
        },
        getOne: (req, res) => {
            Pixel.findById(req.params.id)
                .then(pixel => res.json(pixel))
                .catch(e => res.status(422).json(e));
        },
        getByMap: (req, res) => {
            id = mongoose.Types.ObjectId(req.params.id);
            Pixel.find({ 'map_pos.map': id }).sort('map_pos.y').sort('map_pos.x')
                .then(pixels => res.json(pixels))
                .catch(e => res.status(422).json(e));
        },
        create: (req, res) => {
            req.body.map_pos.map = mongoose.Types.ObjectId(req.body.map_pos.map);
            Pixel.create(req.body)
                .then(pixel => {
                    res.json(pixel);
                    Map.findByIdAndUpdate(pixel.map_pos.map, { $push: { pixels: pixel } }, { useFindAndModify: false })
                        .then()
                        .catch(e => console.log(e));
                })
                .catch(e => {
                    res.status(422).json(e);
                    console.log('pixel creation error');
                });
        },
        update: (req, res) => {
            Pixel.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
                .then(pixel => res.json(pixel))
                .catch(e => res.status(422).json(e));
        },
        delete: (req, res) => {
            Pixel.findByIdAndRemove(req.params.id, { useFindAndModify: false })
                .then(pixel => res.json(pixel))
                .catch(e => res.status(422).json(e));
        },
        claim: (req, res) => {
            User.findById(req.user._id).populate("pixels")
                .then(user => {
                    Pixel.findById(req.body._id) //req.body._id is the id of the pixel clicked on
                        .then(pixel => {
                            if (isAdjacent(user, pixel) || user.pixels.filter(userPixel => String(userPixel.map_pos.map) == String(pixel.map_pos.map)).length == 0) {
                                pixel.color = req.body.color;
                                User.findByIdAndUpdate(pixel.owner, { $pull: { pixels: pixel._id } }, { useFindAndModify: false })
                                    .then(previousOwner => {
                                        pixel.owner = user._id;
                                        pixel.save();
                                        if (!user.pixels.includes(pixel._id)) {
                                            user.pixels.push(pixel);
                                            user.save();
                                        }
                                        io.to(String(pixel.map_pos.map)).emit('pixelClaimed', pixel);
                                        res.json(pixel);
                                    })
                                    .catch(e => res.status(420).json(e));
                            }
                            else {
                                res.status(418).send("ERROR: Pixel placed is not adjacent");
                            }
                        })
                        .catch(e => res.status(422).json(e));
                })
                .catch(e => res.json(e));
        }
    }
}

//returns true or false, true if adjacent, false if not adjacent
//receives pixel clicked on
//checks each pixel user owns (within this map). When an adjacent pixel is found, return true
//if we reach end of pixels user owns, return false

function isAdjacent(myUser, myPixel) {
    var pixelList = myUser.pixels.filter(pixel => String(pixel.map_pos.map) == String(myPixel.map_pos.map))
    var isAdjacent = false;
    pixelList.forEach(pixel => {
        if ((pixel.map_pos.x - myPixel.map_pos.x >= -1 && pixel.map_pos.x - myPixel.map_pos.x <= 1) && (pixel.map_pos.y - myPixel.map_pos.y >= -1 && pixel.map_pos.y - myPixel.map_pos.y <= 1))
            isAdjacent = true;
    })
    return isAdjacent;
}