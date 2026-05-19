/* ===== COUNTRIES ===== */
const COUNTRIES = [
  { flag:'🇷🇺', name:'Россия',                dial:'+7',    maxD:10, mask:'(###) ###-##-##'  },
  { flag:'🇰🇿', name:'Казахстан',             dial:'+7',    maxD:10, mask:'(###) ###-##-##'  },
  { flag:'🇧🇾', name:'Беларусь',              dial:'+375',  maxD:9,  mask:'(##) ###-##-##'   },
  { flag:'🇺🇦', name:'Украина',               dial:'+380',  maxD:9,  mask:'(##) ###-##-##'   },
  { flag:'🇺🇿', name:'Узбекистан',            dial:'+998',  maxD:9,  mask:'(##) ###-##-##'   },
  { flag:'🇦🇿', name:'Азербайджан',           dial:'+994',  maxD:9,  mask:'(##) ###-##-##'   },
  { flag:'🇬🇪', name:'Грузия',                dial:'+995',  maxD:9,  mask:'(###) ##-##-##'   },
  { flag:'🇦🇲', name:'Армения',               dial:'+374',  maxD:8,  mask:'(##) ##-##-##'    },
  { flag:'🇰🇬', name:'Кыргызстан',            dial:'+996',  maxD:9,  mask:'(###) ###-###'    },
  { flag:'🇹🇯', name:'Таджикистан',           dial:'+992',  maxD:9,  mask:'(##) ###-##-##'   },
  { flag:'🇹🇲', name:'Туркменистан',          dial:'+993',  maxD:8,  mask:'(##) ##-##-##'    },
  { flag:'🇲🇩', name:'Молдова',               dial:'+373',  maxD:8,  mask:'(##) ##-##-##'    },
  { flag:'🇺🇸', name:'США',                   dial:'+1',    maxD:10, mask:'(###) ###-####'   },
  { flag:'🇨🇦', name:'Канада',                dial:'+1',    maxD:10, mask:'(###) ###-####'   },
  { flag:'🇬🇧', name:'Великобритания',        dial:'+44',   maxD:10, mask:'#### ######'      },
  { flag:'🇩🇪', name:'Германия',              dial:'+49',   maxD:11, mask:'(###) ########'   },
  { flag:'🇫🇷', name:'Франция',               dial:'+33',   maxD:9,  mask:'# ## ## ## ##'    },
  { flag:'��🇹', name:'Италия',                dial:'+39',   maxD:10, mask:'### ### ####'     },
  { flag:'�🇸', name:'Испания',               dial:'+34',   maxD:9,  mask:'### ### ###'      },
  { flag:'🇹�🇷', name:'Турция',                dial:'+90',   maxD:10, mask:'(###) ### ####'   },
  { flag:'🇦🇪', name:'ОАЭ',                   dial:'+971',  maxD:9,  mask:'## ### ####'      },
  { flag:'��', name:'Саудовская Аравия',     dial:'+966',  maxD:9,  mask:'## ### ####'      },
  { flag:'🇨🇳', name:'Китай',                 dial:'+86',   maxD:11, mask:'### #### ####'    },
  { flag:'��', name:'Индия',                 dial:'+91',   maxD:10, mask:'##### #####'      },
  { flag:'🇯🇵', name:'Япония',                dial:'+81',   maxD:10, mask:'##-####-####'     },
  { flag:'🇧🇷', name:'Бразилия',              dial:'+55',   maxD:11, mask:'(##) #####-####'  },
  { flag:'🇦🇺', name:'Австралия',             dial:'+61',   maxD:9,  mask:'### ### ###'      },
  { flag:'🇦🇫', name:'Афганистан',            dial:'+93',   maxD:9  },
  { flag:'🇦🇱', name:'Албания',               dial:'+355',  maxD:9  },
  { flag:'🇩🇿', name:'Алжир',                 dial:'+213',  maxD:9  },
  { flag:'🇦🇩', name:'Андорра',               dial:'+376',  maxD:6  },
  { flag:'🇦🇴', name:'Ангола',                dial:'+244',  maxD:9  },
  { flag:'🇦🇬', name:'Антигуа и Барбуда',     dial:'+1268', maxD:7  },
  { flag:'🇦🇷', name:'Аргентина',             dial:'+54',   maxD:10 },
  { flag:'🇦🇹', name:'Австрия',               dial:'+43',   maxD:10 },
  { flag:'�🇸', name:'Багамы',                dial:'+1242', maxD:7  },
  { flag:'🇧🇭', name:'Бахрейн',               dial:'+973',  maxD:8  },
  { flag:'🇧🇩', name:'Бангладеш',             dial:'+880',  maxD:10 },
  { flag:'🇧🇧', name:'Барбадос',              dial:'+1246', maxD:7  },
  { flag:'🇧🇿', name:'Белиз',                 dial:'+501',  maxD:7  },
  { flag:'🇧🇯', name:'Бенин',                 dial:'+229',  maxD:8  },
  { flag:'🇧🇹', name:'Бутан',                 dial:'+975',  maxD:8  },
  { flag:'🇧🇴', name:'Боливия',               dial:'+591',  maxD:8  },
  { flag:'🇧🇦', name:'Босния и Герцеговина',  dial:'+387',  maxD:8  },
  { flag:'🇧🇼', name:'Ботсвана',              dial:'+267',  maxD:8  },
  { flag:'🇧🇳', name:'Бруней',                dial:'+673',  maxD:7  },
  { flag:'🇧�🇬', name:'Болгария',              dial:'+359',  maxD:9  },
  { flag:'🇧🇫', name:'Буркина-Фасо',          dial:'+226',  maxD:8  },
  { flag:'🇧🇮', name:'Бурунди',               dial:'+257',  maxD:8  },
  { flag:'🇨🇻', name:'Кабо-Верде',            dial:'+238',  maxD:7  },
  { flag:'🇰🇭', name:'Камбоджа',              dial:'+855',  maxD:9  },
  { flag:'🇨🇲', name:'Камерун',               dial:'+237',  maxD:9  },
  { flag:'🇨🇫', name:'ЦАР',                   dial:'+236',  maxD:8  },
  { flag:'🇹🇩', name:'Чад',                   dial:'+235',  maxD:8  },
  { flag:'🇨🇱', name:'Чили',                  dial:'+56',   maxD:9  },
  { flag:'🇨🇴', name:'Колумбия',              dial:'+57',   maxD:10 },
  { flag:'🇰🇲', name:'Коморы',                dial:'+269',  maxD:7  },
  { flag:'🇨🇩', name:'ДР Конго',              dial:'+243',  maxD:9  },
  { flag:'🇨🇬', name:'Конго',                 dial:'+242',  maxD:9  },
  { flag:'🇨🇷', name:'Коста-Рика',            dial:'+506',  maxD:8  },
  { flag:'🇭🇷', name:'Хорватия',              dial:'+385',  maxD:9  },
  { flag:'🇨🇺', name:'Куба',                  dial:'+53',   maxD:8  },
  { flag:'🇨🇾', name:'Кипр',                  dial:'+357',  maxD:8  },
  { flag:'🇨🇿', name:'Чехия',                 dial:'+420',  maxD:9  },
  { flag:'🇩🇰', name:'Дания',                 dial:'+45',   maxD:8  },
  { flag:'🇩🇯', name:'Джибути',               dial:'+253',  maxD:8  },
  { flag:'🇩🇲', name:'Доминика',              dial:'+1767', maxD:7  },
  { flag:'🇩🇴', name:'Доминиканская Респ.',   dial:'+1809', maxD:10 },
  { flag:'🇪🇨', name:'Эквадор',               dial:'+593',  maxD:9  },
  { flag:'🇪🇬', name:'Египет',                dial:'+20',   maxD:10 },
  { flag:'🇸🇻', name:'Сальвадор',             dial:'+503',  maxD:8  },
  { flag:'🇬🇶', name:'Экватор. Гвинея',       dial:'+240',  maxD:9  },
  { flag:'🇪🇷', name:'Эритрея',               dial:'+291',  maxD:7  },
  { flag:'🇪🇪', name:'Эстония',               dial:'+372',  maxD:8  },
  { flag:'🇸🇿', name:'Эсватини',              dial:'+268',  maxD:8  },
  { flag:'🇪🇹', name:'Эфиопия',               dial:'+251',  maxD:9  },
  { flag:'🇫🇯', name:'Фиджи',                 dial:'+679',  maxD:7  },
  { flag:'🇫🇮', name:'Финляндия',             dial:'+358',  maxD:9  },
  { flag:'🇬🇦', name:'Габон',                 dial:'+241',  maxD:8  },
  { flag:'🇬🇲', name:'Гамбия',                dial:'+220',  maxD:7  },
  { flag:'🇬🇭', name:'Гана',                  dial:'+233',  maxD:9  },
  { flag:'🇬🇷', name:'Греция',                dial:'+30',   maxD:10 },
  { flag:'🇬🇩', name:'Гренада',               dial:'+1473', maxD:7  },
  { flag:'🇬🇹', name:'Гватемала',             dial:'+502',  maxD:8  },
  { flag:'🇬🇳', name:'Гвинея',                dial:'+224',  maxD:9  },
  { flag:'🇬🇼', name:'Гвинея-Бисау',          dial:'+245',  maxD:9  },
  { flag:'🇬🇾', name:'Гайана',                dial:'+592',  maxD:7  },
  { flag:'🇭🇹', name:'Гаити',                 dial:'+509',  maxD:8  },
  { flag:'🇭🇳', name:'Гондурас',              dial:'+504',  maxD:8  },
  { flag:'🇭🇺', name:'Венгрия',               dial:'+36',   maxD:9  },
  { flag:'🇮🇸', name:'Исландия',              dial:'+354',  maxD:7  },
  { flag:'🇮🇩', name:'Индонезия',             dial:'+62',   maxD:12 },
  { flag:'🇮🇷', name:'Иран',                  dial:'+98',   maxD:10 },
  { flag:'🇮🇶', name:'Ирак',                  dial:'+964',  maxD:10 },
  { flag:'🇮🇪', name:'Ирландия',              dial:'+353',  maxD:9  },
  { flag:'🇮🇱', name:'Израиль',               dial:'+972',  maxD:9  },
  { flag:'🇯🇲', name:'Ямайка',                dial:'+1876', maxD:7  },
  { flag:'🇯🇴', name:'Иордания',              dial:'+962',  maxD:9  },
  { flag:'🇰🇪', name:'Кения',                 dial:'+254',  maxD:9  },
  { flag:'🇰🇮', name:'Кирибати',              dial:'+686',  maxD:8  },
  { flag:'🇽🇰', name:'Косово',                dial:'+383',  maxD:8  },
  { flag:'🇰🇼', name:'Кувейт',                dial:'+965',  maxD:8  },
  { flag:'🇱🇦', name:'Лаос',                  dial:'+856',  maxD:10 },
  { flag:'🇱🇻', name:'Латвия',                dial:'+371',  maxD:8  },
  { flag:'🇱🇧', name:'Ливан',                 dial:'+961',  maxD:8  },
  { flag:'🇱🇸', name:'Лесото',                dial:'+266',  maxD:8  },
  { flag:'🇱🇷', name:'Либерия',               dial:'+231',  maxD:8  },
  { flag:'🇱🇾', name:'Ливия',                 dial:'+218',  maxD:9  },
  { flag:'🇱🇮', name:'Лихтенштейн',           dial:'+423',  maxD:7  },
  { flag:'🇱🇹', name:'Литва',                 dial:'+370',  maxD:8  },
  { flag:'🇱🇺', name:'Люксембург',            dial:'+352',  maxD:9  },
  { flag:'🇲🇬', name:'Мадагаскар',            dial:'+261',  maxD:9  },
  { flag:'🇲🇼', name:'Малави',                dial:'+265',  maxD:9  },
  { flag:'🇲🇾', name:'Малайзия',              dial:'+60',   maxD:10 },
  { flag:'🇲🇻', name:'Мальдивы',              dial:'+960',  maxD:7  },
  { flag:'🇲🇱', name:'Мали',                  dial:'+223',  maxD:8  },
  { flag:'🇲🇹', name:'Мальта',                dial:'+356',  maxD:8  },
  { flag:'🇲🇭', name:'Маршалловы Острова',    dial:'+692',  maxD:7  },
  { flag:'🇲🇷', name:'Мавритания',            dial:'+222',  maxD:8  },
  { flag:'🇲🇺', name:'Маврикий',              dial:'+230',  maxD:8  },
  { flag:'🇲🇽', name:'Мексика',               dial:'+52',   maxD:10 },
  { flag:'🇫🇲', name:'Микронезия',            dial:'+691',  maxD:7  },
  { flag:'🇲🇨', name:'Монако',                dial:'+377',  maxD:8  },
  { flag:'🇲🇳', name:'Монголия',              dial:'+976',  maxD:8  },
  { flag:'🇲🇪', name:'Черногория',            dial:'+382',  maxD:8  },
  { flag:'🇲🇦', name:'Марокко',               dial:'+212',  maxD:9  },
  { flag:'🇲🇿', name:'Мозамбик',              dial:'+258',  maxD:9  },
  { flag:'🇲🇲', name:'Мьянма',                dial:'+95',   maxD:9  },
  { flag:'🇳🇦', name:'Намибия',               dial:'+264',  maxD:9  },
  { flag:'🇳🇷', name:'Науру',                 dial:'+674',  maxD:7  },
  { flag:'🇳🇵', name:'Непал',                 dial:'+977',  maxD:10 },
  { flag:'🇳🇱', name:'Нидерланды',            dial:'+31',   maxD:9  },
  { flag:'🇳🇿', name:'Новая Зеландия',        dial:'+64',   maxD:9  },
  { flag:'🇳🇮', name:'Никарагуа',             dial:'+505',  maxD:8  },
  { flag:'🇳🇪', name:'Нигер',                 dial:'+227',  maxD:8  },
  { flag:'🇳🇬', name:'Нигерия',               dial:'+234',  maxD:10 },
  { flag:'🇰🇵', name:'Северная Корея',        dial:'+850',  maxD:10 },
  { flag:'🇲🇰', name:'Северная Македония',    dial:'+389',  maxD:8  },
  { flag:'🇳🇴', name:'Норвегия',              dial:'+47',   maxD:8  },
  { flag:'🇴🇲', name:'Оман',                  dial:'+968',  maxD:8  },
  { flag:'🇵🇰', name:'Пакистан',              dial:'+92',   maxD:10 },
  { flag:'🇵🇼', name:'Палау',                 dial:'+680',  maxD:7  },
  { flag:'🇵🇸', name:'Палестина',             dial:'+970',  maxD:9  },
  { flag:'🇵🇦', name:'Панама',                dial:'+507',  maxD:8  },
  { flag:'🇵🇬', name:'Папуа — Нов. Гвинея',  dial:'+675',  maxD:8  },
  { flag:'🇵🇾', name:'Парагвай',              dial:'+595',  maxD:9  },
  { flag:'🇵🇪', name:'Перу',                  dial:'+51',   maxD:9  },
  { flag:'🇵🇭', name:'Филиппины',             dial:'+63',   maxD:10 },
  { flag:'🇵🇱', name:'Польша',                dial:'+48',   maxD:9  },
  { flag:'🇵🇹', name:'Португалия',            dial:'+351',  maxD:9  },
  { flag:'🇶🇦', name:'Катар',                 dial:'+974',  maxD:8  },
  { flag:'🇷🇴', name:'Румыния',               dial:'+40',   maxD:10 },
  { flag:'🇷🇼', name:'Руанда',                dial:'+250',  maxD:9  },
  { flag:'🇰🇳', name:'Сент-Китс и Невис',     dial:'+1869', maxD:7  },
  { flag:'🇱🇨', name:'Сент-Люсия',            dial:'+1758', maxD:7  },
  { flag:'🇻🇨', name:'Сент-Винсент',          dial:'+1784', maxD:7  },
  { flag:'🇼🇸', name:'Самоа',                 dial:'+685',  maxD:7  },
  { flag:'🇸🇲', name:'Сан-Марино',            dial:'+378',  maxD:10 },
  { flag:'🇸🇹', name:'Сан-Томе и Принсипи',   dial:'+239',  maxD:7  },
  { flag:'🇸🇳', name:'Сенегал',               dial:'+221',  maxD:9  },
  { flag:'🇷🇸', name:'Сербия',                dial:'+381',  maxD:9  },
  { flag:'🇸🇨', name:'Сейшелы',               dial:'+248',  maxD:7  },
  { flag:'🇸🇱', name:'Сьерра-Леоне',          dial:'+232',  maxD:8  },
  { flag:'🇸🇬', name:'Сингапур',              dial:'+65',   maxD:8  },
  { flag:'🇸🇰', name:'Словакия',              dial:'+421',  maxD:9  },
  { flag:'🇸🇮', name:'Словения',              dial:'+386',  maxD:8  },
  { flag:'🇸🇧', name:'Соломоновы Острова',    dial:'+677',  maxD:7  },
  { flag:'🇸🇴', name:'Сомали',                dial:'+252',  maxD:8  },
  { flag:'🇿🇦', name:'ЮАР',                   dial:'+27',   maxD:9  },
  { flag:'🇰🇷', name:'Южная Корея',           dial:'+82',   maxD:10 },
  { flag:'🇸🇸', name:'Южный Судан',           dial:'+211',  maxD:9  },
  { flag:'🇱🇰', name:'Шри-Ланка',             dial:'+94',   maxD:9  },
  { flag:'🇸🇩', name:'Судан',                 dial:'+249',  maxD:9  },
  { flag:'🇸🇷', name:'Суринам',               dial:'+597',  maxD:7  },
  { flag:'🇸🇪', name:'Швеция',                dial:'+46',   maxD:9  },
  { flag:'🇨🇭', name:'Швейцария',             dial:'+41',   maxD:9  },
  { flag:'🇸🇾', name:'Сирия',                 dial:'+963',  maxD:9  },
  { flag:'🇹🇼', name:'Тайвань',               dial:'+886',  maxD:9  },
  { flag:'🇹🇿', name:'Танзания',              dial:'+255',  maxD:9  },
  { flag:'🇹🇭', name:'Таиланд',               dial:'+66',   maxD:9  },
  { flag:'🇹🇱', name:'Восточный Тимор',       dial:'+670',  maxD:8  },
  { flag:'🇹🇬', name:'Того',                  dial:'+228',  maxD:8  },
  { flag:'🇹🇴', name:'Тонга',                 dial:'+676',  maxD:7  },
  { flag:'🇹🇹', name:'Тринидад и Тобаго',     dial:'+1868', maxD:7  },
  { flag:'🇹🇳', name:'Тунис',                 dial:'+216',  maxD:8  },
  { flag:'🇹🇻', name:'Тувалу',                dial:'+688',  maxD:6  },
  { flag:'🇺🇬', name:'Уганда',                dial:'+256',  maxD:9  },
  { flag:'🇺🇾', name:'Уругвай',               dial:'+598',  maxD:9  },
  { flag:'🇻🇺', name:'Вануату',               dial:'+678',  maxD:7  },
  { flag:'🇻🇦', name:'Ватикан',               dial:'+379',  maxD:10 },
  { flag:'🇻🇪', name:'Венесуэла',             dial:'+58',   maxD:10 },
  { flag:'🇻🇳', name:'Вьетнам',               dial:'+84',   maxD:10 },
  { flag:'🇾🇪', name:'Йемен',                 dial:'+967',  maxD:9  },
  { flag:'🇿🇲', name:'Замбия',                dial:'+260',  maxD:9  },
  { flag:'🇿🇼', name:'Зимбабве',              dial:'+263',  maxD:9  },
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

  dropdown.innerHTML =
    `<div class="country-search-wrap">
      <input type="text" class="country-search" placeholder="🔍 Поиск страны или кода..." />
    </div>
    <div class="country-list">${
      COUNTRIES.map((c, i) =>
        `<button type="button" class="country-item" data-i="${i}">
          <span class="ci-flag">${c.flag}</span>
          <span class="ci-name">${c.name}</span>
          <span class="ci-dial">${c.dial}</span>
        </button>`
      ).join('')
    }</div>`;

  const searchInput = dropdown.querySelector('.country-search');
  const countryList = dropdown.querySelector('.country-list');

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    countryList.querySelectorAll('.country-item').forEach((item, i) => {
      const c = COUNTRIES[i];
      item.style.display = (c.name.toLowerCase().includes(q) || c.dial.includes(q)) ? '' : 'none';
    });
  });

  searchInput.addEventListener('click', (e) => e.stopPropagation());
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { dropdown.style.display = 'none'; input.focus(); }
  });

  function fmt(raw) {
    const d = raw.replace(/\D/g, '').slice(0, sel.maxD);
    if (!sel.mask) return d;
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
    input.placeholder = c.mask ? c.mask.replace(/#/g, '_') : '_'.repeat(c.maxD);
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
