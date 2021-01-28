const User = require('../models/user');
const Map = require('../models/map').model;
const Pixel = require('../models/pixel').model;
module.exports = {
    mapUserLink: async (req, res) => {
        try {
            var user = await User.findOneAndUpdate({ _id: req.body.userId }, { $addToSet: { maps: req.body.mapId } }, { new: true })
            var map = await Map.findOneAndUpdate({ _id: req.body.mapId }, { $addToSet: { users: req.body.userId } }, { new: true })
            res.json({ user, map })
        } 
        catch (e){
            res.sendStatus(500)
        }
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
    create: async (req, res) => {
        try {
            map = await Map.create(req.body);
            map = await map.populateWithPixels()
            res.json(map)
        }
        catch(e){
            res.sendStatus(500).json(e)
        }
    },
    join: async (req, res) => {
        try {
            var user = await User.findOneAndUpdate({ _id: req.user._id }, { $addToSet: { maps: req.params.id } }, { new: true })
            var map = await Map.findOneAndUpdate({ _id: req.params.id }, { $addToSet: { users: req.user._id } }, { new: true })
            res.json({user, map});
        }
        catch(e){
            res.sendStatus(500);
        }
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
    },

}
function startTickLoop() {
    //every 5 minutes
    tick()
}
function tick() {
    
}