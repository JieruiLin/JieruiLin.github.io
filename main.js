// Progressive enhancements for the homepage. The page is fully readable without JS.
"use strict";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Theme toggle ---------- */
function initTheme() {
  const root = document.documentElement;
  $(".theme-toggle")?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
  // Follow OS changes unless the user picked a theme explicitly
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) root.dataset.theme = e.matches ? "dark" : "light";
  });
}

/* ---------- Scroll progress, nav shadow, active section ---------- */
function initScroll() {
  const nav = $(".nav");
  const bar = $(".scroll-progress");
  let ticking = false;

  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty("--progress", max > 0 ? scrollY / max : 0);
    nav.classList.toggle("is-scrolled", scrollY > 8);
    ticking = false;
  };
  addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();

  const links = new Map($$(".nav__links a").map((a) => [a.hash.slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      links.forEach((a, id) => a.classList.toggle("is-active", id === e.target.id));
    }
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((_, id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    }
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));
}

/* ---------- Typing effect ---------- */
function initTyped() {
  const el = $(".typed");
  if (!el || reducedMotion) return;
  const words = JSON.parse(el.dataset.words);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  (async () => {
    await sleep(2200);
    for (let i = 1; ; i = (i + 1) % words.length) {
      const word = words[i];
      for (let n = el.textContent.length; n >= 0; n--) { el.textContent = el.textContent.slice(0, n); await sleep(35); }
      for (let n = 1; n <= word.length; n++) { el.textContent = word.slice(0, n); await sleep(70); }
      await sleep(2200);
    }
  })();
}

/* ---------- Paper summary toggles ---------- */
function initSummaries() {
  for (const btn of $$(".pill--toggle")) {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) continue;
    // Swap `hidden` for a CSS-animated collapse; `inert` keeps closed content out of tab order
    panel.hidden = false;
    panel.inert = true;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", open);
      panel.classList.toggle("is-open", open);
      panel.inert = !open;
    });
  }
}

/* ---------- Publication filters ---------- */
function initFilters() {
  const chips = $$(".chip");
  const pubs = $$(".pub");
  chips.forEach((chip) => chip.addEventListener("click", () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => c.classList.toggle("is-active", c === chip));
    pubs.forEach((p) => {
      const show = f === "all" || p.dataset.tags.split(" ").includes(f);
      p.classList.toggle("is-hidden", !show);
      if (show) p.classList.add("is-visible");
    });
  }));
}

/* ---------- Hero canvas: drifting neural-network graph ---------- */
function initNetwork() {
  const canvas = $(".hero__canvas");
  if (!canvas || reducedMotion) return;
  const ctx = canvas.getContext("2d");
  const LINK_DIST = 130;
  let w, h, dpr, nodes = [], raf = null;
  const pointer = { x: -1e4, y: -1e4 };

  const accent = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    ({ width: w, height: h } = canvas.getBoundingClientRect());
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Fewer nodes on small screens keeps phones smooth
    const count = Math.round(Math.min(70, (w * h) / 14000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.8,
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    const color = accent();
    ctx.fillStyle = ctx.strokeStyle = color;

    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      // gentle repulsion from the pointer
      const dx = n.x - pointer.x, dy = n.y - pointer.y, d2 = dx * dx + dy * dy;
      if (d2 < 10000) { n.x += dx * 0.015; n.y += dy * 0.015; }
    }

    ctx.lineWidth = 0.8;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DIST) {
          ctx.globalAlpha = (1 - d / LINK_DIST) * 0.25;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 0.55;
    for (const n of nodes) { ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill(); }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }

  const start = () => { if (!raf) raf = requestAnimationFrame(frame); };
  const stop = () => { cancelAnimationFrame(raf); raf = null; };

  // Only animate while the hero is on screen and the tab is visible
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(canvas);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  canvas.parentElement.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left; pointer.y = e.clientY - rect.top;
  });
  canvas.parentElement.addEventListener("pointerleave", () => { pointer.x = pointer.y = -1e4; });

  let resizeTimer;
  new ResizeObserver(() => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); }).observe(canvas);
  resize();
}

/* ---------- Boot ---------- */
initTheme();
initScroll();
initReveal();
initTyped();
initFilters();
initSummaries();
initNetwork();
$("#year").textContent = new Date().getFullYear();
