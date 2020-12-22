var mongoose = require('../config/mongoose');

var QueueSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, {timestamps: true});

const Queue = mongoose.model("Queue", QueueSchema);

module.exports = {
    schema: QueueSchema,
    model: Queue
}