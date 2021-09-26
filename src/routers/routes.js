const express = require('express');
const routers = express();

const users = require('../controllers/users');
const loginLogout = require('../controllers/loginLogout');

routers.post('/cadastrar', users.userRegistration);
routers.post('/login', loginLogout.userLogin);

// TODO - MIDDLEWARE PARA VERIFICAR SE O USUARIO ESTA LOGADO


module.exports = routers;