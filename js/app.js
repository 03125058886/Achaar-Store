(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const rs = n => "Rs. " + Math.round(n).toLocaleString("en-PK") + ".00";
  const waLink = text => `https://wa.me/${STORE.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;
  const findP = id => PRODUCTS.find(p => p.id === id);
  const catName = id => (CATEGORIES.find(c => c.id === id) || {}).name || "All Products";
  const stars = r => "★★★★★".slice(0, Math.round(r)) + "☆☆☆☆☆".slice(0, 5 - Math.round(r));
  const offPct = s => s.old ? Math.round((1 - s.price / s.old) * 100) : 0;
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const ICON = {
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3 5 6.4 5c2 0 3.4 1.1 4.1 2.3h3C14.2 6.1 15.6 5 17.6 5 21 5 22.7 8.4 21.2 11.4 19 15.6 12 20 12 20z"/></svg>',
    eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  };

  /* ---------------- store info ---------------- */
  $$("[data-store-name]").forEach(e => e.textContent = STORE.name);
  $$("[data-prepaid]").forEach(e => e.textContent = STORE.prepaidDiscount);
  $$("[data-free-text]").forEach(e => e.textContent = `Rs. ${STORE.freeDeliveryAbove.toLocaleString("en-PK")} se upar orders par`);
  const hello = `Assalam o Alaikum! Mujhe ${STORE.name} ke products ke baare mein maloomat chahiye.`;
  ["#waFloat", "#fWa", "#appWa"].forEach(s => $(s).href = waLink(hello));
  $("#fPhone").textContent = STORE.phoneDisplay; $("#fPhone").href = "tel:+" + STORE.whatsapp;
  $("#appCall").href = "tel:+" + STORE.whatsapp;
  $("#fEmail").textContent = STORE.email; $("#fEmail").href = "mailto:" + STORE.email;
  $("#fAddr").textContent = STORE.address;
  $("#fIg").href = $("#appIg").href = STORE.instagram;
  $("#fFb").href = $("#appFb").href = STORE.facebook;
  $("#year").textContent = new Date().getFullYear();

  const topItems = [
    `Extra ${STORE.prepaidDiscount}% Off ON PREPAID ORDERS`,
    `FREE DELIVERY ON ORDERS ABOVE Rs. ${STORE.freeDeliveryAbove.toLocaleString("en-PK")}`,
    "4.9 ★★★★★ | 10,000+ Happy Customers",
    "CASH ON DELIVERY ALL OVER PAKISTAN",
  ];
  $("#topbarTrack").innerHTML = [...topItems, ...topItems, ...topItems, ...topItems].map(t => `<span>${t}</span>`).join("");

  /* nav */
  $("#navDrop").innerHTML = CATEGORIES.map(c => `<a href="#all" data-cat="${c.id}">${c.name}</a>`).join("");
  $("#mnavLinks").innerHTML =
    `<a href="#">Home</a><a href="#all" data-cat="all">Shop Now</a>` +
    CATEGORIES.map(c => `<a class="sub" href="#all" data-cat="${c.id}">${c.name}</a>`).join("") +
    `<a href="#bestsellers">Best Selling Products</a><a href="#combos">Combos</a><a href="#about">About us</a><a href="#contact">Contact</a>`;
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-cat]");
    if (a && !a.classList.contains("cat-tab")) { e.preventDefault(); showAll(a.dataset.cat); closeAll(); }
  });
  $("#menuBtn").onclick = () => { $("#mnav").classList.add("open"); $("#overlay").classList.add("show"); };
  $("#mnavLinks").addEventListener("click", e => e.target.tagName === "A" && closeAll());
  window.addEventListener("scroll", () => $("#header").classList.toggle("scrolled", scrollY > 10), { passive: true });

  /* ---------------- product card ---------------- */
  let wish = store.get("wish", []);
  function card(p) {
    const s = p.sizes[0], off = offPct(s), multi = p.sizes.length > 1;
    const ctaLabel = !p.stock ? "Out of Stock" : multi ? "Select Options" : "Add to Cart";
    const ctaAttr = !p.stock ? "disabled" : multi ? "data-qv" : "data-add";
    const from = multi ? "" : "";
    return `<div class="card" data-id="${p.id}">
      <div class="card-media" data-qv>
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <img class="img2" src="${p.img2 || p.img}" alt="" loading="lazy">
        ${!p.stock ? `<span class="sold-badge">Sold out</span>` : off ? `<span class="sale-badge">-${off}%</span>` : ""}
      </div>
      <div class="card-tools">
        <button class="${wish.includes(p.id) ? "on" : ""}" data-wish aria-label="Wishlist">${ICON.heart}</button>
        <button class="qv-btn" data-qv aria-label="Quick view">${ICON.eye}</button>
      </div>
      <div class="card-cta"><button class="btn btn-light" ${ctaAttr}>${ctaLabel}</button></div>
      <div class="card-info">
        <h3 data-qv>${p.name}</h3>
        <div class="rating"><span class="stars">${stars(p.rating)}</span>(${p.reviews})</div>
        <div class="price ${off ? "sale" : ""}">${from}<span class="now">${rs(s.price)}</span>${off ? `<s>${rs(s.old)}</s>` : ""}</div>
        <div class="m-cta"><button class="btn btn-dark" ${ctaAttr}>${ctaLabel}</button></div>
      </div>
    </div>`;
  }

  document.addEventListener("click", e => {
    const c = e.target.closest(".card"); if (!c) return;
    const p = findP(+c.dataset.id);
    if (e.target.closest("[data-wish]")) {
      const b = e.target.closest("[data-wish]");
      wish = wish.includes(p.id) ? wish.filter(x => x !== p.id) : [...wish, p.id];
      store.set("wish", wish); updateWish();
      $$(`.card[data-id="${p.id}"] [data-wish]`).forEach(x => x.classList.toggle("on", wish.includes(p.id)));
      toast(wish.includes(p.id) ? "Wishlist mein add ho gaya ♥" : "Wishlist se hata diya");
      void b;
    } else if (e.target.closest("[data-add]")) addToCart(p.id, 0, 1, true);
    else if (e.target.closest("[data-qv]")) openQuick(p.id);
  });
  function updateWish() { $("#wishCount").textContent = wish.length; }
  $("#wishBtn").onclick = () => {
    if (!wish.length) return toast("Wishlist khali hai. Product par ♥ dabayein.");
    showAll("wish");
  };

  /* ---------------- sections ---------------- */
  $("#popularRow").innerHTML = PRODUCTS.filter(p => p.tags.includes("popular")).map(p =>
    `<div class="pop" data-pop="${p.id}"><img src="${p.img}" alt=""><div><b>${p.name}</b><span>${rs(p.sizes[0].price)}</span></div></div>`).join("");
  $("#popularRow").addEventListener("click", e => { const x = e.target.closest("[data-pop]"); x && openQuick(+x.dataset.pop); });

  $("#catRow").innerHTML = CATEGORIES.map(c =>
    `<button class="cat" data-cat="${c.id}"><div class="cat-img"><img src="${c.img}" alt="${c.name}" loading="lazy"></div><span>${c.name}</span></button>`).join("");

  const badges = [
    ["BESTSELLER", "The Achaar Everyone Loves", "Kachi Ghani Sarson Tail, No Preservatives"],
    ["TRENDING", "Chatpata Khao, Khush Raho", "Har khane ka swaad dugna"],
    ["FAVOURITE", "Ghar Jaisa Swaad", "Nani ki asli khandani recipe"],
    ["MOST LOVED", "A Better Way To Eat Desi", "Taaza phal, taaza masalay"],
    ["LIMITED STOCK", "One Jar Is Never Enough", "Chhotay batches, jaldi khatam"],
    ["HANDMADE", "Banaya Mohabbat Se", "Haath se bhara har jar"],
  ];
  const bcards = badges.map(([t, h, p]) =>
    `<div class="bcard"><span class="tag">${t}</span><span class="stars">★★★★★</span><h3>${h}</h3><p>${p}</p><a href="#bestsellers">Shop Now</a></div>`).join("");
  $("#badgeTrack").innerHTML = bcards + bcards;

  /* bestsellers with tabs */
  const bestTabs = [["all", "All"], ["achaar", "Achaars"], ["chutney", "Chutneys"], ["murabba", "Murabba"]];
  $("#bestTabs").innerHTML = bestTabs.map(([id, n], i) => `<button class="cat-tab${i ? "" : " active"}" data-tab="${id}">${n}</button>`).join("");
  function renderBest(tab = "all") {
    const list = PRODUCTS.filter(p => p.tags.includes("best") && (tab === "all" || p.cat === tab)).slice(0, 8);
    $("#bestGrid").innerHTML = list.map(card).join("");
  }
  $("#bestTabs").addEventListener("click", e => {
    const b = e.target.closest("[data-tab]"); if (!b) return;
    $$("#bestTabs button").forEach(x => x.classList.toggle("active", x === b));
    renderBest(b.dataset.tab);
  });
  renderBest();

  $("#comboGrid").innerHTML = PRODUCTS.filter(p => p.cat === "combo").map(card).join("");
  $("#topGrid").innerHTML = PRODUCTS.filter(p => p.tags.includes("top")).slice(0, 8).map(card).join("");

  /* all products */
  let allCat = "all", sortBy = "default";
  $("#filterRow").innerHTML = [["all", "All"], ...CATEGORIES.map(c => [c.id, c.name])].map(([id, n]) =>
    `<button class="cat-tab" data-f="${id}">${n}</button>`).join("");
  function renderAll() {
    let list = allCat === "all" ? PRODUCTS : allCat === "wish" ? PRODUCTS.filter(p => wish.includes(p.id)) : PRODUCTS.filter(p => p.cat === allCat);
    if (sortBy === "low") list = [...list].sort((a, b) => a.sizes[0].price - b.sizes[0].price);
    if (sortBy === "high") list = [...list].sort((a, b) => b.sizes[0].price - a.sizes[0].price);
    if (sortBy === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    $("#allGrid").innerHTML = list.map(card).join("");
    $("#allTitle").textContent = allCat === "wish" ? "Your Wishlist" : catName(allCat);
    $$("#filterRow button").forEach(b => b.classList.toggle("active", b.dataset.f === allCat));
  }
  function showAll(cat = "all") {
    allCat = cat; $("#all").hidden = false; renderAll();
    $("#all").scrollIntoView({ behavior: "smooth" });
  }
  $("#filterRow").addEventListener("click", e => { const b = e.target.closest("[data-f]"); if (b) { allCat = b.dataset.f; renderAll(); } });
  $("#sort").onchange = e => { sortBy = e.target.value; renderAll(); };
  $("#viewAll").onclick = () => showAll("all");

  /* reviews */
  const REVIEWS = [
    ["Ayesha K.", "Karachi", "Bilkul ammi ke haath jaisa aam ka achaar. Pehli baar online itna acha achaar mila. Dobara order kar diya!"],
    ["Usman R.", "Islamabad", "Bharwan lal mirch zabardast hai. Packing bohat achi thi, ek boond bhi leak nahi hui."],
    ["Nasreen B.", "Faisalabad", "Gajar ka murabba aur amla murabba dono taaza aur meethay. Bachay roz khate hain."],
    ["Bilal A.", "Lahore", "Lehsan ka achaar aur imli chutney, dono best. Delivery 2 din mein aa gayi."],
    ["Sana M.", "Multan", "Hall of Fame box gift kiya, sab ne tareef ki. Bohat professional packing."],
    ["Hamza T.", "Rawalpindi", "Chicken achaar safar ke liye perfect hai. Masala ekdum balanced."],
    ["Fatima Z.", "Peshawar", "Khatta meetha nimboo ka achaar hazme ke liye behtareen. Bilkul ghar jaisa."],
    ["Ali H.", "Sialkot", "WhatsApp par order karna bohat aasan tha. Jaldi reply aur time par delivery."],
  ];
  const rc = REVIEWS.map(([n, c, t]) =>
    `<div class="rcard"><div class="stars">★★★★★</div><p>"${t}"</p><div class="who"><span class="av">${n[0]}</span><div><b>${n}</b><small>${c} • <span class="ver">✔ Verified Buyer</span></small></div></div></div>`).join("");
  $("#reviewTrack").innerHTML = rc + rc;

  /* ---------------- hero slider ---------------- */
  const slides = $$(".slide"); let cur = 0, timer;
  $("#dots").innerHTML = slides.map((_, i) => `<button aria-label="Slide ${i + 1}" class="${i ? "" : "active"}"></button>`).join("");
  function go(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle("active", j === cur));
    $$("#dots button").forEach((d, j) => d.classList.toggle("active", j === cur));
    clearInterval(timer); timer = setInterval(() => go(cur + 1), 5500);
  }
  $("#dots").addEventListener("click", e => { const i = $$("#dots button").indexOf(e.target); if (i > -1) go(i); });
  $("#slidePrev").onclick = () => go(cur - 1);
  $("#slideNext").onclick = () => go(cur + 1);
  let tx = 0;
  $("#slides").addEventListener("touchstart", e => tx = e.touches[0].clientX, { passive: true });
  $("#slides").addEventListener("touchend", e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) go(cur + (d < 0 ? 1 : -1)); });
  go(0);

  /* ---------------- search ---------------- */
  $("#searchBtn").onclick = () => { $("#searchPanel").classList.toggle("open"); $("#searchInput").focus(); };
  $("#searchClose").onclick = () => $("#searchPanel").classList.remove("open");
  function doSearch(q) {
    q = q.trim().toLowerCase();
    const res = q ? PRODUCTS.filter(p => (p.name + " " + p.desc + " " + p.cat).toLowerCase().includes(q)) : [];
    $("#searchResults").innerHTML = q && !res.length ? `<p>"${q.replace(/</g, "")}" ke liye kuch nahi mila.</p>` :
      res.slice(0, 8).map(p => `<div class="sr-item" data-sr="${p.id}"><img src="${p.img}" alt=""><div><b>${p.name}</b><span>${rs(p.sizes[0].price)}</span></div></div>`).join("");
  }
  $("#searchInput").addEventListener("input", e => doSearch(e.target.value));
  $(".trending").addEventListener("click", e => { const b = e.target.closest("[data-q]"); if (b) { $("#searchInput").value = b.dataset.q; doSearch(b.dataset.q); } });
  $("#searchResults").addEventListener("click", e => { const x = e.target.closest("[data-sr]"); if (x) { $("#searchPanel").classList.remove("open"); openQuick(+x.dataset.sr); } });

  /* ---------------- quick view ---------------- */
  function openQuick(id) {
    const p = findP(id); let si = 0, q = 1;
    const imgs = [p.img, p.img2].filter((v, i, a) => v && a.indexOf(v) === i);
    const draw = () => {
      const s = p.sizes[si], off = offPct(s);
      $("#qvBody").innerHTML = `
        <div class="qv-media"><img class="main" src="${imgs[0]}" alt="${p.name}">
          <div class="qv-thumbs">${imgs.map((m, i) => `<img src="${m}" data-thumb="${m}" class="${i ? "" : "active"}" alt="">`).join("")}</div></div>
        <div class="qv-info">
          <h2>${p.name}</h2>
          <div class="rating"><span class="stars">${stars(p.rating)}</span>${p.rating} (${p.reviews} reviews)</div>
          <div class="price ${off ? "sale" : ""}"><span class="now">${rs(s.price)}</span>${off ? `<s>${rs(s.old)}</s><span class="save">Save ${off}%</span>` : ""}</div>
          <p class="desc">${p.desc}</p>
          <span class="${p.stock ? "stock-in" : "stock-out"}">${p.stock ? "● In stock, ready to ship" : "● Out of stock"}</span>
          <span class="opt-label">Size: ${s.w}</span>
          <div class="opts">${p.sizes.map((z, i) => `<button data-opt="${i}" class="${i === si ? "active" : ""}">${z.w}</button>`).join("")}</div>
          <div class="qv-buy">
            <div class="qty"><button data-q="-1">−</button><span>${q}</span><button data-q="1">+</button></div>
            <button class="btn btn-dark" data-qadd ${p.stock ? "" : "disabled"}>${p.stock ? "Add to Cart" : "Out of Stock"}</button>
          </div>
          <button class="btn btn-wa block" data-qbuy ${p.stock ? "" : "disabled"}>Buy it now on WhatsApp</button>
          <ul class="qv-points"><li>100% Desi</li><li>No Preservatives</li><li>Cash on Delivery</li><li>Leak-proof Packing</li></ul>
        </div>`;
    };
    draw();
    $("#qvBody").onclick = e => {
      const t = e.target;
      if (t.dataset.opt) { si = +t.dataset.opt; draw(); }
      else if (t.dataset.q) { q = Math.max(1, q + +t.dataset.q); draw(); }
      else if (t.dataset.thumb) { $(".qv-media .main").src = t.dataset.thumb; $$(".qv-thumbs img").forEach(x => x.classList.toggle("active", x === t)); }
      else if (t.closest("[data-qadd]")) { addToCart(p.id, si, q, true); closeModal("#quick"); }
      else if (t.closest("[data-qbuy]")) { addToCart(p.id, si, q, false); closeModal("#quick"); openCart(true); }
    };
    openModal("#quick");
  }
  const openModal = s => { $(s).classList.add("open"); $(s).setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
  const closeModal = s => { $(s).classList.remove("open"); $(s).setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
  $$(".modal").forEach(m => m.addEventListener("click", e => { if (e.target === m || e.target.closest("[data-close]")) closeModal("#" + m.id); }));

  /* policies */
  const POLICIES = {
    shipping: ["Shipping Information", `<p>Poore Pakistan mein courier ke zariye delivery. Bade shehron mein 2 se 3 din, baqi 3 se 5 kaam ke din.</p><ul><li>Rs. ${STORE.freeDeliveryAbove.toLocaleString("en-PK")} se upar ke orders par delivery FREE.</li><li>Is se kam par Rs. ${STORE.deliveryCharge} delivery charges.</li><li>Order confirm hone par tracking number WhatsApp par bheja jata hai.</li></ul>`],
    return: ["Return Policy", "<p>Khane ki cheez hone ki wajah se khula hua jar wapas nahi hota. Agar jar toota hua ya ghalat product mile to 48 ghante ke andar photo ke saath WhatsApp karein. Hum muft replacement bhejenge.</p>"],
    privacy: ["Privacy Policy", "<p>Aap ka naam, number aur pata sirf aap ka order deliver karne ke liye istemal hota hai. Hum ye maloomat kisi teesre fareeq ko nahi dete.</p>"],
    terms: ["Terms and Conditions", "<p>Qeematein aur stock baghair notice badal sakte hain. Order WhatsApp par confirm hone ke baad hi final samjha jayega. Cash on Delivery orders par customer ka number verify kiya jata hai.</p>"],
  };
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-policy]"); if (!a) return;
    e.preventDefault(); const [t, b] = POLICIES[a.dataset.policy];
    $("#policyBody").innerHTML = `<h2>${t}</h2>${b}`; openModal("#policy");
  });

  $("#newsletter").addEventListener("submit", e => {
    e.preventDefault();
    const n = e.target.querySelector("input").value.trim();
    window.open(waLink(`Assalam o Alaikum! Mujhe ${STORE.name} ke naye offers WhatsApp par bhejein. Mera number: ${n}`), "_blank");
    e.target.reset(); toast("Shukriya! Ab aap ko offers milte rahenge.");
  });

  /* ---------------- cart ---------------- */
  let cart = store.get("cart", []).filter(l => findP(l.id) && findP(l.id).sizes[l.s]);
  const save = () => store.set("cart", cart);

  function addToCart(id, s, q = 1, open = true) {
    const line = cart.find(l => l.id === id && l.s === s);
    line ? line.q += q : cart.push({ id, s, q });
    save(); renderCart();
    if (open) setTimeout(() => openCart(false), 750);
  }
  const isPrepaid = () => (($("#checkoutForm").elements.payment || {}).value || "").startsWith("Prepaid");
  function totals() {
    const sub = cart.reduce((t, l) => t + findP(l.id).sizes[l.s].price * l.q, 0);
    const disc = isPrepaid() ? Math.round(sub * STORE.prepaidDiscount / 100) : 0;
    const del = sub === 0 || sub >= STORE.freeDeliveryAbove ? 0 : STORE.deliveryCharge;
    return { sub, disc, del, total: sub - disc + del };
  }
  function renderCart() {
    $("#cartCount").textContent = cart.reduce((t, l) => t + l.q, 0);
    $("#cartItems").innerHTML = cart.map((l, i) => {
      const p = findP(l.id), s = p.sizes[l.s];
      return `<div class="line"><img src="${p.img}" alt="">
        <div><h4>${p.name}</h4><small>${s.w}</small><div class="lp">${rs(s.price)}</div>
          <div class="qty"><button data-dec="${i}">−</button><span>${l.q}</span><button data-inc="${i}">+</button></div></div>
        <button class="rm" data-rm="${i}" aria-label="Remove">${ICON.trash}</button></div>`;
    }).join("");
    const empty = !cart.length;
    $("#cartEmpty").hidden = !empty; $("#drawerFoot").hidden = empty; $("#freeBar").hidden = empty;
    if (empty) showCartView();
    const t = totals(), left = STORE.freeDeliveryAbove - t.sub;
    $("#freeText").innerHTML = left > 0 ? `Sirf <b>${rs(left)}</b> aur, aur delivery <b>FREE!</b>` : "🎉 Mubarak ho! Aap ko <b>FREE delivery</b> mil gayi.";
    $("#freeFill").style.width = Math.min(100, t.sub / STORE.freeDeliveryAbove * 100) + "%";
    $("#subtotal").textContent = rs(t.sub);
    $("#discRow").hidden = !t.disc; $("#disc").textContent = "− " + rs(t.disc);
    $("#delivery").textContent = t.del ? rs(t.del) : "FREE";
    $("#total").textContent = rs(t.total);
  }
  $("#cartItems").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return; const d = b.dataset;
    if (d.inc) cart[d.inc].q++;
    else if (d.dec) { if (--cart[d.dec].q < 1) cart.splice(d.dec, 1); }
    else if (d.rm) cart.splice(d.rm, 1);
    else return;
    save(); renderCart();
  });

  function showCartView() {
    $("#drawerTitle").textContent = "Shopping Cart";
    $("#cartView").hidden = false; $("#checkoutForm").hidden = true;
    $("#toCheckout").hidden = false; $("#sendWa").hidden = true; $("#backToCart").hidden = true;
  }
  function showCheckout() {
    $("#drawerTitle").textContent = "Checkout";
    $("#cartView").hidden = true; $("#checkoutForm").hidden = false;
    $("#toCheckout").hidden = true; $("#sendWa").hidden = false; $("#backToCart").hidden = false;
  }
  function openCart(checkout) {
    checkout && cart.length ? showCheckout() : showCartView();
    $("#drawer").classList.add("open"); $("#overlay").classList.add("show");
  }
  function closeAll() {
    $("#drawer").classList.remove("open"); $("#mnav").classList.remove("open"); $("#overlay").classList.remove("show");
  }
  $("#openCart").onclick = () => openCart(false);
  $("#overlay").onclick = closeAll;
  $$("#drawer [data-close], #mnav [data-close]").forEach(b => b.onclick = closeAll);
  $("#toCheckout").onclick = showCheckout;
  $("#backToCart").onclick = showCartView;
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    closeAll(); $$(".modal.open").forEach(m => closeModal("#" + m.id)); $("#searchPanel").classList.remove("open");
  });

  /* checkout form */
  const form = $("#checkoutForm");
  const savedC = store.get("customer", {});
  ["name", "phone", "city", "address"].forEach(k => savedC[k] && (form.elements[k].value = savedC[k]));
  form.addEventListener("change", e => e.target.name === "payment" && renderCart());

  form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    ["name", "phone", "city", "address"].forEach(k => {
      const el = form.elements[k]; el.value = el.value.trim();
      const bad = !el.checkValidity(); el.classList.toggle("invalid", bad); if (bad) ok = false;
    });
    const err = $("#formError");
    if (!ok) { err.textContent = "Barah-e-karam laal fields theek se bharein (mobile number: 03XXXXXXXXX)."; err.hidden = false; return; }
    err.hidden = true;

    const f = Object.fromEntries(new FormData(form));
    store.set("customer", { name: f.name, phone: f.phone, city: f.city, address: f.address });
    const t = totals();
    const orderNo = "AG" + Date.now().toString().slice(-6);
    const items = cart.map((l, i) => {
      const p = findP(l.id), s = p.sizes[l.s];
      return `${i + 1}. ${p.name}\n    ${s.w} × ${l.q} = ${rs(s.price * l.q)}`;
    }).join("\n");

    const msg =
`*🛒 NEW ORDER #${orderNo}*
━━━━━━━━━━━━━━━
${items}
━━━━━━━━━━━━━━━
Subtotal: ${rs(t.sub)}${t.disc ? `\nPrepaid Discount: − ${rs(t.disc)}` : ""}
Delivery: ${t.del ? rs(t.del) : "FREE"}
*Total: ${rs(t.total)}*

*👤 Customer Details*
Name: ${f.name}
Mobile: ${f.phone}
City: ${f.city}
Address: ${f.address}
Payment: ${f.payment}${f.notes ? `\nNotes: ${f.notes}` : ""}

Order confirm kar dein, shukriya!`;

    window.open(waLink(msg), "_blank");
    cart = []; save(); renderCart(); closeAll();
    form.elements.notes.value = "";
    toast("Shukriya! WhatsApp par message bhej dein, hum jald order confirm karenge ✅", 5000);
  });

  /* toast */
  let tt;
  function toast(text, ms = 2400) {
    const el = $("#toast"); el.textContent = text; el.classList.add("show");
    clearTimeout(tt); tt = setTimeout(() => el.classList.remove("show"), ms);
  }

  updateWish(); renderCart();
})();
