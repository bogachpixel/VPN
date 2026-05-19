const axios = require('axios');

const MARZBAN_URL = process.env.MARZBAN_URL || 'http://142.93.107.127:8000';
let marzbanToken = null;
let tokenExpiry = null;

async function getMarzbanToken() {
  if (marzbanToken && tokenExpiry && Date.now() < tokenExpiry) {
    return marzbanToken;
  }

  const response = await axios.post(
    `${MARZBAN_URL}/api/admin/token`,
    new URLSearchParams({
      username: process.env.MARZBAN_USERNAME,
      password: process.env.MARZBAN_PASSWORD
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  marzbanToken = response.data.access_token;
  tokenExpiry = Date.now() + 25 * 60 * 1000;
  return marzbanToken;
}

async function createMarzbanUser(username, expireTimestamp) {
  const token = await getMarzbanToken();

  const response = await axios.post(
    `${MARZBAN_URL}/api/user`,
    {
      username,
      proxies: {
        shadowsocks: {}
      },
      expire: expireTimestamp,
      data_limit: 0,
      data_limit_reset_strategy: 'no_reset',
      status: 'active',
      inbounds: {}
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
}

async function getMarzbanUser(username) {
  const token = await getMarzbanToken();

  const response = await axios.get(`${MARZBAN_URL}/api/user/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
}

async function updateMarzbanUser(username, expireTimestamp) {
  const token = await getMarzbanToken();

  const response = await axios.put(
    `${MARZBAN_URL}/api/user/${username}`,
    { expire: expireTimestamp, status: 'active' },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
}

module.exports = { createMarzbanUser, getMarzbanUser, updateMarzbanUser };
