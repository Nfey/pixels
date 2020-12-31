const Queue = require('../models/queue').model;
const Map = require('../models/map').model;
const User = require('../models/user');
const Pixel = require('../models/pixel').model;
module.exports = (io, socketList) => {
    function mapSetup(myQueue) {
        console.log('setting up map');
        //creates new map with first 2 users in queue, removes users from queue
        return Map.create({ theme: "TestTheme", height: 5, width: 5, users: myQueue.users.splice(0, 2) })
            .then(map => {
                myQueue.save()
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
                var promises = [];
                //adds map id to each user's maps array
                map.users.forEach(userId => {
                    let promise = User.findByIdAndUpdate(userId, { $addToSet: { maps: map._id } }, { new: true });
                    promises.push(promise);
                    //each user joins io room with associated map's id
                    // promise.then(user => {
                    //     socketList[user._id].join(map._id);
                    //     console.log(socketList[user._id]);
                    // })
                    //     .catch(e => e);
                });
                //after each user joins io room, send redirect message to all clients added to io room
                return Promise.all(promises)
                    .then(users => {
                        users.forEach(user => {
                            socketList[user._id].join(String(map._id));
                        })
                        console.log('redirecting')
                        io.to(String(map._id)).emit("redirectToMap", map);
                        console.log('redirected');
                        return map;
                    })
                    .catch(e => e);
            })
            .catch(e => e);
    }
    return {
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
                        res.json(mapSetup(queue));
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
}

