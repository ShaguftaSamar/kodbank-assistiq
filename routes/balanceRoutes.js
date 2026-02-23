const express = require('express');
const router = express.Router();
const { getBalance } = require('../controllers/balanceController');

router.post('/getBalance', getBalance);

module.exports = router;
