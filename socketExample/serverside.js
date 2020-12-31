const express = require('express');
const app = express();
const server = app.listen(3000);
const io = require('socket.io')(server);

io.on("connection", (socket) => {
    console.log('connected');
    socket.on("disconnect", () => {
        console.log('disconnected');
    })
    socket.on("happy birthday", (info)=> {
        console.log(info);
    })
    var catastrophe_strikes = true;
    var doomsdayInfo = {type: "Nuke", weAreAllDoomed: true}
    if(catastrophe_strikes){
        io.emit("shit's fucked yo", doomsdayInfo);
    }
    var database_changes = true;
    if(database_changes){
        io.emit("data-change", doomsdayInfo);
    }
})