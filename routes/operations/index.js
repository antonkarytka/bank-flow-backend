const express = require('express');
const router = express.Router();

const validateRequestSchema = require('../../helpers/http/request-schema-validator');
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
const { createTransitionWithDependencies } = require('../../models/transition/methods');


router.post('/put-money-on-cashbox', [
  validateRequestSchema(VALIDATION_SCHEMAS.PUT_MONEY_ON_CASHBOX),
  (req, res) => {
    return putMoneyOnCashbox(req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/transfer-money-to-raw-account', [
  validateRequestSchema(VALIDATION_SCHEMAS.TRANSFER_MONEY_TO_RAW_ACCOUNT),
  (req, res) => {
    return createTransitionWithDependencies(transferMoneyToRawAccount, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/use-money-inside-bank', [
  validateRequestSchema(VALIDATION_SCHEMAS.USE_MONEY_INSIDE_BANK),
  (req, res) => {
    return createTransitionWithDependencies(useMoneyInsideBank, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/add-interest-charge', [
  validateRequestSchema(VALIDATION_SCHEMAS.ADD_INTEREST_CHARGE),
  (req, res) => {
    return createTransitionWithDependencies(addInterestCharge, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/get-all-percent-charges', [
  validateRequestSchema(VALIDATION_SCHEMAS.GET_ALL_PERCENT_CHARGES),
  (req, res) => {
    return createTransitionWithDependencies(getAllPercentCharges, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/get-money-from-cashbox', [
  validateRequestSchema(VALIDATION_SCHEMAS.GET_MONEY_FROM_CASHBOX),
  (req, res) => {
    return getMoneyFromCashbox(req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/set-finish-deposit-state', [
  validateRequestSchema(VALIDATION_SCHEMAS.SET_FINISH_DEPOSIT_STATE),
  (req, res) => {
    return createTransitionWithDependencies(setFinishDepositState, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/get-all-raw-amount', [
  validateRequestSchema(VALIDATION_SCHEMAS.GET_ALL_RAW_AMOUNT),
  (req, res) => {
    return createTransitionWithDependencies(getAllRawAmount, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);


module.exports = router;