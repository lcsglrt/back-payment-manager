const knex = require("../database/db");
const bcrypt = require("bcrypt");
const registerUserSchema = require("../validations/registerUserSchema");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await registerUserSchema.validate(req.body);

    const userExists = await knex("users").where({ email }).first();
    if (userExists) return res.status(400).json('E-mail já cadastrado.');

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await knex('users')
      .insert({
        name,
        email,
        password: encryptedPassword,
      })
      .returning('*');

    if (!newUser) return res.status(400).json('Erro ao cadastrar usuário');

    return res.status(200).json(newUser[0]);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  registerUser,
};