const { pool, logAccess } = require('../models/db');
const { generatePaymentUrl } = require('../services/freekassaService');

const PLANS = {
  7:  { price: 200, label: '7 дней' },
  14: { price: 300, label: '14 дней' },
  30: { price: 500, label: '30 дней' }
};

async function createPayment(req, res) {
  try {
    const planDays = parseInt(req.body.planDays, 10);
    const userId = req.userId;

    const plan = PLANS[planDays];
    if (!plan) {
      return res.status(400).json({ error: 'Неверный тариф' });
    }

    const subResult = await pool.query(
      'INSERT INTO subscriptions (user_id, plan_days, status) VALUES ($1, $2, $3) RETURNING id',
      [userId, planDays, 'pending']
    );

    const subscriptionId = subResult.rows[0].id;
    const orderId = `${userId}-${subscriptionId}-${Date.now()}`;

    await pool.query(
      'INSERT INTO payments (user_id, subscription_id, amount, order_id, status) VALUES ($1, $2, $3, $4, $5)',
      [userId, subscriptionId, plan.price, orderId, 'pending']
    );

    const paymentUrl = generatePaymentUrl(orderId, plan.price);
    logAccess(userId, req, 'payment_init');

    const widgetApiKey = process.env.FREEKASSA_API_KEY || '';
    const merchantId  = process.env.FREEKASSA_MERCHANT_ID;
    const widgetUrl = `https://widgets.freekassa.net?type=payment-window&lang=ru&theme=dark&api_key=${widgetApiKey}&shopID=${merchantId}&default_amount=${plan.price}&o=${orderId}`;

    return res.json({ paymentUrl, widgetUrl, orderId });
  } catch (err) {
    console.error('CreatePayment error:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function getPaymentStatus(req, res) {
  try {
    const { orderId } = req.params;
    const result = await pool.query(
      'SELECT status FROM payments WHERE order_id = $1 AND user_id = $2',
      [orderId, req.userId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Не найдено' });
    return res.json({ status: result.rows[0].status });
  } catch (err) {
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

module.exports = { createPayment, getPaymentStatus, PLANS };
