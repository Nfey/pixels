const Map = require('../models/map').model;
const Pixel = require('../models/pixel').model;
module.exports = {
    getAll: (req, res) => {
        Map.find()
            .then(maps => res.json(maps))
            .catch(e => res.status(422).json(e));
    },
    getOne: (req, res) => {
        Map.findById(req.params.id).populate("pixels")
            .then(map => res.json(map))
            .catch(e => res.status(422).json(e));
    },
    create: (req, res) => {
        Map.create(req.body)
            .then(map => {
                for (let y = 0; y < map.height; y++) {
                    for (let x = 0; x < map.width; x++) {
                        Pixel.create({ map_pos: { map: map._id, x: x, y: y } })
                            .then(pixel => {
                                Map.findByIdAndUpdate(map._id, {$push: {pixels: pixel}})
                                    .then(map => {})
                                    .catch(e => console.log(e));
                            })
                            .catch(e => console.log(e));
                    }
                }
                res.json(map);
            })
            .catch(e => res.status(422).json(e));
    },
    update: (req, res) => {
        Map.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
            .then(map => res.json(map))
            .catch(e => res.status(422).json(e));
    },
    delete: (req, res) => {
        Map.findByIdAndRemove(req.params.id, { useFindAndModify: false })
            .then(map => res.json(map))
            .catch(e => res.status(422).json(e));
    }
}