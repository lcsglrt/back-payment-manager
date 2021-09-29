const knex = require("../../database/db");
const clientRegistrationSchema = require("../../validations/clientRegistrationSchema");
const jwt = require("jsonwebtoken");

const clientRegistration = async (req, res) => {
  const { name, email, cpf, state,
    phone, zipcode, address, district,
    city, address2, landmark,
  } = req.body;
  const { id } = req.userData;

  try {
    await clientRegistrationSchema.validate(req.body);

    const userExists = await knex("users").where("id", id).first();
    if (!userExists) return res.status(404).json("O usuário não encontrado.");

    const newClient = await knex("clients")
      .insert({ user_id: id, name, email, cpf,
        phone, zipcode, address, state,
        district, city, address2, landmark,
      }).returning("*");

    if (!newClient) return res.status(400).json('Erro ao cadastrar cliente.');

    return res.status(200).json(newClient[0]);

  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  clientRegistration,
};
