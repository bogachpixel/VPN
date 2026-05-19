const md5 = require('md5');

const CURRENCY = 'RUB';

function generatePaymentUrl(orderId, amount) {
  const merchantId = process.env.FREEKASSA_MERCHANT_ID;
  const secret1   = process.env.FREEKASSA_SECRET1;

  // Old stable API — sign WITHOUT currency
  const sign = md5(`${merchantId}:${amount}:${secret1}:${orderId}`);

  const params = new URLSearchParams({
    m:        merchantId,
    oa:       amount,
    currency: CURRENCY,
    o:        orderId,
    s:        sign,
    lang:     'ru',
  });

  return `https://www.free-kassa.ru/merchant/cash.php?${params.toString()}`;
}

function verifyWebhook(params) {
  const { MERCHANT_ID, AMOUNT, MERCHANT_ORDER_ID, SIGN, CUR_ID } = params;
  const secret2 = process.env.FREEKASSA_SECRET2;

  // Try both: with and without currency (API v1 vs v2)
  const sign1 = md5(`${MERCHANT_ID}:${AMOUNT}:${secret2}:${MERCHANT_ORDER_ID}`);
  const sign2 = md5(`${MERCHANT_ID}:${AMOUNT}:${secret2}:${CURRENCY}:${MERCHANT_ORDER_ID}`);

  const ok = SIGN === sign1 || SIGN === sign2;
  if (!ok) {
    console.error(`[Freekassa] Sign mismatch. Got: ${SIGN} | Expected v1: ${sign1} | v2: ${sign2}`);
    console.error(`[Freekassa] Params: MERCHANT_ID=${MERCHANT_ID} AMOUNT=${AMOUNT} ORDER=${MERCHANT_ORDER_ID}`);
  }
  return ok;
}

module.exports = { generatePaymentUrl, verifyWebhook };
