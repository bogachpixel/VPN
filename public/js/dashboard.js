document.addEventListener('DOMContentLoaded', async () => {
  if (!isLoggedIn()) {
    window.location.href = '/login';
    return;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  const userLabel = document.getElementById('userLabel');
  const subSection = document.getElementById('subSection');
  const noSubSection = document.getElementById('noSubSection');
  const loading = document.getElementById('loading');
  const renewSection = document.getElementById('renewSection');
  const buyAlert = document.getElementById('buyAlert');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      removeToken();
      window.location.href = '/';
    });
  }

  let currentVpnName = '';

  async function loadUser() {
    try {
      const user = await apiRequest('GET', '/auth/me');
      if (userLabel) {
        userLabel.textContent = user.phone || user.email || 'Пользователь';
      }
      currentVpnName = user.vpn_name || '';
      const vpnNameDisplay = document.getElementById('vpnNameDisplay');
      if (vpnNameDisplay) vpnNameDisplay.textContent = currentVpnName || 'Не задано';
    } catch {}
  }

  async function loadSubscription() {
    try {
      const data = await apiRequest('GET', '/subscription/active');

      if (loading) loading.style.display = 'none';

      if (data.hasSubscription && !data.subscription.isExpired) {
        const sub = data.subscription;

        const expiresDate = new Date(sub.expiresAt);
        const daysLeft = Math.ceil((expiresDate - new Date()) / (1000 * 60 * 60 * 24));

        const expiresEl = document.getElementById('expiresAt');
        const daysLeftEl = document.getElementById('daysLeft');
        const qrImg = document.getElementById('qrCode');
        const linkSpan = document.getElementById('marzbanLink');

        if (expiresEl) expiresEl.textContent = expiresDate.toLocaleDateString('ru-RU', {
          day: 'numeric', month: 'long', year: 'numeric'
        });

        if (daysLeftEl) daysLeftEl.textContent = `${daysLeft} дн.`;

        startCountdown(expiresDate);

        if (qrImg && sub.qrCode) {
          qrImg.src = sub.qrCode;
          qrImg.style.display = 'block';
        }

        if (linkSpan && sub.marzbanLink) {
          linkSpan.textContent = sub.marzbanLink;
        }

        if (subSection) subSection.style.display = '';
        if (noSubSection) noSubSection.style.display = 'none';
        if (renewSection) renewSection.style.display = '';

      } else {
        if (subSection) subSection.style.display = 'none';
        if (noSubSection) noSubSection.style.display = '';
        if (renewSection) renewSection.style.display = '';
      }
    } catch (err) {
      if (loading) loading.style.display = 'none';
      if (noSubSection) noSubSection.style.display = '';
    }
  }

  let paymentPollTimer = null;

  function openPaymentModal(widgetUrl) {
    const modal  = document.getElementById('paymentModal');
    const frame  = document.getElementById('paymentFrame');
    const status = document.getElementById('paymentStatus');
    if (!modal || !frame) return;
    frame.src = widgetUrl;
    if (status) status.style.display = 'none';
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    startPaymentPoll();
  }

  function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    const frame = document.getElementById('paymentFrame');
    if (modal) modal.style.display = 'none';
    if (frame) frame.src = '';
    document.body.style.overflow = '';
    if (paymentPollTimer) { clearInterval(paymentPollTimer); paymentPollTimer = null; }
  }

  function startPaymentPoll() {
    if (paymentPollTimer) clearInterval(paymentPollTimer);
    paymentPollTimer = setInterval(async () => {
      try {
        const data = await apiRequest('GET', '/subscription/active');
        if (data.hasSubscription && !data.subscription.isExpired) {
          clearInterval(paymentPollTimer); paymentPollTimer = null;
          const status = document.getElementById('paymentStatus');
          const frame  = document.getElementById('paymentFrame');
          if (status) { status.textContent = '✅ Оплата прошла! Обновляем...'; status.style.display = 'block'; }
          if (frame)  frame.style.display = 'none';
          setTimeout(() => { closePaymentModal(); window.location.reload(); }, 2000);
        }
      } catch (e) {}
    }, 3000);
  }

  async function buyPlan(planDays) {
    if (!buyAlert) return;
    hideAlert(buyAlert);
    const btn = document.getElementById('buyBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Создание платежа...'; }
    try {
      const data = await apiRequest('POST', '/payment/create', { planDays });
      if (btn) { btn.disabled = false; btn.textContent = 'Перейти к оплате →'; }
      if (data.widgetUrl) {
        openPaymentModal(data.widgetUrl);
      } else {
        window.location.href = data.paymentUrl;
      }
    } catch (err) {
      showAlert(buyAlert, err.message, 'error');
      if (btn) { btn.disabled = false; btn.textContent = 'Перейти к оплате →'; }
    }
  }

  const closeModalBtn = document.getElementById('closePaymentModal');
  if (closeModalBtn) closeModalBtn.addEventListener('click', closePaymentModal);
  const paymentBackdrop = document.getElementById('paymentModal');
  if (paymentBackdrop) paymentBackdrop.addEventListener('click', (e) => {
    if (e.target === paymentBackdrop) closePaymentModal();
  });

  let selectedPlan = 30;

  function setupPlanButtons() {
    const planBtns = document.querySelectorAll('.plan-btn');
    planBtns.forEach(btn => {
      const days = parseInt(btn.dataset.days);
      if (days === selectedPlan) btn.classList.add('selected');

      btn.addEventListener('click', () => {
        planBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedPlan = days;
      });
    });

    const buyBtn = document.getElementById('buyBtn');
    if (buyBtn) {
      buyBtn.addEventListener('click', () => buyPlan(selectedPlan));
    }
  }

  let countdownInterval = null;

  function startCountdown(expiresDate) {
    const el = document.getElementById('countdown');
    if (!el) return;
    if (countdownInterval) clearInterval(countdownInterval);

    function update() {
      const diff = expiresDate - new Date();
      if (diff <= 0) {
        el.textContent = 'Истекло';
        clearInterval(countdownInterval);
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      el.textContent = `${d}д ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }

    update();
    countdownInterval = setInterval(update, 1000);
  }

  function setupVpnNameEdit() {
    const editBtn = document.getElementById('editVpnNameBtn');
    const editBox = document.getElementById('vpnNameEditBox');
    const input = document.getElementById('vpnNameInput');
    const saveBtn = document.getElementById('saveVpnNameBtn');
    const cancelBtn = document.getElementById('cancelVpnNameBtn');
    const display = document.getElementById('vpnNameDisplay');
    const alert = document.getElementById('vpnNameAlert');
    if (!editBtn) return;

    editBtn.addEventListener('click', () => {
      if (input) input.value = currentVpnName;
      editBox.style.display = 'block';
      if (input) input.focus();
    });

    if (cancelBtn) cancelBtn.addEventListener('click', () => { editBox.style.display = 'none'; });

    if (saveBtn) saveBtn.addEventListener('click', async () => {
      const val = input.value.trim();
      if (!val) { showAlert(alert, 'Введите имя VPN', 'error'); return; }
      saveBtn.disabled = true;
      saveBtn.textContent = '...';
      try {
        await apiRequest('POST', '/auth/vpn-name', { vpnName: val });
        currentVpnName = val;
        if (display) display.textContent = val;
        editBox.style.display = 'none';
        hideAlert(alert);
      } catch (err) {
        showAlert(alert, err.message, 'error');
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Сохранить';
      }
    });
  }

  function setupCopyBtn() {
    const copyBtn = document.getElementById('copyBtn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
      const link = document.getElementById('marzbanLink')?.textContent;
      if (link) {
        navigator.clipboard.writeText(link).then(() => {
          copyBtn.textContent = 'Скопировано!';
          setTimeout(() => copyBtn.textContent = 'Копировать', 2000);
        });
      }
    });
  }

  const params = new URLSearchParams(window.location.search);
  const autoBuy = params.get('buy');
  if (autoBuy) {
    selectedPlan = parseInt(autoBuy);
  }

  await Promise.all([loadUser(), loadSubscription()]);
  setupPlanButtons();
  setupCopyBtn();
  setupVpnNameEdit();
  setupTestBtn();

  function setupTestBtn() {
    const testBtn = document.getElementById('testBtn');
    const testAlert = document.getElementById('testAlert');
    if (!testBtn) return;

    testBtn.addEventListener('click', async () => {
      hideAlert(testAlert);
      testBtn.disabled = true;
      testBtn.textContent = 'Активация...';

      try {
        await apiRequest('POST', '/subscription/test-activate', {});
        showAlert(testAlert, '✅ Тестовая подписка активирована! Обновляем страницу...', 'success');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        showAlert(testAlert, err.message, 'error');
        testBtn.disabled = false;
        testBtn.textContent = 'Активировать тест';
      }
    });
  }

});
