/* =========================================================
   Dr. Jesús Rodríguez González — JS compartido
   Comportamientos comunes a todas las páginas. Cada bloque
   comprueba la existencia de sus elementos, así que el mismo
   archivo sirve para el Home y para las landings de sede.
   ========================================================= */

// ---- SCROLL PROGRESS BAR ----
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = (total > 0 ? window.scrollY / total * 100 : 0) + '%';
  }, { passive: true });
}

// ---- NAV SHRINK ON SCROLL ----
const navEl = document.querySelector('nav');
if (navEl) {
  window.addEventListener('scroll', () => {
    navEl.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ---- TEMA (modo oscuro persistente) ----
const themeToggle = document.getElementById('theme-toggle');
const applyTheme = theme => {
  document.body.classList.toggle('dark-mode', theme === 'dark');
  if (themeToggle) themeToggle.textContent = theme === 'dark' ? 'Modo claro' : 'Modo oscuro';
};
applyTheme(localStorage.getItem('theme') || 'light');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

// ---- REVEAL ON SCROLL ----
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(r => revealObs.observe(r));

// ---- STATS COUNTER ----
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    const update = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
    counterObs.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

// ---- CYCLING SPECIALTY TEXT ----
const specEl = document.getElementById('specialty-text');
if (specEl) {
  const specialties = ['Ortodoncia Invisible', 'Estética Dental', 'Implantología', 'Odontopediatría', 'Periodoncia'];
  let specIdx = 0;
  setInterval(() => {
    specEl.style.opacity = '0';
    specEl.style.transform = 'translateY(8px)';
    setTimeout(() => {
      specIdx = (specIdx + 1) % specialties.length;
      specEl.textContent = specialties[specIdx];
      specEl.style.opacity = '1';
      specEl.style.transform = 'translateY(0)';
    }, 380);
  }, 2800);
}

// ---- COUNTDOWN TIMER ----
const cdD = document.getElementById('cd-d');
if (cdD) {
  const cdH = document.getElementById('cd-h');
  const cdM = document.getElementById('cd-m');
  const cdS = document.getElementById('cd-s');
  const pad = n => String(n).padStart(2, '0');
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 14);
  deadline.setHours(23, 59, 59, 0);
  const tick = () => {
    const diff = deadline - new Date();
    if (diff <= 0) { cdD.closest('.countdown-wrap').innerHTML = '<span style="color:var(--blue);font-size:0.8rem;font-weight:600;">¡Oferta finalizada!</span>'; return; }
    cdD.textContent = pad(Math.floor(diff / 86400000));
    cdH.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    cdM.textContent = pad(Math.floor((diff % 3600000) / 60000));
    cdS.textContent = pad(Math.floor((diff % 60000) / 1000));
  };
  tick();
  setInterval(tick, 1000);
}

// ---- PARALLAX HERO ----
const heroPhoto = document.querySelector('.hero-photo');
if (heroPhoto) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight * 1.2) {
      heroPhoto.style.transform = 'translateY(' + (window.scrollY * 0.28) + 'px)';
    }
  }, { passive: true });
}

// ---- TOAST ----
function showToast(msg, duration = 4000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}
if (document.getElementById('toast')) {
  setTimeout(() => showToast('🦷 Plazas limitadas — reserva tu cita gratuita hoy'), 14000);
}

// ---- FORMULARIO DE CAPTACIÓN (mejora progresiva) ----
// El <form> ya tiene action + method="POST" + el hidden "sede", así que
// funciona aunque falle el JS. Aquí lo interceptamos para enviar por fetch
// y mostrar el estado de éxito sin abandonar la página.
const leadForm = document.getElementById('lead-form');
if (leadForm) {
  leadForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const errBox = document.getElementById('form-error');
    const showErr = (msg) => { if (errBox) { errBox.style.display = 'block'; errBox.textContent = msg; } };
    if (errBox) errBox.style.display = 'none';

    const data = new FormData(leadForm);
    const nombre = (data.get('nombre') || '').toString().trim();
    const telefono = (data.get('telefono') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();

    if (!nombre || !telefono || !email) {
      showErr('Por favor, rellena todos los campos obligatorios (nombre, teléfono y email).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showErr('Por favor, introduce un email válido.');
      return;
    }

    const btn = leadForm.querySelector('.btn-submit');
    const btnLabel = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }

    try {
      const payload = Object.fromEntries(data.entries());
      const response = await fetch(leadForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('server');

      const fields = document.getElementById('form-fields');
      const success = document.getElementById('form-success');
      if (fields) fields.style.display = 'none';
      if (success) {
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      showToast('✅ ¡Cita solicitada! Te confirmamos en menos de 2h.');
    } catch (e) {
      showErr('Ha ocurrido un error. Por favor, inténtalo de nuevo o llámanos por teléfono.');
      if (btn) { btn.disabled = false; btn.textContent = btnLabel; }
    }
  });
}
