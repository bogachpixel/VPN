const express = require('express');
const router = express.Router();
const { getActiveSubscription, getPaymentHistory, testActivate, refreshSubscription } = require('../controllers/subscriptionController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/active', authMiddleware, getActiveSubscription);
router.get('/payments', authMiddleware, getPaymentHistory);
router.post('/test-activate', authMiddleware, testActivate);
router.post('/refresh', authMiddleware, refreshSubscription);

module.exports = router;
