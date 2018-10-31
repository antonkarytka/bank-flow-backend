const express = require('express');
const router = express.Router();

const models = require('../../models');
const validateRequestSchema = require('../../helpers/http/request-schema-validator');
const VALIDATION_SCHEMAS = require('./validation-schemas');


router.get('/', [
  validateRequestSchema(VALIDATION_SCHEMAS.FETCH),
  (req, res) => {
    return models.Deposit.fetchDeposits(req.query)
    .then(deposits => res.status(200).json(deposits))
    .catch(err => res.status(400).json(err))
  }
]);


router.post('/', [
  validateRequestSchema(VALIDATION_SCHEMAS.CREATE_ONE),
  (req, res) => {
    return models.Deposit.createDepositWithDependencies(req.body)
    .then(deposit => res.status(200).json(deposit))
    .catch(err => res.status(400).json(err))
  }
]);


module.exports = router;