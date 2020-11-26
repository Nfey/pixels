module.exports = server => {
    const io = require('socket.io')(server);
    io.on('connection', (socket) => {
        console.log('connected');
        socket.on('disconnect', ()=> {
            console.log('disconnected');
        })
    });

    return {
        io: io
    }
}