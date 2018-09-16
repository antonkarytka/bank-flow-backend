const express = require('express');
const router = express.Router();
const { checkSchema, validationResult } = require('express-validator/check');

const models = require('../../models');
const VALIDATION_SCHEMAS = require('./validation-schemas');


router.get('/', [
  checkSchema(VALIDATION_SCHEMAS.FETCH),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.mapped() });

    return models.Citizenship.fetchCitizenships(req.query)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).json(err))
  }
]);


module.exports = router;