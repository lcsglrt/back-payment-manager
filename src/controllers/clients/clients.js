const knex = require("../../database/db");
const clientRegistrationSchema = require("../../validations/clientRegistrationSchema");
const jwt = require("jsonwebtoken");

const clientRegistration = async (req, res) => {
  const { name, email, cpf, state,
    phone, zipcode, street, district,
    city, addtional, landmark,
  } = req.body;
  const { id } = req.userData;

  try {
    await clientRegistrationSchema.validate(req.body);

    const clientExists = await knex("clients").where("email", email).orWhere("cpf", cpf).first();
    if (!clientExists) return res.status(404).json("Cliente já cadastrado.");

    const newClient = await knex("clients")
      .insert({ user_id: id, name, email, cpf,
        phone, zipcode, street, state,
        district, city, addtional, landmark,
      }).returning("*");

    if (!newClient) return res.status(400).json('Erro ao cadastrar cliente.');

console.log(newClient);
    return res.status(200).json(newClient);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  clientRegistration,
};
