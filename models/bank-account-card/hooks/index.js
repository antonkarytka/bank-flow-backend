const bcrypt = require('bcrypt');

const hooks = {
  beforeCreate: hashPin
};

function hashPin(content) {
  content.pin = bcrypt.hashSync(content.pin, 10);
}


module.exports = hooks;