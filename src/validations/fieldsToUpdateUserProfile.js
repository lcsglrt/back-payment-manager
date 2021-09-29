const bcrypt = require('bcrypt');

const fieldsToUpdateUserProfile = async ({ name, email, password, phone, cpf }) => {
  let fieldsToUpdate = {};

  if (name) {
    fieldsToUpdate = { ...fieldsToUpdate, name };
  }

  if (email) {
    fieldsToUpdate = { ...fieldsToUpdate, email };
  }

  if (password) {
    password = await bcrypt.hash(password, 10);
    fieldsToUpdate = { ...fieldsToUpdate, password };
  }

  if (phone) {
    fieldsToUpdate = { ...fieldsToUpdate, phone };
  }

  if (cpf) {
    fieldsToUpdate = { ...fieldsToUpdate, cpf };
  }

  return fieldsToUpdate;
};

module.exports = fieldsToUpdateUserProfile;
