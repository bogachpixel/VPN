const express = require('express');
const router = express.Router();
const { getStats, getUsers, getUserDetail, blockUser, getUserIpLogs, reissueQr, disableVpn, deleteVpn } = require('../controllers/adminController');

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetail);
router.post('/users/:id/block', blockUser);
router.get('/users/:id/ip-logs', getUserIpLogs);
router.post('/users/:id/reissue-qr', reissueQr);
router.post('/users/:id/disable-vpn', disableVpn);
router.post('/users/:id/delete-vpn', deleteVpn);

module.exports = router;
