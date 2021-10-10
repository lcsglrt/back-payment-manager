const yup = require('./yup');

const updateUserProfileSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string(),
    phone: yup.string().nullable()
      .matches(/^[0-9]+$/, 'Telefone precisa ser apenas números')
      .min(10, 'Telefone precisa ter no mínimo 10 dígitos, incluindo o ddd')
      .max(11, 'Telefone precisa ter no máximo 11 dígitos, incluindo o ddd'),
    cpf: yup.string().nullable()
      .matches(/^[0-9]+$/, 'CPF precisa ser apenas números')
      .min(11, 'CPF não pode ter menos que 11 dígitos')
      .max(11, 'CPF não pode ter mais que 11 dígitos'),
  });

module.exports = updateUserProfileSchema;