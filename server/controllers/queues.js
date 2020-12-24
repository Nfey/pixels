const Queue = require('../models/queue').model;
const Map = require('../models/map').model;

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
         Queue.findByIdAndUpdate(req.params.id, {$addToSet: { users : req.user._id }})
            .then(queue => {
                if(queue.users.length == 3){
                    res.json(mapSetup(queue))
                }
                else{
                    res.json(queue)
                }
               
            })
            .catch(e => res.status(422).json(e));
    },
    leaveQueue: (req, res) => {
        Queue.findByIdAndUpdate(req.params.id, {$pull: { users : req.user._id }})
            .then(queue => res.json(queue))
            .catch(e => res.status(422).json(e));
    }
}

function mapSetup(myQueue) {
    Map.create({theme : "TestTheme", height : 5, width : 5, users : myQueue.users.splice(0,3)})
        .then(map => {
            myQueue.save()
            return map
        })
        .catch(e => res.status(500).json(e));
}