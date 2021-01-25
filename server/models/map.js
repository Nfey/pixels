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
    console.log(this.currentTick)
    console.log(this.tickTotal)
    if(this.currentTick <= this.tickTotal){
        setTimeout(() => this.tick(this), this.tickTime * 100)
    }
    else{
        this.phase = "postGame"
    }   
}
MapSchema.methods.test = function(){
    console.log('test is running');
}

MapSchema.methods.stopTickTimer = function(){
    clearTimeout(this.timerId)
}

MapSchema.methods.tick = function(instance){
    console.log("tick() ran")
    console.log(instance.currentTick);
    instance.combatHandler()
    instance.currencyHandler()
    instance.currentTick++
    instance.startTickTimer()
}

MapSchema.methods.combatHandler = function(){
    console.log('handling combat');
}

MapSchema.methods.currencyHandler = function(){
    console.log('handling currency');
}
const Map = mongoose.model("Map", MapSchema);
module.exports = {
    schema: MapSchema,
    model: Map
}
