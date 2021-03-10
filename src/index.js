require('dotenv').config();

const express = require('express');
const checkReq = require('./utils/CheckReq');

const server = express();
const routes = require('./routes');

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(checkReq);
server.use(routes);

server.listen(process.env.PORT || 3000);
