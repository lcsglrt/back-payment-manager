const knex = require('../../database/db');
const datefns = require('date-fns');
const lodash = require('lodash');

const dateFormat = 'yyyy-MM-dd';
const today = new Date();

const general = async (req, res) => {
  try {
    const getClients = await knex('clients');
    const getCharges = await knex('charges');

    const qty ={
      clients: {
        onDay: 0,
        overdue: 0
      },
      charges: {
        expected: 0,
        overdue: 0,
        paid: 0
      }
    }

    const countClient = getClients.map(client => {
      const charges = getCharges.filter(charge => charge.client_id === client.id);

      const isLate = charges.some(charge => {
        const due_dateFormated = datefns.fromUnixTime(charge.due_date);     
        return !charge.status && due_dateFormated < today;
      });

      if (isLate) {
        qty.clients.overdue++;
        return;
      }

      qty.clients.onDay++;
    });

    const countCharge = getCharges.map(charge => {
      const due_dateFormated = datefns.fromUnixTime(charge.due_date);     
      
      if (!charge.status && due_dateFormated < today) {
        qty.charges.overdue++;
        return;
      }

      if (!charge.status && due_dateFormated >= today) {
        qty.charges.expected++;
        return;
      }

      qty.charges.paid++;
    });


    return res.status(200).json(qty);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const clients = async (req, res) => {
  const { status } = req.query;

  try {
    const getClients = await knex('clients');
    const getCharges = await knex('charges');

    const allClients =  getClients.map(client => {
      const charges = getCharges.filter(charge => charge.client_id === client.id);
      const isLate = charges.some(charge => {
        const due_dateFormatted = datefns.fromUnixTime(charge.due_date);
        
        if (!charge.status && due_dateFormatted === today) {
          return false;
        }

        return !charge.status && due_dateFormatted < today
      });
    
      const totalAmountCharges = lodash.sumBy(charges, charge => { return charge.amount });
      const totaAmountReceived = lodash.sumBy(charges, charge => { return charge.status ? charge.amount : 0 });

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
    })
    .filter(client => client);

    const clientsOnDay = allClients.filter(client => client.isLate === false);
    const clientsOverdue = allClients.filter(client => client.isLate === true);

    if (status === 'em-dia') {
      if (clientsOnDay.length === 0) {
        return res.status(200).json('Nenhum cliente está em dia.');
      }

      return res.status(200).json(clientsOnDay);
    }

    if (status === 'inadimplentes') {
      if (clientsOverdue.length === 0) {
        return res.status(200).json('Nenhum cliente está em dia.');
      }
      
      return res.status(200).json(clientsOverdue);
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }  
}

module.exports = {
  general,
  clients,
}