const yup = require('./yup');

const updateUserProfileSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string(),
    phone: yup.string().nullable(),
    cpf: yup.string().nullable(),
  });

module.exports = updateUserProfileSchema;