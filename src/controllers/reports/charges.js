const knex = require('../../database/db');
const datefns = require('date-fns');

const reports = async (req, res) => {
  const dateFormat = 'yyyy-MM-dd';
  const today = datefns.format(new Date(), dateFormat);
  // const today = new Date();
  
  let qtyFutureCharges = 0;
  let qtyOverdueCharges = 0;
  let qtyPaidCharges = 0;

  try {
    const getCharges = await knex('charges').returning('*');

    const verifyCharges = getCharges.map(charge => {
      const due_dateFormated = datefns.format(datefns.fromUnixTime(charge.due_date), dateFormat);     
      if (!charge.status && due_dateFormated >= today) {
        qtyFutureCharges++
        return;
      }

      if (!charge.status && due_dateFormated < today) {
        qtyOverdueCharges++
        return;
      }

      if (charge.status) {
        qtyPaidCharges++;
        return;
      }
    });

    const charges = {
      future: qtyFutureCharges,
      overdue: qtyOverdueCharges,
      paid: qtyPaidCharges
    }



    return res.status(200).json(charges);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  reports,
}