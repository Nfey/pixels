const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');
const jwt = require('jsonwebtoken');
const ROLES = require('../config/roles');
function generateAccessToken(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        username: user.username,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
}
function generateRefreshToken(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        username: user.username,
    }, process.env.REFRESH_TOKEN_SECRET);
}
module.exports = {
    register: (req, res) => {
        if (req.body.password.length >= 6) {
            const userBlueprint = { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, username: req.body.username };
            User.create(userBlueprint)
                .then(user => {
                    user.hashPassword(req.body.password)
                        .then(hashed_password => {
                            user.passwordHash = hashed_password;
                            user.save();
                            res.json(user)
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(e => res.status(422).json(e))
        }
        else {
            res.sendStatus(422);
        }
    },
    login: (req, res) => {
        User.findOne({ email: req.body.email })
            .then(user => {
                console.log("success 1")
                user.validatePassword(req.body.password)
                    .then(userHasValidPassword => {
                        console.log("success 2");
                        if (userHasValidPassword) {
                            var accessToken = generateAccessToken(user);
                            RefreshToken.findOne({ userId: user._id })
                                .then(refreshToken => {
                                    if (refreshToken != null) {
                                        const { exp } = jwt.decode(accessToken);
                                        res.json({ accessToken: accessToken, refreshToken: refreshToken.value, expiresAt: exp });
                                    }
                                    else {
                                        var refreshToken = generateRefreshToken(user);
                                        RefreshToken.create({ value: refreshToken, userId: user._id });
                                        const { exp } = jwt.decode(accessToken);
                                        res.json({ accessToken: accessToken, refreshToken: refreshToken, expiresAt: exp });
                                    }
                                })
                                .catch(e => {
                                    res.status(500).json(e);
                                });
                        }
                        else {
                            res.status(401).send();
                        }
                    })
                    .catch(e => {
                        console.log(e);
                        res.status(422).json(e)
                    });
            })
            .catch(e => res.status(422).json(e));
    },
    authenticateToken: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(401);
            req.user = user;
            next();
        })
    },
    getNewToken: (req, res) => {
        const refreshToken = req.body.token;
        RefreshToken.findOne({ value: refreshToken })
            .then(token => {
                if (token != null) {
                    jwt.verify(token.value, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                        if (err) return res.status(403).json(e);
                        const accessToken = generateAccessToken(user);
                        const { exp } = jwt.decode(accessToken);
                        res.json({ accessToken: accessToken, expiresAt: exp });
                    });
                }
                else {
                    res.sendStatus(403);
                }
            })
            .catch(e => res.status(402));
    },
    logout: (req, res) => {
        RefreshToken.findOneAndDelete({ value: req.body.token })
            .then(token => {
                res.sendStatus(204);
            })
            .catch(e => res.status(422).json(e));
    }
}
