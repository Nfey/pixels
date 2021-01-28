const Map = require('../models/map').model;
const User = require('../models/user');
const Pixel = require('../models/pixel').model;
const Queue = require('../models/queue').model;

module.exports = {
    getAll: (req, res) => {
        Queue.find()
            .then(queues => res.json(queues))
            .catch(e => res.status(422).json(e));
    },
    getQueue: (req, res) => {
        Queue.findById(req.params.id)
            .then(queue => res.json(queue))
            .catch(e => res.status(422).json(e));
    },
    createQueue: (req, res) => {
        Queue.create(req.body)
            .then(queue => res.json(queue))
            .catch(e => res.status(422).json(e));
    },
    updateQueue: (req, res) => {
        Queue.findByIdAndUpdate(req.params.id, req.body)
            .then(queue => res.json(queue))
            .catch(e => res.status(422).json(e));
    },
    deleteQueue: (req, res) => {
        Queue.findByIdAndRemove(req.params.id, { useFindAndModify: false })
            .then(result => res.json(result))
            .catch(e => res.status(422).json(e));
    },
    joinQueue: (req, res) => {
        //route is something like '/api/queue/:id/join'
        //req.user._id is the user id
        //queue id is in req.params.id
        //add user id to queue's users array  
        Queue.findByIdAndUpdate(req.params.id, { $addToSet: { users: req.user._id } }, { new: true })
            .then(queue => {
                if (queue.users.length == 2) {
                    //res.json(mapSetup(queue));
                    res.json(queue.mapSetup())
                }
                else {
                    res.json(queue);
                }
            })
            .catch(e => res.status(422).json(e));
    },
    leaveQueue: (req, res) => {
        Queue.findByIdAndUpdate(req.params.id, { $pull: { users: req.user._id } })
            .then(queue => res.json(queue))
            .catch(e => res.status(422).json(e));
    }
}


function randomTheme() {
    var themes = [
        "Cars",
        "Christmas",
        "Kwanza"
    ]
    var randInt = Math.floor(Math.random() * themes.length)
    return themes[randInt]

}