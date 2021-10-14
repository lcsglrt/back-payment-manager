const knex = require('../../database/db');
const createChargeSchema = require('../../validations/createChargeSchema');
const updateChargeSchema = require('../../validations/updateChargeSchema');

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
    .select('charges.id', 'clients.name', 'charges.description', 'charges.amount', 'charges.status', 'charges.due_date');

    if (charges.length === 0) return res.status(404).json('Nenhuma cobrança cadastrada.');

    res.status(200).json(charges);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

const updateCharge = async (req, res) => {
  const { id } = req.params;

  try {
    const chargeExists = await findCharge(id);
    if(!chargeExists) return res.status(404).json('Cobrança não encontrada.');

    await updateChargeSchema.validate(req.body);

    const update = await knex('charges').where({ id }).update(req.body);
    if (!update) return res.status(400).status('Erro ao atualizar cobrança');

    res.status(200).json('Cobrança atualizada com sucesso.');
  } catch (error) {
    res.status(400).json(error.message);
  }
}

const getCharge = async (req, res) => {
  const { id } = req.params;

  try {
    const chargeExists = await knex('charges').where({ id }).first();
    if (!chargeExists) return res.status(404).json('Cobrança não existe.');

    const { create_at, user_id, ...chargeData } = chargeExists;

    return res.status(200).json(chargeData)

  } catch (error) {
    res.status(400).json(error.message);
  }
}

const deleteCharge = async (req, res) => {
  const { id } = req.params;

  try {
    const chargeExists = await findCharge(id);
    if (!chargeExists) return res.status(404).json('Cobrança não encontrada.');

    const nowInSecond = Math.floor(new Date() / 1000);
    if (parseInt(chargeExists.due_date) < nowInSecond && chargeExists.due_date) {
      return res.status(400).json('Não é possível excluir uma cobrança vencida.');
    }

    const deleteCharge = await knex('charges').delete().where({ id });
    if (!deleteCharge) return res.status(400).json('Erro ao deletar cobrança.');

    return res.status(200).json('Cobrança deletada com sucesso.');

  } catch (error) {
    res.status(400).json(error.message);
  }
}

async function findCharge(chargeID) {
  const chargeExists = await knex('charges').where({'id': chargeID}).first();
  return chargeExists ? chargeExists : false;
}

module.exports ={
  createCharge,
  chargeList,
  updateCharge,
  getCharge,
  deleteCharge
}