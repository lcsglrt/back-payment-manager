const yup = require('./yup');

const userRegistrationSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

module.exports = userRegistrationSchema;