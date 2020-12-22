const User = require('../models/user');
const Map = require('../models/map').model;
const Pixel = require('../models/pixel').model;
module.exports = {
    mapUserLink: (req, res) => {
        var userPromise = User.findOneAndUpdate({ _id: req.body.userId }, { $addToSet: { maps: req.body.mapId } }, { new: true })
        var mapPromise = Map.findOneAndUpdate({ _id: req.body.mapId }, { $addToSet: { users: req.body.userId } }, { new: true })
        Promise.all([userPromise, mapPromise])
            .then(values => {
                res.json({ user: values[0], map: values[1] })
            })
            .catch(e => res.status(422).json(e))
    },
    getAll: (req, res) => {
        Map.find()
            .then(maps => res.json(maps))
            .catch(e => res.status(422).json(e));
    },
    getOne: (req, res) => {
        Map.findById(req.params.id).populate("pixels").populate("users")
            .then(map => res.json(map))
            .catch(e => res.status(422).json(e));
    },
    // getCustomersWithThisOneVerySpecificAddress: (req, res) => {
    //     Customer.find({ address: "Park Lane 38" })
    //         .then(customer => console.log(customer))
    //         .catch(error => console.error(error));
    // },
    create: (req, res) => {
        Map.create(req.body)
            .then(map => {
                for (let y = 0; y < map.height; y++) {
                    for (let x = 0; x < map.width; x++) {
                        Pixel.create({ map_pos: { map: map._id, x: x, y: y } })
                            .then(pixel => {
                                Map.findByIdAndUpdate(map._id, { $push: { pixels: pixel } })
                                    .then(map => { })
                                    .catch(e => console.log(e));
                            })
                            .catch(e => console.log(e));
                    }
                }
                res.json(map);
            })
            .catch(e => res.status(422).json(e));
    },
    join: (req, res) => {
        var userPromise = User.findOneAndUpdate({ _id: req.user._id }, { $addToSet: { maps: req.params.id } }, { new: true })
        var mapPromise = Map.findOneAndUpdate({ _id: req.params.id }, { $addToSet: { users: req.user._id } }, { new: true })
        Promise.all([userPromise, mapPromise])
            .then(values => {
                res.json({user: values[0], map: values[1]});
            })
            .catch(e => res.status(422).json(e))
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