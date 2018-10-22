const Promise = require('bluebird');
const schedule = require('node-schedule');

const models = require('../../models');
const { sequelize } = models;
const { Op } = sequelize;
const { MIDNIGHT } = require('./constants');
const { ACCOUNT_TYPE } = require('../../models/bank-account/constants');


const recalculateBankAccountAmounts = () => schedule.scheduleJob(MIDNIGHT, () => {
  const currentDate = new Date();

  return sequelize.continueTransaction({}, transaction => {
    return models.BankAccount.fetch(
      { accountType: ACCOUNT_TYPE.PERCENT },
      {
        attributes: ['id', 'amount'],
        include: [{
          model: models.Deposit,
          as: 'deposit',
          attributes: ['dailyPercentChargeAmount', 'depositProgramEndsAt'],
          required: true,
          where: {
            depositProgramEndsAt: {
              [Op.gt]: currentDate
            }
          }
        }],
        transaction
      }
    )
    .then(bankAccounts => Promise.each(bankAccounts, bankAccount => {
      const {
        amount: currentAmount,
        deposit: { dailyPercentChargeAmount }
      } = bankAccount;
      const updatedAmount = currentAmount + dailyPercentChargeAmount;

      return models.BankAccount.update(
        { id: bankAccount.id },
        { amount: updatedAmount },
        { transaction }
      )
    }))
  })
});

module.exports = recalculateBankAccountAmounts;