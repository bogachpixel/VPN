const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../models/db');

async function register(req, res) {
  try {
    const { phone, email, password, vpnName } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов' });
    }

    if (!phone && !email) {
      return res.status(400).json({ error: 'Укажите телефон или email' });
    }

    const existing = await pool.query(
      'SELECT id FROM users WHERE phone = $1 OR email = $2',
      [phone || null, email || null]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь с такими данными уже существует' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (phone, email, password_hash, vpn_name) VALUES ($1, $2, $3, $4) RETURNING id',
      [phone || null, email || null, passwordHash, vpnName || null]
    );

    const userId = result.rows[0].id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

    return res.json({ token, userId });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function login(req, res) {
  try {
    const { phone, email, password } = req.body;

    if (!password || (!phone && !email)) {
      return res.status(400).json({ error: 'Укажите телефон или email и пароль' });
    }

    const query = phone
      ? 'SELECT * FROM users WHERE phone = $1'
      : 'SELECT * FROM users WHERE email = $1';
    const params = [phone || email];

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверные данные для входа' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Неверные данные для входа' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    return res.json({ token, userId: user.id });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function getMe(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, phone, email, vpn_name, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('GetMe error:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function seedTestUser(req, res) {
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', ['test@test.com']);
    if (existing.rows.length > 0) {
      return res.json({ message: 'Тестовый пользователь уже существует', userId: existing.rows[0].id });
    }
    const passwordHash = await bcrypt.hash('Test1234', 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
      ['test@test.com', passwordHash]
    );
    return res.json({ message: 'Тестовый пользователь создан', userId: result.rows[0].id });
  } catch (err) {
    console.error('SeedTestUser error:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function updateVpnName(req, res) {
  try {
    const { vpnName } = req.body;
    if (!vpnName || !vpnName.trim()) {
      return res.status(400).json({ error: 'Имя VPN не может быть пустым' });
    }
    await pool.query('UPDATE users SET vpn_name = $1 WHERE id = $2', [vpnName.trim(), req.userId]);
    return res.json({ success: true });
  } catch (err) {
    console.error('UpdateVpnName error:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

module.exports = { register, login, getMe, seedTestUser, updateVpnName };
