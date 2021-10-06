const knex = require("../../database/db");
const clientRegistrationSchema = require("../../validations/clientRegistrationSchema");
const fieldsToUpdateClientProfile = require("../../validations/fieldsToUpdateClientProfile");
const updateClientProfileSchema = require("../../validations/updateClientProfileSchema");

const clientRegistration = async (req, res) => {
  const { name, email, cpf, state,
    phone, zipcode, street, district,
    city, additional, landmark,
  } = req.body;
  const { id } = req.userData;

  try {
    await clientRegistrationSchema.validate(req.body);

    const clientEmailExists = await knex("clients").where("email", email).first();
    if (clientEmailExists) return res.status(404).json("E-mail já cadastrado.");

    const clientCPFExists = await knex("clients").where("cpf", cpf).first();
    if (clientCPFExists) return res.status(404).json("CPF já cadastrado.");

    const newClient = await knex("clients")
      .insert({ user_id: id, name, email, cpf,
        phone, zipcode, street, state,
        district, city, additional, landmark
      }).returning("*");

    if (!newClient) return res.status(400).json('Erro ao cadastrar cliente.');

    return res.status(200).json(newClient);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const updateClientProfile = async (req, res) => {
  const { email, cpf } = req.body;
  const { id } = req.params;

  try {
    await updateClientProfileSchema.validate(req.body);

    const clientExists = await knex('clients').where('id', id).first();
    if (!clientExists) return res.status(404).json('Cliente não encontrado.');

    if (email !== clientExists.email) {
      const clientEmailExists = await knex('clients').where({ email }).first();
      if (clientEmailExists) return res.status(400).json('E-mail já cadastrado.');
    }

    if (cpf !== clientExists.cpf) {
      const clientCPFExists = await knex('clients').where({ cpf }).first();
      if (clientCPFExists) return res.status(400).json('CPF já cadastrado.');
    }

    const fieldsToUpdate = await fieldsToUpdateClientProfile(req.body);
    // const updateClient = await knex('clients').where({ id }).update(fieldsToUpdate);

    // if (!updateClient) return res.status(400).json('Cliente não foi atualizado.');

    return res.status(200).json('Cliente atualizado com sucesso.');

  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  clientRegistration,
  updateClientProfile,
};
