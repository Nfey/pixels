const path = require('path');
const users = require('../controllers/users');
const cors = require('cors');
module.exports = app => {
    app.use(
        cors({
          origin: [/^http:\/\/localhost(?::[0-9]+)?$/]
        })
      ); 
      app.options("*", cors());
    app.post('/register', (req, res) => users.register(req, res));
    app.post('/login', (req, res) => users.login(req, res));
    app.post('/token', (req, res) => users.getNewToken(req, res));
    app.delete('/logout', (req, res) => users.logout(req, res));
}
