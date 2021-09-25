const knex = require("../database/db");
const bcrypt = require("bcrypt");
const yup = require("yup");

const registerUser = async (req, res) => {
  const schema = yup.object().shape({
    name: yup.string().required(),
  });

  try {
    await schema.validate({
      
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  registerUser,
};
