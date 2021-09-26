const yup = require('../validations/yup');

const registerUserSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

module.exports = registerUserSchema;