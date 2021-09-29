const userLoginSchema = require('../../validations/userLoginSchema');
const knex = require('../../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    await userLoginSchema.validate(req.body);

    const userExists = await knex("users").where({ email }).first();
    if (!userExists) return res.status(400).json('Este usuário não está cadastrado.');

    const passwordIsCorrect = await bcrypt.compare(password, userExists.password);

    if (!passwordIsCorrect) return res.status(400).json('O e-mail ou senha não coincidem.')

    const token = jwt.sign({ id: userExists.id}, process.env.JWT_SECRET, { expiresIn: '8h' });

    const { password: _, ...userData } = userExists;

    return res.status(200).json({
      userData,
      token
    });

  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  userLogin
};
