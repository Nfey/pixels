var mongoose = require('../config/mongoose');
var MapSchema = new mongoose.Schema({
    theme: { type: String, required: true },
    height: { type: Number, required: true, default: 10 },
    width: { type: Number, required: true, default: 10 },
    pixels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pixel" }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    phase: { type: String, default: "turn" },
    tickTime: { type: Number, required: true, default: 30 },
    tickTotal: { type: Number, required: true, default: 4 },
    currentTick: { type: Number, required: true, default: 1 },
    timerId: {type: Number, required: false}
}, { timestamps: true });

MapSchema.methods.startTickTimer = function(){
    console.log("startTickTimer() ran")
    if(this.currentTick <= this.tickTotal){
        this.timerId = setTimeout(this.tickTime * 1000, () => this.tick())
    }
    else{
        this.phase = "postGame"
    }   
}

MapSchema.methods.stopTickTimer = function(){
    clearTimeout(this.timerId)
}

MapSchema.methods.tick = function(){
    console.log("tick() ran")
    this.combatHandler()
    this.currencyHandler()
    this.currentTick++
    this.startTickTimer()
}

MapSchema.methods.combatHandler = function(){
}

MapSchema.methods.currencyHandler = function(){
}
const Map = mongoose.model("Map", MapSchema);
module.exports = {
    schema: MapSchema,
    model: Map
}
