const { pool } = require('../models/db');
const QRCode = require('qrcode');
const { createMarzbanUser } = require('../services/marzbanService');

function injectVpnName(link, vpnName) {
  if (!link || !vpnName) return link;
  try {
    // Only modify direct protocol URIs — HTTP subscription URLs must stay untouched
    const isProtoUri = /^(vless|vmess|trojan|ss|ssr):\/\//i.test(link);
    if (!isProtoUri) return link;
    const hashIdx = link.indexOf('#');
    const base = hashIdx >= 0 ? link.substring(0, hashIdx) : link;
    return base + '#' + encodeURIComponent(vpnName);
  } catch { return link; }
}

async function getActiveSubscription(req, res) {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT s.*, u.vpn_name
       FROM subscriptions s
       JOIN users u ON u.id = s.user_id
       WHERE s.user_id = $1 AND s.status = 'active'
       ORDER BY s.expires_at DESC
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({ hasSubscription: false });
    }

    const sub = result.rows[0];
    const vpnName = sub.vpn_name;
    const isExpired = new Date(sub.expires_at) < new Date();

    const displayLink = injectVpnName(sub.marzban_link, vpnName);

    let qrCode = null;
    if (displayLink) {
      qrCode = await QRCode.toDataURL(displayLink, {
        width: 300,
        margin: 2,
        color: { dark: '#1a1a1a', light: '#ffffff' }
      });
    }

    return res.json({
      hasSubscription: true,
      subscription: {
        id: sub.id,
        planDays: sub.plan_days,
        startedAt: sub.started_at,
        expiresAt: sub.expires_at,
        marzbanLink: displayLink,
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

async function testActivate(req, res) {
  try {
    const userId = req.userId;
    const now = new Date();
    const expireDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const expireTimestamp = Math.floor(expireDate.getTime() / 1000);

    const marzbanUsername = `test_${userId}_${Date.now()}`;
    let marzbanLink = '';

    try {
      const marzbanUser = await createMarzbanUser(marzbanUsername, expireTimestamp);
      marzbanLink = marzbanUser.subscription_url || (marzbanUser.links && marzbanUser.links[0]) || '';
    } catch (err) {
      console.log('Marzban unavailable, using placeholder for test:', err.message);
      marzbanLink = `vless://00000000-0000-0000-0000-000000000000@142.93.107.127:443?type=tcp&security=tls#TouchVPN-Test-${userId}`;
    }

    await pool.query(
      `UPDATE subscriptions SET status = 'cancelled'
       WHERE user_id = $1 AND status = 'active' AND plan_days = 1`,
      [userId]
    );

    await pool.query(
      `INSERT INTO subscriptions
       (user_id, plan_days, started_at, expires_at, marzban_username, marzban_link, status)
       VALUES ($1, 1, $2, $3, $4, $5, 'active')`,
      [userId, now, expireDate, marzbanUsername, marzbanLink]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('TestActivate error:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function refreshSubscription(req, res) {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT * FROM subscriptions
       WHERE user_id = $1 AND status = 'active'
       ORDER BY expires_at DESC LIMIT 1`,
      [userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Активная подписка не найдена' });
    }

    const sub = result.rows[0];
    const expireTimestamp = Math.floor(new Date(sub.expires_at).getTime() / 1000);

    let marzbanUsername = sub.marzban_username;
    let marzbanLink = '';

    const { createMarzbanUser, getMarzbanUser, updateMarzbanUser } = require('../services/marzbanService');

    if (marzbanUsername) {
      try {
        const marzbanUser = await getMarzbanUser(marzbanUsername);
        marzbanLink = marzbanUser.subscription_url || (marzbanUser.links && marzbanUser.links[0]) || '';
      } catch (e) {
        // user not found — create new
        marzbanUsername = `vpn_${userId}_${Date.now()}`;
        const marzbanUser = await createMarzbanUser(marzbanUsername, expireTimestamp);
        marzbanLink = marzbanUser.subscription_url || (marzbanUser.links && marzbanUser.links[0]) || '';
      }
    } else {
      marzbanUsername = `vpn_${userId}_${Date.now()}`;
      const marzbanUser = await createMarzbanUser(marzbanUsername, expireTimestamp);
      marzbanLink = marzbanUser.subscription_url || (marzbanUser.links && marzbanUser.links[0]) || '';
    }

    await pool.query(
      'UPDATE subscriptions SET marzban_username = $1, marzban_link = $2 WHERE id = $3',
      [marzbanUsername, marzbanLink, sub.id]
    );

    return res.json({ success: true, marzbanLink });
  } catch (err) {
    console.error('RefreshSubscription error:', err);
    return res.status(500).json({ error: 'Не удалось подключиться к серверу VPN. Попробуйте позже.' });
  }
}

module.exports = { getActiveSubscription, getPaymentHistory, testActivate, refreshSubscription };
