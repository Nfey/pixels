const io = require('socket.io-client');
const socket = io('http://localhost:3000');
// var testObject = {name: "Nick"}
socket.emit("happy birthday", "Nick");
socket.on("shit's fucked yo", (info) => {
    console.log(info);
    if(info.weAreAllDoomed){
        console.log('fuck.');
    }
})
