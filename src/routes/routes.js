const express = require('express');
const router = express.Router();

// Combine all routes

router.use('/auth', require('./auth'));
router.use('/products', require('./products'));
router.use('/users', require('./users'));

module.exports = router;
