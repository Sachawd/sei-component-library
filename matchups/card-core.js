/*
 * card-core.js — the one place a matchup card is built.
 *
 * Crest canon §4: one spine, interchangeable renderers, never two systems. Two
 * renderers now read this file — render-matchup.js on a Mac with Playwright, and
 * the generator page in Brock and Jess's browser. Neither owns the layout rules,
 * so a change to the kit rule or the CTA rule lands in both at once.
 *
 * Runs unchanged in Node and in a browser. Nothing in here touches the disk, the
 * network or the DOM; the one thing that differs between the two — how a photo
 * path becomes a usable src — is passed in as resolveSrc.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CardCore = factory();
})(typeof self !== "undefined" ? self : this, function () {

  const esc = s => String(s ?? "").replace(/[&<>"]/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const hydrate = (s, map) => Object.entries(map).reduce(
    (acc, [k, v]) => acc.split(`{{${k}}}`).join(v == null ? "" : String(v)), s);

  const slug = s => String(s ?? "").toLowerCase().normalize("NFKD")
    .replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // initials, for a club we hold no crest for. Same fallback the C-22 block uses.
  const initials = n => String(n || "").split(/\s+/).filter(Boolean).slice(0, 2)
    .map(w => w[0]).join("").toUpperCase();

  function kickoffParts(iso, cfg) {
    const d = new Date(iso);
    const tz = cfg.timezone;
    const date = d.toLocaleDateString("en-US", { timeZone: tz, month: "long", day: "numeric", year: "numeric" });
    const time = d.toLocaleTimeString("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" });
    return { date, time: `${time} ${cfg.tz_label}` };
  }

  // One side of the card. Named for the SIDE, never "home" twice — the Figma
  // file names both halves "Home Team" and ships Man City's crest under the
  // words MANCHESTER UTD. That bug does not survive the port.
  function side(team, which, matchId, withCta, cfg, photos, resolveSrc) {
    const key = slug(team.name);
    // Sacha's call 2026-09-09: ONE image per club to start. A string is the
    // expected shape. An array is accepted too and picked deterministically from
    // the match id, so moving to a rotating set later is a data change and not a
    // code change — but nothing here builds a rotation today.
    const entry = photos[key];
    const pick = e => Array.isArray(e)
      ? (e.length ? e[[...String(matchId || key)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % e.length] : null)
      : e || null;
    // KIT RULE (Sacha, 2026-09-09): the home side gets the home kit, the away
    // side the away kit — so the card shows what they will wear and links to the
    // shirt we are selling. Falls back to the other kit, then to a flat panel.
    // ⚠️ It is an ASSUMPTION, not a fact. Kit clashes mean an away side sometimes
    // wears third, and the feed does not say which kit was chosen. Fine for a
    // fixture card published before kick-off; check it before any post-match use.
    const photo = (entry && typeof entry === "object" && !Array.isArray(entry))
      ? (pick(entry[which]) || pick(entry.home) || pick(entry.away) || pick(entry.third))
      : pick(entry);
    const crest = team.crest
      ? `<img class="crest" src="${esc(resolveSrc(team.crest))}" alt="">`
      : `<div class="crest-fallback">${esc(initials(team.name))}</div>`;
    return {
      [`${which}_name`]: esc(team.short || team.name),
      [`${which}_crest_tag`]: crest,
      [`${which}_photo_tag`]: photo ? `<img src="${esc(resolveSrc(photo))}" alt="">` : "",
      [`${which}_surface`]: photo ? "transparent" : cfg.surface,
      // Two ways to lose the button. SOCIAL has no CTA at all (Sacha, 2026-09-10)
      // — there is nothing to click in a feed image and a dead button reads as a
      // mistake. And no landing page means no button in any variant: a CTA that
      // goes nowhere is worse than none.
      [`${which}_cta`]: (withCta && team.url) ? `<div class="cta">${esc(cfg.cta_label)}</div>` : "",
      [`_${which}_hasPhoto`]: !!photo,
      [`_${which}_hasCrest`]: !!team.crest,
      [`_${which}_hasUrl`]: !!team.url,
    };
  }

  function centre(m) {
    if (m.status === "final" && m.score) {
      const chip = m.score.decided === "pens" ? "PENS" : m.score.decided === "aet" ? "AET" : "FT";
      return `<div class="score"><div class="line">${m.score.home}-${m.score.away}</div>
            <div class="chip">${chip}</div></div>`;
    }
    // ⚠️ never a live score. C-22 refreshes every 15 min and a 15-minute-stale
    // score is wrong in a way people notice. A blank one is not.
    if (m.status === "live") return `<div class="vs">VS</div>`;
    return `<div class="vs">VS</div>`;
  }

  /*
   * The whole card, as HTML.
   *   tpl        matchup-mother.html
   *   cfg        card-config.json
   *   photos     club-photos.json .clubs
   *   match      one fixture from the C-22 payload
   *   variant    an entry from cfg.variants
   *   format     an entry from cfg.formats
   *   resolveSrc turns a stored photo value into a src this renderer can load
   * Returns { html, flags } — flags are what QA reports on.
   */
  function buildCard({ tpl, cfg, photos, match, variant, format, resolveSrc }) {
    const withCta = variant.cta !== false;
    const H = side(match.home, "home", match.id, withCta, cfg, photos, resolveSrc);
    const A = side(match.away, "away", match.id, withCta, cfg, photos, resolveSrc);
    const k = kickoffParts(match.kickoff, cfg);
    const html = hydrate(tpl, {
      W: format.w, H: format.h, photo_pct: format.photo_pct ?? 60,
      surface: cfg.surface, card_surface: cfg.card_surface, fallback_surface: cfg.surface,
      date_line: esc(k.date), time_line: esc(k.time),
      // fixtures.json carries NO venue. The row is hidden rather than faked.
      venue_line: "", city_line: "",
      home_label: esc(cfg.home_label), away_label: esc(cfg.away_label),
      centre_block: centre(match),
      ...H, ...A,
    });
    return {
      html,
      flags: {
        homeHasPhoto: H._home_hasPhoto, awayHasPhoto: A._away_hasPhoto,
        homeHasCrest: H._home_hasCrest, awayHasCrest: A._away_hasCrest,
        homeHasUrl: H._home_hasUrl, awayHasUrl: A._away_hasUrl,
      },
    };
  }

  return { esc, hydrate, slug, initials, kickoffParts, side, centre, buildCard };
});
