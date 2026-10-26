(function () {
  var NUTMEG_ONLY = /^(foundations|v2-tokens|icons|components)\.html/;
  var inVolley = document.body.getAttribute("data-hub") === "volley";
  var PAGES = (window.NM_PAGES || [
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
  ]).filter(function (p) { return !inVolley || !NUTMEG_ONLY.test(p.url); });

  document.querySelectorAll(".nm-drawer__toggle").forEach(function (btn) {
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
    window.matchMedia("(min-width: 1025px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });
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
      else if (list.querySelector("[data-hash]") && location.hash) history.replaceState(null, "", location.pathname + location.search);
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
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  var riseTargets = function () {
    var cards = Array.prototype.slice.call(document.querySelectorAll("#block-grid .nm-card"));
    if (cards.length) return cards;
    if (document.body.getAttribute("data-page") !== "block") return [];
    var secs = Array.prototype.slice.call(document.querySelectorAll(".nm-content > .nm-section"));
    var rank = function (el) { return el.querySelector(".nm-demo") ? 0 : el.id === "heights" ? 1 : 2; };
    return secs.map(function (el, i) { return { el: el, r: rank(el), i: i }; })
      .sort(function (a, b) { return a.r - b.r || a.i - b.i; })
      .map(function (o) { return o.el; });
  };

  var order = riseTargets();
  var start = performance.now();

  var settle = function (el) {
    el.classList.remove("nm-rising");
    el.style.transitionDelay = "";
  };

  var rise = function (els, base) {
    els.forEach(function (el, i) {
      el.classList.add("nm-rising");
      el.style.transitionDelay = (base + i * 35) + "ms";
      var done = function (e) {
        if (e.target !== el) return;
        el.removeEventListener("transitionend", done);
        settle(el);
      };
      el.addEventListener("transitionend", done);
      setTimeout(function () { settle(el); }, base + i * 35 + 900);
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { els.forEach(function (el) { el.classList.add("nm-risen"); }); });
    });
  };

  var queue = [];
  var flush = function () {
    var batch = queue.splice(0).filter(function (el) { return !el.classList.contains("nm-risen"); });
    batch.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });
    rise(batch, Math.max(0, 250 - (performance.now() - start)));
  };

  var riseIO = null;
  if (order.length) {
    if ("IntersectionObserver" in window) {
      riseIO = new IntersectionObserver(function (entries) {
        var fresh = !queue.length;
        entries.forEach(function (en) {
          if (en.isIntersecting) { queue.push(en.target); riseIO.unobserve(en.target); }
        });
        if (fresh && queue.length) requestAnimationFrame(flush);
      }, { rootMargin: "0px 0px -40px 0px" });
      order.forEach(function (el) { riseIO.observe(el); });
    } else {
      order.forEach(function (el) { el.classList.add("nm-risen"); });
    }
  }

  window.NM = window.NM || {};
  window.NM.replay = function (els) {
    els.forEach(function (el) { settle(el); el.classList.remove("nm-risen"); });
    void document.body.offsetHeight;
    var now = [];
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) now.push(el);
      else if (riseIO) riseIO.observe(el);
      else el.classList.add("nm-risen");
    });
    rise(now, 0);
  };

  var hoverable = window.matchMedia("(hover: hover) and (pointer: fine)");
  var videos = Array.prototype.slice.call(document.querySelectorAll(".nm-card__video"));
  var btnOf = function (v) { return v.parentNode.querySelector(".nm-card__video-btn"); };
  var mark = function (v, playing) {
    var b = btnOf(v);
    if (!b) return;
    b.setAttribute("data-playing", String(playing));
    b.setAttribute("aria-label", playing ? "Pause preview video" : "Play preview video");
  };
  var load = function (v) {
    if (!v.getAttribute("src") && v.dataset.src) { v.src = v.dataset.src; v.load(); }
  };
  var play = function (v) {
    load(v);
    var p = v.play();
    if (p && p.catch) p.catch(function () { mark(v, false); });
    mark(v, true);
  };
  var stop = function (v, rewind) {
    v.pause();
    if (rewind) { try { v.currentTime = 0; } catch (e) {} }
    mark(v, false);
  };
  var auto = function (v) { return !reduce.matches && v.dataset.userPaused !== "true"; };

  videos.forEach(function (v) {
    var card = v.closest(".nm-card");
    var b = btnOf(v);
    mark(v, false);
    if (b) b.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!v.paused) { v.dataset.userPaused = "true"; stop(v, false); }
      else { v.dataset.userPaused = "false"; play(v); }
    });
    if (!card) return;
    card.addEventListener("mouseenter", function () { if (hoverable.matches && auto(v)) play(v); });
    card.addEventListener("mouseleave", function () { if (hoverable.matches && !card.contains(document.activeElement)) stop(v, true); });
    card.addEventListener("focusin", function () { if (auto(v)) play(v); });
    card.addEventListener("focusout", function (e) { if (!card.contains(e.relatedTarget)) stop(v, true); });
  });

  if (videos.length && "IntersectionObserver" in window) {
    var nearIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { load(en.target); nearIO.unobserve(en.target); } });
    }, { rootMargin: "240px 0px" });
    var viewIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (!en.isIntersecting || en.intersectionRatio < 0.6) { if (!v.paused) stop(v, false); return; }
        if (!hoverable.matches && auto(v)) play(v);
      });
    }, { threshold: [0, 0.6] });
    videos.forEach(function (v) { nearIO.observe(v); viewIO.observe(v); });
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") videos.forEach(function (v) { if (!v.paused) stop(v, false); });
  });

  var filter = document.getElementById("block-filter");
  if (filter) {
    filter.addEventListener("nm-tab", function (e) {
      var f = e.detail.getAttribute("data-filter");
      var shown = [];
      document.querySelectorAll("#block-grid .nm-type").forEach(function (sec) {
        sec.hidden = f !== "all" && sec.getAttribute("data-type") !== f;
        if (!sec.hidden) shown = shown.concat(Array.prototype.slice.call(sec.querySelectorAll(".nm-card")));
      });
      window.NM.replay(shown);
    });
    var picked = filter.querySelector('[aria-selected="true"]');
    if (picked && picked.getAttribute("data-filter") !== "all") filter.dispatchEvent(new CustomEvent("nm-tab", { detail: picked }));
  }

  // Live Email Block Editor for Brock (Volley Email components & templates)
  var isEmailPage = /^email-/.test(location.pathname.split("/").pop() || "") || document.querySelector(".nm-demo[data-email-block]");
  if (isEmailPage) {
    var BRAND_SWATCHES = [
      { hex: "#000000", name: "Black" },
      { hex: "#2162E4", name: "Soccer Blue" },
      { hex: "#EEFF4F", name: "Neon Yellow" },
      { hex: "#0D1A12", name: "Evergreen" },
      { hex: "#0E0E0E", name: "Chivas Obsidian" },
      { hex: "#FFE014", name: "Chivas Gold" },
      { hex: "#F4EDE1", name: "Cream" },
      { hex: "#FFFFFF", name: "White" }
    ];
    var QUICK_LINKS = [
      { label: "Pick a checked link", url: "" },
      { label: "Soccer.com Home", url: "https://www.soccer.com/" },
      { label: "Soccer.com Sale", url: "https://www.soccer.com/shop/sale" },
      { label: "Soccer.com Footwear", url: "https://www.soccer.com/shop/footwear" },
      { label: "Soccer.com Jerseys", url: "https://www.soccer.com/shop/jerseys" },
      { label: "WSS Home", url: "https://www.worldsoccershop.com/" },
      { label: "WSS Ready to Ship", url: "https://www.worldsoccershop.com/shop/products/ready-to-ship" },
      { label: "WSS Chivas Shop", url: "https://www.worldsoccershop.com/shop/clubs/chivas" }
    ];
    var S3_HOSTS = [
      { label: "Preview files (not for sending)", base: "" },
      { label: "Soccer.com image bucket", base: "https://sei-clubs.s3.amazonaws.com/sasSOCsoccer/images/emails/holiday26/" },
      { label: "WorldSoccerShop image bucket", base: "https://sei-wss-web.s3.us-east-1.amazonaws.com/sasWSSworldsoccershop/images/emails/" }
    ];

    var normalizeHex = function (h) {
      var s = (h || "").trim().toUpperCase();
      if (/^#[0-9A-F]{3}$/.test(s)) {
        return "#" + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
      }
      return /^#[0-9A-F]{6}$/.test(s) ? s : "#000000";
    };

    var buildUtmUrl = function (rawUrl, campaign, contentTag) {
      if (!rawUrl || rawUrl.indexOf("http") !== 0) return rawUrl;
      var camp = (campaign || "").trim();
      var cont = (contentTag || "").trim();
      if (!camp && !cont) return rawUrl;
      try {
        var u = new URL(rawUrl);
        u.searchParams.set("utm_source", "zeta");
        u.searchParams.set("utm_medium", "email");
        if (camp) u.searchParams.set("utm_campaign", camp);
        if (cont) u.searchParams.set("utm_content", cont);
        return u.toString();
      } catch (e) {
        return rawUrl;
      }
    };

    var findCodeForDemo = function (demo) {
      var next = demo.nextElementSibling;
      if (next && next.classList.contains("nm-codeblock")) return next;
      var sec = demo.closest(".nm-section");
      if (sec) {
        var cbs = sec.querySelectorAll(".nm-codeblock");
        if (cbs.length === 1) return cbs[0];
      }
      var allCbs = document.querySelectorAll(".nm-codeblock");
      return allCbs.length === 1 ? allCbs[0] : null;
    };

    var demos = Array.prototype.slice.call(document.querySelectorAll(".nm-demo"));
    demos.forEach(function (demo, demoIdx) {
      var codeBlock = findCodeForDemo(demo);
      var frame = demo.querySelector("iframe.nm-demo__frame");
      if (!codeBlock || !frame) return;
      var codeEl = codeBlock.querySelector("pre code");
      if (!codeEl) return;

      var origCode = codeEl.textContent;
      var frameSrc = frame.getAttribute("src") || "";
      var baseHref = "";
      try {
        baseHref = new URL(frameSrc, location.href).href.replace(/[^/]*$/, "").replace(/blocks\/$/, "");
      } catch (e) {
        baseHref = "";
      }

      var blockId = demo.getAttribute("data-email-block") || (frame.id || ("block-" + (demoIdx + 1))).replace(/^frame-/, "");
      var isChivas = /chivas/i.test(blockId) || /chivas/i.test(location.pathname);
      var defaultCampaign = isChivas ? "WSS_10302026_Chivas_Third" : "SDC_10302026_Holiday_Kickoff";
      var defaultContent = blockId.replace(/^email-block-/, "").replace(/-/g, "_");

      // Parse initial snippet to discover editable text, colors, images, and links
      var probe = document.createElement("div");
      probe.innerHTML = origCode;

      // 1. Discover editable text nodes
      var textSpecs = [];
      var walkText = function (node) {
        if (node.nodeType === 1) {
          var tag = node.tagName.toUpperCase();
          if (tag === "STYLE" || tag === "SCRIPT" || tag === "NOSCRIPT") return;
          var styleAttr = node.getAttribute("style") || "";
          var isPreheader = /display\s*:\s*none/i.test(styleAttr) && node.textContent.trim().length > 0;
          if (isPreheader) {
            var cleanPre = node.textContent.replace(/[\u2007\uFEFF\u034F\s]+$/g, "").trim();
            if (cleanPre) {
              textSpecs.push({ label: "Hidden preview text (inbox line)", initial: cleanPre, isPreheader: true });
            }
            return;
          }
        }
        var children = node.childNodes;
        for (var i = 0; i < children.length; i++) {
          var ch = children[i];
          if (ch.nodeType === 3) {
            var val = ch.nodeValue.replace(/\u00a0/g, " ").trim();
            if (val.length > 0) {
              var parentTag = (node.tagName || "").toUpperCase();
              var lbl = "Text " + (textSpecs.length + 1);
              if (/code:/i.test(val)) lbl = "Promo code";
              else if (parentTag === "A" || (node.closest && node.closest("a"))) lbl = "Button text: " + val.slice(0, 22);
              else lbl = "Text: " + val.slice(0, 24) + (val.length > 24 ? "..." : "");
              textSpecs.push({ label: lbl, initial: val, isPreheader: false });
            }
          } else if (ch.nodeType === 1) {
            walkText(ch);
          }
        }
      };
      walkText(probe);

      // 2. Discover distinct hex colors
      var colorMatches = origCode.match(/#[0-9A-Fa-f]{6}\b/g) || [];
      var uniqueColors = [];
      colorMatches.forEach(function (c) {
        var up = c.toUpperCase();
        if (uniqueColors.indexOf(up) === -1) uniqueColors.push(up);
      });

      // 3. Discover images (separate main content images from tiny 27px decorative border slices)
      var imgEls = Array.prototype.slice.call(probe.querySelectorAll("img"));
      var imgSpecs = [];
      imgEls.forEach(function (img, idx) {
        var w = Number(img.getAttribute("width") || 0);
        var src = img.getAttribute("src") || "";
        var alt = img.getAttribute("alt") || "";
        var isSlice = (w > 0 && w <= 36) && alt === "";
        var shortName = src.split("/").pop().split("?")[0] || ("Image " + (idx + 1));
        imgSpecs.push({
          index: idx,
          shortName: shortName,
          w: w,
          h: Number(img.getAttribute("height") || 0),
          src: src,
          alt: alt,
          isSlice: isSlice
        });
      });

      // 4. Discover unique links
      var aEls = Array.prototype.slice.call(probe.querySelectorAll("a[href]"));
      var linkSpecs = [];
      aEls.forEach(function (a, idx) {
        var href = a.getAttribute("href") || "";
        var txt = a.textContent.trim();
        var imgInA = a.querySelector("img");
        var desc = txt || (imgInA ? (imgInA.getAttribute("alt") || imgInA.getAttribute("src") || "Image link") : ("Link " + (idx + 1)));
        linkSpecs.push({ index: idx, label: desc.slice(0, 32), href: href });
      });

      // State object
      var state = {
        campaign: defaultCampaign,
        contentTag: defaultContent,
        s3Base: "",
        altTest: false,
        texts: textSpecs.map(function (t) { return t.initial; }),
        colors: {},
        imgs: imgSpecs.map(function (im) { return { src: im.src, alt: im.alt }; }),
        links: linkSpecs.map(function (lk) { return lk.href; })
      };
      uniqueColors.forEach(function (c) { state.colors[c] = c; });

      // Build the editor from Nutmeg parts: eyebrow, serif title, cards, pill buttons.
      // Edits wait in state until Brock presses Update preview.
      var el = function (tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text !== undefined) n.textContent = text;
        return n;
      };
      var makeField = function (labelText, control, hintText) {
        var f = el("label", "nm-field");
        f.appendChild(el("span", "nm-field__label", labelText));
        f.appendChild(control);
        if (hintText) f.appendChild(el("span", "nm-field__hint", hintText));
        return f;
      };
      var makeInput = function (value, placeholder) {
        var i = el("input", "nm-input");
        i.type = "text";
        i.value = value || "";
        if (placeholder) i.placeholder = placeholder;
        return i;
      };
      var makeGroup = function (eyebrow, title, open) {
        var g = el("details", "nm-card nm-card--open nm-email-editor__group");
        if (open) g.open = true;
        var head = el("summary", "nm-email-editor__summary");
        var headText = el("div");
        headText.appendChild(el("span", "nm-eyebrow", eyebrow));
        headText.appendChild(el("span", "nm-card__title", title));
        head.appendChild(headText);
        head.insertAdjacentHTML("beforeend", '<svg class="nm-email-editor__chev" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M5 9L12 16L19 9" stroke="currentColor" stroke-width="1.5"/></svg>');
        g.appendChild(head);
        var grid = el("div", "nm-email-editor__grid");
        g.appendChild(grid);
        return { card: g, grid: grid };
      };

      var dirty = false;
      var statusChip;
      var markDirty = function () {
        dirty = true;
        statusChip.textContent = "Changes not in the preview yet";
        statusChip.className = "nm-chip nm-chip--yellow nm-chip--sm";
      };
      var markClean = function () {
        dirty = false;
        statusChip.textContent = "Preview and code are up to date";
        statusChip.className = "nm-chip nm-chip--green nm-chip--sm";
      };

      var barLabel = codeBlock.querySelector(".nm-codeblock__bar > span");
      if (barLabel) barLabel.textContent = "HTML for a Zeta HTML block (updates when you press Update preview)";

      var editor = el("section", "nm-email-editor");
      editor.setAttribute("aria-label", "Change this block");

      var bar = el("div", "nm-email-editor__head");
      var titleWrap = el("div", "nm-email-editor__title");
      titleWrap.appendChild(el("span", "nm-eyebrow", "Live editor"));
      var titleRow = el("div", "nm-email-editor__title-row");
      titleRow.appendChild(el("h3", "nm-card__title", "Change this block"));
      statusChip = el("span", "nm-chip nm-chip--green nm-chip--sm", "Preview and code are up to date");
      titleRow.appendChild(statusChip);
      titleWrap.appendChild(titleRow);
      titleWrap.appendChild(el("p", "nm-email-editor__lede", "Make your changes, then press Update preview. The code block below updates at the same time."));

      var makeActions = function () {
        var actions = el("div", "nm-email-editor__actions");
        var applyBtn = el("button", "nm-btn", "Update preview");
        applyBtn.type = "button";
        applyBtn.addEventListener("click", function () { sync(); markClean(); });
        actions.appendChild(applyBtn);
        return actions;
      };
      var actions = makeActions();
      var altBtn = el("button", "nm-btn nm-btn--outline", "Show it with images blocked");
      altBtn.type = "button";
      altBtn.setAttribute("aria-pressed", "false");
      var resetBtn = el("button", "nm-btn nm-btn--text", "Start again");
      resetBtn.type = "button";
      actions.appendChild(altBtn);
      actions.appendChild(resetBtn);
      bar.appendChild(titleWrap);
      bar.appendChild(actions);
      editor.appendChild(bar);

      var body = el("div", "nm-email-editor__body");
      var allControls = [];
      var watch = function (input, handler) {
        input.addEventListener("input", function () { handler(); markDirty(); });
      };

      // 1. Words
      if (textSpecs.length) {
        var gText = makeGroup("1. Words", "Text and promo code", true);
        textSpecs.forEach(function (spec, idx) {
          var inp = makeInput(spec.initial);
          watch(inp, function () { state.texts[idx] = inp.value; });
          allControls.push(function () { inp.value = spec.initial; });
          gText.grid.appendChild(makeField(spec.label, inp));
        });
        body.appendChild(gText.card);
      }

      // 2. Images
      var mainImgs = imgSpecs.filter(function (im) { return !im.isSlice; });
      if (mainImgs.length) {
        var gImg = makeGroup("2. Images", "Pictures and alt text", true);
        mainImgs.forEach(function (im) {
          var card = el("div", "nm-email-editor__img");
          var head = el("span", "nm-eyebrow", im.shortName + (im.w ? ", " + im.w + " by " + im.h : ""));
          var srcIn = makeInput(im.src, "Image address");
          var altIn = makeInput(im.alt, "Say what the picture shows or what the offer is");
          var skuRow = el("div", "nm-email-editor__inline");
          var skuIn = makeInput("", "Article number, like A1142072");
          var skuBtn = el("button", "nm-btn nm-btn--outline", "Load PDP image");
          skuBtn.type = "button";
          skuBtn.addEventListener("click", function () {
            var rawSku = skuIn.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
            if (!rawSku) return;
            var ihUrl = "https://www.imagehandler.net/preview/?istyle=0000&fmt=png&w=1200&h=1200&cmp=100&c=999&img=" + rawSku + "000&iset=0100&iindex=0088";
            state.imgs[im.index].src = ihUrl;
            srcIn.value = ihUrl;
            markDirty();
          });
          skuRow.appendChild(skuIn);
          skuRow.appendChild(skuBtn);
          watch(srcIn, function () { state.imgs[im.index].src = srcIn.value; });
          watch(altIn, function () { state.imgs[im.index].alt = altIn.value; });
          allControls.push(function () {
            srcIn.value = im.src;
            altIn.value = im.alt;
            skuIn.value = "";
          });
          card.appendChild(head);
          card.appendChild(makeField("Image address", srcIn));
          card.appendChild(makeField("Alt text", altIn, "Outlook shows this when images are blocked."));
          card.appendChild(makeField("Or swap in a PDP image", skuRow, "Type the article number and the product photo from the product page replaces this image."));
          gImg.grid.appendChild(card);
        });
        body.appendChild(gImg.card);
      }

      // 3. Links
      if (linkSpecs.length) {
        var gLink = makeGroup("3. Links", "Where each link goes", false);
        linkSpecs.forEach(function (lk, idx) {
          var row = el("div", "nm-email-editor__inline");
          var urlIn = makeInput(lk.href);
          var pick = el("select", "nm-select nm-select--narrow");
          QUICK_LINKS.forEach(function (ql) {
            var opt = el("option", "", ql.label);
            opt.value = ql.url;
            pick.appendChild(opt);
          });
          pick.addEventListener("change", function () {
            if (!pick.value) return;
            state.links[idx] = pick.value;
            urlIn.value = pick.value;
            markDirty();
          });
          watch(urlIn, function () { state.links[idx] = urlIn.value; });
          allControls.push(function () {
            urlIn.value = lk.href;
            pick.selectedIndex = 0;
          });
          row.appendChild(urlIn);
          row.appendChild(pick);
          gLink.grid.appendChild(makeField("Link " + (idx + 1) + ": " + lk.label, row));
        });
        body.appendChild(gLink.card);
      }

      // 4. Colours
      if (uniqueColors.length) {
        var gCol = makeGroup("4. Colours", "Colours in this block", false);
        uniqueColors.forEach(function (origHex) {
          var field = el("div", "nm-field");
          var sp = el("span", "nm-field__label", "Colour ");
          sp.appendChild(el("span", "nm-code", origHex));
          var row = el("div", "nm-email-editor__color-row");
          var picker = el("input", "nm-color");
          picker.type = "color";
          picker.value = normalizeHex(origHex);
          picker.setAttribute("aria-label", "Pick a colour to replace " + origHex);
          var hexIn = makeInput(origHex);
          hexIn.classList.add("nm-input--mono");
          hexIn.setAttribute("aria-label", "Colour code to replace " + origHex);
          var swatchRow = el("div", "nm-email-editor__swatches");
          BRAND_SWATCHES.forEach(function (sw) {
            var b = el("button", "nm-email-editor__swatch");
            b.type = "button";
            var dot = el("span", "nm-email-editor__swatch-dot");
            dot.style.backgroundColor = sw.hex;
            b.appendChild(dot);
            b.appendChild(el("span", "", sw.name));
            b.setAttribute("aria-label", "Use " + sw.name + " " + sw.hex);
            b.addEventListener("click", function () {
              state.colors[origHex] = sw.hex;
              picker.value = sw.hex;
              hexIn.value = sw.hex;
              markDirty();
            });
            swatchRow.appendChild(b);
          });
          watch(picker, function () {
            var v = picker.value.toUpperCase();
            state.colors[origHex] = v;
            hexIn.value = v;
          });
          watch(hexIn, function () {
            var v = hexIn.value.trim();
            if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
              state.colors[origHex] = v.toUpperCase();
              picker.value = v.toUpperCase();
            }
          });
          allControls.push(function () {
            picker.value = normalizeHex(origHex);
            hexIn.value = origHex;
          });
          row.appendChild(picker);
          row.appendChild(hexIn);
          field.appendChild(sp);
          field.appendChild(row);
          field.appendChild(swatchRow);
          gCol.grid.appendChild(field);
        });
        body.appendChild(gCol.card);
      }

      // 5. Tracking and image folder
      var gTrack = makeGroup("5. Tracking", "Campaign name and image folder", false);
      var inCamp = makeInput(state.campaign);
      watch(inCamp, function () { state.campaign = inCamp.value; });
      gTrack.grid.appendChild(makeField("Campaign name", inCamp, "Added to every link so Google Analytics knows the send."));
      var inCont = makeInput(state.contentTag);
      watch(inCont, function () { state.contentTag = inCont.value; });
      gTrack.grid.appendChild(makeField("Block name", inCont, "Tells Analytics which block was clicked."));
      var selS3 = el("select", "nm-select");
      S3_HOSTS.forEach(function (h) {
        var opt = el("option", "", h.label);
        opt.value = h.base;
        selS3.appendChild(opt);
      });
      selS3.addEventListener("change", function () { state.s3Base = selS3.value; markDirty(); });
      gTrack.grid.appendChild(makeField("Where the images live", selS3, "Pick the bucket before you copy the code."));
      body.appendChild(gTrack.card);

      editor.appendChild(body);
      var foot = el("div", "nm-email-editor__foot");
      foot.appendChild(makeActions());
      editor.appendChild(foot);
      demo.parentNode.insertBefore(editor, demo.nextSibling);

      // Build updated HTML string from current state
      var generateHtml = function (forPreview) {
        var box = document.createElement("div");
        box.innerHTML = origCode;

        // Apply text changes
        var tCursor = 0;
        var applyText = function (node) {
          if (node.nodeType === 1) {
            var tag = node.tagName.toUpperCase();
            if (tag === "STYLE" || tag === "SCRIPT" || tag === "NOSCRIPT") return;
            var styleAttr = node.getAttribute("style") || "";
            var isPreheader = /display\s*:\s*none/i.test(styleAttr) && node.textContent.trim().length > 0;
            if (isPreheader) {
              var cleanPre = node.textContent.replace(/[\u2007\uFEFF\u034F\s]+$/g, "").trim();
              if (cleanPre) {
                var newPre = state.texts[tCursor] !== undefined ? state.texts[tCursor] : cleanPre;
                tCursor++;
                node.innerHTML = newPre + "&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;";
              }
              return;
            }
          }
          var children = node.childNodes;
          for (var i = 0; i < children.length; i++) {
            var ch = children[i];
            if (ch.nodeType === 3) {
              var val = ch.nodeValue.replace(/\u00a0/g, " ").trim();
              if (val.length > 0) {
                var updated = state.texts[tCursor];
                tCursor++;
                if (updated !== undefined) {
                  ch.nodeValue = updated;
                }
              }
            } else if (ch.nodeType === 1) {
              applyText(ch);
            }
          }
        };
        applyText(box);

        // Apply image changes
        var curImgs = box.querySelectorAll("img");
        for (var i = 0; i < curImgs.length; i++) {
          if (state.imgs[i]) {
            var rawSrc = state.imgs[i].src;
            if (!forPreview && state.s3Base && /^assets\//.test(rawSrc)) {
              rawSrc = state.s3Base + rawSrc.replace(/^assets\//, "");
            }
            curImgs[i].setAttribute("src", rawSrc);
            curImgs[i].setAttribute("alt", state.imgs[i].alt);
          }
        }

        // Apply link & UTM changes
        var curLinks = box.querySelectorAll("a[href]");
        for (var j = 0; j < curLinks.length; j++) {
          if (state.links[j] !== undefined) {
            var tagged = buildUtmUrl(state.links[j], state.campaign, state.contentTag);
            curLinks[j].setAttribute("href", tagged);
          }
        }

        var out = box.innerHTML;

        // Apply hex color replacements safely via placeholders
        var keys = Object.keys(state.colors);
        keys.forEach(function (origHex, kIdx) {
          var re = new RegExp(origHex, "gi");
          out = out.replace(re, "__NM_HEX_" + kIdx + "__");
        });
        keys.forEach(function (origHex, kIdx) {
          var targetHex = state.colors[origHex] || origHex;
          out = out.replace(new RegExp("__NM_HEX_" + kIdx + "__", "g"), targetHex);
        });

        return out;
      };

      var sync = function () {
        var finalCode = generateHtml(false);
        codeEl.textContent = finalCode;

        var previewInner = generateHtml(true);
        var altStyle = state.altTest
          ? "img { display:none !important; } a, td { color:#EEFF4F; }"
          : "";
        var altScript = state.altTest
          ? "<script>document.querySelectorAll('img').forEach(function(im){var d=document.createElement('div');d.style.cssText='padding:18px 12px;border:1px dashed #EEFF4F;background:#151515;color:#FFFFFF;font-family:monospace;font-size:13px;text-align:center;';d.textContent='[IMG BLOCKED] Alt: '+(im.getAttribute('alt')||'(empty decorative alt)');im.parentNode.insertBefore(d,im);});<\/script>"
          : "";

        var docHtml = '<!DOCTYPE html><html><head><meta charset="utf-8">' +
          (baseHref ? '<base href="' + baseHref + '">' : '') +
          '<style>html,body{margin:0;padding:0;background:#141414;}' + altStyle + '</style></head><body>' +
          previewInner + altScript + '</body></html>';
        frame.srcdoc = docHtml;
      };

      altBtn.addEventListener("click", function () {
        state.altTest = !state.altTest;
        altBtn.setAttribute("aria-pressed", String(state.altTest));
        altBtn.textContent = state.altTest ? "Show the images again" : "Show it with images blocked";
        sync();
        markClean();
      });

      resetBtn.addEventListener("click", function () {
        state.campaign = defaultCampaign;
        state.contentTag = defaultContent;
        state.s3Base = "";
        state.altTest = false;
        inCamp.value = defaultCampaign;
        inCont.value = defaultContent;
        selS3.selectedIndex = 0;
        altBtn.setAttribute("aria-pressed", "false");
        altBtn.textContent = "Show it with images blocked";
        textSpecs.forEach(function (t, i) { state.texts[i] = t.initial; });
        uniqueColors.forEach(function (c) { state.colors[c] = c; });
        imgSpecs.forEach(function (im, i) { state.imgs[i] = { src: im.src, alt: im.alt }; });
        linkSpecs.forEach(function (lk, i) { state.links[i] = lk.href; });
        allControls.forEach(function (fn) { fn(); });
        codeEl.textContent = origCode;
        frame.removeAttribute("srcdoc");
        frame.setAttribute("src", frameSrc);
        markClean();
      });
    });
  }

  window.NM_READY = true;
})();
