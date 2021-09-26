const express = require('express');
const routers = express();

const users = require('../controllers/users');

routers.post('/cadastrar', users.userRegistration);
routers.post('/login', users.userLogin);


module.exports = routers;