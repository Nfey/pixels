var socketList = {};
var io = require("socket.io")()
console.log("inside the module")

module.exports = { setup: socketSetup, socketList: socketList, io: io }

function socketSetup(server) {
    console.log("inside setup")
    const socketioJwt = require('socketio-jwt');
    io.attach(server)

    io.use(socketioJwt.authorize({
        secret: process.env.ACCESS_TOKEN_SECRET,
        handshake: true
    }));
    io.on('connection', (socket) => {
        console.log('connected', socket.decoded_token._id);
        module.exports.socketList[socket.decoded_token._id] = socket;
        socket.on('join-room', id => {
            socket.join(id);
            // io.to(id).emit('joined');
        });
        socket.on('leave-room', _ => {
            socket.leaveAll();
        });
        socket.on('disconnect', _ => {
            delete socketList[socket.decoded_token._id];
            console.log('disconnected', socket.decoded_token._id);
        })
    });  
}