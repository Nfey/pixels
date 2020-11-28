module.exports = server => {
    const io = require('socket.io')(server);
    io.on('connection', (socket) => {
        console.log('connected');
        socket.on('join-room', id => {
            socket.join(id);
            // io.to(id).emit('joined');
        });
        socket.on('leave-room', _=> {
            socket.leaveAll();
        });
        socket.on('disconnect', _=> {
            console.log('disconnected');
        })
    });

    return io;
}