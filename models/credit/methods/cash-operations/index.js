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


/**
 * Transfer all creditId's money to cashbox.
 *
 * @param creditId
 * @param options
 * @returns {*}
 */
const transferToRawFromCashbox = ({ creditId }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return Promise.join(
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction }),
      models.Credit.fetchById(creditId, { ...options, transaction })
    )
    .spread((cashboxBankAccount, credit) => {
      return Promise.all([
        manipulateBankAccountAmount(
          DECREASE,
          { id: cashboxBankAccount.id, amount: cashboxBankAccount.amount },
          { ...options, transaction }
        ),
        manipulateBankAccountAmount(
          INCREASE,
          { id: credit.rawBankAccountId, amount: cashboxBankAccount.amount },
          { ...options, transaction }
        )
      ])
      .then(() => ({
        senderBankAccountId: cashboxBankAccount.id,
        receiverBankAccountId: credit.rawBankAccountId,
        amount: cashboxBankAccount.amount
      }))
    })
  })
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

        const isActive = credit.residualAmount > credit.monthlyChargeAmount;
        const newMonthlyChargeAmount = newResidualMonthlyPaymentAmount * (credit.creditProgram.percent / 100) / DAYS_IN_YEAR * 30 + credit.creditBody

        return models.BankAccount.fetchById(credit.rawBankAccountId, { ...options, transaction})
          .then(bankAccount => {
            if (bankAccount.amount < credit.monthlyChargeAmount) {
              return Promise.resolve({
                status: {
                  error: `Can\'t get monthly charge from bank account #${bankAccount.number}.`,
                  success: null,
                },
                account: bankAccount
              })
            } else {
              return manipulateBankAccountAmount(
                DECREASE,
                { id: credit.rawBankAccountId, amount: credit.monthlyChargeAmount },
                { ...options, transaction }
              )
                .then(result => {
                return Promise.resolve({
                  status: {
                    error: null,
                    success: `Monthly charge from bank account #${bankAccount.number} has been successfully charged`,
                  },
                  account: bankAccount
                });
            });
            }
          })
          .then(({ status: { error } }) => {
            if (error) return Promise.resolve();

            return models.Credit.updateOne(
              { id: credit.id },
              {
                monthlyChargeAmount: newMonthlyChargeAmount,
                residualAmount: isActive ? credit.residualAmount - credit.monthlyChargeAmount : 0,
                residualMonthlyPaymentAmount: newResidualMonthlyPaymentAmount,
                active: isActive,
              },
              { ...options, transaction }
            )
          })
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
        .then(credits => {
          return (
            Promise.map(credits, credit => {
              const isActive = credit.residualAmount > credit.monthlyChargeAmount;
              console.log(isActive, credit.residualAmount, credit.monthlyChargeAmount);

              return (
                models.Credit.updateOne(
                  { id: credit.id },
                  { residualAmount: isActive ? credit.residualAmount - credit.monthlyChargeAmount : 0, active: isActive },
                  { ...options, transaction }
              ));
            })
          );
      });
    });
  });
};


module.exports = {
  transferAllToCashboxFromRaw,
  changeMonthlyPercentagePaymentCreditState,
  changeAnnuityCreditState,
  transferToRawFromCashbox
};