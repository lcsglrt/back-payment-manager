const knex = require('../../database/db');
const datefns = require('date-fns');

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

      const clientIsOverdue = charges.some(charge => {
        const due_dateFormated = datefns.format(datefns.fromUnixTime(charge.due_date), dateFormat);     
        return !charge.status && due_dateFormated < today;
      });

      if (clientIsOverdue) {
        qty.clients.overdue++;
        return;
      }

      qty.clients.onDay++;
    });

    const countCharge = getCharges.map(charge => {
      const due_dateFormated = datefns.format(datefns.fromUnixTime(charge.due_date), dateFormat);     
      
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

module.exports = {
  general,
}