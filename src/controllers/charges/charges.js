const knex = require('../../database/db');
const createChargeSchema = require('../../validations/createChargeSchema');

const createCharge = async (req, res) => {
  const { client_id, description, status, amount, due_date } = req.body;
  const { id } = req.userData;

  try {
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

    if (!newCharge) return res.status(400).json('Erro ao criar cobrança.');

    return res.status(200).json(newCharge);
  } catch (error) {
    res.status(400).json(error.message);
  }

}

const chargeList = async (req, res) => {
  try {
    const charges = await knex('charges')
    .join('clients', 'charges.client_id', 'clients.id')
    .select('charges.id as charge_id',
      'clients.id as client_id', 
      'clients.name', 
      'charges.description', 
      'charges.amount', 
      'charges.status', 
      'charges.due_date'
    );

    if (charges.length === 0) return res.status(404).json('Nenhuma cobrança cadastrada.');

    res.status(200).json(charges);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

module.exports ={
  createCharge,
  chargeList
}