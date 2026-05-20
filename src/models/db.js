const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20),
        email VARCHAR(255),
        password_hash VARCHAR(255) NOT NULL,
        vpn_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS vpn_name VARCHAR(100);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        plan_days INTEGER NOT NULL,
        started_at TIMESTAMP,
        expires_at TIMESTAMP,
        marzban_username VARCHAR(255),
        marzban_link TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        subscription_id INTEGER REFERENCES subscriptions(id),
        amount DECIMAL(10,2) NOT NULL,
        freekassa_id VARCHAR(255),
        order_id VARCHAR(255) UNIQUE,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      ALTER TABLE subscriptions
        ADD COLUMN IF NOT EXISTS suspected_sharing BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS qr_version        INTEGER  DEFAULT 1,
        ADD COLUMN IF NOT EXISTS last_site_ip      VARCHAR(45);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS user_access_logs (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
        ip_address VARCHAR(45),
        user_agent TEXT,
        action     VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_access_logs_user_id
        ON user_access_logs(user_id);
    `);

    console.log('Database initialized successfully');
  } finally {
    client.release();
  }
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = forwarded
    ? forwarded.split(',')[0].trim()
    : (req.socket?.remoteAddress || req.ip || '');
  return raw.replace(/^::ffff:/, '');
}

async function logAccess(userId, req, action) {
  const ip = getClientIp(req);
  const ua = (req.headers['user-agent'] || '').substring(0, 500);
  pool.query(
    'INSERT INTO user_access_logs (user_id, ip_address, user_agent, action) VALUES ($1,$2,$3,$4)',
    [userId, ip, ua, action]
  ).catch(e => console.error('logAccess error:', e.message));
  pool.query(
    `UPDATE subscriptions SET last_site_ip = $1
     WHERE id = (
       SELECT id FROM subscriptions
       WHERE user_id = $2 AND status = 'active'
       ORDER BY expires_at DESC
       LIMIT 1
     )`,
    [ip, userId]
  ).catch(() => {});
}

module.exports = { pool, initDB, logAccess };
