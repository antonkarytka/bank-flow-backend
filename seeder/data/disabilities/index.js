const models = require('../../../models');

const disabilities = {};

disabilities['1'] = {
  id: 'c10f7550-d0d1-58ee-093d-a14aad9afef7',
  grade: 1
};

disabilities['2'] = {
  id: 'b19d0ec0-6450-9553-c74c-9a057662994f',
  grade: 2
};

disabilities['3'] = {
  id: '9ce5afa7-57ae-655c-547a-999d7ec92c65',
  grade: 3
};


module.exports = {
  data: disabilities,
  model: models.Disability
};