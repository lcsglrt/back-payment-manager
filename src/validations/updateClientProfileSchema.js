const yup = require('./yup');

const updateClientProfileSchema = yup.object().shape({
    name: yup.string().required('Nome é um campo obrigatório.'),
    email: yup.string().email().required(),
    cpf: yup.string().required()
      .matches(/^[0-9]+$/, 'CPF precisa ser apenas números')
      .min(11, 'CPF não pode ter menos que 11 dígitos')
      .max(11, 'CPF não pode ter mais que 11 dígitos'),
    phone: yup.string().required()
      .matches(/^[0-9]+$/, 'Telefone precisa ser apenas números')
      .min(10, 'Telefone precisa ter no mínimo 10 dígitos, incluindo o ddd')
      .max(11, 'Telefone precisa ter no máximo 11 dígitos, incluindo o ddd'),
    zipcode: yup.string().nullable()
      .matches(/^[0-9]+$/, 'CEP precisa ser apenas números')
      .min(8, 'CEP não pode ter menos que 8 dígitos')
      .max(8, 'CEP não pode ter mais que 8 dígitos'),
    street: yup.string().nullable(),
    additional: yup.string().nullable(),
    district: yup.string().nullable(),
    city: yup.string().nullable(),
    state: yup.string().nullable(),
    landmark: yup.string().nullable(),
  });

module.exports = updateClientProfileSchema;