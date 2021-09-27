const knex = require('../database/db');
const jwt = require('jsonwebtoken');

const verifyLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).json('Não autorizado.');

    try {
        const token = authorization.replace('Bearer ', '').trim();
        const { id } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await knex('users').where('id', id).first();

        if (!user) return res.status(404).json('Usuário não encontrado.');

        const { password: _, ...userData } = user;

        req.userData = userData;
        
        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = verifyLogin;