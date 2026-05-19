const express = require('express');
const router = express.Router();
const { createPayment, getPaymentStatus } = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, createPayment);
router.get('/status/:orderId', authMiddleware, getPaymentStatus);

module.exports = router;
