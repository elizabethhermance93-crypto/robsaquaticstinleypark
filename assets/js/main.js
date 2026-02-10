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
