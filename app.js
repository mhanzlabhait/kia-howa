(() => {
  // Theme Toggle with localStorage persistence
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle?.querySelector(".theme-icon");

  const applyTheme = (theme) => {
    htmlEl.setAttribute("data-theme", theme);
    if (themeIcon) {
      themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    }
    try {
      localStorage.setItem("hanzla_theme", theme);
    } catch (_) {
      // Ignore storage errors in restricted environments
    }
  };

  let savedTheme = "dark";
  try {
    savedTheme = localStorage.getItem("hanzla_theme") || "dark";
  } catch (_) {
    savedTheme = "dark";
  }
  applyTheme(savedTheme);

  themeToggle?.addEventListener("click", () => {
    const current = htmlEl.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  });

  // Mobile Menu Toggle
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  menuToggle?.addEventListener("click", () => {
    const isHidden = mobileMenu.hasAttribute("hidden");
    if (isHidden) {
      mobileMenu.removeAttribute("hidden");
      menuToggle.setAttribute("aria-expanded", "true");
    } else {
      mobileMenu.setAttribute("hidden", "");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.setAttribute("hidden", "");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Hero Typewriter Effect
  const typewriterEl = document.getElementById("typewriter-text");
  const roles = [
    "Full-Stack Developer",
    "Creative Problem Solver",
    "Tech Enthusiast"
  ];
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let isDeleting = true;

  const tickTypewriter = () => {
    if (!typewriterEl) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
      typewriterEl.textContent = currentRole.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tickTypewriter, 350);
        return;
      }
      setTimeout(tickTypewriter, 45);
    } else {
      charIndex++;
      typewriterEl.textContent = currentRole.slice(0, charIndex);
      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(tickTypewriter, 1600);
        return;
      }
      setTimeout(tickTypewriter, 85);
    }
  };

  setTimeout(tickTypewriter, 1600);

  // Project Category Filters
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      projectCards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        if (match) {
          card.removeAttribute("hidden");
        } else {
          card.setAttribute("hidden", "");
        }
      });
    });
  });

  // Project Preview Modal
  const projectDetails = {
    "kia-howa": {
      badge: "Web App",
      title: "Kia Howa Web App",
      description:
        "A sleek, mobile-first status & activity hub built to make updates fast, clear, and effortless from any phone or desktop browser.",
      highlights: [
        "Mobile-first responsive design tuned for iOS & Android",
        "Glassmorphic UI cards with smooth dark & light themes",
        "Zero-dependency architecture for instant loading"
      ]
    },
    "smart-tasks": {
      badge: "Web App",
      title: "Smart Task Hub",
      description:
        "A fast productivity workspace featuring quick task entry, local persistence, and a clutter-free focus layout.",
      highlights: [
        "Instant add, complete, and filter actions",
        "Offline-friendly LocalStorage state persistence",
        "Keyboard & touch-friendly interface"
      ]
    },
    "chat-ui": {
      badge: "UI/UX",
      title: "Real-Time Chat UI",
      description:
        "A clean messaging interface crafted with fluid transitions, status indicators, and accessible contrast in both dark and light modes.",
      highlights: [
        "Smooth message transitions and typing states",
        "Adaptive layout across mobile and wide screens",
        "Accessible color tokens and focus outlines"
      ]
    },
    "dev-portfolio": {
      badge: "UI/UX",
      title: "Dev Portfolio",
      description:
        "This personal developer portfolio showcase featuring dynamic role typing, category filters, modal previews, and a working feedback form.",
      highlights: [
        "CSS custom properties for instant theme switching",
        "Interactive project filtering & preview modal",
        "Lightweight vanilla JavaScript with zero build overhead"
      ]
    }
  };

  const modal = document.getElementById("project-modal");
  const modalBadge = document.getElementById("modal-badge");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalHighlights = document.getElementById("modal-highlights");
  const modalClose = document.getElementById("modal-close");
  const modalDismiss = document.getElementById("modal-dismiss");
  const modalBackdrop = modal?.querySelector(".modal-backdrop");

  const openModal = (projectKey) => {
    const info = projectDetails[projectKey];
    if (!info || !modal) return;

    modalBadge.textContent = info.badge;
    modalTitle.textContent = info.title;
    modalDescription.textContent = info.description;
    modalHighlights.innerHTML = info.highlights
      .map((item) => `<div>✓ ${item}</div>`)
      .join("");

    modal.removeAttribute("hidden");
  };

  const closeModal = () => {
    modal?.setAttribute("hidden", "");
  };

  document.querySelectorAll(".preview-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.currentTarget.closest(".project-card");
      if (card?.dataset.project) {
        openModal(card.dataset.project);
      }
    });
  });

  modalClose?.addEventListener("click", closeModal);
  modalDismiss?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hasAttribute("hidden")) {
      closeModal();
    }
  });

  // Toast helper
  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  const showToast = (message) => {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.removeAttribute("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.setAttribute("hidden", "");
    }, 3500);
  };

  // Contact Form Handler
  const contactForm = document.getElementById("contact-form");
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("name");
    const senderName = nameInput?.value.trim() || "Friend";
    contactForm.reset();
    showToast(`Shukriya, ${senderName}! Your message has been received.`);
  });

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
