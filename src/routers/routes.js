const express = require('express');
const routes = express();
const verifyLogin = require('../middlewares/verifyLogin');

const users = require('../controllers/users');
const loginLogout = require('../controllers/loginLogout');

routes.post('/cadastrar', users.userRegistration);
routes.post('/login', loginLogout.userLogin);

routes.use(verifyLogin);

routes.get('/perfil', users.getUserProfile);

module.exports = routes;