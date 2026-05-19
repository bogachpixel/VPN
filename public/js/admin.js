let ADMIN_KEY = '';
let currentPage = 1;
let currentSearch = '';

/* ---- LOGIN ---- */
document.getElementById('adminLoginBtn').addEventListener('click', tryLogin);
document.getElementById('adminKeyInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') tryLogin(); });

function tryLogin() {
  const key = document.getElementById('adminKeyInput').value.trim();
  if (!key) return;
  ADMIN_KEY = key;
  loadStats(true);
}

document.getElementById('adminLogoutBtn').addEventListener('click', () => {
  ADMIN_KEY = '';
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('adminLoginScreen').style.display = 'flex';
});

/* ---- SIDEBAR NAV ---- */
document.querySelectorAll('.sidebar-link').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-link').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
    btn.classList.add('active');
    const viewId = 'view-' + btn.dataset.view;
    document.getElementById(viewId).classList.add('active');
    if (btn.dataset.view === 'users') loadUsers(1, '');
  });
});

/* ---- STATS ---- */
async function loadStats(isLogin = false) {
  try {
    const data = await adminRequest('GET', '/admin/stats');
    document.getElementById('st-users').textContent = data.totalUsers;
    document.getElementById('st-active').textContent = data.activeSubscriptions;
    document.getElementById('st-payments').textContent = data.totalPayments;
    document.getElementById('st-revenue').textContent = data.totalRevenue.toLocaleString('ru-RU') + ' ₽';
    document.getElementById('statsLoading').style.display = 'none';
    document.getElementById('statsGrid').style.display = '';

    if (isLogin) {
      document.getElementById('adminLoginScreen').style.display = 'none';
      document.getElementById('adminPanel').style.display = 'block';
    }
  } catch (err) {
    if (isLogin) {
      const al = document.getElementById('loginAlert');
      al.textContent = 'Неверный ключ или ошибка сервера';
      al.className = 'alert alert-error show';
    } else {
      document.getElementById('statsLoading').textContent = 'Ошибка загрузки: ' + err.message;
    }
    ADMIN_KEY = '';
  }
}

/* ---- USERS ---- */
document.getElementById('searchBtn').addEventListener('click', () => {
  currentSearch = document.getElementById('userSearch').value.trim();
  loadUsers(1, currentSearch);
});
document.getElementById('userSearch').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { currentSearch = e.target.value.trim(); loadUsers(1, currentSearch); }
});
document.getElementById('refreshUsersBtn').addEventListener('click', () => loadUsers(currentPage, currentSearch));

async function loadUsers(page, search) {
  currentPage = page;
  currentSearch = search;
  document.getElementById('usersLoading').style.display = 'block';
  document.getElementById('usersTableWrap').style.display = 'none';
  document.getElementById('usersPagination').innerHTML = '';

  try {
    const qs = new URLSearchParams({ page, limit: 50, search }).toString();
    const data = await adminRequest('GET', `/admin/users?${qs}`);

    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    if (!data.users.length) {
      document.getElementById('usersLoading').textContent = 'Пользователи не найдены.';
      return;
    }

    data.users.forEach(u => {
      const isActive = u.sub_status === 'active' && u.expires_at && new Date(u.expires_at) > new Date();
      const expiresStr = u.expires_at ? new Date(u.expires_at).toLocaleDateString('ru-RU') : '—';
      const contact = u.phone || u.email || '—';
      const vpnName = u.vpn_name || '<span style="color:var(--text-secondary);font-style:italic;">не задано</span>';
      const badge = isActive
        ? `<span class="badge badge-active">● Активна</span>`
        : (u.sub_status ? `<span class="badge badge-expired">Истекла</span>` : `<span class="badge badge-none">Нет</span>`);
      const paid = u.total_paid > 0 ? `<span class="badge badge-paid">${parseFloat(u.total_paid).toLocaleString('ru-RU')} ₽</span>` : '—';
      const regDate = new Date(u.created_at).toLocaleDateString('ru-RU');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="color:var(--text-secondary);">${u.id}</td>
        <td>${escHtml(contact)}</td>
        <td>${vpnName}</td>
        <td>${badge}</td>
        <td style="color:var(--text-secondary); font-size:0.78rem;">${isActive ? expiresStr : '—'}</td>
        <td>${paid}</td>
        <td style="color:var(--text-secondary); font-size:0.78rem;">${regDate}</td>
        <td>
          <button class="btn btn-ghost" style="padding:4px 10px; min-height:28px; font-size:0.75rem;" onclick="openUserDetail(${u.id})">Подробно</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('usersLoading').style.display = 'none';
    document.getElementById('usersTableWrap').style.display = 'block';

    renderPagination(data.total, data.limit, data.page);
  } catch (err) {
    document.getElementById('usersLoading').textContent = 'Ошибка: ' + err.message;
  }
}

function renderPagination(total, limit, page) {
  const pages = Math.ceil(total / limit);
  if (pages <= 1) return;
  const wrap = document.getElementById('usersPagination');
  wrap.innerHTML = '';
  const range = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) range.push(i);
  if (range[0] > 1) {
    const b = makePageBtn(1, page); wrap.appendChild(b);
    if (range[0] > 2) wrap.appendChild(Object.assign(document.createElement('span'), { textContent: '…', style: 'color:var(--text-secondary); padding:0 4px;' }));
  }
  range.forEach(i => wrap.appendChild(makePageBtn(i, page)));
  if (range[range.length-1] < pages) {
    if (range[range.length-1] < pages - 1) wrap.appendChild(Object.assign(document.createElement('span'), { textContent: '…', style: 'color:var(--text-secondary); padding:0 4px;' }));
    wrap.appendChild(makePageBtn(pages, page));
  }
  const info = document.createElement('span');
  info.style.cssText = 'color:var(--text-secondary); font-size:0.78rem; margin-left:8px;';
  info.textContent = `${total} записей`;
  wrap.appendChild(info);
}

function makePageBtn(i, current) {
  const b = document.createElement('button');
  b.textContent = i;
  b.className = 'btn ' + (i === current ? 'btn-primary' : 'btn-outline');
  b.style.cssText = 'min-height:30px; padding:4px 10px; font-size:0.78rem;';
  b.addEventListener('click', () => loadUsers(i, currentSearch));
  return b;
}

/* ---- USER DETAIL MODAL ---- */
async function openUserDetail(userId) {
  const modal = document.getElementById('detailModal');
  const content = document.getElementById('modalContent');
  modal.classList.add('open');
  content.innerHTML = '<div style="color:var(--text-secondary); padding:20px; text-align:center;">Загрузка...</div>';

  try {
    const data = await adminRequest('GET', `/admin/users/${userId}`);
    const u = data.user;

    const subsHtml = data.subscriptions.map(s => {
      const active = s.status === 'active' && new Date(s.expires_at) > new Date();
      return `<tr>
        <td>${s.id}</td>
        <td>${s.plan_days} дн.</td>
        <td>${s.status}</td>
        <td style="font-size:0.76rem;">${s.expires_at ? new Date(s.expires_at).toLocaleString('ru-RU') : '—'}</td>
        ${active ? `<td><button class="btn btn-danger" style="padding:3px 8px;min-height:26px;font-size:0.73rem;" onclick="blockSub(${u.id})">Отключить</button></td>` : '<td>—</td>'}
      </tr>`;
    }).join('') || '<tr><td colspan="5" style="color:var(--text-secondary);">Нет подписок</td></tr>';

    const paymentsHtml = data.payments.map(p => `<tr>
      <td>${p.id}</td>
      <td>${parseFloat(p.amount).toLocaleString('ru-RU')} ₽</td>
      <td>${p.status}</td>
      <td style="font-size:0.76rem;">${new Date(p.created_at).toLocaleString('ru-RU')}</td>
    </tr>`).join('') || '<tr><td colspan="4" style="color:var(--text-secondary);">Нет платежей</td></tr>';

    content.innerHTML = `
      <h2 style="font-size:1.05rem; font-weight:700; margin-bottom:18px; background:var(--holo); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">
        Пользователь #${u.id}
      </h2>

      <div class="modal-section">
        <div class="modal-section-title">Основное</div>
        <div class="key-val"><span class="k">Телефон</span><span class="v">${u.phone || '—'}</span></div>
        <div class="key-val"><span class="k">Email</span><span class="v">${u.email || '—'}</span></div>
        <div class="key-val"><span class="k">Имя VPN</span><span class="v" style="color:var(--neon-cyan);">${u.vpn_name || '<em style="color:var(--text-secondary)">не задано</em>'}</span></div>
        <div class="key-val"><span class="k">Регистрация</span><span class="v">${new Date(u.created_at).toLocaleString('ru-RU')}</span></div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Подписки</div>
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead><tr><th>#</th><th>Тариф</th><th>Статус</th><th>Истекает</th><th></th></tr></thead>
            <tbody>${subsHtml}</tbody>
          </table>
        </div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Платежи</div>
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead><tr><th>#</th><th>Сумма</th><th>Статус</th><th>Дата</th></tr></thead>
            <tbody>${paymentsHtml}</tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) {
    content.innerHTML = `<div class="alert alert-error show">Ошибка: ${escHtml(err.message)}</div>`;
  }
}

async function blockSub(userId) {
  if (!confirm('Отключить все активные подписки этого пользователя?')) return;
  try {
    await adminRequest('POST', `/admin/users/${userId}/block`);
    alert('Подписки отключены');
    openUserDetail(userId);
    loadUsers(currentPage, currentSearch);
  } catch (err) {
    alert('Ошибка: ' + err.message);
  }
}

document.getElementById('modalCloseBtn').addEventListener('click', () => {
  document.getElementById('detailModal').classList.remove('open');
});
document.getElementById('detailModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('detailModal')) {
    document.getElementById('detailModal').classList.remove('open');
  }
});

/* ---- HELPERS ---- */
async function adminRequest(method, path) {
  const resp = await fetch('/api' + path, {
    method,
    headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY }
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error || resp.statusText);
  return data;
}

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
