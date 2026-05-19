const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('vpn_token');
}

function setToken(token) {
  localStorage.setItem('vpn_token', token);
}

function removeToken() {
  localStorage.removeItem('vpn_token');
}

function isLoggedIn() {
  return !!getToken();
}

async function apiRequest(method, endpoint, data) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || 'Ошибка запроса');
  }

  return json;
}

function showAlert(el, message, type = 'error') {
  el.textContent = message;
  el.className = `alert alert-${type} show`;
}

function hideAlert(el) {
  el.className = 'alert';
}
