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
  var TOOLS_SITE = "https://the-tunnel.netlify.app/";
  var CHIP = { sizes: "Image sizes", graphics: "Graphics", find: "Find", help: "Help" };
  var TOOLS = [
    { tab: "sizes", name: "DX & Social Resizer", what: "Makes the 16:9, 4:5, 9:16 and 1:1 sizes from one picture.", url: TOOLS_SITE + "dx-resizer.html" },
    { tab: "sizes", name: "Blog Image Sizer", what: "Makes the blog hero, preview and SEO sizes.", url: TOOLS_SITE + "blog-resizer.html" },
    { tab: "sizes", name: "Photo Sizer", what: "Sizes one photo for a site block.", url: "../photo-sizer/index.html" },
    { tab: "graphics", name: "Soccer.com graphics", what: "Builds Soccer.com matchup banners.", url: TOOLS_SITE + "soccer-com-graphics.html" },
    { tab: "graphics", name: "WorldSoccerShop graphics", what: "Builds WorldSoccerShop matchup cards.", url: TOOLS_SITE + "worldsoccershop-graphics.html" },
    { tab: "find", name: "Find by SKU list", what: "Paste article numbers and see every shoot that has them.", url: TOOLS_SITE + "index.html#skus" },
    { tab: "find", name: "Logo search", what: "Club, federation and brand logos.", url: TOOLS_SITE + "logos.html" },
    { tab: "help", name: "Team guide", what: "How each team uses the Tunnel, step by step.", url: TOOLS_SITE + "v2/team-guide.html" },
    { tab: "help", name: "Aspect ratios and image specs", what: "The size rules, in Box.", url: "https://sportsendeavors.app.box.com/folder/326752475361" },
    { tab: "help", name: "Send feedback", what: "Ask for something to be added or fixed.", url: "https://airtable.com/apppFkTaDMtYW1Zvi/pagFKvi39wdUH9d6V/form" }
  ];

  var $ = function (id) { return document.getElementById(id); };
  var home = $("tn-home"), brand = $("tn-brand"), drawer = $("tn-drawer"), tools = $("tn-tools");
  var list = $("tn-drawer-list"), where = $("tn-where"), note = $("tn-note");
  var brandGrid = $("tn-brand-grid"), quickChips = $("tn-quick-chips");
  var homeGrid = $("tn-home-grid"), homeHeading = $("tn-home-heading"), homeCount = $("tn-home-count"), homeClear = $("tn-home-clear");
  var rail = document.querySelectorAll(".nm-rail__item");

  var currentKey = null;
  var OPEN = {};
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

  var CAMPAIGN = "Holiday 2026";
  function inCampaign(r) { return (r.offers || []).indexOf(CAMPAIGN) >= 0; }
  function campaignRows(rows, val) {
    return rows.filter(function (r) { return val === "other" ? !inCampaign(r) : inCampaign(r); });
  }

  function isVideoRow(r) {
    return Boolean(r.vid || ((r.av || []).indexOf("Video") >= 0 && (r.av || []).indexOf("Stills") < 0));
  }

  var STORE_CHIP = {
    "Soccer.com": "sdc", "Soccer.com Campaign": "sdc", "WorldSoccerShop": "wss",
    "431 Sports": "431", "Team Soccer": "team", "Vendor": "vendor"
  };
  function storeChip(storeTag) {
    return '<span class="tn-card__store tn-card__store--' + (STORE_CHIP[storeTag] || "vendor") + '">' + esc(storeTag) + "</span>";
  }

  function renderShootCard(r, s3, folder, storeTag) {
    var base = s3 || S3_DEFAULT;
    if (r.sl) ROWS[(folder || "vendor") + "/" + r.sl] = r;
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
      mediaInner += storeChip(storeTag);
    }

    var primaryAction = hasBox
      ? '<a class="tn-btn" href="' + esc(r.u) + '" target="_blank" rel="noopener">Open in ' + esc(r.home || "Box") + " &#8599;</a>"
      : '<button type="button" class="tn-btn" data-shoot-open="' + esc(r.sl || "") + '" data-shoot-folder="' + esc(folder || "vendor") + '">View shoot</button>';
    var secondaryAction = cover
      ? '<button type="button" class="tn-btn tn-btn--outline" data-copy-url="' + esc(cover) + '">Copy CDN link</button>'
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
      mediaInner += storeChip(storeTag);
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
          '<button type="button" class="tn-btn tn-btn--outline" data-copy-url="' + esc(r.u || "") + '">Copy link</button>' +
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
      var hol = campaignRows(camp.rows, "holiday").length, oth = camp.rows.length - hol;
      if (hol) campItems.push({ label: CAMPAIGN + " Shoots", type: "campaign", val: "holiday", count: hol });
      if (oth) campItems.push({ label: "Other campaign shoots", type: "campaign", val: "other", count: oth });
    }
    if (main && main.rows) {
      var offerCounts = {};
      main.rows.forEach(function (r) {
        (r.offers || []).forEach(function (of) { offerCounts[of] = (offerCounts[of] || 0) + 1; });
      });
      Object.keys(offerCounts).forEach(function (of) {
        if (of === CAMPAIGN && campItems.length) return;
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
      var open = Boolean(OPEN[s.label]);
      return '<li><button class="nm-drawer__toggle" type="button" data-section="' + esc(s.label) + '" aria-expanded="' + open + '" aria-controls="' + id + '">' + esc(s.label) + CHEV + "</button>" +
        '<ul class="nm-drawer__sub" id="' + id + '"' + (open ? "" : " hidden") + ">" + sub + "</ul></li>";
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

    var ytTotal = pubRows.filter(function (r) { return r.p === "YouTube"; }).length;
    var blogTotal = pubRows.filter(function (r) { return r.p === "Blog"; }).length;

    var holRows = campaignRows(campRows, "holiday");

    // Quick chips bar
    var chipDefs = [{ label: "All Shoots (" + num(allRows.length) + ")", type: "all", val: "" }];
    (main.cats || []).slice(0, 5).forEach(function (c) {
      chipDefs.push({ label: c.k + " (" + num(c.n) + ")", type: "cat", val: c.k });
    });
    if (holRows.length) {
      chipDefs.push({ label: CAMPAIGN + " (" + num(holRows.length) + ")", type: "campaign", val: "holiday" });
    }
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
      var cHits = campaignRows(campRows, currentFilter.val).filter(matchQuery);
      var cAssets = cHits.reduce(function (n, r) { return n + Number(r.c || 0); }, 0);
      note.textContent = "Showing " + num(cHits.length) + (currentFilter.val === "other" ? " other campaign shoot" : " " + CAMPAIGN + " shoot") + (cHits.length === 1 ? "" : "s") + " (" + num(cAssets) + " assets).";
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
    var scope = $("tn-home-scope") ? $("tn-home-scope").value : "all";
    var keys = scope === "all" ? ["wss", "soccer-com", "vendor", "431", "team-soccer"] : [scope];
    var where = scope === "all" ? "across all brands" : "in " + BRANDS[scope].name;
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
        homeHeading.textContent = 'Search results for “' + query.trim() + '”' + (scope === "all" ? "" : " in " + BRANDS[scope].name);
        homeCount.textContent = num(hits.length) + " matching shoot" + (hits.length === 1 ? "" : "s") +
          (pubMatches.length ? " and " + num(pubMatches.length) + " published YouTube / Blog posts" : "") + " " + where + ".";
        homeGrid.innerHTML = hits.slice(0, 72).map(function (it) {
          return renderShootCard(it.row, it.s3, it.folder, it.store);
        }).join("") + pubMatches.slice(0, 24).map(function (it) {
          return renderPubCard(it.row, it.store);
        }).join("") || '<p class="tn-empty">No shoots or posts across any brand matched that search.</p>';
      } else {
        homeHeading.textContent = scope === "all" ? "Recent shoots across all brands" : "Recent " + BRANDS[scope].name + " shoots";
        homeCount.textContent = "Showing the " + num(Math.min(36, combined.length)) + " newest shoots out of " + num(combined.length) + " total shoots (" + num(totalAssets) + " assets " + (scope === "all" ? "across WorldSoccerShop, Soccer.com, Vendor, 431 Sports, and Team Soccer" : "in " + BRANDS[scope].name) + ").";
        homeGrid.innerHTML = combined.slice(0, 36).map(function (it) {
          return renderShootCard(it.row, it.s3, it.folder, it.store);
        }).join("");
      }
    });
  }

  /* ---------- Shoot photos and the image viewer ---------- */

  // Set this to the Tunnel's download proxy (for example "/dl/") on a host that runs one.
  // GitHub Pages has none, so Download goes straight to the open-in-a-tab route.
  var DOWNLOAD_ROUTE = /(^|\.)the-tunnel\.netlify\.app$/.test(location.hostname) ? "/dl/" : "";
  var PAGE_SIZE = 60;
  var PICK_KEY = "tn-selection-v2";

  var SD = null;            // the shoot open in the dialog
  var ROWS = {};            // shoot records by folder/slug, so the viewer can read category and season
  var PICKS = loadPicks();

  function loadPicks() {
    try {
      var arr = JSON.parse(localStorage.getItem(PICK_KEY) || "[]");
      return new Map(arr.map(function (it) { return [it.id, it]; }));
    } catch (e) { return new Map(); }
  }
  function savePicks() {
    try { localStorage.setItem(PICK_KEY, JSON.stringify(Array.from(PICKS.values()))); } catch (e) {}
  }
  function pickItem(i) {
    var f = SD.files[i], d = SD.data;
    return {
      id: photoId(i), title: photoTitle(f), shoot: d.n || SD.slug, brand: d.store || f.tr || "",
      file: fileName(f), url: fileUrl(f, SD.base),
      size: f.w ? f.w + " x " + f.h : "", ratio: f.r || "", season: f.se || "",
      skus: Array.isArray(f.sk) ? f.sk.join(" ") : (f.sk || ""), box: f.u || f.boxUrl || d.boxUrl || ""
    };
  }

  /* Selection bar: count, where the CSV goes, save and clear */
  var CAN_PICK_FOLDER = typeof window.showSaveFilePicker === "function";
  var SEL_NOTE = "";
  function csvName() {
    var t = new Date();
    return "tunnel-selection-" + t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0") + ".csv";
  }
  function buildCSV() {
    var cols = [["Photo", "title"], ["Shoot", "shoot"], ["Brand", "brand"], ["File name", "file"], ["CDN link", "url"], ["Size (px)", "size"], ["Ratio", "ratio"], ["Season", "season"], ["SKUs", "skus"], ["Box link", "box"]];
    var cell = function (v) { v = String(v == null ? "" : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var lines = [cols.map(function (c) { return c[0]; }).join(",")];
    PICKS.forEach(function (it) { lines.push(cols.map(function (c) { return cell(it[c[1]]); }).join(",")); });
    return "\ufeff" + lines.join("\r\n");
  }
  function selBarHTML() {
    var n = PICKS.size;
    var where = SEL_NOTE || ("Saves as " + csvName() + (CAN_PICK_FOLDER ? ". You choose the folder." : " to your Downloads folder."));
    return '<div class="tn-selbar__text"><p class="tn-selbar__count">' + num(n) + " photo" + (n === 1 ? "" : "s") + " selected</p>" +
      '<p class="tn-selbar__where">' + esc(where) + "</p></div>" +
      '<div class="tn-selbar__acts"><a class="nm-btn tn-v-btn" href="' + esc(resizeSelectedUrl()) + '" target="_blank" rel="noopener">Resize selected</a>' +
      '<button type="button" class="nm-btn nm-btn--white" data-sel-act="save">' + (CAN_PICK_FOLDER ? "Save CSV..." : "Download CSV") + "</button>" +
      '<button type="button" class="nm-btn tn-v-btn" data-sel-act="clear">Clear</button></div>';
  }
  function resizeSelectedUrl() {
    var q = Array.from(PICKS.values()).filter(function (it) { return /\.(jpe?g|png)$/i.test(it.file); })
      .map(function (it) { return "img=" + encodeURIComponent(it.file); }).join("&");
    return TOOLS_SITE + "dx-resizer.html" + (q ? "?" + q : "");
  }
  function renderSelBar() {
    ["tn-selbar", "tn-sd-selbar"].forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.hidden = PICKS.size === 0;
      if (PICKS.size) el.innerHTML = selBarHTML();
    });
  }
  function saveCSV() {
    var name = csvName(), text = buildCSV();
    var done = function (msg) { SEL_NOTE = msg; renderSelBar(); announce(msg); setTimeout(function () { SEL_NOTE = ""; renderSelBar(); }, 6000); };
    if (CAN_PICK_FOLDER) {
      window.showSaveFilePicker({ suggestedName: name, types: [{ description: "CSV file", accept: { "text/csv": [".csv"] } }] })
        .then(function (h) {
          return h.createWritable().then(function (w) { return w.write(text).then(function () { return w.close(); }); }).then(function () { return h.name; });
        })
        .then(function (saved) { done("Saved " + saved + " in the folder you chose."); })
        .catch(function (e) { if (e && e.name !== "AbortError") done("Could not save. Try again, or use another browser."); });
      return;
    }
    var url = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
    var a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
    done("Saved " + name + " to your Downloads folder.");
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-sel-act]");
    if (!b) return;
    if (b.getAttribute("data-sel-act") === "save") saveCSV();
    else {
      PICKS.clear(); savePicks();
      document.querySelectorAll("[data-v-pick]").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      if (V.open) paintPick();
      renderSelBar();
      announce("Selection cleared.");
    }
  });

  function isImageFile(f) { return Boolean(f && f.f && /\.(jpe?g|png|webp|gif)$/i.test(f.f)); }
  function onS3(f) { return isImageFile(f) && (!f.hs || /S3/.test(f.hs)); }
  function fileUrl(f, base) {
    if (!f || !f.f) return f && f.u ? f.u : "";
    return /^https?:\/\//.test(f.f) ? f.f : (base || S3_DEFAULT) + enc(f.f);
  }
  function fileName(f) { return String(f.f || "").split("/").pop(); }
  function photoId(i) { return SD.folder + "/" + SD.slug + "/" + (SD.files[i].f || i); }
  function photoTitle(f) { return f.t || SD.data.n || SD.slug; }
  function skuText(L) {
    if (!L || !L.length) return "";
    if (!Array.isArray(L)) return String(L);
    return L.length <= 12 ? L.join(", ") : L.slice(0, 10).join(", ") + " and " + num(L.length - 10) + " more";
  }
  function joinList(v) { return Array.isArray(v) ? v.join(", ") : (v || ""); }

  function photoCard(f, i) {
    var total = SD.files.length;
    var title = photoTitle(f);
    var name = title + ", photo " + (i + 1) + " of " + num(total);
    var url = fileUrl(f, SD.base);
    var img = isImageFile(f) ? '<img src="' + esc(url) + '" alt="' + esc(f.ds || title) + '" loading="lazy" onerror="this.style.display=\'none\'">' : "";
    var meta = [f.se, f.r].filter(Boolean).join(" · ") || "–";
    var pills = [];
    if (onS3(f) && !(f.sk && f.sk.length)) pills.push('<span class="tn-pill tn-pill--warn">Needs SKUs</span>');
    var picked = PICKS.has(photoId(i));
    return '<article class="tn-photo" data-photo="' + i + '">' +
      '<button type="button" class="tn-photo__media" data-v-open="' + i + '" aria-label="Open ' + esc(name) + '">' +
        '<span class="tn-card__ini" aria-hidden="true">' + esc(f.r || f.hs || "FILE") + "</span>" + img +
        (onS3(f) ? '<span class="tn-photo__badge" aria-hidden="true">S3</span>' : "") +
      "</button>" +
      '<h3 class="tn-photo__title">' + esc(title) + "</h3>" +
      '<p class="tn-photo__meta">' + esc(meta) + "</p>" +
      (pills.length ? '<div class="tn-card__pills">' + pills.join("") + "</div>" : "") +
      '<div class="tn-photo__acts">' +
        '<button type="button" class="tn-btn tn-btn--outline" data-v-pick="' + i + '" aria-pressed="' + picked + '" aria-label="Select ' + esc(name) + '">Select</button>' +
        '<button type="button" class="tn-btn" data-v-open="' + i + '" aria-label="Details for ' + esc(name) + '">Details</button>' +
        (f.vimeo ? '<a class="tn-btn tn-btn--outline" href="' + esc(f.vimeo) + '" target="_blank" rel="noopener">Watch 360 &#8599;</a>' : "") +
      "</div>" +
    "</article>";
  }

  function renderMorePhotos() {
    var grid = $("tn-photos");
    if (!grid || !SD) return;
    var from = SD.shown, to = Math.min(SD.files.length, from + PAGE_SIZE);
    var html = "";
    for (var i = from; i < to; i++) html += photoCard(SD.files[i], i);
    grid.insertAdjacentHTML("beforeend", html);
    SD.shown = to;
    var more = $("tn-photos-more");
    var left = SD.files.length - SD.shown;
    if (more) {
      more.hidden = left <= 0;
      more.querySelector("button").textContent = "Show " + num(Math.min(left, PAGE_SIZE)) + " more photos (" + num(left) + " left)";
    }
  }
  function ensureCard(i) {
    while (SD && i >= SD.shown) renderMorePhotos();
    return document.querySelector('#tn-photos [data-photo="' + i + '"]');
  }
  function updatePickedCount() { renderSelBar(); }

  function openShootDialog(folder, slug) {
    var dlg = $("tn-shoot-dialog");
    var title = $("tn-sd-title");
    var sub = $("tn-sd-sub");
    var body = $("tn-sd-body");
    if (!dlg || !slug) return Promise.resolve(false);
    SD = null;
    title.textContent = "Loading shoot files...";
    sub.textContent = "";
    body.innerHTML = '<p class="tn-empty">Fetching shoot manifest...</p>';
    updatePickedCount();
    if (!dlg.open) {
      if (dlg.showModal) dlg.showModal();
      else dlg.setAttribute("open", "");
    }

    var localUrl = "files/" + folder + "/" + slug + ".json";
    var remoteUrl = REMOTE_FILES_BASE + folder + "/" + slug + ".json";
    return loadJSON(localUrl).then(function (d) {
      if (d && d.files) return d;
      return loadJSON(remoteUrl);
    }).then(function (d) {
      if (!d || !d.files) {
        title.textContent = slug;
        sub.textContent = "Individual file list lives on the Tunnel server.";
        body.innerHTML = '<p class="tn-empty">Open this shoot directly on <a href="https://the-tunnel.netlify.app/v2/" target="_blank" rel="noopener">The Tunnel v2</a> to browse all individual frames.</p>';
        return false;
      }
      var files = d.files || [];
      SD = { folder: folder, slug: slug, data: d, files: files, base: d.s3 || S3_DEFAULT, row: ROWS[folder + "/" + slug] || null, shown: 0 };
      title.textContent = d.n || slug;
      sub.textContent = (d.store || folder) + " · " + num(files.length) + " asset" + (files.length === 1 ? "" : "s") + (d.built ? " · Updated " + d.built : "");
      body.innerHTML = '<div class="tn-photos" id="tn-photos" role="list"></div>' +
        '<div class="tn-photos-more" id="tn-photos-more" hidden><button type="button" class="tn-btn tn-btn--outline"></button></div>';
      renderMorePhotos();
      return true;
    });
  }

  function togglePick(i) {
    var id = photoId(i);
    if (PICKS.has(id)) PICKS.delete(id); else PICKS.set(id, pickItem(i));
    savePicks();
    var on = PICKS.has(id);
    document.querySelectorAll('[data-v-pick="' + i + '"]').forEach(function (b) { b.setAttribute("aria-pressed", String(on)); });
    if (V.open && V.idx === i) paintPick();
    updatePickedCount();
    announce(on ? "Added to selection." : "Removed from selection.");
  }

  /* Viewer */
  var viewer = $("tn-viewer"), vStage = $("tn-v-stage"), vBg = $("tn-v-bg"), vBar = $("tn-v-bar"), vPanel = $("tn-v-panel");
  var vBody = $("tn-v-body"), vLive = $("tn-v-live");
  var V = { open: false, busy: false, idx: 0, img: null, hidden: null, pushed: false };

  function motionOK() {
    return typeof window.gsap !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function announce(t) {
    vLive.textContent = "";
    setTimeout(function () { vLive.textContent = t; }, 30);
  }

  function dims(f, thumb) {
    if (f.w && f.h) return Promise.resolve({ w: Number(f.w), h: Number(f.h) });
    if (thumb && thumb.complete && thumb.naturalWidth) return Promise.resolve({ w: thumb.naturalWidth, h: thumb.naturalHeight });
    return new Promise(function (resolve) {
      var probe = new Image(), done = false;
      var finish = function (v) { if (!done) { done = true; resolve(v); } };
      probe.onload = function () { finish({ w: probe.naturalWidth, h: probe.naturalHeight }); };
      probe.onerror = function () { finish(null); };
      setTimeout(function () { finish(null); }, 1500);
      probe.src = fileUrl(f, SD.base);
    });
  }

  function fitBox(d) {
    var pad = window.innerWidth <= 760 ? 12 : 24;
    var sw = vStage.clientWidth - pad * 2, sh = vStage.clientHeight - pad * 2;
    var w = d ? d.w : sw, h = d ? d.h : sh;
    var k = Math.min(sw / w, sh / h, d ? 1 : Infinity);
    w = Math.round(w * k); h = Math.round(h * k);
    return { w: w, h: h, x: Math.round((vStage.clientWidth - w) / 2), y: Math.round((vStage.clientHeight - h) / 2) };
  }
  function place(img, box) {
    img.style.width = box.w + "px";
    img.style.height = box.h + "px";
    img.style.left = box.x + "px";
    img.style.top = box.y + "px";
  }

  function makeStageImage(f) {
    if (!isImageFile(f)) {
      var empty = document.createElement("div");
      empty.className = "tn-viewer__empty";
      empty.innerHTML = '<p>' + esc(f.ds || photoTitle(f)) + "</p><p>Stored in " + esc(f.hs || "an outside link") + ". Use the button in the panel to open it.</p>";
      return empty;
    }
    var img = document.createElement("img");
    img.className = "tn-viewer__img";
    img.alt = f.ds || photoTitle(f);
    img.decoding = "async";
    img.src = fileUrl(f, SD.base);
    return img;
  }

  // The flight: the full photo starts scaled and clipped to exactly the card's cropped thumbnail,
  // then the scale and the clip open together, so nothing jumps when the crop differs.
  function thumbPose(box, rect) {
    var s = Math.max(rect.width / box.w, rect.height / box.h);
    var sr = vStage.getBoundingClientRect();
    var cx = rect.left + rect.width / 2 - (sr.left + box.x + box.w / 2);
    var cy = rect.top + rect.height / 2 - (sr.top + box.y + box.h / 2);
    var iw = (box.w - rect.width / s) / 2, ih = (box.h - rect.height / s) / 2;
    var r = 8 / s;
    return { x: cx, y: cy, scale: s, clipPath: "inset(" + ih + "px " + iw + "px " + ih + "px " + iw + "px round " + r + "px)" };
  }
  var OPEN_POSE = { x: 0, y: 0, scale: 1, clipPath: "inset(0px 0px 0px 0px round 4px)" };

  function cardImg(i) {
    var card = document.querySelector('#tn-photos [data-photo="' + i + '"]');
    var img = card && card.querySelector(".tn-photo__media img");
    return img && img.style.display !== "none" && img.complete && img.naturalWidth ? img : null;
  }
  function hideCardImg(i) {
    if (V.hidden) V.hidden.style.visibility = "";
    V.hidden = null;
    var img = cardImg(i);
    if (img) { img.style.visibility = "hidden"; V.hidden = img; }
  }

  function paintPick() {
    var b = $("tn-v-pick"), on = PICKS.has(photoId(V.idx));
    b.setAttribute("aria-pressed", String(on));
    b.textContent = on ? "In selection" : "Add to selection";
  }

  function rows(el, pairs) {
    el.innerHTML = pairs.map(function (p) {
      var v = p[1];
      var dd = v && p[2] ? '<a href="' + esc(v) + '" target="_blank" rel="noopener">' + esc(p[2]) + "</a>" : esc(v || "–");
      return "<dt>" + esc(p[0]) + "</dt><dd>" + dd + "</dd>";
    }).join("");
  }

  function paintPanel() {
    var f = SD.files[V.idx], d = SD.data, row = SD.row || {};
    var title = photoTitle(f);
    var cat = f.c || (row.cats || [])[0];
    var season = f.se || (row.ses || [])[0];
    var crumbs = ["Asset Library", cat, d.n || SD.slug, season].filter(Boolean);
    $("tn-v-crumbs").innerHTML = crumbs.map(function (c, n) {
      return "<li" + (n === crumbs.length - 1 ? ' aria-current="location"' : "") + ">" + esc(c) + "</li>";
    }).join("");
    $("tn-v-cur").textContent = num(V.idx + 1);
    $("tn-v-total").textContent = num(SD.files.length);
    $("tn-v-prev").disabled = $("tn-v-next").disabled = SD.files.length < 2;
    $("tn-v-title").textContent = title;
    var store = d.store || f.tr || "";
    $("tn-v-source").textContent = (onS3(f) ? "On S3, downloadable" : "Stored in " + (f.hs || "an outside link")) + (store ? " · " + store + " assets" : "");

    rows($("tn-v-file"), [
      ["What is in it", f.ds],
      ["Dimensions", f.w ? f.w + " × " + f.h + " px" : (V.dims && isImageFile(f) ? V.dims.w + " × " + V.dims.h + " px (read from the photo)" : "")],
      ["Aspect ratio", f.r],
      ["Filename", fileName(f)],
      ["Stored", onS3(f) ? "S3 · Photos/" : (f.hs || "")]
    ]);
    rows($("tn-v-meta"), [
      ["Season", season],
      ["Category", cat],
      ["Brand", joinList(f.b)],
      ["Kit", f.kit],
      ["SKU", skuText(f.sk)],
      ["Launch", f.la],
      ["Launch date", f.d ? niceDate(f.d) : ""]
    ]);
    rows($("tn-v-adv"), [
      ["Owned by", f.tr || d.store],
      ["Type of shoot", f.sh],
      ["Stills or video", joinList(f.av)],
      ["Sport", f.sp],
      ["Note", f.nt],
      ["Approval", f.ap || (f.tr === "WorldSoccerShop" ? "Not marked" : "")],
      ["Players", joinList(f.pl)],
      ["Footwear tags", joinList(f.ft)],
      ["Tags", joinList(f.tg)],
      ["Record created", f.cr],
      ["Wave", f.wv],
      ["Box", f.u || f.boxUrl || d.boxUrl, "Open in Box"],
      ["ClickUp task", f.cu, "Open task"]
    ]);

    var url = fileUrl(f, SD.base), img = isImageFile(f);
    $("tn-v-copy").hidden = !img;
    $("tn-v-copy").setAttribute("data-url", url);
    var dl = $("tn-v-dl"), host = $("tn-v-open-host"), rs = $("tn-v-resize");
    resetDownload();
    dl.hidden = !onS3(f);
    host.hidden = onS3(f) || !f.u;
    if (!host.hidden) { host.href = f.u; host.textContent = "Open in " + (f.hs || "host") + " ↗"; }
    rs.hidden = !img;
    rs.href = TOOLS_SITE + "dx-resizer.html?img=" + encodeURIComponent(fileName(f));
    paintPick();
  }

  function preloadNeighbours() {
    [V.idx - 1, V.idx + 1].forEach(function (n) {
      var f = SD.files[(n + SD.files.length) % SD.files.length];
      if (f && isImageFile(f)) { var p = new Image(); p.src = fileUrl(f, SD.base); }
    });
  }

  function setAddress(mode) {
    var u = new URL(location.href);
    if (mode === "clear") { u.searchParams.delete("shoot"); u.searchParams.delete("photo"); }
    else {
      u.searchParams.set("shoot", SD.folder + "/" + SD.slug);
      u.searchParams.set("photo", SD.files[V.idx].f || String(V.idx));
    }
    if (mode === "push") { history.pushState({ tnViewer: true }, "", u); V.pushed = true; }
    else history.replaceState(mode === "clear" ? null : history.state, "", u);
  }

  function layoutCurrent() {
    if (!V.img || V.img.tagName !== "IMG") return;
    place(V.img, fitBox(V.dims));
  }

  function openViewer(i, opts) {
    if (!SD || V.busy || V.open) return;
    opts = opts || {};
    V.idx = i; V.open = true; V.busy = true; V.pushed = false;
    var f = SD.files[i];
    var thumb = opts.fly === false ? null : cardImg(i);
    var firstRect = thumb ? thumb.getBoundingClientRect() : null;

    paintPanel();
    vStage.innerHTML = "";
    var el = makeStageImage(f);
    V.img = el;
    if (el.tagName === "IMG") el.style.visibility = "hidden";
    vStage.appendChild(el);
    viewer.showModal();
    setAddress(opts.address === "keep" ? "replace" : "push");
    announce("Photo " + (i + 1) + " of " + SD.files.length + ": " + photoTitle(f));

    dims(f, thumb).then(function (d) {
      V.dims = d;
      if (!f.w) paintPanel();
      if (el.tagName === "IMG") { place(el, fitBox(d)); el.style.visibility = ""; }
      var others = Array.prototype.filter.call(document.querySelectorAll("#tn-photos .tn-photo"), function (c) { return c.getAttribute("data-photo") !== String(i); });
      var done = function () { V.busy = false; $("tn-v-title").focus(); preloadNeighbours(); };

      if (!motionOK()) {
        viewer.style.opacity = "0";
        viewer.style.transition = "opacity .2s ease";
        requestAnimationFrame(function () { viewer.style.opacity = "1"; });
        setTimeout(function () { viewer.style.transition = ""; done(); }, 200);
        return;
      }
      var g = window.gsap;
      var mobile = window.innerWidth <= 760;
      var tl = g.timeline({ defaults: { ease: "power2.inOut" }, onComplete: done });
      tl.fromTo(vBg, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0)
        .fromTo(vBar, { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.15)
        .fromTo(vPanel, mobile ? { autoAlpha: 0, y: 32 } : { autoAlpha: 0, x: 32 }, { autoAlpha: 1, x: 0, y: 0, duration: 0.4 }, 0.2);
      if (others.length) tl.to(others, { autoAlpha: 0, duration: 0.3, stagger: { amount: 0.12 } }, 0);
      if (thumb && el.tagName === "IMG") {
        hideCardImg(i);
        var box = fitBox(d);
        tl.fromTo(el, thumbPose(box, firstRect), Object.assign({ duration: 0.6 }, OPEN_POSE), 0);
      } else {
        tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.1);
      }
    });
  }

  function step(delta) {
    if (!V.open || V.busy || !SD || SD.files.length < 2) return;
    var n = SD.files.length;
    V.idx = (V.idx + delta + n) % n;
    var f = SD.files[V.idx];
    var old = V.img;
    var el = makeStageImage(f);
    if (el.tagName === "IMG") el.classList.add("is-entering");
    vStage.appendChild(el);
    V.img = el;
    vBody.classList.add("is-swapping");
    setTimeout(function () { paintPanel(); vBody.classList.remove("is-swapping"); }, 150);
    $("tn-v-cur").textContent = num(V.idx + 1);
    setAddress("replace");
    announce("Photo " + (V.idx + 1) + " of " + n + ": " + photoTitle(f));
    if (old) {
      old.classList.add("is-leaving");
      setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 260);
    }
    var mine = V.idx;
    dims(f, cardImg(mine)).then(function (d) {
      if (V.idx !== mine) return;
      V.dims = d;
      if (!f.w) setTimeout(function () { if (V.idx === mine) paintPanel(); }, 160);
      if (el.tagName === "IMG") {
        place(el, fitBox(d));
        requestAnimationFrame(function () { el.classList.remove("is-entering"); });
      }
    });
    preloadNeighbours();
  }

  function finishClose() {
    viewer.close();
    vStage.innerHTML = "";
    V.img = null; V.open = false; V.busy = false;
    [vBg, vBar, vPanel].forEach(function (n) { n.removeAttribute("style"); });
    viewer.removeAttribute("style");
    document.querySelectorAll("#tn-photos .tn-photo").forEach(function (c) { c.style.opacity = ""; c.style.visibility = ""; });
    if (V.hidden) { V.hidden.style.visibility = ""; V.hidden = null; }
    var card = document.querySelector('#tn-photos [data-photo="' + V.idx + '"] .tn-photo__media');
    if (card) card.focus({ preventScroll: true });
  }

  function animateClose() {
    if (!V.open || V.busy) return;
    V.busy = true;
    var i = V.idx;
    var card = SD ? ensureCard(i) : null;
    if (card) card.scrollIntoView({ block: "center" });
    var target = cardImg(i);
    var el = V.img;

    if (!motionOK()) {
      viewer.style.transition = "opacity .2s ease";
      viewer.style.opacity = "0";
      setTimeout(finishClose, 200);
      return;
    }
    var g = window.gsap;
    var mobile = window.innerWidth <= 760;
    var tl = g.timeline({ defaults: { ease: "power2.inOut" }, onComplete: finishClose });
    tl.to(vBar, { autoAlpha: 0, y: -16, duration: 0.3 }, 0)
      .to(vPanel, mobile ? { autoAlpha: 0, y: 32, duration: 0.3 } : { autoAlpha: 0, x: 32, duration: 0.3 }, 0)
      .to(vBg, { autoAlpha: 0, duration: 0.45 }, 0.05)
      .to("#tn-photos .tn-photo", { autoAlpha: 1, duration: 0.4, stagger: { amount: 0.12 } }, 0.1);
    if (target && el && el.tagName === "IMG") {
      hideCardImg(i);
      tl.to(el, Object.assign({ duration: 0.6 }, thumbPose(fitBox(V.dims), target.getBoundingClientRect())), 0);
    } else if (el) {
      tl.to(el, { autoAlpha: 0, duration: 0.3 }, 0);
    }
  }

  function closeViewer() {
    if (!V.open || V.busy) return;
    if (V.pushed) history.back();       // popstate runs the close
    else { setAddress("clear"); animateClose(); }
  }

  function resetDownload() {
    var b = $("tn-v-dl");
    clearTimeout(b._t);
    b.textContent = "Download";
    b.removeAttribute("data-note");
  }
  function downloadPhoto() {
    var f = SD.files[V.idx], b = $("tn-v-dl");
    var url = fileUrl(f, SD.base), name = fileName(f);
    var show = function (text, ms) {
      clearTimeout(b._t);
      b.textContent = text;
      b.setAttribute("data-note", "");
      announce(text);
      b._t = setTimeout(resetDownload, ms);
    };
    // The image host refuses server-side fetches (Cloudflare), while serving browsers.
    // So when no proxy route answers, open the photo in a tab and hand the designer its real name.
    var fallback = function () {
      if (navigator.clipboard) navigator.clipboard.writeText(name).catch(function () {});
      window.open(url, "_blank", "noopener");
      show("Opened in a new tab. Right-click, Save image as (name copied).", 6000);
    };
    if (!DOWNLOAD_ROUTE) { fallback(); return; }
    b.textContent = "Saving...";
    fetch(DOWNLOAD_ROUTE + enc(name), { credentials: "same-origin" }).then(function (res) {
      var type = res.headers.get("content-type") || "";
      if (!res.ok || type.indexOf("image/") !== 0) throw new Error("refused");
      return res.blob();
    }).then(function (blob) {
      var obj = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = obj; a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(obj); }, 10000);
      show("Saved as " + name, 1600);
    }).catch(fallback);
  }

  $("tn-v-prev").addEventListener("click", function () { step(-1); });
  $("tn-v-next").addEventListener("click", function () { step(1); });
  $("tn-v-close").addEventListener("click", closeViewer);
  $("tn-v-dl").addEventListener("click", downloadPhoto);
  $("tn-v-pick").addEventListener("click", function () { togglePick(V.idx); });
  $("tn-v-copy").addEventListener("click", function () {
    var b = this, u = b.getAttribute("data-url");
    if (!u || !navigator.clipboard) return;
    navigator.clipboard.writeText(u).then(function () {
      b.textContent = "Copied";
      announce("CDN link copied.");
      setTimeout(function () { b.textContent = "Copy CDN link"; }, 1400);
    });
  });
  vPanel.addEventListener("click", function (e) {
    var t = e.target.closest(".tn-v-sec__btn");
    if (!t) return;
    var open = t.getAttribute("aria-expanded") === "true";
    t.setAttribute("aria-expanded", String(!open));
    $(t.getAttribute("aria-controls")).hidden = open;
  });
  viewer.addEventListener("cancel", function (e) { e.preventDefault(); closeViewer(); });
  viewer.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      var f = Array.prototype.filter.call(viewer.querySelectorAll("button, a[href], [tabindex='0']"), function (n) {
        return !n.disabled && !n.hidden && n.offsetParent !== null;
      });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === $("tn-v-title"))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    else if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  });
  viewer.addEventListener("click", function (e) {
    if (e.target === vStage || e.target === vBg || e.target.classList.contains("tn-viewer__empty")) closeViewer();
  });
  (function swipe() {
    var x0 = null, y0 = 0;
    vStage.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") { x0 = e.clientX; y0 = e.clientY; } });
    vStage.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { step(dx < 0 ? 1 : -1); }
    });
  })();
  window.addEventListener("resize", function () { if (V.open && !V.busy) layoutCurrent(); });
  window.addEventListener("popstate", function () {
    var has = new URL(location.href).searchParams.get("photo");
    if (V.open && !has) { V.pushed = false; animateClose(); }
    else if (!V.open && has) openFromAddress();
  });

  $("tn-sd-body").addEventListener("click", function (e) {
    var o = e.target.closest("[data-v-open]");
    if (o) { openViewer(Number(o.getAttribute("data-v-open"))); return; }
    var p = e.target.closest("[data-v-pick]");
    if (p) { togglePick(Number(p.getAttribute("data-v-pick"))); return; }
    if (e.target.closest("#tn-photos-more button")) renderMorePhotos();
  });

  function openFromAddress() {
    var u = new URL(location.href);
    var shoot = u.searchParams.get("shoot"), photo = u.searchParams.get("photo");
    if (!shoot || !photo) return;
    var cut = shoot.indexOf("/");
    if (cut < 1) return;
    var folder = shoot.slice(0, cut), slug = shoot.slice(cut + 1);
    var go = function () {
      if (!SD) return;
      var i = SD.files.findIndex(function (f) { return f.f === photo; });
      if (i < 0 && /^\d+$/.test(photo)) i = Number(photo);
      if (i < 0 || i >= SD.files.length) return;
      ensureCard(i);
      openViewer(i, { fly: false, address: "keep" });
    };
    if (SD && SD.folder === folder && SD.slug === slug) go();
    else openShootDialog(folder, slug).then(go);
  }

  function renderTools(tab) {
    if (!CHIP[tab]) tab = "all";
    document.querySelectorAll("#tn-tools-tabs .nm-tab").forEach(function (t) {
      var on = t.getAttribute("data-tab") === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) $("tn-tools-panel").setAttribute("aria-labelledby", t.id);
    });
    $("tn-tools-rows").innerHTML = TOOLS.filter(function (t) { return tab === "all" || t.tab === tab; }).map(function (t) {
      var ext = /^https?:/.test(t.url);
      return "<tr><td class=\"tn-tools-table__name\">" + esc(t.name) + "</td><td>" + esc(t.what) + "</td>" +
        '<td><span class="tn-kind tn-kind--' + t.tab + '">' + esc(CHIP[t.tab]) + "</span></td>" +
        '<td class="tn-tools-table__go"><a class="tn-btn tn-btn--outline" href="' + esc(t.url) + '" target="_blank" rel="noopener" aria-label="Open ' + esc(t.name) + (ext ? ", opens in a new tab" : "") + '">Open &#8599;</a></td></tr>';
    }).join("");
  }
  function markHub(which) {
    document.querySelectorAll("[data-hub-link]").forEach(function (a) {
      if (a.getAttribute("data-hub-link") === which) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  function render() {
    var route = (location.hash.replace(/^#\/?/, "") || "home").toLowerCase();
    if (route.indexOf("tools") === 0) {
      var tab = route.split("/")[1] || "all";
      home.hidden = true; brand.hidden = true; drawer.hidden = true; tools.hidden = false;
      rail.forEach(function (a) { a.removeAttribute("aria-current"); });
      document.title = "Tools | The Tunnel";
      currentKey = null;
      renderTools(tab);
      markHub(CHIP[tab] ? tab : "");
      return;
    }
    tools.hidden = true;
    var key = route;
    if (key !== "home" && !BRANDS[key]) key = "home";
    rail.forEach(function (a) {
      if (a.getAttribute("data-view") === key) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    markHub(key === "home" ? "home" : "");
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
      OPEN = {};
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
      OPEN[t.getAttribute("data-section")] = !open;
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

  $("tn-shoot-dialog").addEventListener("close", function () { SD = null; });
  $("tn-sd-close").addEventListener("click", function () {
    var dlg = $("tn-shoot-dialog");
    if (dlg.close) dlg.close();
    else dlg.removeAttribute("open");
  });
  $("tn-shoot-dialog").addEventListener("click", function (e) {
    if (e.target === $("tn-shoot-dialog")) $("tn-sd-close").click();
  });

  $("tn-tools-tabs").addEventListener("click", function (e) {
    var t = e.target.closest(".nm-tab");
    if (t) location.hash = "#/tools/" + (t.getAttribute("data-tab") === "all" ? "" : t.getAttribute("data-tab"));
  });
  $("tn-tools-tabs").addEventListener("keydown", function (e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    var tabs = Array.prototype.slice.call(this.querySelectorAll(".nm-tab"));
    var i = tabs.indexOf(document.activeElement);
    var next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
    next.click();
    setTimeout(function () { $(next.id).focus(); }, 0);
  });

  $("tn-home-scope").addEventListener("change", function () {
    loadAllForHome($("tn-home-search").value);
    $("tn-home-search").focus();
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
  renderSelBar();
  openFromAddress();
})();
