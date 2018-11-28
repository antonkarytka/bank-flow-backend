const express = require('express');
const router = express.Router();

const models = require('../../models');
const validateRequestSchema = require('../../helpers/http/request-schema-validator');
const VALIDATION_SCHEMAS = require('./validation-schemas');


router.post('/login', [
  validateRequestSchema(VALIDATION_SCHEMAS.LOG_IN),
  (req, res) => {
    return models.BankAccountCard.logIn(req.body)
    .then(result => res.status(200).json(result))
    .catch(err => {
      if (err === 'cardDeactivated') return res.status(403).json(`Failed to log in. Requested bank account card has been deactivated.`);
      return res.status(401).json(err);
    })
  }
]);

router.post('/:bankAccountCardId/activate', [
  validateRequestSchema(VALIDATION_SCHEMAS.ACTIVATE),
  (req, res) => {
    return models.BankAccountCard.setActive({ ...req.params, active: true })
    .then(result => res.status(200).json(result))
    .catch(err => {
      console.log(err);
      res.status(400).json(err)
    })
  }
]);

router.post('/:bankAccountCardId/deactivate', [
  validateRequestSchema(VALIDATION_SCHEMAS.DEACTIVATE),
  (req, res) => {
    return models.BankAccountCard.setActive({ ...req.params, active: false })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/deactivate', [
  validateRequestSchema(VALIDATION_SCHEMAS.DEACTIVATE_BY_NUMBER),
  (req, res) => {
    return models.BankAccountCard.deactivateByNumber(req.body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/', [
  validateRequestSchema(VALIDATION_SCHEMAS.CREATE_ONE),
  (req, res) => {
    return models.BankAccountCard.createBankAccountCard(req.body)
    .then(result => res.status(200).json(result))
    .catch(err => {
      console.log(err);
      res.status(400).json(err)
    })
  }
]);


module.exports = router;