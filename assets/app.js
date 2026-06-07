/* =================================================================
   Lógica compartida de las landings por sede (Madrid · Valladolid)
   - Animaciones de scroll / contadores / toast
   - Envío del formulario al webhook de n8n incluyendo el campo "sede"
   ================================================================= */

// ---------- Barra de progreso de scroll ----------
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });
}

// ---------- Nav encogido al hacer scroll ----------
const navEl = document.querySelector('nav');
if (navEl) {
  window.addEventListener('scroll', () => {
    navEl.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ---------- Reveal on scroll ----------
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(r => revealObs.observe(r));

// ---------- Contadores de estadísticas ----------
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.target);
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

// ---------- Parallax suave del hero ----------
const heroPhoto = document.querySelector('.hero-photo');
if (heroPhoto) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight * 1.2) {
      heroPhoto.style.transform = 'translateY(' + (window.scrollY * 0.25) + 'px)';
    }
  }, { passive: true });
}

// ---------- Toast ----------
function showToast(msg, duration = 4000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ---------- Envío del formulario ----------
const form = document.getElementById('lead-form');
if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // mejora la UX; el fallback nativo sigue disponible si el JS falla

    const data = Object.fromEntries(new FormData(form).entries());
    const sede = data.sede || 'desconocida';
    const errorEl = document.getElementById('form-error');

    // Validación básica (nombre y teléfono obligatorios; email opcional)
    if (!data.nombre?.trim() || !data.telefono?.trim()) {
      errorEl.style.display = 'block';
      errorEl.textContent = 'Por favor, rellena tu nombre y tu teléfono.';
      return;
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errorEl.style.display = 'block';
      errorEl.textContent = 'Por favor, introduce un email válido.';
      return;
    }
    // Validación de teléfono español: 9 dígitos empezando por 6, 7 o 9 (admite +34 / 0034 / espacios)
    const telLimpio = String(data.telefono).replace(/[\s\-().]/g, '').replace(/^(\+34|0034)/, '');
    if (!/^[679]\d{8}$/.test(telLimpio)) {
      errorEl.style.display = 'block';
      errorEl.textContent = 'Introduce un teléfono móvil español válido (9 dígitos, empieza por 6, 7 o 9).';
      return;
    }
    if (!form.querySelector('#f-consent')?.checked) {
      errorEl.style.display = 'block';
      errorEl.textContent = 'Debes aceptar la Política de Privacidad para continuar.';
      return;
    }

    const btn = document.getElementById('btn-submit');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    errorEl.style.display = 'none';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Se envía la "sede" junto al resto de datos para que n8n enrute el lead
        body: JSON.stringify({ ...data, sede, origen: window.location.href })
      });
      if (response.ok) {
        document.getElementById('form-fields').style.display = 'none';
        document.getElementById('form-success').style.display = 'block';
        document.getElementById('form-success').scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast('✅ ¡Cita solicitada! Te confirmamos en menos de 2h.');
      } else {
        throw new Error('Error en el servidor');
      }
    } catch {
      errorEl.style.display = 'block';
      errorEl.textContent = 'Ha ocurrido un error. Por favor, inténtalo de nuevo o llámanos al 653 112 693.';
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}
