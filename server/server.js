const express = require('express');
const app = express();
const server = app.listen(8000);
const path = require('path');
const dotenv = require('dotenv').config();
app.use(express.static(path.join(__dirname, '../client/dist/client')));
app.use(express.json());

require('./config/routes')(app, server);

