const path = require('path');
const users = require('../controllers/users');
const maps = require('../controllers/maps');
const map = require('../models/map');
module.exports = (app, server) => {
    const io = require('./sockets')(server);
    const pixels = require('../controllers/pixels')(io);
    const messages = require('../controllers/messages')(io);

    app.get('/api/users', (req, res) => users.getAll(req, res));
    app.get('/api/users/:id', users.authenticateToken, (req, res) => users.getUserByParamId(req, res));
    app.get('/api/user', users.authenticateToken, (req, res) => users.getUserByTokenId(req, res));
    app.post('/api/users/:id/addCoins', (req, res) => users.addCoins(req, res));
    app.post('/api/users/:id/subCoins', (req, res) => users.subCoins(req, res));

    app.get('/api/pixels', users.authenticateToken, (req, res) => pixels.getAll(req, res));
    app.get('/api/pixels/:id', users.authenticateToken, (req, res) => pixels.getOne(req, res));
    app.post('/api/pixels', users.authenticateToken, (req, res) => pixels.create(req, res));
    app.put('/api/pixels/:id', users.authenticateToken, (req, res) => pixels.update(req, res));
    app.delete('/api/pixels/:id', users.authenticateToken, (req, res) => pixels.delete(req, res));
    app.post('/api/pixels/claim', users.authenticateToken, (req, res) => pixels.claim(req, res));

    app.post('/api/messages', (req, res) => messages.create(req, res));
    app.get('/api/messages', (req, res) => messages.getAll(req, res));
    app.get('/api/maps/:id/messages', (req, res) => messages.getMapMessages(req, res));

    app.get('/api/maps/:id/join', users.authenticateToken, (req, res) => maps.join(req, res));
    app.get('/api/maps', users.authenticateToken, (req, res) => maps.getAll(req, res));
    app.post('/api/maps/users', (req, res) => maps.mapUserLink(req, res));
    app.get('/api/maps/:id', users.authenticateToken, (req, res) => maps.getOne(req, res));
    app.get('/api/maps/:id/pixels', users.authenticateToken, (req, res) => pixels.getByMap(req, res));
    app.post('/api/maps', users.authenticateToken, (req, res) => maps.create(req, res));
    app.put('/api/maps/:id', users.authenticateToken, (req, res) => maps.update(req, res));
    app.delete('/api/maps/:id', users.authenticateToken, (req, res) => maps.delete(req, res));
    app.all('*', (req, res, next) => {
        res.sendFile(path.resolve('../client/dist/client/index.html'));
    });
}