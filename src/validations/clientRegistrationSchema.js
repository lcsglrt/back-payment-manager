const yup = require('./yup');

const clientRegistrationSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    cpf: yup.string().required(),
    phone: yup.string().required(),
    street: yup.string(),
    additional: yup.string(),
    district: yup.string(),
    city: yup.string(),
    zipcode: yup.string(),
    landmark: yup.string()
  });

module.exports = clientRegistrationSchema;