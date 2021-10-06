const express = require('express');
const routes = express();
const verifyLogin = require('../middlewares/verifyLogin');

const users = require('../controllers/users/users');
const userLogin = require('../controllers/users/userLogin');

const clients = require('../controllers/clients/clients');

routes.post('/cadastrar', users.userRegistration);
routes.post('/login', userLogin.userLogin);

routes.use(verifyLogin);

routes.get('/perfil', users.getUserProfile);
routes.put('/perfil', users.updateUserProfile);

routes.post('/clientes', clients.clientRegistration);
routes.put('/clientes/:id', clients.updateClientProfile);

module.exports = routes;