// ======= EDIT ME: your details =======
const WEDDING_DATE_ISO = "2026-11-15T11:43:00+05:30"; // Muhurtham start, IST
const WEDDING_END_ISO  = "2026-11-15T14:00:00+05:30"; // rough end, for calendar block
const EVENT_TITLE   = "Aswin & Lakshmi's Wedding";
const EVENT_LOCATION = "RDR Convention Centre, Edapazhanji, Thiruvananthapuram";
const EVENT_DETAILS  = "Muhurtham between 11:43 AM & 12:29 PM. Reception from 10:30 AM.";
const GREETINGS_EMAIL = "lakshmipadmanabhan2000@gmail.com";
const GALLERY_COUNT_TO_TRY = 24; // will silently skip any number that has no matching file
// ======================================

/* ---------- Falling petals ---------- */
(function initPetals() {
  const container = document.querySelector(".petals");
  if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const PETAL_COUNT = 16;
  for (let i = 0; i < PETAL_COUNT; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.style.left = Math.random() * 100 + "vw";
    const fallDuration = 9 + Math.random() * 8;
    const swayDuration = 3 + Math.random() * 2;
    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    petal.style.animationDelay = `${Math.random() * fallDuration}s, 0s`;
    petal.style.opacity = 0.4 + Math.random() * 0.4;
    petal.style.width = petal.style.height = 8 + Math.random() * 10 + "px";
    container.appendChild(petal);
  }
})();

/* ---------- Scroll reveal ---------- */
(function initReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    // threshold 0 so sections taller than the screen still trigger
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  targets.forEach((el) => observer.observe(el));

  // Safety net: anything at or above the fold gets shown outright. Without
  // this, a section skipped by an anchor jump or a restored scroll position
  // can stay stuck at opacity 0 and look like a blank page.
  const sweep = () => {
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add("visible");
        observer.unobserve(el);
      }
    });
  };
  let lastSweep = 0;
  const sweepSoon = () => {
    const now = Date.now();
    if (now - lastSweep < 100) return;
    lastSweep = now;
    sweep();
  };

  sweep();
  window.addEventListener("load", sweep);
  window.addEventListener("pageshow", sweep);
  window.addEventListener("scroll", sweepSoon, { passive: true });
  window.addEventListener("resize", sweepSoon);
  window.addEventListener("hashchange", sweepSoon);
})();

/* ---------- Countdown ---------- */
function updateCountdown() {
  const target = new Date(WEDDING_DATE_ISO).getTime();
  const now = Date.now();
  const diff = target - now;

  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs"),
  };

  if (diff <= 0) {
    els.days.textContent = "00";
    els.hours.textContent = "00";
    els.mins.textContent = "00";
    els.secs.textContent = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  els.days.textContent = String(days).padStart(2, "0");
  els.hours.textContent = String(hours).padStart(2, "0");
  els.mins.textContent = String(mins).padStart(2, "0");
  els.secs.textContent = String(secs).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------- Add to Calendar ---------- */
function toGCalFormat(isoString) {
  const d = new Date(isoString);
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

const gcalUrl =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=" + encodeURIComponent(EVENT_TITLE) +
  "&dates=" + toGCalFormat(WEDDING_DATE_ISO) + "/" + toGCalFormat(WEDDING_END_ISO) +
  "&details=" + encodeURIComponent(EVENT_DETAILS) +
  "&location=" + encodeURIComponent(EVENT_LOCATION);

document.getElementById("google-cal-btn").href = gcalUrl;

/* ---------- Reusable one-photo-at-a-time carousel ---------- */
function buildCarousel(container, srcs, opts = {}) {
  container.innerHTML = "";
  if (srcs.length === 0) {
    container.innerHTML =
      `<div class="carousel-empty"><div class="carousel-empty-icon">📷</div>${opts.emptyText || "Photos coming soon"}</div>`;
    return { destroy() {} };
  }

  const wrap = document.createElement("div");
  wrap.className = "photo-carousel";

  let index = 0;
  const imgs = srcs.map((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `${opts.altPrefix || "Photo"} ${i + 1}`;
    img.loading = "lazy";
    img.className = "carousel-slide" + (i === 0 ? " active" : "");
    if (opts.onSlideClick) img.addEventListener("click", () => opts.onSlideClick(index));
    wrap.appendChild(img);
    return img;
  });

  let timer = null;
  if (srcs.length > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.className = "carousel-arrow carousel-prev";
    prevBtn.setAttribute("aria-label", "Previous photo");
    prevBtn.innerHTML = "&#8249;";
    const nextBtn = document.createElement("button");
    nextBtn.className = "carousel-arrow carousel-next";
    nextBtn.setAttribute("aria-label", "Next photo");
    nextBtn.innerHTML = "&#8250;";
    wrap.append(prevBtn, nextBtn);

    const dotsWrap = document.createElement("div");
    dotsWrap.className = "carousel-dots";
    const dots = srcs.map((_, i) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Go to photo ${i + 1}`);
      dotsWrap.appendChild(dot);
      return dot;
    });
    wrap.appendChild(dotsWrap);

    const show = (i) => {
      index = (i + srcs.length) % srcs.length;
      imgs.forEach((im, k) => im.classList.toggle("active", k === index));
      dots.forEach((d, k) => d.classList.toggle("active", k === index));
    };
    const restartAutoplay = () => {
      clearInterval(timer);
      timer = setInterval(() => show(index + 1), opts.interval || 4500);
    };

    prevBtn.addEventListener("click", () => { show(index - 1); restartAutoplay(); });
    nextBtn.addEventListener("click", () => { show(index + 1); restartAutoplay(); });
    dots.forEach((d, i) => d.addEventListener("click", () => { show(i); restartAutoplay(); }));

    let touchStartX = null;
    wrap.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener("touchend", (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { show(index + (dx < 0 ? 1 : -1)); restartAutoplay(); }
      touchStartX = null;
    });

    wrap.addEventListener("mouseenter", () => clearInterval(timer));
    wrap.addEventListener("mouseleave", restartAutoplay);

    restartAutoplay();
  }

  container.appendChild(wrap);
  return { destroy() { clearInterval(timer); } };
}

/* ---------- Photo loading (shared by hero + gallery + lightbox) ---------- */
const galleryCarousel = document.getElementById("gallery-carousel");
const categoryCache = {}; // category -> array of loaded src strings, in order

function probeImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function loadCategory(category) {
  if (categoryCache[category]) return categoryCache[category];
  const checks = [];
  for (let i = 1; i <= GALLERY_COUNT_TO_TRY; i++) {
    checks.push(probeImage(`images/gallery/${category}/${i}.jpg`));
  }
  const results = (await Promise.all(checks)).filter(Boolean);
  categoryCache[category] = results;
  return results;
}

/* ---------- Gallery: Engagement carousel ---------- */
(async function initGallery() {
  const srcs = await loadCategory("engagement");
  buildCarousel(galleryCarousel, srcs, {
    altPrefix: "Aswin & Lakshmi — engagement",
    emptyText: "engagement photos coming soon — add them to images/gallery/engagement/ (see README.md).",
    onSlideClick: (idx) => openLightbox("engagement", idx),
    interval: 4500,
  });
})();

/* ---------- Story timeline photos ---------- */
(async function initTimelinePhotos() {
  const wraps = Array.from(document.querySelectorAll(".timeline-photo-wrap"));
  const collected = [];
  for (const wrap of wraps) {
    const src = wrap.dataset.src;
    const ok = await probeImage(src);
    if (ok) {
      const idx = collected.length;
      collected.push(src);
      const img = document.createElement("img");
      img.src = src;
      img.alt = wrap.dataset.alt || "";
      img.loading = "lazy";
      img.className = "timeline-photo";
      img.addEventListener("click", () => openLightbox("timeline", idx));
      wrap.appendChild(img);
    } else {
      wrap.innerHTML = '<div class="timeline-photo-empty" aria-hidden="true">&#129293;</div>';
    }
  }
  categoryCache.timeline = collected;
})();

/* ---------- Save-the-date video ---------- */
(async function initVideo() {
  const wrap = document.getElementById("video-wrap");
  const src = "assets/save-the-date.mp4";
  const exists = await fetch(src, { method: "HEAD" })
    .then((res) => res.ok)
    .catch(() => false);

  if (exists) {
    wrap.innerHTML =
      '<video controls playsinline preload="metadata" poster="assets/save-the-date-poster.jpg">' +
      `<source src="${src}" type="video/mp4"></video>`;
  } else {
    wrap.innerHTML =
      '<div class="video-placeholder"><div class="video-icon">🎬</div>' +
      "Our save-the-date video is on its way — check back soon!</div>";
  }
})();

/* ---------- Hero background slideshow (save-the-date photos) ---------- */
(async function initHeroBackground() {
  const hero = document.getElementById("hero");
  const bg = document.getElementById("hero-bg");
  const srcs = await loadCategory("save-the-date");
  if (srcs.length === 0) return; // keeps the plain cream hero as fallback

  const slides = srcs.map((src, i) => {
    const img = new Image();
    img.src = src;
    img.alt = "";
    img.className = i === 0 ? "active" : "";
    bg.appendChild(img);
    return img;
  });
  hero.classList.add("has-bg");

  if (slides.length < 2) return;
  let index = 0;
  setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 6000);
})();

/* ---------- Lightbox ---------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
let lightboxCategory = null;
let lightboxIndex = 0;

function openLightbox(category, index) {
  lightboxCategory = category;
  lightboxIndex = index;
  showLightboxImage();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function showLightboxImage() {
  const srcs = categoryCache[lightboxCategory] || [];
  if (!srcs.length) return;
  lightboxImg.src = srcs[lightboxIndex];
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}

function stepLightbox(delta) {
  const srcs = categoryCache[lightboxCategory] || [];
  if (!srcs.length) return;
  lightboxIndex = (lightboxIndex + delta + srcs.length) % srcs.length;
  showLightboxImage();
}

document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
document.getElementById("lightbox-prev").addEventListener("click", () => stepLightbox(-1));
document.getElementById("lightbox-next").addEventListener("click", () => stepLightbox(1));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") stepLightbox(-1);
  if (e.key === "ArrowRight") stepLightbox(1);
});

/* ---------- Send Greetings (mailto) ---------- */
document.getElementById("greet-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("g-name").value.trim();
  const message = document.getElementById("g-message").value.trim();

  const subject = `Wedding Greetings for Aswin & Lakshmi — from ${name}`;
  const body = `${message}\n\n— ${name}`;

  const mailtoLink =
    `mailto:${GREETINGS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailtoLink;
});
