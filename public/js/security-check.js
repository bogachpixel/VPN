(function () {
  if (sessionStorage.getItem('sc_shown')) return;
  sessionStorage.setItem('sc_shown', '1');

  const style = document.createElement('style');
  style.textContent = `
    #sc-overlay {
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(4, 4, 14, 0.75);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      opacity: 1; transition: opacity 0.5s ease;
    }
    #sc-overlay.sc-hide { opacity: 0; pointer-events: none; }

    #sc-card {
      background: rgba(12, 10, 28, 0.96);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(176, 96, 255, 0.3);
      border-radius: 20px;
      padding: 32px 40px;
      text-align: center;
      box-shadow: 0 0 40px rgba(176,96,255,0.2), 0 0 80px rgba(0,229,255,0.08), 0 24px 60px rgba(0,0,0,0.6);
      min-width: 270px;
      max-width: 320px;
      transform: scale(1);
      transition: transform 0.4s cubic-bezier(.34,1.56,.64,1);
    }

    #sc-logo {
      width: 52px; height: 52px;
      background: linear-gradient(135deg, #F6821F 0%, #FBAD41 100%);
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 6px 20px rgba(246,130,31,0.45);
      font-size: 1.7rem;
    }

    #sc-brand {
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 0.78rem;
      font-weight: 600;
      color: rgba(176,96,255,0.7);
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    #sc-status {
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: #f0eeff;
      margin-bottom: 18px;
      min-height: 26px;
      letter-spacing: -0.2px;
    }

    #sc-bar-wrap {
      width: 100%;
      height: 3px;
      background: rgba(255,255,255,0.07);
      border-radius: 99px;
      overflow: hidden;
    }

    #sc-bar {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #00e5ff, #b060ff, #ff4dc4);
      border-radius: 99px;
      transition: width 1.4s cubic-bezier(.4,0,.2,1);
      box-shadow: 0 0 8px rgba(176,96,255,0.6);
    }

    #sc-check {
      display: none;
      width: 52px; height: 52px;
      background: linear-gradient(135deg, #00d68f 0%, #00e5ff 100%);
      border-radius: 50%;
      align-items: center; justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 0 20px rgba(0,214,143,0.5), 0 6px 20px rgba(0,229,255,0.3);
      font-size: 1.5rem;
      animation: sc-pop 0.4s cubic-bezier(.34,1.56,.64,1);
    }

    @keyframes sc-pop {
      from { transform: scale(0.5); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }

    #sc-sub {
      font-family: 'Inter', -apple-system, sans-serif;
      color: rgba(176,96,255,0.5) !important;
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
