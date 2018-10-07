const express = require('express');
const router = express.Router();
const { checkSchema, validationResult } = require('express-validator/check');

const models = require('../../models');
const VALIDATION_SCHEMAS = require('./validation-schemas');

const { putMoneyOnCashbox, transferMoneyToRawAccount } = require("../../models/bank-account/methods/cash-operations");

// Parameters:
// amount
router.post('/put-money-on-cashbox', [
  checkSchema(VALIDATION_SCHEMAS.CREATE_ONE),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.mapped() });

    return putMoneyOnCashbox(req.body)
    .then(user => res.status(200).json(user))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    })
  }
]);

// Parameters:
// amount
// accountId
router.post('/transfer-money-to-raw-account', [
  checkSchema(VALIDATION_SCHEMAS.CREATE_ONE),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.mapped() });

    return transferMoneyToRawAccount(req.body)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).json(err))
  }
]);


module.exports = router;