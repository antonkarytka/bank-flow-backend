const models = require('../../../models');
const { CURRENCY, TYPE } = require('../../../models/deposit-program/constants');

const depositPrograms = {};

depositPrograms['urgent_revocable__7_null__byn'] = {
  id: '3199a5fe-aab1-02cf-5ced-4ce9ba4f17af',
  name: 'Urgent Revocable',
  type: TYPE.URGENT_REVOCABLE,
  daysToWithdrawMin: 7,
  daysToWithdrawMax: null,
  currency: CURRENCY.BYN,
  percent: 6.9
};

depositPrograms['urgent_revocable__7_null__usd__1.2'] = {
  id: '3dab41e4-25fc-c502-0994-1aafa94c023c',
  name: 'Urgent Revocable',
  type: TYPE.URGENT_REVOCABLE,
  daysToWithdrawMin: 7,
  daysToWithdrawMax: null,
  currency: CURRENCY.USD,
  percent: 1.2
};

depositPrograms['urgent_revocable__7_null__eur__0.5'] = {
  id: '4892988e-69f4-6ced-f21f-7ed1d989cd6e',
  name: 'Urgent Revocable',
  type: TYPE.URGENT_REVOCABLE,
  daysToWithdrawMin: 7,
  daysToWithdrawMax: null,
  currency: CURRENCY.EUR,
  percent: 0.5
};

depositPrograms['urgent_revocable__7_null__rub__3.5'] = {
  id: '88b8ea9c-cc65-12cd-6b41-c25904debb6a',
  name: 'Urgent Revocable',
  type: TYPE.URGENT_REVOCABLE,
  daysToWithdrawMin: 7,
  daysToWithdrawMax: null,
  currency: CURRENCY.RUB,
  percent: 3.5
};

depositPrograms['urgent_irrevocable__32_186__byn__8.0'] = {
  id: '5551d682-4018-9080-f63b-765f1fd7b69c',
  name: 'Urgent Irrevocable',
  type: TYPE.URGENT_IRREVOCABLE,
  daysToWithdrawMin: 32,
  daysToWithdrawMax: 186,
  currency: CURRENCY.BYN,
  percent: 8.0
};

depositPrograms['urgent_irrevocable__32_186__usd__1.5'] = {
  id: '9c8df7f8-c160-c9f3-b99a-62ab1004b48d',
  name: 'Urgent Irrevocable',
  type: TYPE.URGENT_IRREVOCABLE,
  daysToWithdrawMin: 32,
  daysToWithdrawMax: 186,
  currency: CURRENCY.USD,
  percent: 1.5
};

depositPrograms['urgent_irrevocable__32_186__eur__0.7'] = {
  id: 'cf8fd679-68ff-2a54-5e4a-b2a0b74867c1',
  name: 'Urgent Irrevocable',
  type: TYPE.URGENT_IRREVOCABLE,
  daysToWithdrawMin: 32,
  daysToWithdrawMax: 186,
  currency: CURRENCY.EUR,
  percent: 0.7
};

depositPrograms['urgent_irrevocable__32_186__rub__3.75'] = {
  id: '06b1eb7f-9ad2-b0ee-b57e-b4db70f19725',
  name: 'Urgent Irrevocable',
  type: TYPE.URGENT_IRREVOCABLE,
  daysToWithdrawMin: 32,
  daysToWithdrawMax: 186,
  currency: CURRENCY.RUB,
  percent: 3.75
};

depositPrograms['urgent_irrevocable__187_null__byn__9.2'] = {
  id: 'dc40e4d7-14a9-ae05-aa75-dfe80c57a024',
  name: 'Urgent Irrevocable',
  type: TYPE.URGENT_IRREVOCABLE,
  daysToWithdrawMin: 187,
  daysToWithdrawMax: null,
  currency: CURRENCY.BYN,
  percent: 9.2
};

depositPrograms['urgent_irrevocable__187_null__usd__1.7'] = {
  id: '2613d408-aa6a-3656-7c3b-ca9fc85691b6',
  name: 'Urgent Irrevocable',
  type: TYPE.URGENT_IRREVOCABLE,
  daysToWithdrawMin: 187,
  daysToWithdrawMax: null,
  currency: CURRENCY.USD,
  percent: 1.7
};

depositPrograms['urgent_irrevocable__187_null__eur__1.0'] = {
  id: '34c4d005-79b8-42c5-10e0-a2f7eb40aeb2',
  name: 'Urgent Irrevocable',
  type: TYPE.URGENT_IRREVOCABLE,
  daysToWithdrawMin: 187,
  daysToWithdrawMax: null,
  currency: CURRENCY.EUR,
  percent: 1.0
};

depositPrograms['urgent_irrevocable__187_null__rub__4.0'] = {
  id: '87adcc30-ba34-7754-245e-fcb497eec034',
  name: 'Urgent Irrevocable',
  type: TYPE.URGENT_IRREVOCABLE,
  daysToWithdrawMin: 187,
  daysToWithdrawMax: null,
  currency: CURRENCY.RUB,
  percent: 4.0
};


module.exports = {
  data: depositPrograms,
  model: models.DepositProgram
};