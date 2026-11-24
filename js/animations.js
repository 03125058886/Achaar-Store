/* =========================================================
   ANIMATIONS — scroll reveal, fly-to-cart, counters, particles
   ========================================================= */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- page loader ---------- */
  const loader = $("#loader");
  const hideLoader = () => { loader.classList.add("done"); document.body.classList.add("loaded"); setTimeout(() => loader.remove(), 900); };
  if (document.readyState === "complete") setTimeout(hideLoader, 400);
  else { addEventListener("load", () => setTimeout(hideLoader, 300)); setTimeout(hideLoader, 2500); }

  /* ---------- scroll progress bar ---------- */
  const bar = $("#scrollProgress");
  addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  }, { passive: true });

  if (reduce) { $$("[data-count]").forEach(el => el.textContent = el.dataset.count + (el.dataset.suffix || "")); return; }

  /* ---------- scroll reveal ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  const REVEAL = [
    [".section-title, .apps-kicker, .rating-sum, .band-head p", "rv-up"],
    [".tabs, .filter-row", "rv-up"],
    [".cat", "rv-zoom"],
    [".card", "rv-up"],
    [".app-card", "rv-up"],
    [".trust-in > div", "rv-up"],
    [".about-img", "rv-left"],
    [".about-in > div:last-child", "rv-right"],
    [".stats > div", "rv-zoom"],
    [".f-col", "rv-up"],
  ];
  function prep(root = document) {
    REVEAL.forEach(([sel, cls]) => {
      $$(sel, root).forEach(el => {
        if (el.classList.contains("rv")) return;
        const sibs = [...el.parentElement.children];
        el.style.setProperty("--d", (sibs.indexOf(el) % 5) * 90 + "ms");
        el.classList.add("rv", cls);
        io.observe(el);
      });
    });
  }
  prep();
  // grids re-render (tabs, filters, wishlist) → animate new cards too
  new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType !== 1) return;
      if (n.matches(".card")) {
        const i = [...n.parentElement.children].indexOf(n);
        n.style.setProperty("--d", (i % 4) * 80 + "ms");
        n.classList.add("rv", "rv-up");
        requestAnimationFrame(() => io.observe(n));
      }
    }));
  }).observe(document.body, { childList: true, subtree: true });

  /* ---------- band heading: word-by-word wave ---------- */
  const bh = $(".band-head h2");
  if (bh) {
    let i = 0;
    bh.innerHTML = bh.innerHTML.split(/<br\s*\/?>/i).map(line =>
      line.trim().split(/\s+/).map(w => `<span class="w" style="--i:${i++}">${w}</span>`).join(" ")
    ).join("<br>");
    bh.classList.add("words");
    io.observe(bh);
  }

  /* ---------- floating spices in the green band ---------- */
  const band = $(".band"), layer = $("#spiceLayer");
  if (band && layer) {
    band.prepend(layer);
    const bits = ["🌶️", "🍋", "🥭", "🧄", "🌿", "🌶️", "⭐"];
    for (let k = 0; k < 14; k++) {
      const s = document.createElement("span");
      s.textContent = bits[k % bits.length];
      s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;font-size:${16 + Math.random() * 22}px;animation-duration:${8 + Math.random() * 10}s;animation-delay:-${Math.random() * 10}s;opacity:${.12 + Math.random() * .18}`;
      layer.appendChild(s);
    }
  }

  /* ---------- count-up stats ---------- */
  const cio = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.count, dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || "";
    const t0 = performance.now(), dur = 1800;
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = (end * e).toLocaleString("en-PK", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    cio.unobserve(el);
  }), { threshold: .5 });
  $$("[data-count]").forEach(el => cio.observe(el));

  /* ---------- fly to cart ---------- */
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-add], [data-qadd], [data-qbuy]");
    if (!btn || btn.disabled) return;
    const src = btn.closest(".card")?.querySelector(".card-media img") || $(".qv-media .main");
    const cartBtn = $("#openCart");
    if (!src || !cartBtn) return;
    const a = src.getBoundingClientRect(), b = cartBtn.getBoundingClientRect();
    const size = Math.min(a.width, 160);
    const fly = document.createElement("img");
    fly.src = src.currentSrc || src.src; fly.className = "fly-img";
    fly.style.cssText = `left:${a.left + a.width / 2 - size / 2}px;top:${a.top + a.height / 2 - size / 2}px;width:${size}px;height:${size}px`;
    document.body.appendChild(fly);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    fly.animate([
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * .5}px,${dy * .5 - 120}px) scale(.55)`, opacity: 1, offset: .55 },
      { transform: `translate(${dx}px,${dy}px) scale(.12)`, opacity: .4 },
    ], { duration: 750, easing: "cubic-bezier(.5,0,.3,1)" }).onfinish = () => {
      fly.remove();
      cartBtn.animate([{ transform: "scale(1)" }, { transform: "scale(1.35) rotate(-10deg)" }, { transform: "scale(.9) rotate(6deg)" }, { transform: "scale(1)" }], { duration: 500 });
    };
  }, true);

  /* cart / wishlist counter pop */
  const pop = el => new MutationObserver(() => el.animate([{ transform: "scale(1)" }, { transform: "scale(1.6)" }, { transform: "scale(1)" }], { duration: 400, easing: "ease-out" })).observe(el, { childList: true });
  pop($("#cartCount")); pop($("#wishCount"));

  /* heart burst on wishlist */
  document.addEventListener("click", e => {
    const h = e.target.closest("[data-wish]"); if (!h) return;
    setTimeout(() => {
      if (!h.classList.contains("on")) return;
      const r = h.getBoundingClientRect();
      for (let k = 0; k < 7; k++) {
        const s = document.createElement("span");
        s.className = "heart-bit"; s.textContent = "♥";
        s.style.left = r.left + r.width / 2 + "px"; s.style.top = r.top + r.height / 2 + "px";
        document.body.appendChild(s);
        const ang = (k / 7) * Math.PI * 2, dist = 28 + Math.random() * 18;
        s.animate([{ transform: "translate(-50%,-50%) scale(.4)", opacity: 1 },
          { transform: `translate(calc(-50% + ${Math.cos(ang) * dist}px), calc(-50% + ${Math.sin(ang) * dist}px)) scale(1)`, opacity: 0 }],
          { duration: 650, easing: "ease-out" }).onfinish = () => s.remove();
      }
    }, 0);
  });

  /* ---------- desktop-only: 3D tilt on cards & hero parallax ---------- */
  if (finePointer) {
    document.addEventListener("mousemove", e => {
      const m = e.target.closest(".card-media");
      $$(".card-media.tilt").forEach(x => x !== m && (x.classList.remove("tilt"), x.style.transform = ""));
      if (!m) return;
      const r = m.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      m.classList.add("tilt");
      m.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    }, { passive: true });

    const hero = $(".hero");
    hero.addEventListener("mousemove", e => {
      const r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      $$(".slide-in").forEach(s => s.style.transform = `translate(${x * -18}px, ${y * -12}px)`);
    });
    hero.addEventListener("mouseleave", () => $$(".slide-in").forEach(s => s.style.transform = ""));

    /* magnetic primary buttons */
    $$(".btn-light, .btn-dark, .wa-float").forEach(b => {
      b.addEventListener("mousemove", e => {
        const r = b.getBoundingClientRect();
        b.style.translate = `${(e.clientX - r.left - r.width / 2) * .15}px ${(e.clientY - r.top - r.height / 2) * .25}px`;
      });
      b.addEventListener("mouseleave", () => b.style.translate = "");
    });
  }

  /* ripple on every button */
  document.addEventListener("pointerdown", e => {
    const b = e.target.closest(".btn"); if (!b || b.disabled) return;
    const r = b.getBoundingClientRect(), s = document.createElement("span");
    s.className = "ripple"; s.style.left = e.clientX - r.left + "px"; s.style.top = e.clientY - r.top + "px";
    b.appendChild(s); setTimeout(() => s.remove(), 650);
  });

  /* ---------- WhatsApp bubble after a few seconds ---------- */
  const wa = $("#waFloat");
  if (wa) {
    const tip = document.createElement("div");
    tip.className = "wa-tip"; tip.innerHTML = "👋 Assalam o Alaikum!<br><b>Order on WhatsApp</b>";
    document.body.appendChild(tip);
    setTimeout(() => tip.classList.add("show"), 4000);
    setTimeout(() => tip.classList.remove("show"), 11000);
    tip.onclick = () => wa.click();
  }

  /* ---------- header: hide on scroll down, show on scroll up ---------- */
  let lastY = scrollY;
  const header = $("#header");
  addEventListener("scroll", () => {
    const y = scrollY;
    const anyOpen = $("#searchPanel.open") || $(".has-drop:hover");
    header.classList.toggle("hide", y > lastY && y > 400 && !anyOpen);
    lastY = y;
  }, { passive: true });
})();
