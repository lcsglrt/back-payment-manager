const yup = require('./yup');

const clientRegistrationSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    cpf: yup.string().required()
      .matches(/^[0-9]+$/, 'CPF precisa ser apenas números')
      .min(11, 'CPF não pode ter menos que 11 dígitos')
      .max(11, 'CPF não pode ter mais que 11 dígitos'),
    phone: yup.string().required()
      .matches(/^[0-9]+$/, 'Telefone precisa ser apenas números')
      .min(10, 'Telefone precisa ter no mínimo 10 dígitos, incluindo o ddd')
      .max(11, 'Telefone precisa ter no máximo 11 dígitos, incluindo o ddd'),
    street: yup.string(),
    additional: yup.string(),
    district: yup.string(),
    city: yup.string(),
    zipcode: yup.string().nullable()
      .matches(/^[0-9]+$/, 'CEP precisa ser apenas números')
      .min(8, 'CEP não pode ter menos que 8 dígitos')
      .max(8, 'CEP não pode ter mais que 8 dígitos'),
    landmark: yup.string()
  });

module.exports = clientRegistrationSchema;