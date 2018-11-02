const models = require('../../index');

const RELATED_TRANSITIONS = [
  {
    separate: true,
    model: models.Transition,
    as: 'receivedTransitions',
    required: false,
    include: [{
      model: models.BankAccount,
      as: 'senderBankAccount',
      required: true
    }]
  },
  {
    separate: true,
    model: models.Transition,
    as: 'sentTransitions',
    required: false,
    include: [{
      model: models.BankAccount,
      as: 'receiverBankAccount',
      required: true
    }]
  }
];

module.exports = {
  RELATED_TRANSITIONS
};
