const mongoose = require('../../server/config/mongoose');
const Pixel = require('../models/pixel').model;
const Map = require('../models/map').model;
const User = require('../models/user');

module.exports = socketFunctions => {
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
            console.log(id);
            Pixel.find({ 'map_pos.map': id }).sort('map_pos.y').sort('map_pos.x')
                .then(pixels => res.json(pixels))
                .catch(e => res.status(422).json(e));
        },
        create: (req, res) => {
            req.body.map_pos.map = mongoose.Types.ObjectId(req.body.map_pos.map);
            Pixel.create(req.body)
                .then(pixel => {
                    res.json(pixel);
                    Map.findByIdAndUpdate(pixel.map_pos.map, { $push: { pixels: pixel } })
                        .then()
                        .catch(e => console.log(e));
                    console.log('created');
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
            User.findById(req.user._id)
                .then(user => {
                    Pixel.findById(req.body._id)
                        .then(pixel => {
                            pixel.color = req.body.color;
                            pixel.owner = user._id;
                            pixel.save();
                            if (!user.pixels.includes(pixel._id)) {
                                user.pixels.push(pixel);
                                user.save();
                            }
                            socketFunctions.io.emit('pixelClaimed', pixel);
                            res.json(pixel);
                        })
                        .catch(e => res.status(422).json(e));
                })
                .catch(e => res.json(e));
        }
    }
}