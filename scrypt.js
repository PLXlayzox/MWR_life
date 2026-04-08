/* =========================================
   MWR LIFE – JAVASCRIPT
   ========================================= */

/* ---------- NAVBAR SCROLL ---------- */
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


/* ---------- SCROLL TO FORM ---------- */
function scrollToForm() {
  const section = document.getElementById('signup');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Focus le premier champ après l'animation
    setTimeout(() => {
      document.getElementById('firstName')?.focus();
    }, 700);
  }
}


/* ---------- INTERSECTION OBSERVER (FEATURE CARDS) ---------- */
const featureCards = document.querySelectorAll('.feature-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

featureCards.forEach(card => observer.observe(card));


/* ---------- FORM VALIDATION & SUBMIT ---------- */
const form = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

function showError(fieldId, message) {
  const errorEl = document.getElementById(fieldId + 'Error');
  const inputEl = document.getElementById(fieldId);
  if (errorEl) errorEl.textContent = message;
  if (inputEl) inputEl.classList.add('error');
}

function clearError(fieldId) {
  const errorEl = document.getElementById(fieldId + 'Error');
  const inputEl = document.getElementById(fieldId);
  if (errorEl) errorEl.textContent = '';
  if (inputEl) inputEl.classList.remove('error');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Clear errors on input
['firstName', 'lastName', 'email'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => clearError(id));
});
document.getElementById('consent')?.addEventListener('change', () => {
  document.getElementById('consentError').textContent = '';
});

// Form submit
form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Reset errors
  ['firstName', 'lastName', 'email'].forEach(clearError);
  document.getElementById('consentError').textContent = '';

  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('email').value.trim();
  const consent   = document.getElementById('consent').checked;

  let valid = true;

  if (!firstName) {
    showError('firstName', 'Veuillez entrer votre prénom.');
    valid = false;
  }
  if (!lastName) {
    showError('lastName', 'Veuillez entrer votre nom.');
    valid = false;
  }
  if (!email) {
    showError('email', 'Veuillez entrer votre adresse e-mail.');
    valid = false;
  } else if (!validateEmail(email)) {
    showError('email', 'L\'adresse e-mail n\'est pas valide.');
    valid = false;
  }
  if (!consent) {
    document.getElementById('consentError').textContent = 'Vous devez accepter pour continuer.';
    valid = false;
  }

  if (!valid) return;

  // --- Simulation d'envoi (à remplacer par votre backend / Mailchimp / etc.) ---
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').style.display = 'none';
  submitBtn.querySelector('.btn-loading').style.display = 'inline';

  await simulateSend({ firstName, lastName, email });

  // Afficher le message de succès
  form.style.display = 'none';
  successMessage.style.display = 'block';

  // Optionnel: scroller vers le message
  successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
});


/* ---------- SIMULATION D'ENVOI ---------- */
// Remplacez cette fonction par un vrai appel API (Mailchimp, ConvertKit, backend PHP, etc.)
function simulateSend(data) {
  console.log('Inscription reçue :', data);
  return new Promise(resolve => setTimeout(resolve, 1500));
}


/* ---------- ANIMATION D'ENTRÉE LÉGÈRE AU SCROLL ---------- */
const fadeEls = document.querySelectorAll('.section-header, .signup-text, .main-quote');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeUp 0.8s ease both';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  fadeObserver.observe(el);
});