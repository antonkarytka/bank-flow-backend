const express = require('express');
const router = express.Router();

const validateRequestSchema = require('../../helpers/http/request-schema-validator');
const VALIDATION_SCHEMAS = require('./validation-schemas');
const { logIn, createBankAccountCard } = require('../../models/bank-account-card/methods');


router.post('/login', [
  validateRequestSchema(VALIDATION_SCHEMAS.LOG_IN),
  (req, res) => {
    return logIn(req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(401).json(err))
  }
]);


router.post('/', [
  validateRequestSchema(VALIDATION_SCHEMAS.CREATE_ONE),
  (req, res) => {
    return createBankAccountCard(req.body)
    .then(result => res.status(200).json(result))
    .catch(err => {
      console.log(err);
      res.status(400).json(err)
    })
  }
]);


module.exports = router;