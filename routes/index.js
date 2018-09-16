const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/disabilities', require('./disabilities'));
router.use('/cities', require('./cities'));
router.use('/citizenships', require('./citizenships'));

module.exports = router;
