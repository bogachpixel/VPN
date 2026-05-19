document.addEventListener('DOMContentLoaded', () => {
  const navLogin = document.getElementById('navLogin');
  const navRegister = document.getElementById('navRegister');
  const navDashboard = document.getElementById('navDashboard');

  if (isLoggedIn()) {
    if (navLogin) navLogin.style.display = 'none';
    if (navRegister) navRegister.style.display = 'none';
    if (navDashboard) navDashboard.style.display = '';
  } else {
    if (navDashboard) navDashboard.style.display = 'none';
  }

  document.querySelectorAll('.buy-plan-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan;
      if (isLoggedIn()) {
        window.location.href = `/dashboard?buy=${plan}`;
      } else {
        window.location.href = `/login?plan=${plan}`;
      }
    });
  });
});
