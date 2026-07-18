/* =========================================================
   Anil & Priyanka — Romantic Website
   Interactions: floating hearts, scroll reveal, nav, quotes
   ========================================================= */

(function () {
  "use strict";

  const HEART_SVG =
    '<svg viewBox="0 0 32 29.6" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M23.6,0c-3.4,0-6.3,2.2-7.6,5.3C14.7,2.2,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,16,21.2,16,21.2s16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z"/>' +
    "</svg>";

  // 4-point sparkle / twinkle star
  const SPARKLE_SVG =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"/>' +
    "</svg>";

  /* -----------------------------------------------------
   *  Visitor Counter — free global count via Abacus API
   *  (no signup, no key needed)
   * ----------------------------------------------------- */

  // Change VISITOR_NAMESPACE to something unique to your site if you fork this.
  const VISITOR_NAMESPACE     = "anilpriyanka-lovestory";
  const VISITOR_KEY           = "visitors";
  const VISITOR_API_BASE      = "https://abacus.jasoncameron.dev";
  const VISITOR_SESSION_FLAG  = "apVisited_" + VISITOR_NAMESPACE + "_" + VISITOR_KEY;
  const VISITOR_STORAGE_KEY   = "apLastKnownCount";

  async function fetchVisitorCount() {
    // Only count once per browser session — subsequent page navigations
    // just read the current value.
    const alreadyCounted = sessionStorage.getItem(VISITOR_SESSION_FLAG);
    const endpoint = alreadyCounted ? "/get/" : "/hit/";
    const url = VISITOR_API_BASE + endpoint + VISITOR_NAMESPACE + "/" + VISITOR_KEY;

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Counter API returned " + res.status);
      const data = await res.json();
      const value = typeof data.value === "number" ? data.value : parseInt(data.value, 10);
      if (isNaN(value)) throw new Error("Counter API returned non-numeric value");
      if (!alreadyCounted) sessionStorage.setItem(VISITOR_SESSION_FLAG, "1");
      // Cache last-known count so a repeat visitor sees something instantly even if offline
      try { localStorage.setItem(VISITOR_STORAGE_KEY, String(value)); } catch (e) {}
      return value;
    } catch (e) {
      console.warn("[Visitor] counter unavailable:", e.message);
      return null;
    }
  }

  function animateCount(el, target, duration) {
    duration = duration || 1500;
    const startVal = parseInt(el.textContent.replace(/[^0-9]/g, ""), 10) || 0;
    const delta    = target - startVal;
    const startTime = performance.now();

    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(startVal + delta * eased);
      el.textContent = value.toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  async function initVisitorCount() {
    const els = document.querySelectorAll(".visitor-count");
    if (els.length === 0) return;

    // Show cached number instantly (nice UX while API loads)
    let cached = null;
    try { cached = parseInt(localStorage.getItem(VISITOR_STORAGE_KEY), 10); } catch (e) {}
    if (cached && !isNaN(cached)) {
      els.forEach((el) => { el.textContent = cached.toLocaleString(); });
    }

    const count = await fetchVisitorCount();

    if (count === null) {
      // Counter offline: hide widgets so page doesn't show a broken counter
      if (!cached) {
        document.querySelectorAll(".visitor-widget").forEach((w) => {
          w.classList.add("visitor-widget-hidden");
        });
      }
      return;
    }

    els.forEach((el) => animateCount(el, count, 1500));
    document.querySelectorAll(".visitor-widget").forEach((w) => {
      w.classList.add("visitor-widget-ready");
    });
  }

  /* -----------------------------------------------------
   *  Shared Layout — Nav & Footer injection
   *  Pages just need <div id="nav-placeholder"></div>
   *  and     <div id="footer-placeholder"></div>
   * ----------------------------------------------------- */

  // Site pages in visit order (drives prev/next navigation too)
  const PAGES = [
    { file: "index.html",   label: "Home",         short: "Home"     },
    { file: "story.html",   label: "Our Story",    short: "Story"    },
    { file: "journey.html", label: "Journey",      short: "Journey"  },
    { file: "moment.html",  label: "This Moment",  short: "Moment"   },
    { file: "gallery.html", label: "Gallery",      short: "Gallery"  },
    { file: "notes.html",   label: "Love Notes",   short: "Notes"    },
    { file: "wishes.html",  label: "Send Love",    short: "Wishes"   }
  ];

  function currentPageFile() {
    let path = window.location.pathname;
    let file = path.substring(path.lastIndexOf("/") + 1);
    if (!file || file === "") file = "index.html";
    return file;
  }

  function buildNav() {
    const current = currentPageFile();
    const linksHTML = PAGES.map((p) => {
      const active = p.file === current ? " active" : "";
      return '<li><a href="' + p.file + '" class="nav-link' + active + '">' + p.label + '</a></li>';
    }).join("");

    return (
      '<nav class="navbar">' +
        '<a href="index.html" class="nav-logo">A &amp; P</a>' +
        '<ul class="nav-links">' + linksHTML + '</ul>' +
        '<button class="nav-toggle" aria-label="Toggle menu">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</nav>'
    );
  }

  function buildFooter() {
    return (
      '<footer class="footer">' +
        '<div class="footer-heart" aria-hidden="true">' +
          '<svg viewBox="0 0 32 29.6"><path d="M23.6,0c-3.4,0-6.3,2.2-7.6,5.3C14.7,2.2,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,16,21.2,16,21.2s16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z"/></svg>' +
        '</div>' +
        '<p class="footer-names">Anil &amp; Priyanka</p>' +
        '<p class="footer-tagline">Every love story is beautiful &mdash; but ours is my favourite.</p>' +

        '<div class="footer-visitor visitor-widget" role="status" aria-live="polite">' +
          '<svg class="footer-visitor-icon" viewBox="0 0 32 29.6" aria-hidden="true">' +
            '<path d="M23.6,0c-3.4,0-6.3,2.2-7.6,5.3C14.7,2.2,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,16,21.2,16,21.2s16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z"/>' +
          '</svg>' +
          '<span class="visitor-count">0</span>' +
          '<span class="footer-visitor-label"> loving souls have visited us</span>' +
        '</div>' +

        '<p class="footer-copy">Made with love <span aria-hidden="true">&#9825;</span></p>' +
      '</footer>'
    );
  }

  function buildPageNav() {
    const current = currentPageFile();
    const idx = PAGES.findIndex((p) => p.file === current);
    if (idx === -1) return "";

    const prev = PAGES[(idx - 1 + PAGES.length) % PAGES.length];
    const next = PAGES[(idx + 1) % PAGES.length];

    return (
      '<nav class="page-nav" aria-label="Section navigation">' +
        '<a href="' + prev.file + '" class="page-nav-link prev">' +
          '<span class="page-nav-arrow">&larr;</span>' +
          '<span class="page-nav-text">' +
            '<span class="page-nav-label">Previous</span>' +
            '<span class="page-nav-title">' + prev.label + '</span>' +
          '</span>' +
        '</a>' +
        '<a href="' + next.file + '" class="page-nav-link next">' +
          '<span class="page-nav-text">' +
            '<span class="page-nav-label">Next</span>' +
            '<span class="page-nav-title">' + next.label + '</span>' +
          '</span>' +
          '<span class="page-nav-arrow">&rarr;</span>' +
        '</a>' +
      '</nav>'
    );
  }

  function renderLayout() {
    const navSlot = document.getElementById("nav-placeholder");
    if (navSlot) navSlot.outerHTML = buildNav();

    const footerSlot = document.getElementById("footer-placeholder");
    if (footerSlot) footerSlot.outerHTML = buildFooter();

    const pageNavSlot = document.getElementById("page-nav-placeholder");
    if (pageNavSlot) pageNavSlot.outerHTML = buildPageNav();
  }

  /* -----------------------------------------------------
   *  Floating hearts
   * ----------------------------------------------------- */
  function spawnHeart() {
    const container = document.querySelector(".hearts-container");
    if (!container) return;

    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.innerHTML = HEART_SVG;

    const size = Math.random() * 16 + 12; // 12–28px
    const duration = Math.random() * 6 + 8; // 8–14s
    const startX = Math.random() * 100; // vw
    const drift = (Math.random() - 0.5) * 40; // -20..20 vw

    heart.style.width = size + "px";
    heart.style.height = size + "px";
    heart.style.left = startX + "vw";
    heart.style.animationDuration = duration + "s";
    heart.style.setProperty("--drift", drift + "vw");
    heart.style.transform = "translateX(0)";

    // Randomly tint some hearts gold or deep rose
    const roll = Math.random();
    if (roll > 0.85) heart.style.color = "#d4af37";
    else if (roll > 0.6) heart.style.color = "#c2185b";

    container.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000 + 500);
  }

  function startHearts() {
    // Respect reduced-motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Spawn every ~700ms
    setInterval(spawnHeart, 700);
    // Seed a few at once so it looks alive immediately
    for (let i = 0; i < 4; i++) setTimeout(spawnHeart, i * 250);
  }

  /* -----------------------------------------------------
   *  Hero sparkles — golden twinkles around the names
   * ----------------------------------------------------- */
  function spawnSparkle() {
    const field = document.querySelector(".hero-sparkles");
    if (!field) return;

    const rect = field.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return; // off-screen

    const s = document.createElement("div");
    s.className = "sparkle";
    s.innerHTML = SPARKLE_SVG;

    const size = Math.random() * 12 + 6; // 6-18px
    // Concentrate around the middle 70% both axes for a "halo" feel
    const x = 15 + Math.random() * 70; // %
    const y = 25 + Math.random() * 50; // %
    const delay = Math.random() * 0.4;

    s.style.width = size + "px";
    s.style.height = size + "px";
    s.style.left = x + "%";
    s.style.top = y + "%";
    s.style.animationDelay = delay + "s";

    // Mostly gold, occasional white and rose accents
    const roll = Math.random();
    if (roll > 0.85) s.style.color = "#ffffff";
    else if (roll > 0.7) s.style.color = "#ff9dc0";
    else s.style.color = "#e8c96f";

    field.appendChild(s);
    setTimeout(() => s.remove(), 2800);
  }

  function startSparkles() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Continuous twinkle
    setInterval(spawnSparkle, 220);
    // Seed a burst on load
    for (let i = 0; i < 12; i++) setTimeout(spawnSparkle, i * 80);
  }

  /* -----------------------------------------------------
   *  Reveal on scroll
   * ----------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* -----------------------------------------------------
   *  Navbar behaviour (scroll shadow + mobile toggle)
   * ----------------------------------------------------- */
  function initNav() {
    const nav = document.querySelector(".navbar");
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");

    if (nav) {
      const onScroll = () => {
        if (window.scrollY > 40) nav.classList.add("scrolled");
        else nav.classList.remove("scrolled");
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    if (toggle && links) {
      toggle.addEventListener("click", () => {
        toggle.classList.toggle("open");
        links.classList.toggle("open");
      });
      links.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          toggle.classList.remove("open");
          links.classList.remove("open");
        });
      });
    }
  }

  /* -----------------------------------------------------
   *  Quotes carousel
   * ----------------------------------------------------- */
  function initQuotes() {
    const carousel = document.querySelector(".quote-carousel");
    if (!carousel) return;

    const quotes = Array.from(carousel.querySelectorAll(".quote"));
    const prev = carousel.querySelector(".quote-btn.prev");
    const next = carousel.querySelector(".quote-btn.next");
    const dotsWrap = carousel.querySelector(".quote-dots");
    let idx = 0;
    let timer = null;

    // Build dots
    quotes.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Show quote " + (i + 1));
      if (i === 0) b.classList.add("active");
      b.addEventListener("click", () => go(i, true));
      dotsWrap.appendChild(b);
    });
    const dots = Array.from(dotsWrap.querySelectorAll("button"));

    function go(newIdx, userAction) {
      quotes[idx].classList.remove("active");
      dots[idx].classList.remove("active");
      idx = (newIdx + quotes.length) % quotes.length;
      quotes[idx].classList.add("active");
      dots[idx].classList.add("active");
      if (userAction) restart();
    }

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(() => go(idx + 1), 6500);
    }

    prev && prev.addEventListener("click", () => go(idx - 1, true));
    next && next.addEventListener("click", () => go(idx + 1, true));

    // Pause on hover
    carousel.addEventListener("mouseenter", () => timer && clearInterval(timer));
    carousel.addEventListener("mouseleave", restart);

    restart();
  }

  /* -----------------------------------------------------
   *  Hero Slideshow — auto-swaps every 3 seconds
   *  with dots for manual navigation and pause-on-hover.
   * ----------------------------------------------------- */
  const SLIDESHOW_INTERVAL = 3000; // 3 seconds — change to taste

  function initHeroSlideshow() {
    const slideshow = document.querySelector(".hero-slideshow");
    if (!slideshow) return;

    const slides = slideshow.querySelectorAll(".slide");
    const dotsContainer = slideshow.querySelector(".slideshow-dots");
    if (slides.length === 0 || !dotsContainer) return;

    let currentIdx = 0;
    let timer = null;

    // Build dots for manual navigation
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "slideshow-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Show photo " + (i + 1));
      dot.addEventListener("click", () => {
        goToSlide(i);
        restart();
      });
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll(".slideshow-dot");

    function goToSlide(idx) {
      slides[currentIdx].classList.remove("is-active");
      dots[currentIdx].classList.remove("is-active");
      currentIdx = idx;
      slides[currentIdx].classList.add("is-active");
      dots[currentIdx].classList.add("is-active");
    }

    function nextSlide() {
      goToSlide((currentIdx + 1) % slides.length);
    }

    function start() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = setInterval(nextSlide, SLIDESHOW_INTERVAL);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function restart() { stop(); start(); }

    // Pause when hovering, resume on leave
    slideshow.addEventListener("mouseenter", stop);
    slideshow.addEventListener("mouseleave", start);

    // Pause when tab is hidden (saves CPU)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    // Preload next images for smoother transitions
    slides.forEach((slide) => {
      const bg = slide.style.backgroundImage;
      const src = bg && bg.match(/url\(['"]?(.*?)['"]?\)/);
      if (src && src[1]) {
        const img = new Image();
        img.src = src[1];
      }
    });

    start();
  }

  /* -----------------------------------------------------
   *  Mini calendars for the Journey page
   *  Each <div class="mini-calendar" data-year data-month data-day data-caption>
   *  gets rendered as a beautiful month grid with the target day
   *  highlighted with a heart-radiant circle.
   * ----------------------------------------------------- */
  const CAL_MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const CAL_DAY_ABBR = ["S", "M", "T", "W", "T", "F", "S"];
  const CAL_DAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function renderMiniCalendar(el) {
    const year  = parseInt(el.dataset.year,  10);
    const month = parseInt(el.dataset.month, 10) - 1; // 1-indexed in HTML, 0-indexed in JS
    const day   = parseInt(el.dataset.day,   10);
    const caption = el.dataset.caption || "";

    if (isNaN(year) || isNaN(month) || isNaN(day)) return;

    const firstDay      = new Date(year, month, 1);
    const daysInMonth   = new Date(year, month + 1, 0).getDate();
    const startDow      = firstDay.getDay(); // 0=Sun ... 6=Sat
    const targetDate    = new Date(year, month, day);
    const targetDowName = CAL_DAY_FULL[targetDate.getDay()];

    let html = "";

    // Header — month + year + weekday
    html += '<div class="mc-header">' + CAL_MONTH_NAMES[month] + " " + year + "</div>";
    html += '<div class="mc-subheader">A ' + targetDowName + " to remember</div>";

    // Grid
    html += '<div class="mc-grid" role="grid">';

    // Day-of-week header row
    for (let i = 0; i < 7; i++) {
      html += '<div class="mc-day-label" aria-label="' + CAL_DAY_FULL[i] + '">' + CAL_DAY_ABBR[i] + '</div>';
    }

    // Leading empty cells (Sun-based week)
    for (let i = 0; i < startDow; i++) {
      html += '<div class="mc-cell mc-empty" aria-hidden="true"></div>';
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const isTarget = d === day;
      const classes  = "mc-cell" + (isTarget ? " mc-target" : "");
      const aria     = isTarget ? ' aria-label="' + CAL_MONTH_NAMES[month] + " " + d + ", " + year + ' — our special day"' : "";
      html += '<div class="' + classes + '"' + aria + '><span>' + d + '</span></div>';
    }

    html += "</div>";

    // Caption
    if (caption) {
      html += '<p class="mc-caption">&mdash; ' + caption + " &mdash;</p>";
    }

    el.innerHTML = html;
    el.setAttribute("role", "figure");
    el.setAttribute("aria-label",
      "Calendar for " + CAL_MONTH_NAMES[month] + " " + year +
      ", " + CAL_MONTH_NAMES[month] + " " + day + " highlighted."
    );
  }

  function initMiniCalendars() {
    const cals = document.querySelectorAll(".mini-calendar[data-year]");
    cals.forEach(renderMiniCalendar);
  }

  /* -----------------------------------------------------
   *  Live clock + Together-For counter
   * ----------------------------------------------------- */

  // --- CONFIG ---
  // Change TOGETHER_SINCE to your special date (ISO format: YYYY-MM-DDTHH:MM:SS)
  // e.g. wedding day, first date, engagement, etc.
  // Set to null to hide the "Together For" card entirely.
  const TOGETHER_SINCE = "2025-07-16T00:00:00"; // The day we first met
  const TOGETHER_LABEL = "Since our first hello"; // e.g. "Since we said 'I do'"
  const USE_24H_CLOCK  = false; // false = 12-hour with AM/PM, true = 24-hour

  const DAY_NAMES = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
  ];
  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function pad2(n) { return String(n).padStart(2, "0"); }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && el.textContent !== value) el.textContent = value;
  }

  function updateClock() {
    const now = new Date();

    setText("clockDay",  DAY_NAMES[now.getDay()]);
    setText("clockDate", MONTH_NAMES[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear());

    let h = now.getHours();
    let meridian = "";
    if (!USE_24H_CLOCK) {
      meridian = h >= 12 ? "PM" : "AM";
      h = h % 12;
      if (h === 0) h = 12;
    }

    setText("clockHours",   pad2(h));
    setText("clockMinutes", pad2(now.getMinutes()));

    // Trigger tick animation on seconds
    const secEl = document.getElementById("clockSeconds");
    const newSec = pad2(now.getSeconds());
    if (secEl && secEl.textContent !== newSec) {
      secEl.textContent = newSec;
      secEl.classList.remove("tick");
      // force reflow to restart animation
      void secEl.offsetWidth;
      secEl.classList.add("tick");
    }

    const merEl = document.getElementById("clockMeridian");
    if (merEl) {
      if (USE_24H_CLOCK) merEl.style.display = "none";
      else merEl.textContent = meridian;
    }

    // Time zone (best-effort)
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setText("clockZone", tz.replace(/_/g, " "));
    } catch (e) { /* ignore */ }
  }

  function diffYMD(from, to) {
    // Calendar-accurate years/months/days between two Date objects (to >= from)
    let y = to.getFullYear() - from.getFullYear();
    let m = to.getMonth()    - from.getMonth();
    let d = to.getDate()     - from.getDate();

    if (d < 0) {
      // borrow days from previous month
      const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
      d += prevMonth.getDate();
      m -= 1;
    }
    if (m < 0) { m += 12; y -= 1; }
    return { years: y, months: m, days: d };
  }

  function updateTogether() {
    if (!TOGETHER_SINCE) return;
    const start = new Date(TOGETHER_SINCE);
    if (isNaN(start.getTime())) return;

    const now = new Date();
    if (now < start) {
      setText("togetherYears", 0);
      setText("togetherMonths", 0);
      setText("togetherDays", 0);
      setText("togetherHours", "00");
      setText("togetherMinutes", "00");
      setText("togetherSeconds", "00");
      return;
    }

    // Y-M-D based on calendar
    const ymd = diffYMD(start, now);
    setText("togetherYears",  ymd.years);
    setText("togetherMonths", ymd.months);
    setText("togetherDays",   ymd.days);

    // H-M-S = time-of-day difference (relative to same wall-clock instant)
    // We compute using the raw millisecond diff, then extract H/M/S within a day.
    const msDiff = now - start;
    const totalSeconds = Math.floor(msDiff / 1000);
    const hours   = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor(totalSeconds / 60)   % 60;
    const seconds = totalSeconds % 60;

    setText("togetherHours",   pad2(hours));
    setText("togetherMinutes", pad2(minutes));

    const sEl = document.getElementById("togetherSeconds");
    const newSec = pad2(seconds);
    if (sEl && sEl.textContent !== newSec) {
      sEl.textContent = newSec;
      sEl.classList.remove("tick");
      void sEl.offsetWidth;
      sEl.classList.add("tick");
    }

    const sinceEl = document.getElementById("togetherSince");
    if (sinceEl) {
      const formatted = start.toLocaleDateString(undefined, {
        day: "numeric", month: "long", year: "numeric"
      });
      sinceEl.textContent = TOGETHER_LABEL + " · " + formatted;
    }
  }

  function initClock() {
    // If no anniversary date is configured, hide the second card gracefully
    const togetherCard = document.querySelector(".moment-card-alt");
    if (!TOGETHER_SINCE && togetherCard) togetherCard.style.display = "none";

    updateClock();
    updateTogether();

    // Align first tick to the next whole second, then tick every 1000ms
    const msUntilNextSecond = 1000 - (Date.now() % 1000);
    setTimeout(() => {
      updateClock();
      updateTogether();
      setInterval(() => {
        updateClock();
        updateTogether();
      }, 1000);
    }, msUntilNextSecond);
  }

  /* -----------------------------------------------------
   *  Love-Note form + guestbook
   * ----------------------------------------------------- */

  // --- CONFIG ---
  // If you set a real email here, the Send button will also open the
  // visitor's email app pre-filled with their note so it actually reaches you.
  // Leave as empty string to skip the mailto step.
  const COUPLE_EMAIL = ""; // e.g. "anilpriyanka@example.com"
  const STORAGE_KEY = "anilPriyankaWishes";
  const MAX_STORED = 25;
  const MAX_SHOWN = 8;

  function loadWishes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function saveWishes(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
    catch (e) { /* storage may be unavailable */ }
  }

  function timeAgo(ts) {
    const diff = Math.max(0, Date.now() - ts);
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return m + " min ago";
    const h = Math.floor(m / 60);
    if (h < 24) return h + (h === 1 ? " hour ago" : " hours ago");
    const d = Math.floor(h / 24);
    if (d < 7) return d + (d === 1 ? " day ago" : " days ago");
    return new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function renderGuestbook() {
    const list = document.getElementById("guestbookList");
    if (!list) return;
    const wishes = loadWishes();
    if (wishes.length === 0) {
      list.innerHTML =
        '<p class="guestbook-empty">Be the first to leave a note. <span aria-hidden="true">&#9825;</span></p>';
      return;
    }
    const html = wishes.slice(0, MAX_SHOWN).map((w) => (
      '<article class="guest-note">' +
        '<header class="guest-note-head">' +
          '<span class="guest-name">' + escapeHTML(w.name) + '</span>' +
          '<time class="guest-time">' + timeAgo(w.time) + '</time>' +
        '</header>' +
        '<p class="guest-message">' + escapeHTML(w.message) + '</p>' +
      '</article>'
    )).join("");
    list.innerHTML = html;
  }

  function burstHearts(container, count) {
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < count; i++) {
      const h = document.createElement("div");
      h.className = "burst-heart";
      h.innerHTML = HEART_SVG;
      const angle = Math.random() * Math.PI * 2;
      const dist  = 120 + Math.random() * 180;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist - 40; // bias upward
      const rot = (Math.random() * 120 - 60) + "deg";
      const size = 12 + Math.random() * 18;
      h.style.setProperty("--tx", tx + "px");
      h.style.setProperty("--ty", ty + "px");
      h.style.setProperty("--rot", rot);
      h.style.width  = size + "px";
      h.style.height = size + "px";
      h.style.animationDelay = (Math.random() * 0.2) + "s";
      // Vary colours: mostly rose, some gold, some deep
      const roll = Math.random();
      if (roll > 0.85) h.style.color = "#d4af37";
      else if (roll > 0.55) h.style.color = "#c2185b";
      container.appendChild(h);
      setTimeout(() => h.remove(), 1800);
    }
  }

  function initWishForm() {
    const form = document.getElementById("wishForm");
    if (!form) return;

    const nameInput = document.getElementById("wishName");
    const msgInput  = document.getElementById("wishMessage");
    const count     = document.getElementById("wishCount");
    const err       = document.getElementById("wishError");
    const submit    = form.querySelector(".wish-submit");
    const success   = document.getElementById("wishSuccess");
    const successName = document.getElementById("successName");
    const burst     = form.querySelector(".wish-heart-burst");
    const again     = form.querySelector(".wish-again");

    // Character counter for message
    function updateCount() {
      const len = msgInput.value.length;
      count.textContent = len;
      const wrap = count.parentElement;
      wrap.classList.toggle("limit-near", len > 400 && len < 500);
      wrap.classList.toggle("limit-hit",  len >= 500);
    }
    msgInput.addEventListener("input", updateCount);
    updateCount();

    function setError(msg, fieldEl) {
      if (msg) {
        err.textContent = msg;
        err.classList.add("show");
      } else {
        err.textContent = "";
        err.classList.remove("show");
      }
      form.querySelectorAll(".form-field").forEach((f) => f.classList.remove("error"));
      if (fieldEl) fieldEl.closest(".form-field").classList.add("error");
    }

    [nameInput, msgInput].forEach((el) => {
      el.addEventListener("input", () => setError(""));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const message = msgInput.value.trim();

      if (!name) { setError("Please tell us your name.", nameInput); nameInput.focus(); return; }
      if (name.length < 2) { setError("That name seems too short.", nameInput); nameInput.focus(); return; }
      if (!message) { setError("Please write a lovely message.", msgInput); msgInput.focus(); return; }
      if (message.length < 3) { setError("A little longer, please.", msgInput); msgInput.focus(); return; }

      submit.classList.add("sending");

      // Save to guestbook
      const wishes = loadWishes();
      wishes.unshift({ name, message, time: Date.now() });
      if (wishes.length > MAX_STORED) wishes.length = MAX_STORED;
      saveWishes(wishes);

      // Heart burst animation
      burstHearts(burst, 18);

      // Optional mailto fallback so the note reaches you
      if (COUPLE_EMAIL) {
        const subject = encodeURIComponent("A love note from " + name);
        const body = encodeURIComponent(
          "From: " + name + "\n\n" + message + "\n\n(Sent via our love story website)"
        );
        // open in a background tab-like way; user can send from their mail app
        const link = document.createElement("a");
        link.href = "mailto:" + COUPLE_EMAIL + "?subject=" + subject + "&body=" + body;
        link.rel = "noopener noreferrer";
        // Delay slightly so the burst animation is visible before mail app opens
        setTimeout(() => link.click(), 700);
      }

      // Show success state
      setTimeout(() => {
        successName.textContent = name.split(/\s+/)[0]; // first name only
        success.classList.add("show");
        success.setAttribute("aria-hidden", "false");
        submit.classList.remove("sending");
        renderGuestbook();
      }, 500);
    });

    again && again.addEventListener("click", () => {
      form.reset();
      updateCount();
      setError("");
      success.classList.remove("show");
      success.setAttribute("aria-hidden", "true");
      nameInput.focus();
    });

    renderGuestbook();
  }

  /* -----------------------------------------------------
   *  Init when DOM is ready
   * ----------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderLayout();     // Nav + footer + page-nav (must run first)
    startHearts();
    startSparkles();
    initReveal();
    initNav();          // Nav behaviour (scroll shadow + mobile toggle)
    initQuotes();
    initClock();
    initWishForm();
    initMiniCalendars();
    initVisitorCount();
    initHeroSlideshow();

    // Reveal the hero content immediately
    document.querySelectorAll(".hero .reveal").forEach((el) =>
      el.classList.add("visible")
    );
    // Reveal any page-hero content immediately
    document.querySelectorAll(".page-hero .reveal").forEach((el) =>
      el.classList.add("visible")
    );
  });
})();
