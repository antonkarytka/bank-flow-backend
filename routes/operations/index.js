const express = require('express');
const router = express.Router();
const { checkSchema, validationResult } = require('express-validator/check');

const VALIDATION_SCHEMAS = require('./validation-schemas');
const {
  putMoneyOnCashbox,
  transferMoneyToRawAccount,
  useMoneyInsideBank,
  addInterestCharge,
  getAllPercentCharges,
  getMoneyFromCashbox,
  setFinishDepositState,
  getAllRawAmount
} = require('../../models/bank-account/methods/cash-operations');
const { createTransitionWithDependencies } = require('../../models/transitions/methods');


// Parameters:
// amount
router.post('/put-money-on-cashbox', [
  checkSchema(VALIDATION_SCHEMAS.CREATE_ONE),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.mapped() });

    return putMoneyOnCashbox(req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
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

    return createTransitionWithDependencies(transferMoneyToRawAccount, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

// Parameters:
// amount
// accountId
router.post('/use-money-inside-bank', [
  checkSchema(VALIDATION_SCHEMAS.CREATE_ONE),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.mapped() });

    return createTransitionWithDependencies(useMoneyInsideBank, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/add-interest-charge', [
  checkSchema(VALIDATION_SCHEMAS.CREATE_ONE),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.mapped() });

    return createTransitionWithDependencies(addInterestCharge, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/get-all-percent-charges', [
  checkSchema(VALIDATION_SCHEMAS.CREATE_ONE),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.mapped() });

    return createTransitionWithDependencies(getAllPercentCharges, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/get-money-from-cashbox', [
  checkSchema(VALIDATION_SCHEMAS.CREATE_ONE),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.mapped() });

    return getMoneyFromCashbox(req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/set-finish-deposit-state', [
  checkSchema(VALIDATION_SCHEMAS.CREATE_ONE),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.mapped() });

    return createTransitionWithDependencies(setFinishDepositState, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/get-all-raw-amount', [
  checkSchema(VALIDATION_SCHEMAS.CREATE_ONE),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.mapped() });

    return createTransitionWithDependencies(getAllRawAmount, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);


module.exports = router;