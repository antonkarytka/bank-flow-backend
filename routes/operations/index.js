const express = require('express');
const router = express.Router();

const { changeMonthSimulation } = require('../../models/bank-account/methods/common-operations/index');

router.post('/change-month-simulation', [
  (req, res) => {
    return changeMonthSimulation(req.query)
    .then(response => res.status(200).json(response))
    .catch(err => {
      console.log(err);
      return res.status(400).json(err);
    })
  }
]);


module.exports = router;