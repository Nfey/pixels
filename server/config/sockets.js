module.exports = server => {
    const socketioJwt = require('socketio-jwt');
    const io = require('socket.io')(server);

    io.use(socketioJwt.authorize({
        secret: process.env.ACCESS_TOKEN_SECRET,
        handshake: true
    }));

    var socketList = {}


    io.on('connection', (socket) => {
        console.log('connected', socket.decoded_token._id);
        socketList[socket.decoded_token._id] = socket;
        socket.on('join-room', id => {
            socket.join(id);
            // io.to(id).emit('joined');
        });
        socket.on('leave-room', _ => {
            socket.leaveAll();
        });
        socket.on('disconnect', _ => {
            delete socketList[socket.decoded_token._id];
            console.log('disconnected', socketList);
        })
    });

    

    return {
        io: io,
        socketList: socketList
    };
}