const knex = require('../../database/db');
const createChargeSchema = require('../../validations/createChargeSchema');

const createCharge = async (req, res) => {
  const { client_id, description, status, amount, due_date } = req. body;
  const { id } = req.userData;

  try {
    console.log(req.body);
    await createChargeSchema.validate(req.body);

    const now = new Date();
    
    const newCharge = await knex('charges').insert({
      create_at: now,
      user_id: id,
      client_id,
      description,
      status,
      amount,
      due_date
    }).returning('*');

    console.log(newCharge);

    if (!newCharge) return res.status(400).json('Erro ao criar cobrança.');

    return res.status(200).json(newCharge);
  } catch (error) {
    res.status(400).json(error.message);
  }

}

module.exports ={
  createCharge,
}