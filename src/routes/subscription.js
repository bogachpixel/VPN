const express = require('express');
const router = express.Router();
const { getActiveSubscription, getPaymentHistory } = require('../controllers/subscriptionController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/active', authMiddleware, getActiveSubscription);
router.get('/payments', authMiddleware, getPaymentHistory);

module.exports = router;
