const lodash = require('lodash');

const fieldsToUpdateClientProfile = async (fields) => {
  
  const fieldsToUpdate = lodash.pickBy(fields);


  console.log(fieldsToUpdate)



  return fieldsToUpdate;
};

module.exports = fieldsToUpdateClientProfile;
