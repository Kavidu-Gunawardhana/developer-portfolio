/**
 * ============================================================================
 * JAVASCRIPT LOGIC - ALEX MORGAN PORTFOLIO
 * Features:
 * 1. Dark / Light Mode Theme Switcher with LocalStorage persistence
 * 2. Responsive Mobile Navigation Menu (Hamburger) & Keyboard Escape handling
 * 3. Interactive Project Category Filtering
 * 4. Interactive Project Preview Modal Dialog
 * 5. Interactive Contact Form Validation & Toast Notification
 * 6. Scrollspy Active Navigation Indicator
 * 7. Back-to-Top Floating Button with Smooth Scrolling
 * 8. Dynamic Hero Typing Effect
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ==========================================================================
     1. THEME SWITCHER (Dark / Light Mode)
     ========================================================================== */
  const themeToggleBtn = document.getElementById("theme-toggle");
  const storedTheme = localStorage.getItem("portfolio-theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Set initial theme based on localStorage or system preference
  const initialTheme = storedTheme || (systemPrefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", initialTheme);
  updateThemeButtonAria(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("portfolio-theme", newTheme);
      updateThemeButtonAria(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  function updateThemeButtonAria(theme) {
    if (!themeToggleBtn) return;
    const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    themeToggleBtn.setAttribute("aria-label", label);
    themeToggleBtn.setAttribute("title", label);
  }

  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");

  function toggleMobileMenu() {
    const isOpen = navbar.classList.toggle("open");
    mobileMenuToggle.classList.toggle("open", isOpen);
    mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close mobile navigation menu" : "Open mobile navigation menu"
    );
  }

  function closeMobileMenu() {
    if (navbar.classList.contains("open")) {
      navbar.classList.remove("open");
      mobileMenuToggle.classList.remove("open");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
      mobileMenuToggle.setAttribute("aria-label", "Open mobile navigation menu");
    }
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);
  }

  // Close menu when clicking any nav link
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Close menu on Escape key press
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileMenu();
      closeModal();
    }
  });

  // Close menu if window is resized above mobile breakpoint
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     3. INTERACTIVE PROJECT CATEGORY FILTERING
     ========================================================================== */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active state on buttons
      filterButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const categories = card.getAttribute("data-category") || "";
        if (filterValue === "all" || categories.includes(filterValue)) {
          card.classList.remove("hide");
          card.style.animation = "fadeIn 0.4s ease forwards";
        } else {
          card.classList.add("hide");
        }
      });
    });
  });

  /* ==========================================================================
     4. INTERACTIVE PROJECT MODAL PREVIEW
     ========================================================================== */
  const modal = document.getElementById("project-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalCloseBtn = document.getElementById("modal-close");
  const modalConfirmBtn = document.getElementById("modal-confirm");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalTag = document.getElementById("modal-tag");
  const demoTriggers = document.querySelectorAll(".demo-trigger");

  const projectDetailsMap = {
    "ShopEase E-Commerce": {
      tag: "Full-Stack E-Commerce",
      desc: "This project includes responsive product grids, real-time client-side search, a reactive cart using state management, and WCAG-compliant keyboard navigation.",
    },
    "TaskFlow Kanban": {
      tag: "Productivity App",
      desc: "TaskFlow features HTML5 drag-and-drop mechanics, persistent storage via the browser LocalStorage API, column filtering, and full ARIA status updates for screen readers.",
    },
    "SkyCast Weather App": {
      tag: "Asynchronous JavaScript",
      desc: "SkyCast queries live meteorological APIs via asynchronous fetch(), parsing JSON responses to render 5-day forecasts, temperature graphs, and weather animations.",
    },
    "PulseAI Dashboard": {
      tag: "Data Visualization",
      desc: "PulseAI visualizes server analytics using SVG rendering, interactive data toggles, customizable telemetry panels, and high-contrast accessibility themes.",
    },
  };

  function openModal(projectName) {
    if (!modal) return;
    const details = projectDetailsMap[projectName] || {
      tag: "Portfolio Showcase",
      desc: `Detailed walkthrough for ${projectName}. Fully built with semantic HTML, modern responsive CSS, and interactive vanilla JavaScript.`,
    };

    modalTitle.textContent = projectName;
    modalTag.textContent = details.tag;
    modalDesc.textContent = details.desc;

    modal.removeAttribute("hidden");
    document.body.style.overflow = "hidden"; // Prevent background scroll
    modalCloseBtn.focus();
  }

  function closeModal() {
    if (!modal || modal.hasAttribute("hidden")) return;
    modal.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }

  demoTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const projName = trigger.getAttribute("data-project");
      openModal(projName);
    });
  });

  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (modalConfirmBtn) modalConfirmBtn.addEventListener("click", closeModal);

  /* ==========================================================================
     5. INTERACTIVE CONTACT FORM VALIDATION & NOTIFICATION
     ========================================================================== */
  const contactForm = document.getElementById("contact-form");
  const nameInput = document.getElementById("user-name");
  const emailInput = document.getElementById("user-email");
  const messageInput = document.getElementById("user-message");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Clear errors on typing
  [nameInput, emailInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener("input", () => {
      input.classList.remove("input-error");
      const errEl = document.getElementById(`${input.name}-error`);
      if (errEl) errEl.textContent = "";
    });
  });

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        isValid = false;
        nameInput.classList.add("input-error");
        nameError.textContent = "Please enter your full name (at least 2 characters).";
      } else {
        nameInput.classList.remove("input-error");
        nameError.textContent = "";
      }

      // Validate Email
      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        isValid = false;
        emailInput.classList.add("input-error");
        emailError.textContent = "Please provide a valid email address (e.g., name@domain.com).";
      } else {
        emailInput.classList.remove("input-error");
        emailError.textContent = "";
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        isValid = false;
        messageInput.classList.add("input-error");
        messageError.textContent = "Message must be at least 10 characters long.";
      } else {
        messageInput.classList.remove("input-error");
        messageError.textContent = "";
      }

      if (isValid) {
        const userName = nameInput.value.trim();
        showToast(`Thank you, ${userName}! Your message was sent successfully.`);
        contactForm.reset();
      }
    });
  }

  /* ==========================================================================
     6. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  let toastTimer;

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }

  /* ==========================================================================
     7. SCROLLSPY & HEADER SCROLL EFFECT
     ========================================================================== */
  const header = document.getElementById("header");
  const backToTopBtn = document.getElementById("back-to-top");
  const sections = document.querySelectorAll("main section[id]");

  function handleScroll() {
    const scrollY = window.pageYOffset;

    // Header scroll background shadow
    if (header) {
      if (scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }

    // Scrollspy navigation highlight
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", handleScroll);

  // Back to top click event
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /* ==========================================================================
     8. DYNAMIC HERO TYPING EFFECT
     ========================================================================== */
  const typingText = document.getElementById("typing-text");
  if (typingText) {
    const phrases = [
      "modern websites",
      "accessible web applications",
      "responsive user interfaces",
      "clean & maintainable code",
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const delayBetweenPhrases = 2000;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        typingText.textContent = currentPhrase.substring(0, charIndex);
      } else {
        charIndex++;
        typingText.textContent = currentPhrase.substring(0, charIndex);
      }

      let currentSpeed = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentPhrase.length) {
        currentSpeed = delayBetweenPhrases;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        currentSpeed = 300;
      }

      setTimeout(typeLoop, currentSpeed);
    }

    // Start typing loop
    setTimeout(typeLoop, 800);
  }

  /* ==========================================================================
     9. FOOTER DYNAMIC YEAR
     ========================================================================== */
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
