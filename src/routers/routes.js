const express = require('express');
const routes = express();
const verifyLogin = require('../middlewares/verifyLogin');

const users = require('../controllers/users/users');
const userLogin = require('../controllers/users/userLogin');
const clients = require('../controllers/clients/clients');
const charges = require('../controllers/charges/charges');

routes.post('/cadastrar', users.userRegistration);
routes.post('/login', userLogin.userLogin);

routes.use(verifyLogin);

routes.get('/perfil', users.getUserProfile);
routes.put('/perfil', users.updateUserProfile);

routes.post('/clientes', clients.clientRegistration);
routes.get('/clientes/', clients.clientList);
routes.get('/clientes/:id', clients.getClientProfile);
routes.put('/clientes/:id', clients.updateClientProfile);

routes.post('/cobrancas', charges.createCharge);

module.exports = routes;