const express = require('express');
const router = express.Router();

const models = require('../../models');
const validateRequestSchema = require('../../helpers/http/request-schema-validator');
const VALIDATION_SCHEMAS = require('./validation-schemas');


router.get('/', [
  validateRequestSchema(VALIDATION_SCHEMAS.FETCH),
  (req, res) => {
    return models.Disability.fetchDisabilities(req.query)
    .then(disabilities => res.status(200).json(disabilities))
    .catch(err => res.status(400).json(err))
  }
]);


module.exports = router;