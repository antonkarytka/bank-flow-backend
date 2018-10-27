const { checkSchema, validationResult } = require('express-validator/check');

const handleValidationResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const mappedErrors = errors.mapped();
    Promise.reject(mappedErrors);
    return res.status(422).json({ errors: mappedErrors })
  }

  return next();
};

const validateRequestSchema = (schema) => [
  checkSchema(schema),
  handleValidationResults
];


module.exports = validateRequestSchema;