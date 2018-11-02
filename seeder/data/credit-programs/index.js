const models = require('../../../models');
const { CURRENCY, TYPE } = require('../../../models/credit-program/constants');

const creditPrograms = {};

creditPrograms['annuity_payments__30_900__byn__12.3'] = {
  id: '024538e1-2e42-472f-b011-2d6b70812168',
  name: 'Annuity Payment',
  type: TYPE.ANNUITY_PAYMENTS,
  daysToReturnMin: 30,
  daysToReturnMax: 900,
  currency: CURRENCY.BYN,
  percent: 12.3
};

creditPrograms['annuity_payments__30_900__usd__13.4'] = {
  id: '13517263-05d7-471e-a514-219a4c2ef0ee',
  name: 'Annuity Payment',
  type: TYPE.ANNUITY_PAYMENTS,
  daysToReturnMin: 30,
  daysToReturnMax: 900,
  currency: CURRENCY.USD,
  percent: 13.4
};

creditPrograms['annuity_payments__30_900__eur__14.6'] = {
  id: '12e929de-3759-4171-9fa3-727b542a3f7f',
  name: 'Annuity Payment',
  type: TYPE.ANNUITY_PAYMENTS,
  daysToReturnMin: 30,
  daysToReturnMax: 900,
  currency: CURRENCY.EUR,
  percent: 14.6
};

creditPrograms['annuity_payments__30_900__rub__25.1'] = {
  id: '24eaadff-8e2d-489e-93ba-87cb08ccaa58',
  name: 'Annuity Payment',
  type: TYPE.ANNUITY_PAYMENTS,
  daysToReturnMin: 30,
  daysToReturnMax: 900,
  currency: CURRENCY.RUB,
  percent: 25.1
};

creditPrograms['monthly_percentage_payment__30_900__byn__8.5'] = {
  id: '35e1a940-cb63-4db6-babb-88a0ab1d74fe',
  name: 'Monthly Percentage Payment',
  type: TYPE.MONTHLY_PERCENTAGE_PAYMENT,
  daysToReturnMin: 30,
  daysToReturnMax: 900,
  currency: CURRENCY.BYN,
  percent: 8.5
};

creditPrograms['monthly_percentage_payment__30_900__usd__9.8'] = {
  id: '39c4593e-758e-4f41-97a0-62e8bf8e798e',
  name: 'Monthly Percentage Payment',
  type: TYPE.MONTHLY_PERCENTAGE_PAYMENT,
  daysToReturnMin: 30,
  daysToReturnMax: 900,
  currency: CURRENCY.USD,
  percent: 9.8
};

creditPrograms['monthly_percentage_payment__30_900__eur__10.2'] = {
  id: '5554991a-4d04-4c03-ba25-92b052744782',
  name: 'Monthly Percentage Payment',
  type: TYPE.MONTHLY_PERCENTAGE_PAYMENT,
  daysToReturnMin: 30,
  daysToReturnMax: 900,
  currency: CURRENCY.EUR,
  percent: 10.2
};

creditPrograms['monthly_percentage_payment__30_900__rub__15.9'] = {
  id: '680473e8-17b4-4342-9375-4274055433fd',
  name: 'Monthly Percentage Payment',
  type: TYPE.MONTHLY_PERCENTAGE_PAYMENT,
  daysToReturnMin: 30,
  daysToReturnMax: 900,
  currency: CURRENCY.RUB,
  percent: 15.9
};


module.exports = {
  data: creditPrograms,
  model: models.CreditProgram
};