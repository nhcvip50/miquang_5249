/**
 * nav.js — Scroll Progress · Mobile Menu · Scroll Reveal
 * Mì Quảng 52/49
 */

// ── SCROLL PROGRESS BAR ──────────────────────────────────────
const progressBar = document.querySelector(".scroll-progress");
let rafPending = false;

function updateScrollProgress() {
  const scrollTop    = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight
                     - document.documentElement.clientHeight;
  progressBar.style.width =
    (scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0) + "%";
  rafPending = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(updateScrollProgress);
    }
    document
      .getElementById("main-nav")
      .classList.toggle("scrolled", window.scrollY > 10);
  },
  { passive: true }
);

// ── MOBILE MENU ──────────────────────────────────────────────
const menuToggle = document.getElementById("mobile-menu");
const navLinks   = document.getElementById("nav-links");
const menuIcon   = menuToggle.querySelector("i");

function closeMenu() {
  navLinks.classList.remove("active");
  menuIcon.classList.replace("fa-xmark", "fa-bars");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("active");
  menuIcon.classList.toggle("fa-bars", !isOpen);
  menuIcon.classList.toggle("fa-xmark",  isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  // Lock scroll-behind iOS khi menu đang mở
  document.body.style.overflow = isOpen ? "hidden" : "";
});

// Smooth scroll + đóng menu khi click link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href.startsWith("#")) {
      e.preventDefault();
      closeMenu();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Đóng khi click ra ngoài
document.addEventListener("click", (e) => {
  if (!navLinks.contains(e.target) && !menuToggle.contains(e.target))
    closeMenu();
});

// Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// ── SCROLL REVEAL ────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target); // Fire-once: giải phóng observer
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
