const knex = require("../../database/db");
const lodash = require('lodash');
const bcrypt = require("bcrypt");
const userRegistrationSchema = require("../../validations/userRegistrationSchema");
const updateUserProfileSchema = require("../../validations/updateUserProfileSchema");

const userRegistration = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    await userRegistrationSchema.validate(req.body);

    const userExists = await knex("users").where({ email }).first();
    if (userExists) return res.status(400).json('E-mail já cadastrado.');

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await knex('users').insert({ name, email, password: encryptedPassword }).returning('*');

    if (!newUser) return res.status(400).json('Erro ao cadastrar usuário');

    return res.status(200).json(newUser[0]);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getUserProfile = async (req, res) => {
  return res.status(200).json(req.userData);
}

const updateUserProfile = async (req, res) => {
  let { email, cpf } = req.body;
  const { id } = req.userData;

  try {
    await updateUserProfileSchema.validate(req.body);

    const userExists = await knex('users').where('id', id).first();
    if (!userExists) return res.status(404).json('Usuário não encontrado.');

    if (email !== req.userData.email) {
      const userEmailExists = await knex('users').where({ email }).first();
      
      if (userEmailExists) return res.status(400).json('E-mail já cadastrado.');
    }

    if (cpf !== req.userData.cpf) {
      const userCPFExists = await knex('users').where({ cpf }).first();

      if (userCPFExists) return res.status(400).json('CPF já cadastrado.');
    }
    
    const fieldsToUpdate = lodash.pickBy(req.body);

    if (fieldsToUpdate.password) {
      fieldsToUpdate.password = await bcrypt.hash(fieldsToUpdate.password, 10);
    }

    const updatedUser = await knex('users').where({ id }).update(fieldsToUpdate);

    if (!updatedUser) return res.status(400).json('Usuário não foi atualizado.');

    return res.status(200).json('Usuário atualizado com sucesso.');

  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  userRegistration,
  getUserProfile,
  updateUserProfile,
};