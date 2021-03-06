const Message = require('../models/message').model;
var io = require('../config/sockets').io;

module.exports = {
    getAll: (req, res) => {
        Message.find().populate('user')
            .then(messages => res.json(messages))
            .catch(e => res.status(422).json(e));
    },
    getMapMessages: (req, res) => {
        Message.find({ map: req.params.id }).populate('user')
            .then(messages => {
                res.json(messages);
            })
            .catch(e => res.status(422).json(e));
    },
    getOne: (req, res) => {
        Message.findById(req.params.id)
            .then(message => res.json(message))
            .catch(e => res.status(422).json(e));
    },
    create: (req, res) => {
        Message.create(req.body)
            .then(message => {
                message.populate('user').execPopulate().then(_ => io.to(String(message.map)).emit('new-message', message));
                res.json(message);
            })
            .catch(e => res.status(422).json(e));
    },
    update: (req, res) => {
        Message.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
            .then(message => res.json(message))
            .catch(e => res.status(422).json(e));
    },
    delete: (req, res) => {
        Message.findByIdAndRemove(req.params.id, { useFindAndModify: false })
            .then(message => res.json(message))
            .catch(e => res.status(422).json(e));
    }
}
