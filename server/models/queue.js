var mongoose = require('../config/mongoose');

var QueueSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    playerCapacity: {type: Number, required: true, default: 2},
    tickTime: {type: Number, required: true},
    tickTotal: {type: Number, required: true},
    mapHeightLength: {type: Number, required: true}
}, {timestamps: true});

const Queue = mongoose.model("Queue", QueueSchema);

module.exports = {
    schema: QueueSchema,
    model: Queue
}