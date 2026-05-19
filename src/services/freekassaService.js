const md5 = require('md5');

const CURRENCY = 'RUB';

function generatePaymentUrl(orderId, amount) {
  const merchantId = process.env.FREEKASSA_MERCHANT_ID;
  const secret1 = process.env.FREEKASSA_SECRET1;
  const siteUrl = process.env.SITE_URL || 'https://vpn.touchme.tech';

  const sign = md5(`${merchantId}:${amount}:${secret1}:${CURRENCY}:${orderId}`);

  const params = new URLSearchParams({
    m: merchantId,
    oa: amount,
    currency: CURRENCY,
    o: orderId,
    s: sign,
    lang: 'ru',
    us_redirect: `${siteUrl}/payment/success`,
    us_fail_redirect: `${siteUrl}/payment/fail`
  });

  return `https://pay.freekassa.ru/?${params.toString()}`;
}

function verifyWebhook(merchantId, amount, orderId, sign) {
  const secret2 = process.env.FREEKASSA_SECRET2;
  const expectedSign = md5(`${merchantId}:${amount}:${secret2}:${orderId}`);
  return sign === expectedSign;
}

module.exports = { generatePaymentUrl, verifyWebhook };
