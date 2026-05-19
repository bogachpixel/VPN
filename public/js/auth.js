document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) {
    window.location.href = '/dashboard';
    return;
  }

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const alert = document.getElementById('alert');

  let usePhone = true;

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
      const phone = loginForm.querySelector('#phone')?.value.trim();
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
      const phone = registerForm.querySelector('#phone')?.value.trim();
      const email = registerForm.querySelector('#email')?.value.trim();
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
