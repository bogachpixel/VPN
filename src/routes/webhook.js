const express = require('express');
const router = express.Router();
const { handleFreekassaWebhook } = require('../controllers/webhookController');

router.post('/freekassa', handleFreekassaWebhook);
router.get('/freekassa', handleFreekassaWebhook);

module.exports = router;
