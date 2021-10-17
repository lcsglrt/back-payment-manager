const knex = require("../../database/db");
const lodash = require('lodash');
const clientRegistrationSchema = require("../../validations/clientRegistrationSchema");
const updateClientProfileSchema = require("../../validations/updateClientProfileSchema");
const datefns = require('date-fns');

const clientRegistration = async (req, res) => {
  const { name, email, cpf, state, phone, zipcode, street, district, city, additional, landmark } = req.body;
  const { id } = req.userData;

  try {
    await clientRegistrationSchema.validate(req.body);

    const clientEmailExists = await knex("clients").where("email", email).first();
    if (clientEmailExists) return res.status(404).json("E-mail já cadastrado.");

    const clientCPFExists = await knex("clients").where("cpf", cpf).first();
    if (clientCPFExists) return res.status(404).json("CPF já cadastrado.");

    const newClient = await knex("clients")
    .insert({ user_id: id, name, email, cpf,
      phone, zipcode, street, state,
      district, city, additional, landmark
    }).returning("*");

    if (!newClient) return res.status(400).json('Erro ao cadastrar cliente.');

    return res.status(200).json(newClient);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const getDetailedClientProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const getClients = await knex('clients').select('*').where('id', id).returning('*');

    if (getClients.length === 0) return res.status(404).json('Cliente não encontrado.');

    const getCharges = await knex('charges').select('*').where('client_id', id).returning('*');
    
    const clients = getClients.map(client => {
      const address = {
        street: client.street,
        additional: client.additional,
        district: client.district,
        city: client.city,
        state: client.state,
        zipcode: client.zipcode,
        landmark: client.landmark
      }

      const charges = getCharges.filter(charge => client.id === charge.client_id);

      let { 
        street, 
        additional, 
        city,
        landmark,
        district,
        zipcode,
        state,
        ...clientData
      } = client;

      return clientData = { ...clientData, address, charges}
    });
    
    return res.status(200).json(clients[0]);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const getClientProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const getClients = await knex('clients').select('*').where('id', id).returning('*');

    if (getClients.length === 0) return res.status(404).json('Cliente não encontrado.');
    
    const clients = getClients.map(client => {
      const address = {
        street: client.street,
        additional: client.additional,
        district: client.district,
        city: client.city,
        state: client.state,
        zipcode: client.zipcode,
        landmark: client.landmark
      }

      let { 
        street, 
        additional, 
        city,
        landmark,
        district,
        zipcode,
        ...clientData
      } = client;

      return clientData = { ...clientData, address }
    });
    
    return res.status(200).json(clients[0]);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const updateClientProfile = async (req, res) => {
  const { email, cpf } = req.body;
  const { id } = req.params;

  try {
    await updateClientProfileSchema.validate(req.body);

    const clientExists = await knex('clients').where('id', id).first();
    if (!clientExists) return res.status(404).json('Cliente não encontrado.');

    if (email !== clientExists.email) {
      const clientEmailExists = await knex('clients').where("email", email).first();
      if (clientEmailExists) return res.status(400).json('E-mail já cadastrado.');
    }

    if (cpf !== clientExists.cpf) {
      const clientCPFExists = await knex('clients').where({ cpf }).first();
      if (clientCPFExists) return res.status(400).json('CPF já cadastrado.');
    }

    const fieldsToUpdate = lodash.pickBy(req.body);
    const updateClient = await knex('clients').where({ id }).update(fieldsToUpdate);

    if (!updateClient) return res.status(400).json('Cliente não foi atualizado.');

    return res.status(200).json('Cliente atualizado com sucesso.');

  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const clientList = async (req, res) => {
  try {
    const getAllClients = await knex('clients').select('*').returning('*');
    if (getAllClients.length === 0) return res.status(404).json('Nenhum cliente cadastrado.');
    const getAllCharges = await knex('charges').select('*').returning('*');

    const clients = getAllClients.map(client => {
      const charges = getAllCharges.filter(charge => client.id === charge.client_id);

      const totalAmountCharges = lodash.sumBy(charges, charge => { return charge.amount });
      const totaAmountReceived = lodash.sumBy(charges, charge => { return charge.status ? charge.amount : 0 });

      const dateFormat = 'yyyy-MM-dd';
      const today = datefns.format(new Date(), dateFormat);
      const isLate = charges.some(charge => {
        if (charge.client_id === client.id) {
          const due_dateFormated = datefns.format(datefns.fromUnixTime(charge.due_date/1000), dateFormat);
          if (charge.status === false && due_dateFormated < today) return true;
        }
      });

      let { 
        user_id,
        cpf,
        street, 
        additional, 
        city,
        landmark,
        district,
        zipcode,
        state,
        ...clientData
      } = client;

      return clientData = { ...clientData, totalAmountCharges, totaAmountReceived, isLate }
    });
    
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const clientNameList = async (req, res) => {
  try {
    const clientNameList = await knex('clients').select('id', 'name');
    if (clientNameList.length === 0) return res.status(404).json('Nenhum cliente cadastrado.');

    res.status(200).json(clientNameList);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  clientRegistration,
  getDetailedClientProfile,
  getClientProfile,
  updateClientProfile,
  clientList,
  clientNameList,
};
