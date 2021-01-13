const mongoose = require('../../server/config/mongoose');
const Pixel = require('../models/pixel').model;
const Map = require('../models/map').model;
const User = require('../models/user');

module.exports = io => {
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
            Pixel.find({ 'map_pos.map': id }).sort('map_pos.y').sort('map_pos.x')
                .then(pixels => res.json(pixels))
                .catch(e => res.status(422).json(e));
        },
        create: (req, res) => {
            req.body.map_pos.map = mongoose.Types.ObjectId(req.body.map_pos.map);
            Pixel.create(req.body)
                .then(pixel => {
                    res.json(pixel);
                    Map.findByIdAndUpdate(pixel.map_pos.map, { $push: { pixels: pixel } }, { useFindAndModify: false })
                        .then()
                        .catch(e => console.log(e));
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
            User.findById(req.user._id).populate("pixels")
                .then(user => {
                    Pixel.findById(req.body._id) //req.body._id is the id of the pixel clicked on
                        .then(pixel => {
                            if (isAdjacent(user, pixel) || user.pixels.filter(userPixel => String(userPixel.map_pos.map) == String(pixel.map_pos.map)).length == 0) {
                                pixel.color = req.body.color;
                                User.findByIdAndUpdate(pixel.owner, { $pull: { pixels: pixel._id } }, { useFindAndModify: false })
                                    .then(previousOwner => {
                                        pixel.owner = user._id;
                                        pixel.save();
                                        if (!user.pixels.includes(pixel._id)) {
                                            user.pixels.push(pixel);
                                            user.save();
                                        }
                                        io.to(String(pixel.map_pos.map)).emit('pixelClaimed', pixel);
                                        res.json(pixel);
                                    })
                                    .catch(e => res.status(420).json(e));
                            }
                            else {
                                res.status(418).send("ERROR: Pixel placed is not adjacent");
                            }
                        })
                        .catch(e => res.status(422).json(e));
                })
                .catch(e => res.json(e));
        },
        takeInitialTurn: (req, res) => {
            const pixelFromBody = req.body.pixel;
            const mapFromBody = req.body.map;
            const userId = String(req.user._id);
            const activePlayerId = String(mapFromBody.users[0]._id);
            //if 
            if (mapFromBody.phase == "turn" && userId == activePlayerId) {
                var pixelClaimedPromise = claimPixel(mapFromBody, pixelFromBody, userId);
                var turnOrderShiftedPromise = shiftTurnOrder(mapFromBody);
                var oncePixelHasBeenClaimedAndTurnOrderHasBeenShifted = Promise.all([pixelClaimedPromise, turnOrderShiftedPromise]);
                oncePixelHasBeenClaimedAndTurnOrderHasBeenShifted.then(values => {
                    var user = values[0];
                    var updatedMap = results[1];
                    var numClaimedPixels = updatedMap.pixels.filter(pixel => pixel.owner).length;
                    const eachPlayerHasPlacedOnePixel = numClaimedPixels == updatedMap.users.length;
                    const eachPlayerHasPlacedTwoPixels = numClaimedPixels == updatedMap.users.length * 2;
                    if (eachPlayerHasPlacedOnePixel) {
                        var inversionPromise = invertTurnOrder(updatedMap);
                        inversionPromise.then(invertedMap => {
                            io.to(String(invertedMap._id)).emit("turn-is-over", invertedMap);
                        }).catch(e => console.log(e));
                    }
                    else if (eachPlayerHasPlacedTwoPixels) {
                        map.phase = "tick";
                        io.to(String(updatedMap._id)).emit("turn-is-over", updatedMap);
                    }
                    else {
                        io.to(String(updatedMap._id)).emit("turn-is-over", updatedMap);
                    }

                }).catch(e => console.log(e));
            }
        },
        takeInitialTurnAsync: async (req, res) => {
            console.log("Got here lol")
            try {
                //variable declaration
                const pixelFromBody = req.body.pixel;
                const mapId = req.body.map;
                const userId = String(req.user._id);
                console.log("made it to await")
                console.log(mapId)
                var map = await Map.findOne({_id: mapId}).populate("pixels")
                console.log("await is not the problem")
                const activePlayerId = String(map.users[0]);
                console.log(map.users[0], userId, map.phase)
                //checks if game is in turn phase & it is requesting player's turn
                console.log(userId, activePlayerId)
                if (map.phase === "turn" && userId === activePlayerId) {
                    await claimPixel(map, pixelFromBody, userId);
                    var finishedUser = map.users.shift()
                    map.users.push(finishedUser)

                    var numClaimedPixels = map.pixels.filter(pixel => pixel.owner).length;
                    const eachPlayerHasPlacedOnePixel = numClaimedPixels == map.users.length;
                    const eachPlayerHasPlacedTwoPixels = numClaimedPixels == map.users.length * 2;

                    if (eachPlayerHasPlacedOnePixel) {
                        map.users.reverse()
                    }
                    else if (eachPlayerHasPlacedTwoPixels) {
                        map.phase = "tick";
                    }
                    map.save()
                    io.to(String(map._id)).emit("turn-is-over", map);
                    res.json(map)
                }
                else {
                    res.sendStatus(422)
                }
            }
            catch (e) {
                res.sendStatus(500);
            }
        }
    }
}

//returns true or false, true if adjacent, false if not adjacent
//receives pixel clicked on
//checks each pixel user owns (within this map). When an adjacent pixel is found, return true
//if we reach end of pixels user owns, return false

function isAdjacent(myUser, myPixel) {
    var pixelList = myUser.pixels.filter(pixel => String(pixel.map_pos.map) == String(myPixel.map_pos.map))
    var isAdjacent = false;
    pixelList.forEach(pixel => {
        if ((pixel.map_pos.x - myPixel.map_pos.x >= -1 && pixel.map_pos.x - myPixel.map_pos.x <= 1) && (pixel.map_pos.y - myPixel.map_pos.y >= -1 && pixel.map_pos.y - myPixel.map_pos.y <= 1))
            isAdjacent = true;
    })
    return isAdjacent;
}

async function claimPixel(map, bodyPixel, idUser) {
    // steal "claim" property from io
    var user = await User.findById(idUser).populate("pixels")
    var listOfClaimedPixels = map.pixels.filter(pixel => pixel.owner != undefined)
    console.log("List of claimed pixels: ", listOfClaimedPixels)
    var claimedPixelPositions = listOfClaimedPixels.map(pixel => pixel = pixel.map_pos)
    console.log("BodyPixel map_pos: ", bodyPixel.map_pos)
    console.log("Claimed pixel positions: ", claimedPixelPositions)
    var placingOnClaimedSpace = claimedPixelPositions.includes(bodyPixel.map_pos)
    var pixel = await Pixel.findById(bodyPixel._id)

    if (!placingOnClaimedSpace) {
        pixel.color = bodyPixel.color;
        pixel.owner = idUser;
        pixel.save();
        user.pixels.push(pixel._id);
        user.save();
    }
}

function shiftTurnOrder(bodyMap) {
    const promise = Map.findById(bodyMap._id)
    promise.then(map => {
        var finishedUser = map.users.shift()
        map.users.push(finishedUser)
        map.save()
    }).catch(e => console.log(e));
    return promise
}

function invertTurnOrder(myMap) {
    const promise = Map.findById(myMap._id)
    promise.then(map => {
        map.users.reverse()
        map.save()
    }).catch(e => console.log(e));
    return promise
}
/*

*/