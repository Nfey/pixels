const Message = require('../models/message').model;
module.exports = io => {
    return {
        getAll: (req, res) => {
            Message.find().populate('user')
                .then(messages => res.json(messages))
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
                    message.populate('user').execPopulate().then(_=> io.emit('new-message', message));
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
}