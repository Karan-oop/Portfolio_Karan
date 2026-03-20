/**
 * script.js — Karan Kothari Portfolio
 * Features: Navbar toggle, smooth scroll, typing effect, scroll reveal,
 *           skill bar animation, dark/light mode, form validation,
 *           back-to-top, scroll progress indicator.
 */

/* ==========================================================================
   1. DOM Ready Helper
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initThemeToggle();
  initTypingEffect();
  initScrollReveal();
  initSkillBars();
  initScrollProgress();
  initBackToTop();
  initContactForm();
  setFooterYear();
});


/* ==========================================================================
   2. Navbar — Scroll Effect & Active Link Highlighting
   ========================================================================== */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const allLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  /* --- Scroll handler: shrink nav + highlight active link --- */
  const onScroll = () => {
    // Add scrolled class for compact navbar style
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight the nav link matching the current visible section
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    allLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentSection);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on load

  /* --- Hamburger toggle --- */
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* --- Close mobile menu when a link is clicked --- */
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* --- Close mobile menu on outside click --- */
  document.addEventListener('click', e => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ==========================================================================
   3. Dark / Light Mode Toggle
   ========================================================================== */
function initThemeToggle() {
  const btn  = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const html = document.documentElement;

  // Retrieve saved preference or fall back to 'dark'
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateIcon(savedTheme);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateIcon(next);

    // Small rotate animation on the icon
    icon.style.transform = 'rotate(360deg)';
    setTimeout(() => { icon.style.transform = ''; }, 400);
  });

  function updateIcon(theme) {
    icon.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
  }
}


/* ==========================================================================
   4. Typing Effect in Hero Section
   ========================================================================== */
function initTypingEffect() {
  const el     = document.getElementById('typed-text');
  if (!el) return;

  // Strings to cycle through
  const phrases = [
    '| Frontend Developer 🤖',
    '| Figma Designer 💻',
    '| Data Analyst🧩',
    '| Open Source Contributor 🌐',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  // Typing speeds (ms)
  const TYPE_SPEED   = 70;
  const DELETE_SPEED = 40;
  const PAUSE_AFTER  = 1800; // how long to pause after full phrase
  const PAUSE_BEFORE = 500;  // how long to pause before typing next

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      // Delete one character
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
    } else {
      // Type one character
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

    if (!isDeleting && charIndex === current.length) {
      // Finished typing — pause then start deleting
      delay = PAUSE_AFTER;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting — move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = PAUSE_BEFORE;
    }

    setTimeout(type, delay);
  }

  // Kick off with a small initial delay
  setTimeout(type, 600);
}


/* ==========================================================================
   5. Scroll Reveal Animation (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after animate (performance)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,   // trigger when 12% visible
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}


/* ==========================================================================
   6. Skill Bars — Animate width when in view
   ========================================================================== */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill    = entry.target;
          const percent = fill.dataset.width || '0';
          // Defer slightly so CSS transition is visible
          requestAnimationFrame(() => {
            fill.style.width = `${percent}%`;
          });
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 }
  );

  fills.forEach(fill => observer.observe(fill));
}


/* ==========================================================================
   7. Scroll Progress Bar
   ========================================================================== */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = `${scrollPercent}%`;
  }, { passive: true });
}


/* ==========================================================================
   8. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.hidden = false;
      // Use rAF so 'hidden' removal and class addition happen in separate frames
      requestAnimationFrame(() => btn.classList.add('visible'));
    } else {
      btn.classList.remove('visible');
      // Hide from accessibility tree after transition
      const onTransitionEnd = () => {
        if (!btn.classList.contains('visible')) btn.hidden = true;
        btn.removeEventListener('transitionend', onTransitionEnd);
      };
      btn.addEventListener('transitionend', onTransitionEnd);
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ==========================================================================
   9. Contact Form Validation
   ========================================================================== */
function initContactForm() {
  const form          = document.getElementById('contact-form');
  if (!form) return;

  const nameInput     = document.getElementById('name');
  const emailInput    = document.getElementById('email');
  const messageInput  = document.getElementById('message');
  const submitBtn     = document.getElementById('submit-btn');
  const successDiv    = document.getElementById('form-success');

  const nameError     = document.getElementById('name-error');
  const emailError    = document.getElementById('email-error');
  const messageError  = document.getElementById('message-error');

  // Keep success message hidden until a valid submit completes.
  successDiv.hidden = true;

  /* --- Helpers --- */
  const setError = (input, errorEl, msg) => {
    input.classList.add('error');
    input.classList.remove('valid');
    errorEl.textContent = msg;
  };

  const clearError = (input, errorEl) => {
    input.classList.remove('error');
    errorEl.textContent = '';
  };

  const setValid = (input) => {
    input.classList.add('valid');
    input.classList.remove('error');
  };

  const isValidEmail = (email) => {
    // Simple RFC-like regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  };

  /* --- Live validation on blur --- */
  nameInput.addEventListener('blur', () => validateName());
  emailInput.addEventListener('blur', () => validateEmail());
  messageInput.addEventListener('blur', () => validateMessage());

  // Clear errors while user is typing
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length >= 2) { clearError(nameInput, nameError); setValid(nameInput); }
  });
  emailInput.addEventListener('input', () => {
    if (isValidEmail(emailInput.value)) { clearError(emailInput, emailError); setValid(emailInput); }
  });
  messageInput.addEventListener('input', () => {
    if (messageInput.value.trim().length >= 10) { clearError(messageInput, messageError); setValid(messageInput); }
  });

  /* --- Field validators --- */
  function validateName() {
    const val = nameInput.value.trim();
    if (!val) {
      setError(nameInput, nameError, 'Name is required.');
      return false;
    }
    if (val.length < 2) {
      setError(nameInput, nameError, 'Name must be at least 2 characters.');
      return false;
    }
    clearError(nameInput, nameError);
    setValid(nameInput);
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    if (!val) {
      setError(emailInput, emailError, 'Email address is required.');
      return false;
    }
    if (!isValidEmail(val)) {
      setError(emailInput, emailError, 'Please enter a valid email address.');
      return false;
    }
    clearError(emailInput, emailError);
    setValid(emailInput);
    return true;
  }

  function validateMessage() {
    const val = messageInput.value.trim();
    if (!val) {
      setError(messageInput, messageError, 'Message is required.');
      return false;
    }
    if (val.length < 10) {
      setError(messageInput, messageError, 'Message must be at least 10 characters.');
      return false;
    }
    clearError(messageInput, messageError);
    setValid(messageInput);
    return true;
  }

  /* --- Submit Handler --- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    successDiv.hidden = true;

    // Validate all fields
    const nameOk    = validateName();
    const emailOk   = validateEmail();
    const messageOk = validateMessage();

    if (!nameOk || !emailOk || !messageOk) {
      // Focus the first invalid field
      if (!nameOk)    nameInput.focus();
      else if (!emailOk) emailInput.focus();
      else            messageInput.focus();
      return;
    }

    // Show loading state
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    btnText.style.display    = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled       = true;

    // Simulate async form submission (replace with real endpoint if needed)
    await new Promise(resolve => setTimeout(resolve, 1600));

    // Show success message
    btnText.style.display    = 'inline-flex';
    btnLoading.style.display = 'none';
    submitBtn.disabled       = false;

    form.reset();
    [nameInput, emailInput, messageInput].forEach(el => {
      el.classList.remove('valid', 'error');
    });

    successDiv.hidden = false;
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-hide success message after 6 seconds
    setTimeout(() => { successDiv.hidden = true; }, 6000);
  });
}


/* ==========================================================================
   10. Footer Year
   ========================================================================== */
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}


/* ==========================================================================
   11. Profile Image — Tilt Effect on Mouse Move (Hero)
   ========================================================================== */
(function initTiltEffect() {
  const wrapper = document.querySelector('.image-wrapper');
  if (!wrapper) return;

  wrapper.addEventListener('mousemove', (e) => {
    const rect   = wrapper.getBoundingClientRect();
    const x      = e.clientX - rect.left - rect.width  / 2;
    const y      = e.clientY - rect.top  - rect.height / 2;
    const tiltX  = -(y / rect.height) * 12; // max 12deg tilt
    const tiltY  =  (x / rect.width)  * 12;
    wrapper.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    wrapper.style.transform = '';
  });
})();


/* ==========================================================================
   12. Project Card — Keyboard "Enter" / "Space" support for hover overlay
   ========================================================================== */
document.querySelectorAll('.project-card[tabindex]').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const link = card.querySelector('a.btn');
      if (link) link.click();
    }
  });
});
