/* ===== PHONE MASK +7 (XXX) XXX-XX-XX ===== */
function applyPhoneMask(input) {
  if (!input) return;

  input.setAttribute('placeholder', '+7 (___) ___-__-__');
  input.setAttribute('maxlength', '18');
  input.setAttribute('autocomplete', 'tel');
  input.setAttribute('inputmode', 'tel');

  function formatPhone(raw) {
    const digits = raw.replace(/\D/g, '');
    let d = digits;
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (d.startsWith('7')) d = d.slice(1);
    d = d.slice(0, 10);

    let result = '+7';
    if (d.length === 0) return result;
    result += ' (' + d.slice(0, 3);
    if (d.length < 3) return result;
    result += ')';
    if (d.length === 3) return result;
    result += ' ' + d.slice(3, 6);
    if (d.length < 6) return result;
    result += '-' + d.slice(6, 8);
    if (d.length < 8) return result;
    result += '-' + d.slice(8, 10);
    return result;
  }

  function getRawPhone(formatted) {
    return '+7' + formatted.replace(/\D/g, '').replace(/^[78]/, '');
  }

  input.addEventListener('focus', () => {
    if (!input.value) {
      input.value = '+7 (';
    }
  });

  input.addEventListener('blur', () => {
    const digits = input.value.replace(/\D/g, '');
    if (digits.length <= 1) input.value = '';
  });

  input.addEventListener('input', (e) => {
    const pos = input.selectionStart;
    const old = input.value;
    const formatted = formatPhone(old);
    input.value = formatted;
    const diff = formatted.length - old.length;
    const newPos = Math.max(0, pos + diff);
    input.setSelectionRange(newPos, newPos);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
      const val = input.value;
      const pos = input.selectionStart;
      if (pos <= 4 && val.startsWith('+7')) {
        e.preventDefault();
      }
    }
  });

  input.addEventListener('paste', (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    input.value = formatPhone(pasted);
  });

  input._getRaw = () => {
    const digits = input.value.replace(/\D/g, '');
    if (digits.length < 11) return input.value.trim();
    return '+7' + digits.slice(digits.startsWith('7') || digits.startsWith('8') ? 1 : 0);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) {
    window.location.href = '/dashboard';
    return;
  }

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const alert = document.getElementById('alert');

  let usePhone = true;

  document.querySelectorAll('input[type="tel"]').forEach(applyPhoneMask);

  function setupToggle(formEl) {
    const phoneBtn = formEl.querySelector('[data-type="phone"]');
    const emailBtn = formEl.querySelector('[data-type="email"]');
    const phoneGroup = formEl.querySelector('.phone-group');
    const emailGroup = formEl.querySelector('.email-group');

    if (!phoneBtn) return;

    phoneBtn.addEventListener('click', () => {
      usePhone = true;
      phoneBtn.classList.add('active');
      emailBtn.classList.remove('active');
      if (phoneGroup) phoneGroup.style.display = '';
      if (emailGroup) emailGroup.style.display = 'none';
    });

    emailBtn.addEventListener('click', () => {
      usePhone = false;
      emailBtn.classList.add('active');
      phoneBtn.classList.remove('active');
      if (phoneGroup) phoneGroup.style.display = 'none';
      if (emailGroup) emailGroup.style.display = '';
    });
  }

  if (loginForm) {
    setupToggle(loginForm);

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert(alert);

      const btn = loginForm.querySelector('button[type="submit"]');
      const phoneInput = loginForm.querySelector('#phone');
      const phone = phoneInput?._getRaw ? phoneInput._getRaw() : phoneInput?.value.trim();
      const email = loginForm.querySelector('#email')?.value.trim();
      const password = loginForm.querySelector('#password').value;

      btn.disabled = true;
      btn.textContent = 'Вход...';

      try {
        const body = { password };
        if (usePhone) body.phone = phone;
        else body.email = email;

        const data = await apiRequest('POST', '/auth/login', body);
        setToken(data.token);

        const params = new URLSearchParams(window.location.search);
        const plan = params.get('plan');
        if (plan) {
          window.location.href = `/dashboard?buy=${plan}`;
        } else {
          window.location.href = '/dashboard';
        }
      } catch (err) {
        showAlert(alert, err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Войти';
      }
    });
  }

  if (registerForm) {
    setupToggle(registerForm);

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert(alert);

      const btn = registerForm.querySelector('button[type="submit"]');
      const phoneInput = registerForm.querySelector('#phone');
      const phone = phoneInput?._getRaw ? phoneInput._getRaw() : phoneInput?.value.trim();
      const email = registerForm.querySelector('#email')?.value.trim();
      const vpnName = registerForm.querySelector('#vpnName')?.value.trim();
      const password = registerForm.querySelector('#password').value;
      const confirm = registerForm.querySelector('#confirm').value;

      if (password !== confirm) {
        showAlert(alert, 'Пароли не совпадают', 'error');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Регистрация...';

      try {
        const body = { password };
        if (usePhone) body.phone = phone;
        else body.email = email;
        if (vpnName) body.vpnName = vpnName;

        const data = await apiRequest('POST', '/auth/register', body);
        setToken(data.token);

        const params = new URLSearchParams(window.location.search);
        const plan = params.get('plan');
        if (plan) {
          window.location.href = `/dashboard?buy=${plan}`;
        } else {
          window.location.href = '/dashboard';
        }
      } catch (err) {
        showAlert(alert, err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Зарегистрироваться';
      }
    });
  }
});
