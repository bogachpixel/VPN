(function () {
  if (sessionStorage.getItem('sc_shown')) return;
  sessionStorage.setItem('sc_shown', '1');

  const style = document.createElement('style');
  style.textContent = `
    #sc-overlay {
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(15, 12, 5, 0.55);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      opacity: 1; transition: opacity 0.5s ease;
    }
    #sc-overlay.sc-hide { opacity: 0; pointer-events: none; }

    #sc-card {
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.95);
      border-radius: 22px;
      padding: 36px 44px;
      text-align: center;
      box-shadow: 0 24px 60px rgba(0,0,0,0.18);
      min-width: 280px;
      max-width: 340px;
      transform: scale(1);
      transition: transform 0.4s cubic-bezier(.34,1.56,.64,1);
    }

    #sc-logo {
      width: 56px; height: 56px;
      background: linear-gradient(135deg, #F6821F 0%, #FBAD41 100%);
      border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 18px;
      box-shadow: 0 6px 20px rgba(246,130,31,0.4);
      font-size: 1.8rem;
    }

    #sc-brand {
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 0.82rem;
      font-weight: 600;
      color: #6b7280;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 14px;
    }

    #sc-status {
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 20px;
      min-height: 28px;
      letter-spacing: -0.3px;
    }

    #sc-bar-wrap {
      width: 100%;
      height: 4px;
      background: rgba(0,0,0,0.07);
      border-radius: 99px;
      overflow: hidden;
    }

    #sc-bar {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #F6821F, #FBAD41);
      border-radius: 99px;
      transition: width 1.4s cubic-bezier(.4,0,.2,1);
    }

    #sc-check {
      display: none;
      width: 56px; height: 56px;
      background: linear-gradient(135deg, #059669 0%, #34d399 100%);
      border-radius: 50%;
      align-items: center; justify-content: center;
      margin: 0 auto 18px;
      box-shadow: 0 6px 20px rgba(5,150,105,0.4);
      font-size: 1.6rem;
      animation: sc-pop 0.4s cubic-bezier(.34,1.56,.64,1);
    }

    @keyframes sc-pop {
      from { transform: scale(0.5); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }

    #sc-sub {
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 0.82rem;
      color: #9ca3af;
      margin-top: 10px;
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'sc-overlay';
  overlay.innerHTML = `
    <div id="sc-card">
      <div id="sc-logo">☁</div>
      <div id="sc-check">✓</div>
      <div id="sc-brand">Cloudflare</div>
      <div id="sc-status">Проверка соединения...</div>
      <div id="sc-bar-wrap"><div id="sc-bar"></div></div>
      <div id="sc-sub">vpn.touchme.tech</div>
    </div>
  `;
  document.body.appendChild(overlay);

  const bar    = document.getElementById('sc-bar');
  const status = document.getElementById('sc-status');
  const logo   = document.getElementById('sc-logo');
  const check  = document.getElementById('sc-check');

  requestAnimationFrame(() => {
    bar.style.width = '100%';
  });

  setTimeout(() => {
    logo.style.display = 'none';
    check.style.display = 'flex';
    status.textContent = 'Соединение защищено';
    status.style.color = '#059669';
    bar.style.background = 'linear-gradient(90deg, #059669, #34d399)';
  }, 1500);

  setTimeout(() => {
    overlay.classList.add('sc-hide');
    setTimeout(() => overlay.remove(), 500);
  }, 2600);
})();
