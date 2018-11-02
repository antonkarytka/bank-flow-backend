const express = require('express');
const router = express.Router();

const models = require('../../models');
const validateRequestSchema = require('../../helpers/http/request-schema-validator');
const VALIDATION_SCHEMAS = require('./validation-schemas');


router.get('/', [
  validateRequestSchema(VALIDATION_SCHEMAS.FETCH),
  (req, res) => {
    return models.Credit.fetchCredits(req.query)
    .then(credits => res.status(200).json(credits))
    .catch(err => res.status(400).json(err))
  }
]);


router.get('/:creditId', [
  validateRequestSchema(VALIDATION_SCHEMAS.FETCH_BY_ID),
  (req, res) => {
    return models.Credit.fetchCreditById({ ...req.params, ...req.query })
    .then(credit => res.status(200).json(credit))
    .catch(err => res.status(400).json(err))
  }
]);


router.post('/', [
  validateRequestSchema(VALIDATION_SCHEMAS.CREATE_ONE),
  (req, res) => {
    return models.Credit.createCreditWithDependencies(req.body)
    .then(credit => res.status(200).json(credit))
    .catch(err => res.status(400).json(err))
  }
]);


module.exports = router;