(function () {
  var PAGES = window.NM_PAGES || [
    { title: "About Nutmeg", url: "index.html" },
    { title: "Foundations: colour", url: "foundations.html#colour" },
    { title: "Foundations: type", url: "foundations.html#type" },
    { title: "Foundations: space and corners", url: "foundations.html#space" },
    { title: "Foundations: contrast", url: "foundations.html#contrast" },
    { title: "V2 tokens", url: "v2-tokens.html" },
    { title: "V2 tokens: Soccer.com", url: "v2-tokens.html#soccer" },
    { title: "V2 tokens: WorldSoccerShop", url: "v2-tokens.html#wss" },
    { title: "V2 tokens: 431 Sports", url: "v2-tokens.html#431" },
    { title: "Nutmeg components", url: "components.html" },
    { title: "Buttons", url: "components.html#buttons" },
    { title: "Chips", url: "components.html#chips" },
    { title: "Tabs", url: "components.html#tabs" },
    { title: "Cards", url: "components.html#cards" },
    { title: "Table", url: "components.html#table" },
    { title: "Code block", url: "components.html#code" },
    { title: "Steps", url: "components.html#steps" },
    { title: "Icons", url: "icons.html" },
    { title: "Icons: system", url: "icons.html#system" },
    { title: "Icons: social", url: "icons.html#social" },
    { title: "Icons: payment", url: "icons.html#payment" },
    { title: "Showcase Slider", url: "showcase-slider.html" },
    { title: "Workshop videos", url: "videos.html" }
  ];

  document.querySelectorAll(".nm-nav__toggle").forEach(function (btn) {
    var sub = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      if (sub) sub.hidden = open;
    });
  });

  var nav = document.querySelector(".nm-nav");
  var menu = document.querySelector(".nm-menu-btn");
  var scrim = document.querySelector(".nm-scrim");
  if (nav && menu) {
    var setMenu = function (open) {
      nav.setAttribute("data-open", String(open));
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close the menu" : "Open the menu");
      document.body.classList.toggle("nm-locked", open);
      if (scrim) {
        if (open) { scrim.hidden = false; requestAnimationFrame(function () { scrim.setAttribute("data-open", "true"); }); }
        else { scrim.removeAttribute("data-open"); setTimeout(function () { if (nav.getAttribute("data-open") !== "true") scrim.hidden = true; }, 250); }
      }
      if (open) { setTimeout(function () { var first = nav.querySelector("a, button"); if (first) first.focus({ preventScroll: true }); }, 320); }
    };
    menu.addEventListener("click", function () { setMenu(nav.getAttribute("data-open") !== "true"); });
    if (scrim) scrim.addEventListener("click", function () { setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.getAttribute("data-open") === "true") { setMenu(false); menu.focus(); }
    });
    window.matchMedia("(min-width: 901px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });
  }

  var input = document.querySelector(".nm-search__input");
  var results = document.querySelector(".nm-search__results");
  if (input && results) {
    var matches = [];
    var sel = -1;
    var render = function () {
      var q = input.value.trim().toLowerCase();
      results.innerHTML = "";
      sel = -1;
      if (!q) { results.hidden = true; return; }
      matches = PAGES.filter(function (p) { return p.title.toLowerCase().indexOf(q) !== -1; });
      if (!matches.length) {
        var none = document.createElement("p");
        none.textContent = "Nothing matches that yet.";
        results.appendChild(none);
      }
      matches.forEach(function (p) {
        var a = document.createElement("a");
        a.href = p.url;
        a.textContent = p.title;
        a.setAttribute("role", "option");
        results.appendChild(a);
      });
      results.hidden = false;
    };
    input.addEventListener("input", render);
    input.addEventListener("keydown", function (e) {
      var links = results.querySelectorAll("a");
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!links.length) return;
        sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
        links.forEach(function (l, i) { l.setAttribute("aria-selected", String(i === sel)); });
      } else if (e.key === "Enter" && links.length) {
        window.location.href = links[Math.max(sel, 0)].href;
      } else if (e.key === "Escape") {
        input.value = ""; render(); input.blur();
      }
    });
    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); input.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".nm-search")) results.hidden = true;
    });
  }

  document.querySelectorAll(".nm-anchor").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.closest("[id]").id;
      var url = location.href.split("#")[0] + "#" + id;
      history.replaceState(null, "", "#" + id);
      if (navigator.clipboard) navigator.clipboard.writeText(url).catch(function () {});
      btn.setAttribute("data-copied", "true");
      setTimeout(function () { btn.removeAttribute("data-copied"); }, 1600);
    });
  });

  document.querySelectorAll("[role='tablist']").forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll("[role='tab']"));
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel && !list.hasAttribute("data-demo-widths")) panel.hidden = !on;
      });
      if (focus) tab.focus();
      if (tab.dataset.hash) history.replaceState(null, "", "#" + tab.dataset.hash);
      list.dispatchEvent(new CustomEvent("nm-tab", { detail: tab }));
    };
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t, false); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          select(tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length], true);
        }
      });
    });
    var fromHash = tabs.filter(function (t) { return t.dataset.hash && "#" + t.dataset.hash === location.hash; })[0];
    if (fromHash) select(fromHash, false);
  });

  document.querySelectorAll(".nm-copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pre = btn.closest(".nm-codeblock").querySelector("pre");
      var label = btn.querySelector("span");
      var done = function () { label.textContent = "Copied"; setTimeout(function () { label.textContent = "Copy code"; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(pre.textContent).then(done, function () {});
    });
  });

  var fit = function (frame) {
    var h = (frame.getAttribute("data-heights") || "").split(",").map(Number);
    if (h.length !== 3) return;
    var w = frame.getBoundingClientRect().width;
    frame.style.height = (w < 640 ? h[0] : w < 1024 ? h[1] : h[2]) + "px";
  };
  document.querySelectorAll(".nm-demo__frame[data-heights]").forEach(function (frame) {
    fit(frame);
    if (window.ResizeObserver) new ResizeObserver(function () { fit(frame); }).observe(frame);
  });

  document.querySelectorAll("[data-demo-widths]").forEach(function (list) {
    var frame = document.getElementById(list.getAttribute("data-demo-widths"));
    list.addEventListener("nm-tab", function (e) {
      var w = e.detail.getAttribute("data-width");
      frame.style.width = w === "full" ? "100%" : w + "px";
    });
  });
})();
