const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const currentYear = document.getElementById("currentYear");
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");
const imageModal = document.getElementById("imageModal");
const closeModalButton = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const galleryButtons = [...document.querySelectorAll(".gallery-item, .imagery-card")];
const heroSlider = document.getElementById("heroSlider");
const imageryCarousel = document.getElementById("imageryCarousel");
const imageryDots = document.getElementById("imageryDots");
const testimonialCarousel = document.getElementById("testimonialCarousel");
const testimonialDots = document.getElementById("testimonialDotsPro");
const scrollTopButton = document.getElementById("scrollTopBtn");
const paymentIcons = [...document.querySelectorAll(".payment-icon")];
const themeToggle = document.getElementById("themeToggle");
const themeToggleIcon = themeToggle?.querySelector(".theme-toggle-icon");
const themeToggleLabel = themeToggle?.querySelector(".theme-toggle-label");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const themeStorageKey = "rob-aquatics-theme";
const contactRecipientEmail = "nhermanc@gmail.com";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function applyTheme(theme) {
  const resolvedTheme = theme === "dark" ? "dark" : "light";
  document.body.setAttribute("data-theme", resolvedTheme);

  // Ensure exactly one payment icon set per theme.
  paymentIcons.forEach((icon) => {
    const nextSrc = resolvedTheme === "dark"
      ? icon.dataset.darkSrc
      : icon.dataset.lightSrc;
    if (nextSrc && icon.getAttribute("src") !== nextSrc) {
      icon.setAttribute("src", nextSrc);
    }
  });

  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", resolvedTheme === "dark" ? "#0f2f3f" : "#f4f9fc");
  }

  if (!themeToggle) {
    return;
  }

  const isDark = resolvedTheme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");

  if (themeToggleLabel) {
    themeToggleLabel.textContent = isDark ? "Light" : "Dark";
  }
  if (themeToggleIcon) {
    themeToggleIcon.textContent = isDark ? "☀" : "◐";
  }
}

function initializeThemeToggle() {
  let savedTheme = "light";
  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    if (storedTheme) {
      savedTheme = storedTheme;
    }
  } catch (error) {
    savedTheme = "light";
  }

  applyTheme(savedTheme);

  if (!themeToggle) {
    return;
  }

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      window.localStorage.setItem(themeStorageKey, nextTheme);
    } catch (error) {
      // Ignore localStorage failures to avoid breaking toggle interaction.
    }
  });
}

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const sectionIds = ["home", "about", "aquarium-installment", "services", "imagery", "testimonials", "faq", "tour-360", "contact"];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if (sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        const sectionId = entry.target.id;
        navLinks.forEach((link) => {
          const isMatch = link.getAttribute("href") === `#${sectionId}`;
          link.classList.toggle("active", isMatch);
        });
      });
    },
    {
      rootMargin: "-42% 0px -45% 0px",
      threshold: 0.1
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = String(document.getElementById("name")?.value || "").trim();
    const email = String(document.getElementById("email")?.value || "").trim();
    const message = String(document.getElementById("message")?.value || "").trim();

    if (!name || !email || !message) {
      if (formFeedback) {
        formFeedback.textContent = "Please complete all fields before sending.";
        formFeedback.style.color = "#f6b4b4";
      }
      return;
    }

    const subject = encodeURIComponent(`Website inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:${contactRecipientEmail}?subject=${subject}&body=${body}`;

    if (formFeedback) {
      formFeedback.textContent = "Opening your email app now...";
      formFeedback.style.color = "#9ce6a0";
    }
  });
}

function openGalleryImage(src, altText) {
  if (!imageModal || !modalImage) {
    window.open(src, "_blank", "noopener,noreferrer");
    return;
  }

  modalImage.src = src;
  modalImage.alt = altText || "Aquarium gallery image";

  if (typeof imageModal.showModal === "function") {
    imageModal.showModal();
  } else {
    window.open(src, "_blank", "noopener,noreferrer");
  }
}

galleryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const src = button.getAttribute("data-image");
    const altText = button.getAttribute("data-alt") || "";
    if (!src) {
      return;
    }
    openGalleryImage(src, altText);
  });
});

if (closeModalButton && imageModal) {
  closeModalButton.addEventListener("click", () => {
    imageModal.close();
  });

  imageModal.addEventListener("click", (event) => {
    const clickInsideImage = event.target === modalImage;
    const clickInsideButton = event.target === closeModalButton;
    if (!clickInsideImage && !clickInsideButton) {
      imageModal.close();
    }
  });
}

function initializeFadeSlider(root) {
  if (!root) {
    return;
  }

  const slides = [...root.querySelectorAll(".hero-slide")];
  const prevButton = root.querySelector(".hero-prev");
  const nextButton = root.querySelector(".hero-next");
  const dotsContainer = root.querySelector(".hero-dots");
  if (!slides.length || !prevButton || !nextButton || !dotsContainer) {
    return;
  }

  let index = 0;
  let autoplayTimer = null;

  const setActiveSlide = (targetIndex) => {
    index = ((targetIndex % slides.length) + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === index;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", isActive ? "false" : "true");
    });

    const dots = [...dotsContainer.querySelectorAll(".slider-dot")];
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
      dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
    });
  };

  const buildDots = () => {
    dotsContainer.innerHTML = "";
    slides.forEach((_, dotIndex) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", `Go to banner slide ${dotIndex + 1}`);
      dot.addEventListener("click", () => {
        setActiveSlide(dotIndex);
      });
      dotsContainer.appendChild(dot);
    });
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (reduceMotion || slides.length <= 1) {
      return;
    }
    autoplayTimer = window.setInterval(() => {
      setActiveSlide(index + 1);
    }, 8200);
  };

  prevButton.addEventListener("click", () => setActiveSlide(index - 1));
  nextButton.addEventListener("click", () => setActiveSlide(index + 1));

  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", stopAutoplay);
  root.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!root.contains(document.activeElement)) {
        startAutoplay();
      }
    }, 0);
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      setActiveSlide(index - 1);
    } else if (event.key === "ArrowRight") {
      setActiveSlide(index + 1);
    }
  });

  buildDots();
  setActiveSlide(0);
  startAutoplay();
}

function initializeTrackSlider(config) {
  const {
    root,
    trackSelector,
    slideSelector,
    prevSelector,
    nextSelector,
    dotsContainer,
    autoplayMs,
    getItemsPerView
  } = config;

  if (!root) {
    return;
  }

  const track = root.querySelector(trackSelector);
  const slides = [...root.querySelectorAll(slideSelector)];
  const prevButton = root.querySelector(prevSelector);
  const nextButton = root.querySelector(nextSelector);
  if (!track || !slides.length || !prevButton || !nextButton) {
    return;
  }

  let pageIndex = 0;
  let pageCount = 1;
  let itemsPerView = 1;
  let autoplayTimer = null;

  const setControlState = () => {
    const shouldDisable = pageCount <= 1;
    prevButton.disabled = shouldDisable;
    nextButton.disabled = shouldDisable;
  };

  const setActiveDot = () => {
    if (!dotsContainer) {
      return;
    }
    const dots = [...dotsContainer.querySelectorAll(".slider-dot")];
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === pageIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const goToPage = (targetPage, animate = true) => {
    if (!pageCount) {
      return;
    }

    pageIndex = ((targetPage % pageCount) + pageCount) % pageCount;
    const firstSlideIndex = Math.min(pageIndex * itemsPerView, slides.length - 1);
    const targetSlide = slides[firstSlideIndex];
    if (!targetSlide) {
      return;
    }

    if (!animate) {
      track.style.transition = "none";
    }

    track.style.transform = `translateX(-${targetSlide.offsetLeft}px)`;

    if (!animate) {
      requestAnimationFrame(() => {
        track.style.transition = "";
      });
    }

    setControlState();
    setActiveDot();
  };

  const buildDots = () => {
    if (!dotsContainer) {
      return;
    }
    dotsContainer.innerHTML = "";
    for (let i = 0; i < pageCount; i += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", `Go to slide group ${i + 1}`);
      dot.addEventListener("click", () => {
        goToPage(i);
      });
      dotsContainer.appendChild(dot);
    }
  };

  const recalculate = () => {
    itemsPerView = Math.max(1, Number(getItemsPerView()));
    pageCount = Math.max(1, Math.ceil(slides.length / itemsPerView));
    pageIndex = Math.min(pageIndex, pageCount - 1);
    buildDots();
    goToPage(pageIndex, false);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (reduceMotion || pageCount <= 1 || !autoplayMs) {
      return;
    }
    autoplayTimer = window.setInterval(() => {
      goToPage(pageIndex + 1);
    }, autoplayMs);
  };

  prevButton.addEventListener("click", () => goToPage(pageIndex - 1));
  nextButton.addEventListener("click", () => goToPage(pageIndex + 1));

  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", stopAutoplay);
  root.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!root.contains(document.activeElement)) {
        startAutoplay();
      }
    }, 0);
  });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(recalculate, 120);
  });

  recalculate();
  startAutoplay();
}

function initializeScrollTopButton() {
  if (!scrollTopButton) {
    return;
  }

  const toggleButton = () => {
    const shouldShow = window.scrollY > 480;
    scrollTopButton.classList.toggle("visible", shouldShow);
  };

  window.addEventListener("scroll", toggleButton, { passive: true });
  toggleButton();

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

initializeThemeToggle();
initializeFadeSlider(heroSlider);
initializeTrackSlider({
  root: imageryCarousel,
  trackSelector: ".imagery-track",
  slideSelector: ".imagery-card",
  prevSelector: ".imagery-prev",
  nextSelector: ".imagery-next",
  dotsContainer: imageryDots,
  autoplayMs: 5600,
  getItemsPerView: () => (window.innerWidth <= 820 ? 1 : 2)
});
initializeTrackSlider({
  root: testimonialCarousel,
  trackSelector: ".testimonial-track-pro",
  slideSelector: ".testimonial-panel",
  prevSelector: ".testimonial-prev",
  nextSelector: ".testimonial-next",
  dotsContainer: testimonialDots,
  autoplayMs: 6000,
  getItemsPerView: () => {
    if (window.innerWidth <= 620) {
      return 1;
    }
    if (window.innerWidth <= 1000) {
      return 2;
    }
    return 3;
  }
});
initializeScrollTopButton();
