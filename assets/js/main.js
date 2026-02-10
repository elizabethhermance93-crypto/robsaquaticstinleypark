const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const currentYear = document.getElementById("currentYear");
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");
const imageModal = document.getElementById("imageModal");
const closeModalButton = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const galleryButtons = [...document.querySelectorAll(".gallery-item")];
const testimonialSlider = document.getElementById("testimonialSlider");
const testimonialDots = document.getElementById("testimonialDots");

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

const sectionIds = ["home", "about", "aquarium-installment", "services", "imagery", "testimonials", "tour-360", "contact"];
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
    window.location.href = `mailto:robsaquatics@yahoo.com?subject=${subject}&body=${body}`;

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

function initializeTestimonialSlider() {
  if (!testimonialSlider) {
    return;
  }

  const track = testimonialSlider.querySelector(".testimonial-track");
  const slides = [...testimonialSlider.querySelectorAll(".testimonial-slide")];
  const prevButton = testimonialSlider.querySelector(".slider-control-prev");
  const nextButton = testimonialSlider.querySelector(".slider-control-next");
  if (!track || !slides.length || !prevButton || !nextButton) {
    return;
  }

  let pageIndex = 0;
  let pageCount = slides.length;
  let autoplayTimer = null;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setControlState = () => {
    const disableControls = pageCount <= 1;
    prevButton.disabled = disableControls;
    nextButton.disabled = disableControls;
  };

  const setActiveDot = () => {
    if (!testimonialDots) {
      return;
    }
    const dots = [...testimonialDots.querySelectorAll(".slider-dot")];
    dots.forEach((dot, index) => {
      const isActive = index === pageIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const goToPage = (newPage, animate = true) => {
    if (!pageCount) {
      return;
    }

    pageIndex = ((newPage % pageCount) + pageCount) % pageCount;
    const viewport = testimonialSlider.querySelector(".testimonial-viewport");
    const slideWidth = viewport ? viewport.clientWidth : slides[0].clientWidth;

    if (!animate) {
      track.style.transition = "none";
    }

    track.style.transform = `translateX(-${pageIndex * slideWidth}px)`;

    if (!animate) {
      requestAnimationFrame(() => {
        track.style.transition = "";
      });
    }

    setControlState();
    setActiveDot();
  };

  const rebuildDots = () => {
    if (!testimonialDots) {
      return;
    }

    testimonialDots.innerHTML = "";
    for (let i = 0; i < pageCount; i += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", `Go to testimonial page ${i + 1}`);
      dot.addEventListener("click", () => {
        goToPage(i);
      });
      testimonialDots.appendChild(dot);
    }
  };

  const recalculate = () => {
    pageCount = slides.length;
    pageIndex = Math.min(pageIndex, pageCount - 1);
    rebuildDots();
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
    if (prefersReducedMotion || pageCount <= 1) {
      return;
    }
    autoplayTimer = window.setInterval(() => {
      goToPage(pageIndex + 1);
    }, 6000);
  };

  prevButton.addEventListener("click", () => {
    goToPage(pageIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    goToPage(pageIndex + 1);
  });

  testimonialSlider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      goToPage(pageIndex - 1);
    } else if (event.key === "ArrowRight") {
      goToPage(pageIndex + 1);
    }
  });

  testimonialSlider.addEventListener("mouseenter", stopAutoplay);
  testimonialSlider.addEventListener("mouseleave", startAutoplay);
  testimonialSlider.addEventListener("focusin", stopAutoplay);
  testimonialSlider.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!testimonialSlider.contains(document.activeElement)) {
        startAutoplay();
      }
    }, 0);
  });

  let resizeDebounce = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeDebounce);
    resizeDebounce = window.setTimeout(recalculate, 120);
  });

  recalculate();
  startAutoplay();
}

initializeTestimonialSlider();
