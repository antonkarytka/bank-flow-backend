const express = require('express');
const router = express.Router();

router.use('/bank-accounts', require('./bank-accounts'));
router.use('/bank-account-cards', require('./bank-account-cards'));
router.use('/cities', require('./cities'));
router.use('/citizenships', require('./citizenships'));
router.use('/credits', require('./credits'));
router.use('/credit-programs', require('./credit-programs'));
router.use('/deposits', require('./deposits'));
router.use('/deposit-programs', require('./deposit-programs'));
router.use('/disabilities', require('./disabilities'));
router.use('/transitions', require('./transitions'));
router.use('/users', require('./users'));
router.use('/operations', require('./operations'));

module.exports = router;
