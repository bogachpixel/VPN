const express = require('express');
const router = express.Router();
const { getStats, getUsers, getUserDetail, blockUser } = require('../controllers/adminController');

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetail);
router.post('/users/:id/block', blockUser);

module.exports = router;
