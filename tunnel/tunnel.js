(function () {
  var BRANDS = {
    "vendor": { name: "Vendor", rail: "Vendor" },
    "soccer-com": { name: "Soccer.com", logo: "../nutmeg/logos/Logos_sdc.png", w: 177, h: 44 },
    "wss": { name: "WorldSoccerShop", logo: "../nutmeg/logos/Logos_wss.png", w: 177, h: 47 },
    "431": { name: "431 Sports", logo: "../nutmeg/logos/Logos_431.png", w: 72, h: 72 },
    "team-soccer": { name: "Team Soccer" },
    "spg": { name: "SPG" },
    "soccer-master": { name: "Soccer Master", logo: "../nutmeg/logos/Logos_soccermaster.png", w: 143, h: 61 }
  };

  var SECTIONS = [
    { label: "Team & Player", items: [] },
    { label: "Product Category", items: [] },
    { label: "Social", items: ["Instagram", "YouTube"], open: true },
    { label: "Media Type", items: ["Photo", "Video", "Audio", "Illustration"], open: true },
    { label: "Campaigns", items: [] },
    { label: "Brand Decks", items: [] }
  ];

  var CHEV = '<svg class="nm-drawer__chev" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M5 9L12 16L19 9" stroke="currentColor" stroke-width="1.5"/></svg>';

  var $ = function (id) { return document.getElementById(id); };
  var home = $("tn-home"), brand = $("tn-brand"), drawer = $("tn-drawer");
  var list = $("tn-drawer-list"), where = $("tn-where"), note = $("tn-note");
  var rail = document.querySelectorAll(".nm-rail__item");
  var current = null;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function buildDrawer() {
    list.innerHTML = SECTIONS.map(function (s, i) {
      var id = "tn-sub-" + i;
      var sub = s.items.length
        ? s.items.map(function (it) {
            return '<li><button class="nm-drawer__sublink" type="button" data-section="' + esc(s.label) + '" data-item="' + esc(it) + '"><span class="tn-dot" aria-hidden="true">&bull;</span>' + esc(it) + "</button></li>";
          }).join("")
        : '<li><p class="tn-empty">Nothing filed here yet.</p></li>';
      return '<li><button class="nm-drawer__toggle" type="button" aria-expanded="' + (s.open ? "true" : "false") + '" aria-controls="' + id + '">' + esc(s.label) + CHEV + "</button>" +
        '<ul class="nm-drawer__sub" id="' + id + '"' + (s.open ? "" : " hidden") + ">" + sub + "</ul></li>";
    }).join("");
  }

  function setWhere(b, section, item) {
    where.textContent = section ? b.name + " › " + section + " › " + item : b.name;
    note.textContent = section ? "No " + item.toLowerCase() + " assets are connected to this view yet." : "Pick a section from the menu, or search " + b.name + ".";
  }

  function render() {
    var key = (location.hash.replace(/^#\/?/, "") || "home").toLowerCase();
    if (key !== "home" && !BRANDS[key]) key = "home";
    rail.forEach(function (a) {
      if (a.getAttribute("data-view") === key) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    if (key === "home") {
      home.hidden = false; brand.hidden = true; drawer.hidden = true;
      document.title = "The Tunnel";
      current = null;
      return;
    }
    var b = BRANDS[key];
    home.hidden = true; brand.hidden = false; drawer.hidden = false;
    document.title = b.name + " | The Tunnel";
    document.body.setAttribute("data-brand", key);
    $("tn-drawer-title").textContent = b.name;
    $("tn-brand-name").innerHTML = b.logo
      ? '<img src="' + b.logo + '" width="' + b.w + '" height="' + b.h + '" alt="' + esc(b.name) + '">'
      : '<span class="tn-brand__word">' + esc(b.name) + "</span>";
    var input = $("tn-brand-search");
    input.placeholder = "Search " + b.name;
    input.value = "";
    $("tn-brand-search-label").textContent = "Search " + b.name;
    if (current !== key) { buildDrawer(); current = key; }
    setWhere(b);
  }

  list.addEventListener("click", function (e) {
    var t = e.target.closest(".nm-drawer__toggle");
    if (t) {
      var open = t.getAttribute("aria-expanded") === "true";
      t.setAttribute("aria-expanded", open ? "false" : "true");
      $(t.getAttribute("aria-controls")).hidden = open;
      return;
    }
    var s = e.target.closest(".nm-drawer__sublink");
    if (s) {
      list.querySelectorAll(".nm-drawer__sublink").forEach(function (x) { x.removeAttribute("aria-current"); });
      s.setAttribute("aria-current", "page");
      setWhere(BRANDS[current], s.getAttribute("data-section"), s.getAttribute("data-item"));
      closeMenu();
    }
  });

  document.querySelectorAll(".tn-search").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = f.querySelector("input").value.trim();
      if (!q) return;
      if (f.getAttribute("data-search") === "brand" && current) {
        where.textContent = "“" + q + "” in " + BRANDS[current].name;
        note.textContent = "Search results appear here once this view is connected to the library.";
      }
    });
  });

  var btn = document.querySelector(".nm-menu-btn"), nav = $("tn-nav"), scrim = document.querySelector(".nm-scrim");
  function closeMenu() {
    btn.setAttribute("aria-expanded", "false");
    nav.removeAttribute("data-open"); scrim.removeAttribute("data-open"); scrim.hidden = true;
    document.body.classList.remove("nm-locked");
  }
  btn.addEventListener("click", function () {
    if (btn.getAttribute("aria-expanded") === "true") return closeMenu();
    btn.setAttribute("aria-expanded", "true");
    scrim.hidden = false;
    requestAnimationFrame(function () { nav.setAttribute("data-open", "true"); scrim.setAttribute("data-open", "true"); });
    document.body.classList.add("nm-locked");
  });
  scrim.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); $("tn-quick").focus(); }
  });
  rail.forEach(function (a) { a.addEventListener("click", closeMenu); });

  window.addEventListener("hashchange", render);
  render();
})();
