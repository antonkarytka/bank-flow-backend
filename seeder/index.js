const Promise = require('bluebird');

const models = require('../models');
const mocks = require('./data');

const upsertValues = values => Promise.each(values, ({ data, model }) =>
  Promise.each(Object.values(data), item => model.upsertOne({ id: item.id }, item))
);

return models.sequelize.sync({ force: true })
.then(() => {
  return upsertValues([
    mocks.cities,
    mocks.citizenships,
    mocks.creditPrograms,
    mocks.depositPrograms,
    mocks.disabilities,
  ])
  .then(() => upsertValues([
    mocks.users
  ]))
  .then(() => upsertValues([
    mocks.bankAccounts
  ]))
  .then(() => upsertValues([
    mocks.bankAccountCards
  ]))
})
.then(() => console.log('Successfully seeded the database!'))
.catch(err => console.log(`Error occurred while seeding the database: ${err}`));
