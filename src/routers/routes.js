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
routes.get('/clientes', clients.clientList);
routes.get('/nomes-clientes', clients.clientNameList);
routes.get('/detalhes-cliente/:id', clients.getDetailedClientProfile);
routes.get('/perfil-clientes/:id', clients.getClientProfile);
routes.put('/clientes/:id', clients.updateClientProfile);
routes.get('/clientes/relatorios', clients.qtyOnDayOverdue);

routes.post('/cobrancas', charges.createCharge);
routes.get('/cobrancas', charges.chargeList);
routes.put('/cobrancas/:id', charges.updateCharge);
routes.get('/cobrancas/:id', charges.getCharge);
routes.delete('/cobrancas/:id', charges.deleteCharge);

module.exports = routes;