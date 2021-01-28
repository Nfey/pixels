var mongoose = require('../config/mongoose');
var {socketList, io} = require('../config/sockets')

var QueueSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    playerCapacity: { type: Number, required: true, default: 2 },
    tickTime: { type: Number, required: true },
    tickTotal: { type: Number, required: true },
    mapHeightLength: { type: Number, required: true }
}, { timestamps: true });

QueueSchema.methods.mapSetup = function () {
    console.log("io:", io)
    console.log("socketList:", socketList)
    console.log('setting up map');
    console.log(this)
    //creates new map with first 2 users in queue, removes users from queue
    var Map = mongoose.model('Map')
    console.log(Map)
    return Map.create({ theme: randomTheme(), height: this.mapHeightLength, width: this.mapHeightLength, users: this.users.splice(0, this.playerCapacity), tickTime: this.tickTime, tickTotal: this.tickTotal })
        .then(map => {
            this.save()
            //populates map with new blank pixels
            for (let y = 0; y < map.height; y++) {
                for (let x = 0; x < map.width; x++) {
                    mongoose.model('Pixel').create({ map_pos: { map: map._id, x: x, y: y } })
                        .then(pixel => {
                            mongoose.model('Map').findByIdAndUpdate(map._id, { $push: { pixels: pixel } })
                                .then(map => { })
                                .catch(e => console.log(e));
                        })
                        .catch(e => console.log(e));
                }
            }
            console.log("For-loops ran")
            var promises = [];
            //adds map id to each user's maps array
            map.users.forEach(userId => {
                let promise = mongoose.model('User').findByIdAndUpdate(userId, { $addToSet: { maps: map._id } }, { new: true });
                promises.push(promise);
            });

            return Promise.all(promises)
                .then(users => {
                    console.log("promise has run")
                    //each user joins io room with associated map's id
                    users.forEach(user => {
                        socketList[user._id].join(String(map._id));
                    })
                    console.log('redirecting')
                    console.log(map._id);
                    console.log(typeof map._id);
                    //after each user joins io room, send redirect message to all clients added to io room
                    io.to(String(map._id)).emit("redirectToMap", map);
                    console.log('redirected');
                    return map;
                })
                .catch(e => e);
        })
        .catch(e => e);
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

const Queue = mongoose.model("Queue", QueueSchema);

module.exports = {
    schema: QueueSchema,
    model: Queue
}
