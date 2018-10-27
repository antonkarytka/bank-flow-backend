const express = require('express');
const router = express.Router();

router.use('/cities', require('./cities'));
router.use('/citizenships', require('./citizenships'));
router.use('/deposits', require('./deposits'));
router.use('/deposit-programs', require('./deposit-programs'));
router.use('/disabilities', require('./disabilities'));
router.use('/operations', require('./operations'));
router.use('/transitions', require('./transitions'));
router.use('/users', require('./users'));

module.exports = router;
