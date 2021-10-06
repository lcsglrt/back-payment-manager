const yup = require('./yup');

const updateClientProfileSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    cpf: yup.string().required()
      .matches(/^[0-9]+$/, 'cpf precisa ser apenas números')
      .min(11, 'cpf não pode ter menos que 11 dígitos')
      .max(11, 'cpf não pode ter mais que 11 dígitos'),
    phone: yup.string().required()
      .matches(/^[0-9]+$/, 'phone precisa ser apenas números')
      .min(10, 'phone precisa ter no mínimo 10 dígitos, incluindo o ddd')
      .max(11, 'phone precisa ter no máximo 11 dígitos, incluindo o ddd'),
    zipcode: yup.string().nullable()
      .matches(/^[0-9]+$/, 'zipcode precisa ser apenas números')
      .min(8, 'zipcode não pode ter menos que 8 dígitos')
      .max(8, 'zipcode não pode ter mais que 8 dígitos'),
    street: yup.string().nullable(),
    additional: yup.string().nullable(),
    district: yup.string().nullable(),
    city: yup.string().nullable(),
    state: yup.string().nullable(),
    landmark: yup.string().nullable(),
  });

module.exports = updateClientProfileSchema;