const express = require('express');
const router = express.Router();

const models = require('../../models');
const validateRequestSchema = require('../../helpers/http/request-schema-validator');
const VALIDATION_SCHEMAS = require('./validation-schemas');


router.get('/', [
  validateRequestSchema(VALIDATION_SCHEMAS.FETCH),
  (req, res) => {
    return models.User.fetchUsers(req.query)
    .then(users => res.status(200).json(users))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/', [
  validateRequestSchema(VALIDATION_SCHEMAS.CREATE_ONE),
  (req, res) => {
    return models.User.createUserWithDependencies(req.body)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).json(err))
  }
]);

router.put('/:userId', [
  validateRequestSchema(VALIDATION_SCHEMAS.UPDATE_ONE),
  (req, res) => {
    return models.User.updateUser({ id: req.params.userId }, req.body)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).json(err))
  }
]);

router.delete('/:userId', [
  validateRequestSchema(VALIDATION_SCHEMAS.DELETE_ONE),
  (req, res) => {
    return models.User.deleteUser({ id: req.params.userId })
    .then(res => res.status(200).json(res))
    .catch(err => res.status(400).json(err))
  }
]);


module.exports = router;