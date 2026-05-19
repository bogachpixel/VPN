const { pool } = require('../models/db');
const QRCode = require('qrcode');

async function getActiveSubscription(req, res) {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT s.*
       FROM subscriptions s
       WHERE s.user_id = $1 AND s.status = 'active'
       ORDER BY s.expires_at DESC
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({ hasSubscription: false });
    }

    const sub = result.rows[0];
    const isExpired = new Date(sub.expires_at) < new Date();

    let qrCode = null;
    if (sub.marzban_link) {
      qrCode = await QRCode.toDataURL(sub.marzban_link, {
        width: 300,
        margin: 2,
        color: { dark: '#ffffff', light: '#1a1a1a' }
      });
    }

    return res.json({
      hasSubscription: true,
      subscription: {
        id: sub.id,
        planDays: sub.plan_days,
        startedAt: sub.started_at,
        expiresAt: sub.expires_at,
        marzbanLink: sub.marzban_link,
        status: sub.status,
        qrCode,
        isExpired
      }
    });
  } catch (err) {
    console.error('GetActiveSubscription error:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function getPaymentHistory(req, res) {
  try {
    const result = await pool.query(
      `SELECT p.amount, p.status, p.created_at, s.plan_days
       FROM payments p
       JOIN subscriptions s ON p.subscription_id = s.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC
       LIMIT 20`,
      [req.userId]
    );

    return res.json({ payments: result.rows });
  } catch (err) {
    console.error('GetPaymentHistory error:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

module.exports = { getActiveSubscription, getPaymentHistory };
