const express = require('express');
const routers = express();

const users = require('../controllers/users');

routers.post('/cadastrar', users.registerUser);


module.exports = routers;