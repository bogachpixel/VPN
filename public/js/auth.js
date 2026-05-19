/* ===== COUNTRIES ===== */
const COUNTRIES = [
  { flag:'🇷🇺', name:'Россия',          dial:'+7',   maxD:10, mask:'(###) ###-##-##'  },
  { flag:'🇰🇿', name:'Казахстан',       dial:'+7',   maxD:10, mask:'(###) ###-##-##'  },
  { flag:'🇧🇾', name:'Беларусь',        dial:'+375', maxD:9,  mask:'(##) ###-##-##'   },
  { flag:'🇺🇦', name:'Украина',         dial:'+380', maxD:9,  mask:'(##) ###-##-##'   },
  { flag:'🇺🇿', name:'Узбекистан',      dial:'+998', maxD:9,  mask:'(##) ###-##-##'   },
  { flag:'🇦🇿', name:'Азербайджан',     dial:'+994', maxD:9,  mask:'(##) ###-##-##'   },
  { flag:'🇬🇪', name:'Грузия',          dial:'+995', maxD:9,  mask:'(###) ##-##-##'   },
  { flag:'🇦🇲', name:'Армения',         dial:'+374', maxD:8,  mask:'(##) ##-##-##'    },
  { flag:'🇰🇬', name:'Кыргызстан',     dial:'+996', maxD:9,  mask:'(###) ###-###'    },
  { flag:'🇹🇯', name:'Таджикистан',     dial:'+992', maxD:9,  mask:'(##) ###-##-##'   },
  { flag:'🇹🇲', name:'Туркменистан',    dial:'+993', maxD:8,  mask:'(##) ##-##-##'    },
  { flag:'🇲🇩', name:'Молдова',         dial:'+373', maxD:8,  mask:'(##) ##-##-##'    },
  { flag:'🇹🇷', name:'Турция',          dial:'+90',  maxD:10, mask:'(###) ###-####'   },
  { flag:'🇦🇪', name:'ОАЭ',             dial:'+971', maxD:9,  mask:'## ###-####'      },
  { flag:'🇩🇪', name:'Германия',        dial:'+49',  maxD:11, mask:'(###) ########'   },
  { flag:'🇺🇸', name:'США',             dial:'+1',   maxD:10, mask:'(###) ###-####'   },
  { flag:'🇬🇧', name:'Великобритания',  dial:'+44',  maxD:10, mask:'#####-#####'      },
];

/* ===== PHONE FIELD SETUP ===== */
function setupPhoneField(wrapEl) {
  const btn      = wrapEl.querySelector('.country-btn');
  const flagEl   = wrapEl.querySelector('.c-flag');
  const dialEl   = wrapEl.querySelector('.c-dial');
  const dropdown = wrapEl.querySelector('.country-dropdown');
  const input    = wrapEl.querySelector('input[type="tel"]');
  if (!btn || !input) return;

  let sel = COUNTRIES[0];

  dropdown.innerHTML = COUNTRIES.map((c, i) =>
    `<button type="button" class="country-item" data-i="${i}">
      <span class="ci-flag">${c.flag}</span>
      <span class="ci-name">${c.name}</span>
      <span class="ci-dial">${c.dial}</span>
    </button>`
  ).join('');

  function fmt(raw) {
    const d = raw.replace(/\D/g, '').slice(0, sel.maxD);
    let res = '', di = 0;
    for (let i = 0; i < sel.mask.length; i++) {
      if (di >= d.length) break;
      res += sel.mask[i] === '#' ? d[di++] : sel.mask[i];
    }
    return res;
  }

  function pickCountry(c, idx) {
    sel = c;
    flagEl.textContent = c.flag;
    dialEl.textContent = c.dial;
    input.placeholder = c.mask.replace(/#/g, '_');
    input.value = '';
    dropdown.querySelectorAll('.country-item').forEach((el, i) =>
      el.classList.toggle('active', i === idx)
    );
    dropdown.style.display = 'none';
    input.focus();
  }

  pickCountry(COUNTRIES[0], 0);

  input.setAttribute('inputmode', 'tel');
  input.setAttribute('autocomplete', 'tel');

  input.addEventListener('input', () => {
    const pos = input.selectionStart;
    const old = input.value;
    const next = fmt(old);
    input.value = next;
    input.setSelectionRange(Math.max(0, pos + next.length - old.length),
                            Math.max(0, pos + next.length - old.length));
  });

  input.addEventListener('paste', (e) => {
    e.preventDefault();
    input.value = fmt((e.clipboardData || window.clipboardData).getData('text'));
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = dropdown.style.display !== 'none';
    document.querySelectorAll('.country-dropdown').forEach(d => d.style.display = 'none');
    if (!open) dropdown.style.display = 'block';
  });

  document.addEventListener('click', () => { dropdown.style.display = 'none'; });
  dropdown.addEventListener('click', (e) => e.stopPropagation());

  dropdown.querySelectorAll('.country-item').forEach((item, i) => {
    item.addEventListener('click', () => pickCountry(COUNTRIES[i], i));
  });

  wrapEl._getRaw = () => sel.dial + input.value.replace(/\D/g, '');
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

  document.querySelectorAll('.phone-field-wrap').forEach(setupPhoneField);

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
      const phoneWrap = loginForm.querySelector('.phone-field-wrap');
      const phone = phoneWrap?._getRaw ? phoneWrap._getRaw() : loginForm.querySelector('#phone')?.value.trim();
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
      const phoneWrap = registerForm.querySelector('.phone-field-wrap');
      const phone = phoneWrap?._getRaw ? phoneWrap._getRaw() : registerForm.querySelector('#phone')?.value.trim();
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
