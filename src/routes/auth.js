const express = require('express');
const router = express.Router();
const { register, login, getMe, seedTestUser } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.get('/seed-test', seedTestUser);

module.exports = router;
