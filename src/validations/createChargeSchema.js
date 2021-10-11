const yup = require('./yup');

const createChargeSchema = yup.object().shape({
    client_id: yup.number().required(),
    description: yup.string().required(),
    status: yup.boolean().required(),
    amount: yup.number().required(),
    due_date: yup.number().required()
  });

module.exports = createChargeSchema;
;
