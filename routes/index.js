const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/disabilities', require('./disabilities'));
router.use('/cities', require('./cities'));
router.use('/citizenships', require('./citizenships'));
router.use('/deposit-programs', require('./deposit-programs'));
router.use('/deposits', require('./deposits'));

module.exports = router;
