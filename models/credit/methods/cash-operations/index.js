const Promise = require('bluebird');

const models = require('../../../index');
const { sequelize } = models;
const { Op } = sequelize;

const {
  ACCOUNT_TYPE,
  AMOUNT_ACTION: { INCREASE, DECREASE }
} = require('../../../bank-account/constants');
const { TYPE: CREDIT_PROGRAM_TYPE } = require('../../../credit-program/constants');
const { DAYS_IN_YEAR } = require('../../../../constants');

const { manipulateBankAccountAmount } = require('../../../bank-account/methods/common-operations');


/**
 * Transfer all creditId's money to cashbox.
 *
 * @param creditId
 * @param options
 * @returns {*}
 */
const transferAllToCashboxFromRaw = ({ creditId }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    console.log(creditId);
    return Promise.join(
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction }),
      models.Credit.fetchById(creditId, {
        ...options,
        include: [{
          model: models.BankAccount,
          as: 'rawBankAccount',
          attributes: ['id', 'amount'],
          required: true
        }],
        transaction
      })
    )
    .spread((cashboxBankAccount, credit) => {
      const { rawBankAccount } = credit;

      return Promise.all([
        manipulateBankAccountAmount(
          INCREASE,
          { id: cashboxBankAccount.id, amount: rawBankAccount.amount },
          { ...options, transaction }
        ),
        manipulateBankAccountAmount(
          DECREASE,
          { id: rawBankAccount.id, amount: rawBankAccount.amount },
          { ...options, transaction }
        )
      ])
      .then(() => ({
        senderBankAccountId: rawBankAccount.id,
        receiverBankAccountId: cashboxBankAccount.id,
        amount: rawBankAccount.amount
      }))
    })
  });
};


const changeMonthlyPercentagePaymentCreditState = (content = {}, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.CreditProgram.fetch({ type: CREDIT_PROGRAM_TYPE.MONTHLY_PERCENTAGE_PAYMENT }, { ...options, transaction })
    .then(creditPrograms => {
      return models.Credit.fetch(
        { creditProgramId: { [Op.in]: creditPrograms.map(program => program.id) } },
        {
          ...options,
          include: [{
            model: models.CreditProgram,
            as: 'creditProgram',
            required: true
          }],
          transaction
        }
      )
      .then(credits => Promise.map(credits, credit => {
        const newResidualMonthlyPaymentAmount = credit.residualMonthlyPaymentAmount - credit.creditBody;

        return models.Credit.updateOne(
          { id: credit.id },
          {
            monthlyChargeAmount: newResidualMonthlyPaymentAmount * (credit.creditProgram.percent / 100) / DAYS_IN_YEAR * 30 + credit.creditBody,
            residualAmount: credit.residualAmount - credit.monthlyChargeAmount,
            residualMonthlyPaymentAmount: newResidualMonthlyPaymentAmount
          },
          { ...options, transaction }
        )
      }));
    });
  });
};


const changeAnnuityCreditState = (content = {}, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.CreditProgram.fetch({ type: CREDIT_PROGRAM_TYPE.ANNUITY_PAYMENTS }, { ...options, transaction })
      .then(creditPrograms => {
        return models.Credit.fetch(
          { creditProgramId: { [Op.in]: creditPrograms.map(program => program.id) } },
          {
            ...options,
            include: [{
              model: models.CreditProgram,
              as: 'creditProgram',
              required: true
            }],
            transaction
          }
        )
        .then(credits => Promise.map(credits, credit => models.Credit.updateOne(
          { id: credit.id },
          { residualAmount: credit.residualAmount - credit.monthlyChargeAmount },
          { ...options, transaction }
        )));
      });
  });
};


module.exports = {
  transferAllToCashboxFromRaw,
  changeMonthlyPercentagePaymentCreditState,
  changeAnnuityCreditState
};