const express = require('express');
const router = express.Router();
const { register, login, getMe, seedTestUser, updateVpnName, updateEmail } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.post('/vpn-name', authMiddleware, updateVpnName);
router.post('/email', authMiddleware, updateEmail);
router.get('/seed-test', seedTestUser);

module.exports = router;
