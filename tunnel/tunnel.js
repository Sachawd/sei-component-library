(function () {
  var BRANDS = {
    "vendor": {
      name: "Vendor",
      rail: "Vendor",
      file: "data/data-vendor.json",
      folder: "vendor",
      decks: [
        { label: "All 2026 Vendor Decks (Box)", url: "https://sportsendeavors.app.box.com/folder/55874882616" },
        { label: "adidas 2026 Decks (Box)", url: "https://sportsendeavors.app.box.com/folder/420151429465" },
        { label: "Nike 2026 Decks (Box)", url: "https://sportsendeavors.app.box.com/folder/333070806768" },
        { label: "PUMA 2026 Decks (Box)", url: "https://sportsendeavors.app.box.com/folder/379324895382" }
      ]
    },
    "soccer-com": {
      name: "Soccer.com",
      logo: "../nutmeg/logos/Logos_sdc.png",
      w: 177,
      h: 44,
      file: "data/data-brand-soccer-com.json",
      campFile: "data/data-campaign-soccer-com.json",
      pubFile: "data/data-published-soccer-com.json",
      folder: "soccer-com",
      decks: [
        { label: "Aspect Ratios & Image Specs (Box)", url: "https://sportsendeavors.app.box.com/folder/326752475361" },
        { label: "2026 Video Guidelines (Box)", url: "https://sportsendeavors.app.box.com/folder/393225519974" }
      ]
    },
    "wss": {
      name: "WorldSoccerShop",
      logo: "../nutmeg/logos/Logos_wss.png",
      w: 177,
      h: 47,
      file: "data/data-brand-worldsoccershop.json",
      pubFile: "data/data-published-worldsoccershop.json",
      folder: "worldsoccershop",
      decks: [
        { label: "WSS Brand Guidelines (Box)", url: "https://sportsendeavors.app.box.com/folder/52709252256" },
        { label: "WSS Brand Pitch Decks (Box)", url: "https://sportsendeavors.app.box.com/folder/134039764981" }
      ]
    },
    "431": {
      name: "431 Sports",
      logo: "../nutmeg/logos/Logos_431.png",
      w: 72,
      h: 72,
      file: "data/data-brand-431-sports.json",
      folder: "431-sports",
      decks: []
    },
    "team-soccer": {
      name: "Team Soccer",
      file: "data/data-brand-team-soccer.json",
      folder: "team-soccer",
      decks: [
        { label: "adidas Fall 2026 Teamwear Guide (Box)", url: "https://sportsendeavors.app.box.com/folder/420151429465" }
      ]
    },
    "spg": {
      name: "SPG",
      file: null,
      folder: "spg",
      decks: []
    },
    "soccer-master": {
      name: "Soccer Master",
      logo: "../nutmeg/logos/Logos_soccermaster.png",
      w: 143,
      h: 61,
      file: null,
      folder: "soccer-master",
      decks: []
    }
  };

  var CHEV = '<svg class="nm-drawer__chev" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M5 9L12 16L19 9" stroke="currentColor" stroke-width="1.5"/></svg>';
  var S3_DEFAULT = "https://www.imagehandler.net/dxassets/?img=Photos/";
  var REMOTE_FILES_BASE = "https://the-tunnel.netlify.app/v2/files/";

  var $ = function (id) { return document.getElementById(id); };
  var home = $("tn-home"), brand = $("tn-brand"), drawer = $("tn-drawer");
  var list = $("tn-drawer-list"), where = $("tn-where"), note = $("tn-note");
  var brandGrid = $("tn-brand-grid"), quickChips = $("tn-quick-chips");
  var homeGrid = $("tn-home-grid"), homeHeading = $("tn-home-heading"), homeCount = $("tn-home-count"), homeClear = $("tn-home-clear");
  var rail = document.querySelectorAll(".nm-rail__item");

  var currentKey = null;
  var currentFilter = { type: "all", val: "", q: "" };
  var CACHE = {};

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function num(n) { return Number(n || 0).toLocaleString("en-US"); }
  function enc(f) {
    return String(f || "").replace(/\+/g, "%2B").replace(/#/g, "%23").replace(/&/g, "%26").replace(/ /g, "%20");
  }
  function niceDate(d) {
    if (!d) return "Recent";
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
    if (!m) return d;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return Number(m[3]) + " " + months[Number(m[2]) - 1] + " " + m[1];
  }
  function cardIni(name) {
    var w = String(name || "").split(/\s+/).filter(function (x) { return x && /[A-Za-z0-9]/.test(x[0]); });
    return (w.slice(0, 2).map(function (x) { return x[0].toUpperCase(); }).join("")) || "SE";
  }

  function loadJSON(path) {
    if (!path) return Promise.resolve(null);
    if (!CACHE[path]) {
      CACHE[path] = fetch(path).then(function (r) {
        return r.ok ? r.json() : null;
      }).catch(function () { return null; });
    }
    return CACHE[path];
  }

  function loadBrandBundle(key) {
    var b = BRANDS[key];
    if (!b || !b.file) return Promise.resolve({ main: null, camp: null, pub: null });
    return Promise.all([
      loadJSON(b.file),
      loadJSON(b.campFile),
      loadJSON(b.pubFile)
    ]).then(function (res) {
      return { main: res[0], camp: res[1], pub: res[2] };
    });
  }

  function isVideoRow(r) {
    return Boolean(r.vid || ((r.av || []).indexOf("Video") >= 0 && (r.av || []).indexOf("Stills") < 0));
  }

  function renderShootCard(r, s3, folder, storeTag) {
    var base = s3 || S3_DEFAULT;
    var cover = r.f ? (/^https?:\/\//.test(r.f) ? r.f : base + enc(r.f)) : "";
    var offers = r.offers || [];
    var ratios = r.rs || [];
    var cats = r.cats || [];
    var pills = [];
    if (offers.length) pills.push('<span class="tn-pill tn-pill--offer">' + esc(offers[0]) + "</span>");
    if (cats.length) pills.push('<span class="tn-pill">' + esc(cats[0]) + "</span>");
    if (r.av && r.av.length) pills.push('<span class="tn-pill">' + esc(r.av.join(", ")) + "</span>");
    ratios.slice(0, 2).forEach(function (rt) {
      pills.push('<span class="tn-pill">' + esc(rt) + "</span>");
    });

    var hasBox = r.u && /^https?:\/\//.test(r.u);
    var mediaInner = '<div class="tn-card__fallback"><span class="tn-card__ini">' + esc(cardIni(r.n)) + '</span><span class="tn-card__lbl">' + esc(r.home ? r.home + " folder" : "Shoot folder") + "</span></div>";
    if (cover) {
      mediaInner += '<img src="' + esc(cover) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">';
    }
    if (storeTag) {
      mediaInner += '<span class="tn-card__store">' + esc(storeTag) + "</span>";
    }

    var primaryAction = hasBox
      ? '<a class="tn-btn" href="' + esc(r.u) + '" target="_blank" rel="noopener">Open in ' + esc(r.home || "Box") + " &#8599;</a>"
      : '<button type="button" class="tn-btn" data-shoot-open="' + esc(r.sl || "") + '" data-shoot-folder="' + esc(folder || "vendor") + '">View Shoot (' + num(r.c) + ")</button>";
    var secondaryAction = cover
      ? '<button type="button" class="tn-btn tn-btn--outline" data-copy-url="' + esc(cover) + '">Copy CDN Link</button>'
      : (r.sl ? '<button type="button" class="tn-btn tn-btn--outline" data-shoot-open="' + esc(r.sl) + '" data-shoot-folder="' + esc(folder || "vendor") + '">Inspect Files</button>' : "");

    return '<article class="tn-card">' +
      '<div class="tn-card__media" data-shoot-open="' + esc(r.sl || "") + '" data-shoot-folder="' + esc(folder || "vendor") + '">' + mediaInner + "</div>" +
      '<div class="tn-card__body">' +
        '<p class="tn-card__meta"><span>' + esc(niceDate(r.d)) + "</span><span>" + num(r.c) + " asset" + (r.c === 1 ? "" : "s") + "</span></p>" +
        (pills.length ? '<div class="tn-card__pills">' + pills.join("") + "</div>" : "") +
        '<h3 class="tn-card__title"><button type="button" data-shoot-open="' + esc(r.sl || "") + '" data-shoot-folder="' + esc(folder || "vendor") + '">' + esc(r.n) + "</button></h3>" +
        '<div class="tn-card__actions">' + primaryAction + secondaryAction + "</div>" +
      "</div>" +
    "</article>";
  }

  function renderPubCard(r, storeTag) {
    var isYT = r.p === "YouTube";
    var isBlog = r.p === "Blog";
    var mediaInner = '<div class="tn-card__fallback"><span class="tn-card__ini">' + esc(isYT ? "YT" : "BLOG") + '</span><span class="tn-card__lbl">' + esc(r.ch || r.p) + "</span></div>";
    if (r.th) {
      mediaInner += '<img src="' + esc(r.th) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">';
    }
    if (storeTag) {
      mediaInner += '<span class="tn-card__store">' + esc(storeTag) + "</span>";
    }
    var btnLabel = isYT ? "Watch on YouTube &#8599;" : (isBlog ? "Read Article &#8599;" : "Open Post &#8599;");
    return '<article class="tn-card">' +
      '<a class="tn-card__media" href="' + esc(r.u || "#") + '" target="_blank" rel="noopener">' + mediaInner + "</a>" +
      '<div class="tn-card__body">' +
        '<p class="tn-card__meta"><span>' + esc(niceDate(r.d)) + "</span><span>" + esc(r.views || r.p) + "</span></p>" +
        '<div class="tn-card__pills"><span class="tn-pill tn-pill--offer">' + esc(r.ch || r.p) + "</span></div>" +
        '<h3 class="tn-card__title"><a href="' + esc(r.u || "#") + '" target="_blank" rel="noopener">' + esc(r.t) + "</a></h3>" +
        '<div class="tn-card__actions">' +
          '<a class="tn-btn" href="' + esc(r.u || "#") + '" target="_blank" rel="noopener">' + btnLabel + "</a>" +
          '<button type="button" class="tn-btn tn-btn--outline" data-copy-url="' + esc(r.u || "") + '">Copy Link</button>' +
        "</div>" +
      "</div>" +
    "</article>";
  }

  function buildDrawerForBrand(key, bundle) {
    var b = BRANDS[key];
    var main = bundle.main;
    var camp = bundle.camp;
    var pub = bundle.pub;

    var teams = (main && main.teams ? main.teams : []).slice(0, 30);
    var cats = main && main.cats ? main.cats : [];
    var pubRows = pub && pub.rows ? pub.rows : [];
    var ytCount = pubRows.filter(function (r) { return r.p === "YouTube"; }).length;
    var blogCount = pubRows.filter(function (r) { return r.p === "Blog"; }).length;

    var campItems = [];
    if (camp && camp.rows && camp.rows.length) {
      campItems.push({ label: "Holiday 2026 Shoots", type: "campaign", val: "all", count: camp.rows.length });
    }
    if (main && main.rows) {
      var offerCounts = {};
      main.rows.forEach(function (r) {
        (r.offers || []).forEach(function (of) { offerCounts[of] = (offerCounts[of] || 0) + 1; });
      });
      Object.keys(offerCounts).forEach(function (of) {
        campItems.push({ label: of, type: "offer", val: of, count: offerCounts[of] });
      });
    }

    var allRows = main && main.rows ? main.rows : [];
    var photoCount = allRows.filter(function (r) { return !isVideoRow(r); }).length;
    var videoCount = allRows.filter(isVideoRow).length + ytCount;

    var sections = [
      {
        label: "Product Category",
        open: true,
        items: [{ label: "All Shoots", type: "all", val: "", count: allRows.length }].concat(
          cats.map(function (c) { return { label: c.k, type: "cat", val: c.k, count: c.n }; })
        )
      },
      {
        label: "Team & Player",
        open: false,
        items: teams.map(function (t) { return { label: t.k, type: "team", val: t.k, count: t.n }; })
      },
      {
        label: "Social & Editorial",
        open: Boolean(ytCount || blogCount),
        items: []
          .concat(ytCount ? [{ label: "YouTube", type: "social", val: "YouTube", count: ytCount }] : [])
          .concat(blogCount ? [{ label: "Blog Articles", type: "social", val: "Blog", count: blogCount }] : [])
      },
      {
        label: "Media Type",
        open: true,
        items: [
          { label: "Photo", type: "media", val: "Photo", count: photoCount },
          { label: "Video", type: "media", val: "Video", count: videoCount }
        ]
      },
      {
        label: "Campaigns",
        open: campItems.length > 0,
        items: campItems
      },
      {
        label: "Brand Decks",
        open: (b.decks || []).length > 0,
        items: (b.decks || []).map(function (d) { return { label: d.label, url: d.url }; })
      }
    ];

    list.innerHTML = sections.map(function (s, i) {
      var id = "tn-sub-" + i;
      var sub = s.items.length
        ? s.items.map(function (it) {
            if (it.url) {
              return '<li><a class="nm-drawer__sublink" href="' + esc(it.url) + '" target="_blank" rel="noopener"><span class="tn-dot" aria-hidden="true">&bull;</span><span>' + esc(it.label) + '</span><span class="tn-sub-count">&#8599;</span></a></li>';
            }
            var isCur = currentFilter.type === it.type && currentFilter.val === it.val;
            return '<li><button class="nm-drawer__sublink" type="button" data-ftype="' + esc(it.type) + '" data-fval="' + esc(it.val) + '" data-flabel="' + esc(it.label) + '"' + (isCur ? ' aria-current="page"' : "") + '><span class="tn-dot" aria-hidden="true">&bull;</span><span>' + esc(it.label) + '</span>' + (it.count != null ? '<span class="tn-sub-count">' + num(it.count) + "</span>" : "") + "</button></li>";
          }).join("")
        : '<li><p class="tn-empty">Nothing filed here yet.</p></li>';
      return '<li><button class="nm-drawer__toggle" type="button" aria-expanded="' + (s.open ? "true" : "false") + '" aria-controls="' + id + '">' + esc(s.label) + CHEV + "</button>" +
        '<ul class="nm-drawer__sub" id="' + id + '"' + (s.open ? "" : " hidden") + ">" + sub + "</ul></li>";
    }).join("");
  }

  function renderBrandResults(key, bundle) {
    var b = BRANDS[key];
    var main = bundle.main;
    var camp = bundle.camp;
    var pub = bundle.pub;

    if (!main) {
      where.textContent = b.name;
      note.textContent = "No asset feed file is connected for " + b.name + " yet. Choose Vendor, Soccer.com, WSS, 431, or Team Soccer in the left rail.";
      quickChips.innerHTML = "";
      brandGrid.innerHTML = "";
      return;
    }

    var allRows = (main.rows || []).slice().sort(function (a, c) { return (c.d || "0").localeCompare(a.d || "0"); });
    var campRows = (camp && camp.rows ? camp.rows : []).slice();
    var pubRows = (pub && pub.rows ? pub.rows : []).slice();
    var words = (currentFilter.q || "").trim().toLowerCase().split(/\s+/).filter(Boolean);

    // Quick chips bar
    var chipDefs = [{ label: "All Shoots (" + num(allRows.length) + ")", type: "all", val: "" }];
    (main.cats || []).slice(0, 5).forEach(function (c) {
      chipDefs.push({ label: c.k + " (" + num(c.n) + ")", type: "cat", val: c.k });
    });
    if (campRows.length) {
      chipDefs.push({ label: "Holiday 2026 (" + num(campRows.length) + ")", type: "campaign", val: "all" });
    }
    var ytTotal = pubRows.filter(function (r) { return r.p === "YouTube"; }).length;
    var blogTotal = pubRows.filter(function (r) { return r.p === "Blog"; }).length;
    if (ytTotal) chipDefs.push({ label: "YouTube (" + num(ytTotal) + ")", type: "social", val: "YouTube" });
    if (blogTotal) chipDefs.push({ label: "Blog (" + num(blogTotal) + ")", type: "social", val: "Blog" });

    quickChips.innerHTML = chipDefs.map(function (cd) {
      var on = currentFilter.type === cd.type && currentFilter.val === cd.val;
      return '<button type="button" class="tn-chip" data-ftype="' + esc(cd.type) + '" data-fval="' + esc(cd.val) + '" data-flabel="' + esc(cd.label.replace(/\s*\([^)]*\)$/, "")) + '" aria-pressed="' + (on ? "true" : "false") + '">' + esc(cd.label) + "</button>";
    }).join("");

    function matchQuery(r) {
      if (!words.length) return true;
      var hay = ((r.n || "") + " " + (r.t || "") + " " + (r.q || "") + " " + (r.cats || []).join(" ") + " " + (r.teams || []).join(" ") + " " + (r.brands || []).join(" ")).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) >= 0; });
    }

    var headingParts = [b.name];
    if (currentFilter.label && currentFilter.type !== "all") headingParts.push(currentFilter.label);
    if (currentFilter.q) headingParts.push('“' + currentFilter.q + '”');
    where.textContent = headingParts.join(" › ");

    if (currentFilter.type === "social") {
      var socialHits = pubRows.filter(function (r) {
        return r.p === currentFilter.val && matchQuery(r);
      });
      note.textContent = "Showing " + num(Math.min(socialHits.length, 96)) + " of " + num(socialHits.length) + " published " + currentFilter.val + " items.";
      brandGrid.innerHTML = socialHits.slice(0, 96).map(function (r) { return renderPubCard(r); }).join("") || '<p class="tn-empty">No matching published posts found.</p>';
      return;
    }

    if (currentFilter.type === "campaign") {
      var cHits = campRows.filter(matchQuery);
      note.textContent = "Showing " + num(cHits.length) + " campaign shoot" + (cHits.length === 1 ? "" : "s") + " (" + num(camp.assets) + " total assets).";
      brandGrid.innerHTML = cHits.map(function (r) { return renderShootCard(r, camp.s3, "campaign-soccer-com"); }).join("") || '<p class="tn-empty">No matching campaign shoots found.</p>';
      return;
    }

    var filtered = allRows.filter(function (r) {
      if (currentFilter.type === "cat" && (r.cats || []).indexOf(currentFilter.val) < 0) return false;
      if (currentFilter.type === "team" && (r.teams || []).indexOf(currentFilter.val) < 0) return false;
      if (currentFilter.type === "offer" && (r.offers || []).indexOf(currentFilter.val) < 0) return false;
      if (currentFilter.type === "media") {
        if (currentFilter.val === "Photo" && isVideoRow(r)) return false;
        if (currentFilter.val === "Video" && !isVideoRow(r)) return false;
      }
      return matchQuery(r);
    });

    var extraPub = [];
    if ((currentFilter.type === "media" && currentFilter.val === "Video") || (currentFilter.type === "all" && words.length)) {
      extraPub = pubRows.filter(function (r) {
        if (currentFilter.type === "media" && r.p !== "YouTube") return false;
        return matchQuery(r);
      }).slice(0, 36);
    }

    var shown = filtered.slice(0, 96);
    note.textContent = "Showing " + num(shown.length) + " of " + num(filtered.length) + " shoot" + (filtered.length === 1 ? "" : "s") +
      (extraPub.length ? " plus " + num(extraPub.length) + " published videos" : "") +
      " (" + num(main.assets) + " total assets in " + b.name + ", updated " + main.built + ").";

    brandGrid.innerHTML = shown.map(function (r) { return renderShootCard(r, main.s3, b.folder); }).join("") +
      extraPub.map(function (r) { return renderPubCard(r); }).join("") ||
      '<p class="tn-empty">No shoots match that filter. Try clearing the search box or picking All Shoots.</p>';
  }

  function loadAllForHome(query) {
    var q = (query || "").trim().toLowerCase();
    var words = q.split(/\s+/).filter(Boolean);
    homeClear.hidden = !words.length;
    var keys = ["wss", "soccer-com", "vendor", "431", "team-soccer"];
    Promise.all(keys.map(loadBrandBundle)).then(function (bundles) {
      var combined = [];
      var pubMatches = [];
      var totalAssets = 0;

      bundles.forEach(function (bd, idx) {
        var bKey = keys[idx];
        var b = BRANDS[bKey];
        if (bd.main && bd.main.rows) {
          totalAssets += Number(bd.main.assets || 0);
          bd.main.rows.forEach(function (r) {
            combined.push({ row: r, s3: bd.main.s3, folder: b.folder, store: b.name });
          });
        }
        if (bd.camp && bd.camp.rows) {
          bd.camp.rows.forEach(function (r) {
            combined.push({ row: r, s3: bd.camp.s3, folder: "campaign-soccer-com", store: "Soccer.com Campaign" });
          });
        }
        if (words.length && bd.pub && bd.pub.rows) {
          bd.pub.rows.forEach(function (r) {
            var hay = ((r.t || "") + " " + (r.q || "")).toLowerCase();
            if (words.every(function (w) { return hay.indexOf(w) >= 0; })) {
              pubMatches.push({ row: r, store: b.name });
            }
          });
        }
      });

      combined.sort(function (a, c) { return (c.row.d || "0").localeCompare(a.row.d || "0"); });

      if (words.length) {
        var hits = combined.filter(function (item) {
          var r = item.row;
          var hay = ((r.n || "") + " " + (r.q || "") + " " + (r.cats || []).join(" ") + " " + (r.teams || []).join(" ") + " " + (r.brands || []).join(" ") + " " + item.store).toLowerCase();
          return words.every(function (w) { return hay.indexOf(w) >= 0; });
        });
        homeHeading.textContent = 'Search results for “' + query.trim() + '”';
        homeCount.textContent = num(hits.length) + " matching shoot" + (hits.length === 1 ? "" : "s") +
          (pubMatches.length ? " and " + num(pubMatches.length) + " published YouTube / Blog posts" : "") + " across all brands.";
        homeGrid.innerHTML = hits.slice(0, 72).map(function (it) {
          return renderShootCard(it.row, it.s3, it.folder, it.store);
        }).join("") + pubMatches.slice(0, 24).map(function (it) {
          return renderPubCard(it.row, it.store);
        }).join("") || '<p class="tn-empty">No shoots or posts across any brand matched that search.</p>';
      } else {
        homeHeading.textContent = "Recent shoots across all brands";
        homeCount.textContent = "Showing the 36 newest shoots out of " + num(combined.length) + " total shoots (" + num(totalAssets) + " assets across WorldSoccerShop, Soccer.com, Vendor, 431 Sports, and Team Soccer).";
        homeGrid.innerHTML = combined.slice(0, 36).map(function (it) {
          return renderShootCard(it.row, it.s3, it.folder, it.store);
        }).join("");
      }
    });
  }

  function openShootDialog(folder, slug) {
    var dlg = $("tn-shoot-dialog");
    var title = $("tn-sd-title");
    var sub = $("tn-sd-sub");
    var body = $("tn-sd-body");
    if (!dlg || !slug) return;
    title.textContent = "Loading shoot files...";
    sub.textContent = "";
    body.innerHTML = '<p class="tn-empty">Fetching shoot manifest...</p>';
    if (dlg.showModal) dlg.showModal();
    else dlg.setAttribute("open", "");

    var url = REMOTE_FILES_BASE + folder + "/" + slug + ".json";
    loadJSON(url).then(function (d) {
      if (!d || !d.files) {
        title.textContent = slug;
        sub.textContent = "Individual file list lives on the Tunnel server.";
        body.innerHTML = '<p class="tn-empty">Open this shoot directly on <a href="https://the-tunnel.netlify.app/v2/" target="_blank" rel="noopener">The Tunnel v2</a> to browse all individual frames.</p>';
        return;
      }
      title.textContent = d.n || slug;
      var files = d.files || [];
      sub.textContent = (d.store || folder) + " · " + num(files.length) + " asset" + (files.length === 1 ? "" : "s") + (d.built ? " · Updated " + d.built : "");
      var base = d.s3 || S3_DEFAULT;
      body.innerHTML = '<div class="tn-files-grid">' + files.slice(0, 120).map(function (f) {
        var fUrl = f.f ? (/^https?:\/\//.test(f.f) ? f.f : base + enc(f.f)) : (f.u || "");
        var isImg = f.f && /\.(jpe?g|png|webp|gif)(\?|$)/i.test(f.f);
        var thumb = isImg
          ? '<img src="' + esc(fUrl) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">'
          : '<span class="tn-card__ini">' + esc(f.r || f.hs || "FILE") + "</span>";
        var dims = (f.w && f.h) ? (f.w + " × " + f.h + " px" + (f.r ? " (" + f.r + ")" : "")) : (f.r || f.av || "");
        return '<div class="tn-file">' +
          '<a class="tn-file__thumb" href="' + esc(fUrl || "#") + '" target="_blank" rel="noopener">' + thumb + "</a>" +
          '<div class="tn-file__info">' +
            '<p class="tn-file__name">' + esc(f.f || f.ds || "Asset") + "</p>" +
            (dims ? '<p class="tn-file__dim">' + esc(dims) + "</p>" : "") +
            (fUrl ? '<button type="button" class="tn-btn tn-btn--outline" style="width:100%;padding:6px 10px;font-size:12px" data-copy-url="' + esc(fUrl) + '">Copy CDN Link</button>' : "") +
          "</div>" +
        "</div>";
      }).join("") + "</div>";
    });
  }

  function render() {
    var key = (location.hash.replace(/^#\/?/, "") || "home").toLowerCase();
    if (key !== "home" && !BRANDS[key]) key = "home";
    rail.forEach(function (a) {
      if (a.getAttribute("data-view") === key) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    if (key === "home") {
      home.hidden = false;
      brand.hidden = true;
      drawer.hidden = true;
      document.title = "The Tunnel";
      currentKey = null;
      loadAllForHome($("tn-home-search").value);
      return;
    }
    var b = BRANDS[key];
    home.hidden = true;
    brand.hidden = false;
    drawer.hidden = false;
    document.title = b.name + " | The Tunnel";
    document.body.setAttribute("data-brand", key);
    $("tn-drawer-title").textContent = b.name;
    $("tn-brand-name").innerHTML = b.logo
      ? '<img src="' + b.logo + '" width="' + b.w + '" height="' + b.h + '" alt="' + esc(b.name) + '">'
      : '<span class="tn-brand__word">' + esc(b.name) + "</span>";
    var input = $("tn-brand-search");
    input.placeholder = "Search " + b.name;
    $("tn-brand-search-label").textContent = "Search " + b.name;

    if (currentKey !== key) {
      currentKey = key;
      currentFilter = { type: "all", val: "", label: "All Shoots", q: "" };
      input.value = "";
    }
    where.textContent = b.name;
    note.textContent = "Loading " + b.name + " shoots...";
    loadBrandBundle(key).then(function (bundle) {
      if (currentKey !== key) return;
      buildDrawerForBrand(key, bundle);
      renderBrandResults(key, bundle);
    });
  }

  list.addEventListener("click", function (e) {
    var t = e.target.closest(".nm-drawer__toggle");
    if (t) {
      var open = t.getAttribute("aria-expanded") === "true";
      t.setAttribute("aria-expanded", open ? "false" : "true");
      $(t.getAttribute("aria-controls")).hidden = open;
      return;
    }
    var s = e.target.closest("button.nm-drawer__sublink");
    if (s && currentKey) {
      currentFilter.type = s.getAttribute("data-ftype") || "all";
      currentFilter.val = s.getAttribute("data-fval") || "";
      currentFilter.label = s.getAttribute("data-flabel") || "";
      loadBrandBundle(currentKey).then(function (bundle) {
        buildDrawerForBrand(currentKey, bundle);
        renderBrandResults(currentKey, bundle);
      });
      closeMenu();
    }
  });

  quickChips.addEventListener("click", function (e) {
    var c = e.target.closest(".tn-chip");
    if (c && currentKey) {
      currentFilter.type = c.getAttribute("data-ftype") || "all";
      currentFilter.val = c.getAttribute("data-fval") || "";
      currentFilter.label = c.getAttribute("data-flabel") || "";
      loadBrandBundle(currentKey).then(function (bundle) {
        buildDrawerForBrand(currentKey, bundle);
        renderBrandResults(currentKey, bundle);
      });
    }
  });

  document.addEventListener("click", function (e) {
    var copyBtn = e.target.closest("[data-copy-url]");
    if (copyBtn) {
      var u = copyBtn.getAttribute("data-copy-url");
      if (u && navigator.clipboard) {
        navigator.clipboard.writeText(u).then(function () {
          var prev = copyBtn.textContent;
          copyBtn.textContent = "Copied!";
          setTimeout(function () { copyBtn.textContent = prev; }, 1400);
        });
      }
      return;
    }
    var openBtn = e.target.closest("[data-shoot-open]");
    if (openBtn) {
      var sl = openBtn.getAttribute("data-shoot-open");
      var fld = openBtn.getAttribute("data-shoot-folder") || "vendor";
      if (sl) openShootDialog(fld, sl);
    }
  });

  $("tn-sd-close").addEventListener("click", function () {
    var dlg = $("tn-shoot-dialog");
    if (dlg.close) dlg.close();
    else dlg.removeAttribute("open");
  });
  $("tn-shoot-dialog").addEventListener("click", function (e) {
    if (e.target === $("tn-shoot-dialog")) $("tn-sd-close").click();
  });

  $("tn-home-search").addEventListener("input", function (e) {
    loadAllForHome(e.target.value);
  });
  $("tn-home-clear").addEventListener("click", function () {
    $("tn-home-search").value = "";
    $("tn-quick").value = "";
    loadAllForHome("");
  });

  $("tn-brand-search").addEventListener("input", function (e) {
    if (!currentKey) return;
    currentFilter.q = e.target.value;
    loadBrandBundle(currentKey).then(function (bundle) {
      renderBrandResults(currentKey, bundle);
    });
  });

  $("tn-quick").addEventListener("input", function (e) {
    var val = e.target.value;
    if (currentKey) {
      $("tn-brand-search").value = val;
      currentFilter.q = val;
      loadBrandBundle(currentKey).then(function (bundle) {
        renderBrandResults(currentKey, bundle);
      });
    } else {
      $("tn-home-search").value = val;
      loadAllForHome(val);
    }
  });

  document.querySelectorAll(".tn-search").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = f.querySelector("input").value.trim();
      if (f.getAttribute("data-search") === "all") {
        loadAllForHome(q);
        var resEl = $("tn-home-results");
        if (resEl) resEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  var btn = document.querySelector(".nm-menu-btn"), nav = $("tn-nav"), scrim = document.querySelector(".nm-scrim");
  function closeMenu() {
    btn.setAttribute("aria-expanded", "false");
    nav.removeAttribute("data-open");
    scrim.removeAttribute("data-open");
    scrim.hidden = true;
    document.body.classList.remove("nm-locked");
  }
  btn.addEventListener("click", function () {
    if (btn.getAttribute("aria-expanded") === "true") return closeMenu();
    btn.setAttribute("aria-expanded", "true");
    scrim.hidden = false;
    requestAnimationFrame(function () {
      nav.setAttribute("data-open", "true");
      scrim.setAttribute("data-open", "true");
    });
    document.body.classList.add("nm-locked");
  });
  scrim.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      $("tn-quick").focus();
    }
  });
  rail.forEach(function (a) { a.addEventListener("click", closeMenu); });

  window.addEventListener("hashchange", render);
  render();
})();
