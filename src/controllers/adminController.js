const { pool } = require('../models/db');
const { createMarzbanUser, deleteMarzbanUser, disableMarzbanUser } = require('../services/marzbanService');

function checkAdminKey(req, res) {
  const key = req.headers['x-admin-key'] || req.query.key;
  if (!key || key !== process.env.ADMIN_KEY) {
    res.status(401).json({ error: 'Нет доступа' });
    return false;
  }
  return true;
}

async function getStats(req, res) {
  if (!checkAdminKey(req, res)) return;
  try {
    const [usersR, activeR, totalPayR, revenueR] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query("SELECT COUNT(*) FROM subscriptions WHERE status = 'active' AND expires_at > NOW()"),
      pool.query("SELECT COUNT(*) FROM payments WHERE status = 'paid'"),
      pool.query("SELECT COALESCE(SUM(amount),0) as total FROM payments WHERE status = 'paid'")
    ]);
    return res.json({
      totalUsers: parseInt(usersR.rows[0].count),
      activeSubscriptions: parseInt(activeR.rows[0].count),
      totalPayments: parseInt(totalPayR.rows[0].count),
      totalRevenue: parseFloat(revenueR.rows[0].total)
    });
  } catch (err) {
    console.error('Admin getStats error:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function getUsers(req, res) {
  if (!checkAdminKey(req, res)) return;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let whereClause = '';
    let params = [limit, offset];
    if (search) {
      whereClause = `WHERE u.phone ILIKE $3 OR u.email ILIKE $3 OR u.vpn_name ILIKE $3`;
      params.push(`%${search}%`);
    }

    const result = await pool.query(`
      SELECT
        u.id, u.phone, u.email, u.vpn_name, u.created_at,
        s.status AS sub_status,
        s.expires_at,
        s.plan_days,
        s.last_site_ip,
        s.qr_version,
        s.suspected_sharing,
        s.marzban_username,
        COALESCE(p.total_paid, 0) AS total_paid
      FROM users u
      LEFT JOIN LATERAL (
        SELECT status, expires_at, plan_days, last_site_ip, qr_version, suspected_sharing, marzban_username
        FROM subscriptions
        WHERE user_id = u.id AND status = 'active'
        ORDER BY expires_at DESC LIMIT 1
      ) s ON true
      LEFT JOIN LATERAL (
        SELECT SUM(amount) AS total_paid
        FROM payments
        WHERE user_id = u.id AND status = 'paid'
      ) p ON true
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $1 OFFSET $2
    `, params);

    const countResult = await pool.query(
      search
        ? `SELECT COUNT(*) FROM users WHERE phone ILIKE $1 OR email ILIKE $1 OR vpn_name ILIKE $1`
        : `SELECT COUNT(*) FROM users`,
      search ? [`%${search}%`] : []
    );

    return res.json({
      users: result.rows,
      total: parseInt(countResult.rows[0].count),
      page, limit
    });
  } catch (err) {
    console.error('Admin getUsers error:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function getUserDetail(req, res) {
  if (!checkAdminKey(req, res)) return;
  try {
    const userId = parseInt(req.params.id);

    const userR = await pool.query(
      'SELECT id, phone, email, vpn_name, created_at FROM users WHERE id = $1',
      [userId]
    );
    if (userR.rows.length === 0) return res.status(404).json({ error: 'Не найден' });

    const subsR = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [userId]
    );

    const paymentsR = await pool.query(
      'SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [userId]
    );

    return res.json({ user: userR.rows[0], subscriptions: subsR.rows, payments: paymentsR.rows });
  } catch (err) {
    console.error('Admin getUserDetail error:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function blockUser(req, res) {
  if (!checkAdminKey(req, res)) return;
  try {
    const userId = parseInt(req.params.id);
    await pool.query(
      "UPDATE subscriptions SET status = 'cancelled' WHERE user_id = $1 AND status = 'active'",
      [userId]
    );
    return res.json({ success: true });
  } catch (err) {
    console.error('Admin blockUser error:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function getUserIpLogs(req, res) {
  if (!checkAdminKey(req, res)) return;
  try {
    const userId = parseInt(req.params.id);
    const result = await pool.query(
      `SELECT ip_address, user_agent, action, created_at
       FROM user_access_logs
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [userId]
    );
    return res.json({ logs: result.rows });
  } catch (err) {
    console.error('getUserIpLogs error:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function reissueQr(req, res) {
  if (!checkAdminKey(req, res)) return;
  try {
    const userId = parseInt(req.params.id);

    const subResult = await pool.query(
      `SELECT id, marzban_username, expires_at, qr_version
       FROM subscriptions
       WHERE user_id = $1 AND status = 'active'
       ORDER BY expires_at DESC LIMIT 1`,
      [userId]
    );
    if (!subResult.rows.length) {
      return res.status(404).json({ error: 'Активная подписка не найдена' });
    }

    const sub = subResult.rows[0];
    const oldUsername = sub.marzban_username;
    const expireTimestamp = Math.floor(new Date(sub.expires_at).getTime() / 1000);
    const newVersion = (sub.qr_version || 1) + 1;
    const newUsername = `vpn_${userId}_v${newVersion}_${Date.now()}`;

    // 1. Create new Marzban user first
    let newMarzbanData;
    try {
      newMarzbanData = await createMarzbanUser(newUsername, expireTimestamp);
    } catch (err) {
      return res.status(503).json({ error: 'Не удалось создать нового VPN-пользователя: ' + err.message });
    }

    const newLink = newMarzbanData.subscription_url || (newMarzbanData.links && newMarzbanData.links[0]) || '';
    if (!newLink) {
      try { await deleteMarzbanUser(newUsername); } catch (_) {}
      return res.status(503).json({ error: 'Marzban не вернул ссылку' });
    }

    // 2. Delete old user
    if (oldUsername) {
      try {
        await deleteMarzbanUser(oldUsername);
      } catch (err) {
        // Old delete failed — rollback new user, preserve old access
        try { await deleteMarzbanUser(newUsername); } catch (_) {}
        return res.status(503).json({ error: 'Не удалось удалить старого VPN-пользователя: ' + err.message });
      }
    }

    // 3. Update DB only after both operations succeeded
    await pool.query(
      `UPDATE subscriptions
       SET marzban_username = $1, marzban_link = $2, qr_version = $3
       WHERE id = $4`,
      [newUsername, newLink, newVersion, sub.id]
    );

    return res.json({ success: true, newVersion });
  } catch (err) {
    console.error('reissueQr error:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function disableVpn(req, res) {
  if (!checkAdminKey(req, res)) return;
  try {
    const userId = parseInt(req.params.id);
    const subResult = await pool.query(
      `SELECT marzban_username FROM subscriptions
       WHERE user_id = $1 AND status = 'active'
       ORDER BY expires_at DESC LIMIT 1`,
      [userId]
    );
    if (!subResult.rows.length || !subResult.rows[0].marzban_username) {
      return res.status(404).json({ error: 'Активный VPN-пользователь не найден' });
    }
    await disableMarzbanUser(subResult.rows[0].marzban_username);
    return res.json({ success: true });
  } catch (err) {
    console.error('disableVpn error:', err);
    return res.status(500).json({ error: 'Ошибка: ' + err.message });
  }
}

async function deleteVpn(req, res) {
  if (!checkAdminKey(req, res)) return;
  try {
    const userId = parseInt(req.params.id);
    const subResult = await pool.query(
      `SELECT id, marzban_username FROM subscriptions
       WHERE user_id = $1 AND status = 'active'
       ORDER BY expires_at DESC LIMIT 1`,
      [userId]
    );
    if (!subResult.rows.length) {
      return res.status(404).json({ error: 'Активная подписка не найдена' });
    }
    const sub = subResult.rows[0];
    if (sub.marzban_username) {
      try {
        await deleteMarzbanUser(sub.marzban_username);
      } catch (err) {
        console.error('deleteVpn: Marzban delete failed:', err.message);
      }
    }
    await pool.query(
      `UPDATE subscriptions
       SET marzban_username = NULL, marzban_link = NULL, status = 'cancelled'
       WHERE id = $1`,
      [sub.id]
    );
    return res.json({ success: true });
  } catch (err) {
    console.error('deleteVpn error:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

module.exports = { getStats, getUsers, getUserDetail, blockUser, getUserIpLogs, reissueQr, disableVpn, deleteVpn };
