/**
 * ==========================================================================
 * MAYA ARFA MISKIYA — PERSONAL PORTFOLIO JAVASCRIPT
 * Features: Dark Mode, Responsive Mobile Nav, Scroll Reveal,
 *           Database Diagram Interactivity, Contact Form Validation,
 *           Project Modal, and Smooth Scrolling.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
   * 1. THEME ENGINE (DARK / LIGHT MODE)
   * -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlElement = document.documentElement;
  const STORAGE_KEY = 'maya_portfolio_theme';

  // Determine initial theme: saved preference -> system preference -> default 'light'
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);
    });
  }

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Beralih ke mode terang (Light Mode)' : 'Beralih ke mode gelap (Dark Mode)'
      );
      themeToggleBtn.setAttribute(
        'title',
        theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
      );
    }
  }

  /* --------------------------------------------------------------------------
   * 2. STICKY HEADER WITH DYNAMIC BLUR & SHADOW
   * -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* --------------------------------------------------------------------------
   * 3. MOBILE HAMBURGER NAVIGATION
   * -------------------------------------------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
      hamburgerBtn.setAttribute('aria-label', isOpen ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi');
    });

    // Close menu when clicking navigation links
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          closeMobileMenu();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(event.target) &&
        !hamburgerBtn.contains(event.target)
      ) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileMenu();
        hamburgerBtn.focus();
      }
    });
  }

  function closeMobileMenu() {
    if (!navMenu || !hamburgerBtn) return;
    navMenu.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', 'Buka Menu Navigasi');
  }

  /* --------------------------------------------------------------------------
   * 4. ACTIVE SECTION NAVIGATION TRACKER
   * -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (targetLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  }
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  /* --------------------------------------------------------------------------
   * 5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   * -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target); // Unobserve once animated
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('in-view'));
  }

  /* --------------------------------------------------------------------------
   * 6. INTERACTIVE DATABASE DIAGRAM INTERACTION
   * -------------------------------------------------------------------------- */
  const dbSteps = document.querySelectorAll('.db-diagram-step');
  if (dbSteps.length > 0) {
    dbSteps.forEach((step) => {
      step.addEventListener('click', () => {
        dbSteps.forEach((s) => s.classList.remove('active'));
        step.classList.add('active');
      });
    });
  }

  /* --------------------------------------------------------------------------
   * 7. CONTACT FORM CLIENT-SIDE VALIDATION
   * -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const messageInput = document.getElementById('userMessage');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      let isValid = true;

      // Clear previous states
      clearErrors();

      // Validate Name
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal) {
        showError(nameInput, nameError, 'Nama lengkap wajib diisi.');
        isValid = false;
      } else if (nameVal.length < 2) {
        showError(nameInput, nameError, 'Nama minimal terdiri dari 2 karakter.');
        isValid = false;
      }

      // Validate Email
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        showError(emailInput, emailError, 'Alamat email wajib diisi.');
        isValid = false;
      } else if (!emailPattern.test(emailVal)) {
        showError(emailInput, emailError, 'Format email tidak valid (contoh: nama@domain.com).');
        isValid = false;
      }

      // Validate Message
      const messageVal = messageInput ? messageInput.value.trim() : '';
      if (!messageVal) {
        showError(messageInput, messageError, 'Pesan wajib diisi.');
        isValid = false;
      } else if (messageVal.length < 8) {
        showError(messageInput, messageError, 'Pesan minimal terdiri dari 8 karakter.');
        isValid = false;
      }

      if (!isValid) return;

      // Simulate sending
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Mengirim...</span>';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          // Display success feedback
          if (formStatus) {
            formStatus.className = 'form-status-msg success';
            formStatus.textContent = `Terima kasih, ${nameVal}! Pesan Anda berhasil dikirim (simulasi). Saya akan membaca pesan Anda secepatnya.`;
            formStatus.style.display = 'block';

            // Auto-hide success message after 7 seconds
            setTimeout(() => {
              formStatus.style.display = 'none';
            }, 7000);
          }

          // Reset inputs
          contactForm.reset();
        }, 800);
      }
    });

    // Real-time error dismissal on input
    [nameInput, emailInput, messageInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('input-error');
          const errorSpan = document.getElementById(input.id === 'userName' ? 'nameError' : input.id === 'userEmail' ? 'emailError' : 'messageError');
          if (errorSpan) errorSpan.textContent = '';
        });
      }
    });
  }

  function showError(input, errorElement, message) {
    if (input) input.classList.add('input-error');
    if (errorElement) errorElement.textContent = message;
  }

  function clearErrors() {
    [nameInput, emailInput, messageInput].forEach((input) => {
      if (input) input.classList.remove('input-error');
    });
    [nameError, emailError, messageError].forEach((err) => {
      if (err) err.textContent = '';
    });
    if (formStatus) {
      formStatus.style.display = 'none';
      formStatus.className = 'form-status-msg';
    }
  }
});

/* --------------------------------------------------------------------------
 * 8. PROJECT MODAL CONTROLLER (GLOBAL SCOPE)
 * -------------------------------------------------------------------------- */
function openProjectModal(title, description) {
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');

  if (modal && modalTitle && modalDesc) {
    modalTitle.textContent = title;
    modalDesc.textContent = description;
    modal.hidden = false;
    // Next frame to trigger CSS transition
    requestAnimationFrame(() => {
      modal.classList.add('open');
    });
  }
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.classList.remove('open');
    setTimeout(() => {
      modal.hidden = true;
    }, 250);
  }
}

// Modal event listeners for backdrop and escape key
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('projectModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeProjectModal);
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeProjectModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('open')) {
        closeProjectModal();
      }
    });
  }
});
