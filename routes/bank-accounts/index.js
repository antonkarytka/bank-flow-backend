const express = require('express');
const router = express.Router();

const models = require('../../models');
const validateRequestSchema = require('../../helpers/http/request-schema-validator');
const VALIDATION_SCHEMAS = require('./validation-schemas');

const {
  addMoneyToCashbox,
  transferToRawFromCashbox,
  transferToDevelopmentFundFromRaw,
  transferToPercentageFromDevelopmentFund,
  transferAllToCashboxFromPercentage,
  withdrawMoneyFromCashbox,
  transferAllToRawFromDevelopmentFund,
  transferAllToCashboxFromRaw
} = require('../../models/bank-account/methods/cash-operations');
const { createTransitionWithDependencies } = require('../../models/transition/methods');


router.get('/cashbox', [
  validateRequestSchema(VALIDATION_SCHEMAS.FETCH_CASHBOX),
  (req, res) => {
    return models.BankAccount.fetchCashboxAccount(req.query)
    .then(cashboxAccount => res.status(200).json(cashboxAccount))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/cashbox/add-money', [
  validateRequestSchema(VALIDATION_SCHEMAS.ADD_MONEY_TO_CASHBOX),
  (req, res) => {
    return addMoneyToCashbox(req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/cashbox/transfer-to-raw', [
  validateRequestSchema(VALIDATION_SCHEMAS.TRANSFER_TO_RAW_FROM_CASHBOX),
  (req, res) => {
    return createTransitionWithDependencies(transferToRawFromCashbox, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/raw/transfer-to-development-fund', [
  validateRequestSchema(VALIDATION_SCHEMAS.TRANSFER_TO_DEVELOPMENT_FUND_FROM_RAW),
  (req, res) => {
    return createTransitionWithDependencies(transferToDevelopmentFundFromRaw, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/development-fund/transfer-to-percentage', [
  validateRequestSchema(VALIDATION_SCHEMAS.TRANSFER_TO_PERCENTAGE_FROM_DEVELOPMENT_FUND),
  (req, res) => {
    return createTransitionWithDependencies(transferToPercentageFromDevelopmentFund, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/percentage/transfer-all-to-cashbox', [
  validateRequestSchema(VALIDATION_SCHEMAS.TRANSFER_ALL_TO_CASHBOX_FROM_PERCENTAGE),
  (req, res) => {
    return createTransitionWithDependencies(transferAllToCashboxFromPercentage, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/cashbox/withdraw-money', [
  (req, res) => {
    return withdrawMoneyFromCashbox()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/development-fund/transfer-all-to-raw', [
  validateRequestSchema(VALIDATION_SCHEMAS.TRANSFER_ALL_TO_RAW_FROM_DEVELOPMENT_FUND),
  (req, res) => {
    return createTransitionWithDependencies(transferAllToRawFromDevelopmentFund, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/raw/transfer-all-to-cashbox', [
  validateRequestSchema(VALIDATION_SCHEMAS.TRANSFER_ALL_TO_CASHBOX_FROM_RAW),
  (req, res) => {
    return createTransitionWithDependencies(transferAllToCashboxFromRaw, req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.get('/:bankAccountId', [
  validateRequestSchema(VALIDATION_SCHEMAS.FETCH_BY_ID),
  (req, res) => {
    return models.BankAccount.fetchBankAccountById(req.params)
    .then(bankAccount => res.status(200).json(bankAccount))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/:bankAccountId/top-up', [
  validateRequestSchema(VALIDATION_SCHEMAS.TOP_UP),
  (req, res) => {
    return models.BankAccount.topUp({ ...req.params, ...req.body })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/:bankAccountId/withdraw', [
  validateRequestSchema(VALIDATION_SCHEMAS.WITHDRAW),
  (req, res) => {
    return models.BankAccount.withdraw({ ...req.params, ...req.body })
    .then(result => res.status(200).json(result))
    .catch(err => {
      console.log(err);
      res.status(400).json(err)
    })
  }
]);


module.exports = router;