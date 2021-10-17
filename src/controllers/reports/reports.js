const knex = require('../../database/db');
const datefns = require('date-fns');
const lodash = require('lodash');

const dateFormat = 'yyyy-MM-dd';
const today = datefns.format(new Date(), dateFormat);

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
        const due_dateFormatted = datefns.format(datefns.fromUnixTime(charge.due_date/1000), dateFormat);   
        return !charge.status && due_dateFormatted < today;
      });

      if (isLate) {
        qty.clients.overdue++;
        return;
      }

      qty.clients.onDay++;
    });

    const countCharge = getCharges.map(charge => {
      const due_dateFormatted = datefns.format(datefns.fromUnixTime(charge.due_date/1000), dateFormat);    
      
      if (!charge.status && due_dateFormatted < today) {
        qty.charges.overdue++;
        return;
      }

      if (!charge.status && due_dateFormatted >= today) {
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
        const due_dateFormatted = datefns.format(datefns.fromUnixTime(charge.due_date/1000), dateFormat);
        
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

    if (status === 'em-dia') {
      const clientsOnDay = allClients.filter(client => client.isLate === false);

      if (clientsOnDay.length === 0) {
        return res.status(200).json('Nenhum cliente está em dia.');
      }

      return res.status(200).json(clientsOnDay);
    }

    if (status === 'inadimplentes') {
      const clientsOverdue = allClients.filter(client => client.isLate === true);

      if (clientsOverdue.length === 0) {
        return res.status(200).json('Nenhum cliente está inadimplente.');
      }

      return res.status(200).json(clientsOverdue);
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }  
}

const charges = async (req, res) => {
  const { status } = req.query;

  try {
    const getClients = await knex('clients').select('id', 'name');
    const getCharges = await knex('charges');

    if (status === 'previstas') {
      const expected = getCharges.filter(charge => {
        const due_dateFormatted = datefns.format(datefns.fromUnixTime(charge.due_date/1000), dateFormat);
        return !charge.status && due_dateFormatted >= today;
      });
      
      const expectedCharges = expected.map(charge => {
        const clients = getClients.filter(client => client.id === charge.client_id);
        let { id, ...clientName } = clients[0];
        let { create_at, user_id, ...chargeData } = charge;
        chargeData = { ...chargeData, name: clientName.name }
        return chargeData;
      });

      if (expectedCharges.length === 0) return res.status(400).json('Não existe cobranças previstas.');

      return res.status(200).json(expectedCharges);
    }

    if (status === 'vencidas') {
      const overdue = getCharges.filter(charge => {
        const due_dateFormatted = datefns.format(datefns.fromUnixTime(charge.due_date/1000), dateFormat);
        return !charge.status && due_dateFormatted < today;
      }).map(charge => {
        const clients = getClients.filter(client => client.id === charge.client_id);
        let { id, ...clientName } = clients[0];
        let { create_at, user_id, ...chargeData } = charge;
        chargeData = { ...chargeData, name: clientName.name }
        return chargeData;
      });

      if (overdue.length === 0) return res.status(400).json('Não existe cobranças vencidas.');

      return res.status(200).json(overdue);
    }

    if (status === 'pagas') {
      const paid = getCharges
      .filter(charge => charge.status)
      .map(charge => {
        const clients = getClients.filter(client => client.id === charge.client_id);
        let { id, ...clientName } = clients[0];
        let { create_at, user_id, ...chargeData } = charge;
        chargeData = { ...chargeData, name: clientName.name }
        return chargeData;
      });

      if (paid.length === 0) return res.status(400).json('Não existe cobranças pagas.');

      return res.status(200).json(paid);
      
    }
    
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  general,
  clients,
  charges,
}