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

    return models.User.fetchUsers(req.query)
    .then(users => res.status(200).json(users))
    .catch(err => res.status(400).json(err))
  }
]);

router.post('/', [
  checkSchema(VALIDATION_SCHEMAS.CREATE_ONE),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.mapped() });

    return models.User.createUserWithDependencies(req.body)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).json(err))
  }
]);

router.put('/:userId', [
  checkSchema(VALIDATION_SCHEMAS.UPDATE_ONE),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.mapped() });

    return models.User.updateUser({ id: req.params.userId }, req.body)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).json(err))
  }
]);

router.delete('/:userId', [
  checkSchema(VALIDATION_SCHEMAS.DELETE_ONE),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.mapped() });

    return models.User.deleteUser({ id: req.params.userId })
    .then(res => res.status(200).json(res))
    .catch(err => res.status(400).json(err))
  }
]);


module.exports = router;