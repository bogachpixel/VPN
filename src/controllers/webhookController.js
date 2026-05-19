const { pool } = require('../models/db');
const { verifyWebhook } = require('../services/freekassaService');
const { createMarzbanUser, getMarzbanUser, updateMarzbanUser } = require('../services/marzbanService');
const QRCode = require('qrcode');

async function handleFreekassaWebhook(req, res) {
  try {
    const params = Object.keys(req.body).length ? req.body : req.query;
    console.log('[Freekassa webhook] incoming:', JSON.stringify(params));

    const { MERCHANT_ID, AMOUNT, intid, MERCHANT_ORDER_ID, SIGN } = params;

    if (!MERCHANT_ID || !AMOUNT || !MERCHANT_ORDER_ID || !SIGN) {
      console.error('[Freekassa webhook] Missing required params');
      return res.status(200).send('NO');
    }

    if (!verifyWebhook(params)) {
      return res.status(200).send('NO');
    }

    const paymentResult = await pool.query(
      `SELECT p.*, s.plan_days, s.user_id, s.id AS sub_id
       FROM payments p
       JOIN subscriptions s ON p.subscription_id = s.id
       WHERE p.order_id = $1`,
      [MERCHANT_ORDER_ID]
    );

    if (paymentResult.rows.length === 0) {
      console.error('Webhook: order not found', MERCHANT_ORDER_ID);
      return res.status(200).send('NO');
    }

    const payment = paymentResult.rows[0];

    if (payment.status === 'paid') {
      return res.send('YES');
    }

    await pool.query(
      'UPDATE payments SET status = $1, freekassa_id = $2 WHERE order_id = $3',
      ['paid', intid, MERCHANT_ORDER_ID]
    );

    const userId = payment.user_id;
    const planDays = payment.plan_days;
    const now = new Date();
    const expireDate = new Date(now.getTime() + planDays * 24 * 60 * 60 * 1000);
    const expireTimestamp = Math.floor(expireDate.getTime() / 1000);

    const existingSubResult = await pool.query(
      `SELECT * FROM subscriptions
       WHERE user_id = $1 AND status = 'active' AND marzban_username IS NOT NULL
       ORDER BY expires_at DESC LIMIT 1`,
      [userId]
    );

    let marzbanUsername, marzbanLink;

    if (existingSubResult.rows.length > 0) {
      const existingSub = existingSubResult.rows[0];
      marzbanUsername = existingSub.marzban_username;

      const currentExpiry = new Date(existingSub.expires_at);
      const newExpiry = currentExpiry > now
        ? new Date(currentExpiry.getTime() + planDays * 24 * 60 * 60 * 1000)
        : expireDate;
      const newExpireTimestamp = Math.floor(newExpiry.getTime() / 1000);

      await updateMarzbanUser(marzbanUsername, newExpireTimestamp);

      await pool.query(
        'UPDATE subscriptions SET expires_at = $1, status = $2 WHERE id = $3',
        [newExpiry, 'active', existingSub.id]
      );

      const marzbanUser = await getMarzbanUser(marzbanUsername);
      marzbanLink = marzbanUser.subscription_url || (marzbanUser.links && marzbanUser.links[0]) || '';

      await pool.query(
        'UPDATE subscriptions SET marzban_link = $1 WHERE id = $2',
        [marzbanLink, existingSub.id]
      );

    } else {
      marzbanUsername = `vpn_${userId}_${Date.now()}`;

      const marzbanUser = await createMarzbanUser(marzbanUsername, expireTimestamp);
      marzbanLink = marzbanUser.subscription_url || (marzbanUser.links && marzbanUser.links[0]) || '';

      await pool.query(
        `UPDATE subscriptions
         SET started_at = $1, expires_at = $2, marzban_username = $3, marzban_link = $4, status = 'active'
         WHERE id = $5`,
        [now, expireDate, marzbanUsername, marzbanLink, payment.sub_id]
      );
    }

    console.log(`Webhook processed: user ${userId}, plan ${planDays} days, marzban: ${marzbanUsername}`);
    return res.send('YES');
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(200).send('NO');
  }
}

module.exports = { handleFreekassaWebhook };
