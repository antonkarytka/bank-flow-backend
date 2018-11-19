const Promise = require('bluebird');

const models = require('../models');
const mocks = require('./data');

return models.sequelize.sync({ force: true })
.then(() => {
  return Promise.each([
    mocks.bankAccounts,
    mocks.cities,
    mocks.citizenships,
    mocks.creditPrograms,
    mocks.depositPrograms,
    mocks.disabilities
  ], ({ data, model }) => Promise.each(Object.values(data), item => model.upsertOne({ id: item.id }, item)))
  .then(() => Promise.each([
    mocks.bankAccountCards
  ], ({ data, model }) => Promise.each(Object.values(data), item => model.upsertOne({ id: item.id }, item))))
})
.then(() => console.log('Successfully seeded the database!'))
.catch(err => console.log(`Error occurred while seeding the databse: ${err}`));
