#!/usr/bin/env python3
"""Builds Volley Home (index.html), Start Here (get-started.html),
01 - How It Works (how-it-works.html with Osmo Step-by-step Timeline),
and the short single-topic step pages (step-*.html).
"""
import pathlib
import re

HERE = pathlib.Path(__file__).resolve().parent

# Read the nav shell from index.html so nm-shell.py can replace it cleanly
INDEX_TEXT = (HERE / "index.html").read_text(encoding="utf-8")
SHELL_MATCH = re.search(r'(<a class="nm-skip".*?</nav>\n)', INDEX_TEXT, re.S)
SHELL_BLOCK = SHELL_MATCH.group(1)


def page_template(title, desc, body_html, extra_head="", extra_scripts=""):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · Volley</title>
<meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Adamina&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="nutmeg.css">
{extra_head}</head>
<body data-hub="volley">
<script>document.documentElement.classList.add("nm-js");setTimeout(function(){{if(!window.NM_READY)document.documentElement.classList.remove("nm-js")}},3000)</script>
{SHELL_BLOCK}<main class="nm-main" id="nm-main">
<div class="nm-panel"><div class="nm-content">
{body_html}
<footer class="nm-footer"><span>Volley · Sports Endeavors design &amp; marketing hub.</span><a href="https://github.com/Sachawd/sei-component-library" target="_blank" rel="noopener">View on GitHub</a></footer>
</div></div>
</main>
</div>
<script src="nm-pages.js"></script>
<script src="nutmeg.js"></script>
{extra_scripts}</body>
</html>
"""


# 1. VOLLEY HOME (index.html)
LOGO_SET = """
<img src="logos/Logos_sdc.png" width="177" height="44" alt="Soccer.com">
<img src="logos/Logos_wss.png" width="177" height="47" alt="WorldSoccerShop">
<img class="nm-logo--tall" src="logos/Logos_431.png" width="92" height="92" alt="431 Sports">
<img class="nm-logo--tall" src="logos/Logos_soccermaster.png" width="143" height="61" alt="Soccer Master">
"""

VOLLEY_HOME_BODY = f"""<div class="nm-whats-new-bar">
  <span class="nm-whats-new-bar__badge">
    <span class="nm-whats-new-bar__dot" aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 9C19.5 12.2 19.5 16.5 17 19C15.6 20.2 13.8 20.9 12 20.9C10.2 20.9 8.4 20.2 7 19C4.5 16.5 4.5 12.2 7 9L12 2.5L17 9Z"/></svg>
    </span>
    What&#x27;s New
  </span>
  <span class="nm-whats-new-bar__sep" aria-hidden="true">|</span>
  <span>New component &amp; library updates as of 26 October</span>
  <span class="nm-whats-new-bar__sep" aria-hidden="true">|</span>
  <a class="nm-whats-new-bar__link" href="changelog.html">See all new releases</a>
</div>

<section class="nm-hero-banner" aria-label="Volley overview">
  <video class="nm-hero-banner__video" autoplay muted loop playsinline width="1920" height="1080" poster="patterns/Volley%20Pattern%20Muted.png" src="patterns/Volley%20Pattern%20Muted.mp4" aria-hidden="true" tabindex="-1"></video>
  <div class="nm-hero-banner__scrim" aria-hidden="true"></div>
  <div class="nm-hero-banner__content">
    <h1 class="nm-hero-banner__title">Volley</h1>
    <p class="nm-hero-banner__sub">Volley is Sports Endeavors design &amp; marketing hub</p>
  </div>
</section>

<div class="nm-double-rule" aria-hidden="true"></div>

<section aria-label="Quick navigation">
  <div class="nm-home-grid">
    <a class="nm-home-card" href="how-it-works.html">
      <span class="nm-home-card__media"><img src="patterns/Volley%20Pattern%20Muted.png" width="1920" height="1080" alt=""></span>
      <span class="nm-home-card__foot"><span class="nm-home-card__title">How it Works</span><span class="nm-home-card__tag">Overview</span></span>
    </a>
    <a class="nm-home-card" href="get-started.html">
      <span class="nm-home-card__media"><img src="patterns/Volley%20Pattern%20Muted.png" width="1920" height="1080" alt=""></span>
      <span class="nm-home-card__foot"><span class="nm-home-card__title">Getting Started</span><span class="nm-home-card__tag">Toolkits</span></span>
    </a>
    <a class="nm-home-card" href="blocks.html">
      <span class="nm-home-card__media"><img src="patterns/Volley%20Pattern%20Muted.png" width="1920" height="1080" alt=""></span>
      <span class="nm-home-card__foot"><span class="nm-home-card__title">Component library</span><span class="nm-home-card__tag">Tools</span></span>
    </a>
    <a class="nm-home-card" href="step-tools.html">
      <span class="nm-home-card__media"><img src="patterns/Volley%20Pattern%20Muted.png" width="1920" height="1080" alt=""></span>
      <span class="nm-home-card__foot"><span class="nm-home-card__title">Tools</span><span class="nm-home-card__tag">Resources</span></span>
    </a>
  </div>
</section>

<section class="nm-logo-marquee" aria-label="Sports Endeavors storefronts">
  <div class="nm-logo-marquee__inner">
    <div class="nm-logo-marquee__track">{LOGO_SET}{LOGO_SET}</div>
    <div class="nm-logo-marquee__track" aria-hidden="true">{LOGO_SET}{LOGO_SET}</div>
  </div>
</section>"""

(HERE / "index.html").write_text(
    page_template(
        "Volley Home",
        "Volley is Sports Endeavors design and marketing hub.",
        VOLLEY_HOME_BODY,
    ),
    encoding="utf-8",
)

# 1b. CHANGELOG PAGE (changelog.html)
CHANGELOG_BODY = """<div class="nm-title">
  <span class="nm-eyebrow" style="color:var(--nm-accent)">RELEASES &amp; LIBRARY STATUS</span>
  <h1>Changelog</h1>
  <p class="nm-lede">New component releases, library counts, and hub updates across Volley.</p>
  <hr class="nm-divider">
</div>
<section class="nm-section" id="at-a-glance">
  <div class="nm-stats">
    <div class="nm-stat"><span class="nm-stat__num">39</span><span class="nm-stat__cap">components in the library.</span></div>
    <div class="nm-stat"><span class="nm-stat__num">1</span><span class="nm-stat__cap">live on the site.</span></div>
    <div class="nm-stat"><span class="nm-stat__num">10</span><span class="nm-stat__cap">in progress: ready to study and build from.</span></div>
    <div class="nm-stat"><span class="nm-stat__num">28</span><span class="nm-stat__cap">added from the canon folder on 25 Oct 2026 and queued for review.</span></div>
  </div>
</section>
<section class="nm-section" id="whats-new">
  <div class="nm-section__head"><h2 class="nm-h2">What&#x27;s new</h2></div>
  <ul class="nm-list">
    <li>26 Oct 2026: Volley Home hero video, brand logo marquee, 6-step How It Works timeline, 12 step-by-step onboarding cards, and Volley-styled Photo Sizer.</li>
    <li>26 Oct 2026: 39 components grouped by type, plus Email and Pages sections.</li>
    <li>25 Oct 2026: 28 additional blocks added from canon, marked In progress until reviewed.</li>
    <li>24 Oct 2026: Showcase Slider and block detail pages launched.</li>
    <li>24 Oct 2026: Five color pairs updated so every text pair passes contrast.</li>
  </ul>
</section>"""

(HERE / "changelog.html").write_text(
    page_template(
        "Changelog",
        "New component releases, library counts, and hub updates across Volley.",
        CHANGELOG_BODY,
    ),
    encoding="utf-8",
)


# 2. START HERE / GET STARTED (get-started.html)
START_CARDS = [
    ("01", "01·How It Works", "A brief guide to the process", "how-it-works.html"),
    ("02", "02·Starter Kit", "Download your AI starter kit", "starter-pack-wss.html"),
    ("03", "03·Tools & Links", "Your 12 daily tools and bookmarks", "step-tools.html"),
    ("04", "04·Site Updates List", "Why every request starts in ClickUp and the 12 statuses", "step-clickup.html"),
    ("05", "05·Figma Library", "Pulling Cabana 8 code blocks, slots, and Figma annotations", "step-figma.html"),
    ("06", "06·Working With Images", "Photo Sizer, 300 KB and 200 KB limits, and Box subfolders", "step-images.html"),
    ("07", "07·Working With Links", "Using the Link Book and Tunnel product picks", "step-links.html"),
    ("08", "08·Fastr CMS", "Copying from VS Code, the 3 heights, and Reserves space", "step-fastr.html"),
    ("09", "09·Testing", "PageSpeed, 5 widths in Responsively, Jam, and ADA contrast", "step-testing.html"),
    ("10", "10·Video Guides", "Watch the 24-minute workshop reel and 6 short topic clips", "videos.html"),
    ("11", "11·Your First Build", "Click-by-click walkthrough for your first practice run", "first-build.html"),
    ("12", "12·Hand In & Code Share", "Creating 1 Code Share link and attaching your 7 ClickUp items", "step-handin.html"),
]

cards_html = []
for num, title, desc, href in START_CARDS:
    cards_html.append(
        f'<a class="nm-video-card" href="{href}">'
        f'<span class="nm-video-card__media"><span class="nm-title-card">'
        f'<span class="nm-title-card__num">{num}</span>'
        f'<span class="nm-title-card__label">GETTING STARTED</span>'
        f'</span></span>'
        f'<span><span class="nm-video-card__title">{title}</span>'
        f'<span class="nm-video-card__desc">{desc}</span></span></a>'
    )

GET_STARTED_BODY = f"""<div class="nm-title">
  <span class="nm-eyebrow" style="color:var(--nm-accent)">GETTING STARTED</span>
  <h1>Start Here</h1>
  <p class="nm-lede">Follow the steps below one at a time, or open any topic when you need a quick refresher.</p>
  <hr class="nm-divider">
</div>
<section class="nm-section" id="steps-grid">
  <div class="nm-cards nm-cards--3">
    {"".join(cards_html)}
  </div>
</section>
<section class="nm-section" id="explore-more">
  <div class="nm-cards">
    <a class="nm-video-card" href="blocks.html">
      <span class="nm-video-card__media"><img class="nm-video-card__pattern" src="patterns/Volley%20Pattern.png" width="1920" height="1080" alt=""></span>
      <span><span class="nm-video-card__title">Components</span><span class="nm-video-card__desc">Browse all 39 website blocks by type with live previews and code</span></span>
    </a>
    <a class="nm-video-card" href="step-tools.html">
      <span class="nm-video-card__media"><img class="nm-video-card__pattern" src="patterns/Volley%20Pattern%20Muted.png" width="1920" height="1080" alt=""></span>
      <span><span class="nm-video-card__title">Resources</span><span class="nm-video-card__desc">Photo Sizer, The Tunnel, Code Share, Link Book, and Box</span></span>
    </a>
  </div>
</section>
<p class="nm-contrast-note"><a href="designer-guide.html">Prefer reading all steps on a single page? Open the full one-page Designer Guide.</a></p>
"""

(HERE / "get-started.html").write_text(
    page_template(
        "Start Here",
        "Step-by-step onboarding guide for Sports Endeavors designers.",
        GET_STARTED_BODY,
    ),
    encoding="utf-8",
)


# 3. 01 - HOW IT WORKS (how-it-works.html) with verbatim Osmo Step-by-step Timeline
OSMO_TIMELINE_HEAD = """<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/ScrollTrigger.min.js"></script>
<style>
.step-timeline {
  width: 100%;
  max-width: 50em;
  margin-left: auto;
  margin-right: auto;
}

.step-timeline__header {
  grid-column-gap: 1em;
  grid-row-gap: 1em;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 6em;
  display: flex;
}

.step-timeline__h2 {
  letter-spacing: -.05em;
  margin-top: 0;
  margin-bottom: 0;
  /* ⚠️DEVIATION #1: Use Volley serif font token instead of Haffer XH */
  font-family: var(--nm-serif);
  font-size: 4em;
  font-weight: 400;
  line-height: 1;
}

.step-timeline__p {
  margin-bottom: 0;
  font-size: 1.125em;
  line-height: 1.4;
}

.step-timeline__eyebrow {
  /* ⚠️DEVIATION #2: Use Volley forest green eyebrow and sans font token */
  color: #4C753B;
  text-transform: uppercase;
  font-family: var(--nm-sans);
  font-size: 0.75em;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.step-timeline__wrapper {
  position: relative;
}

.step-timeline__list {
  grid-column-gap: 8em;
  grid-row-gap: 8em;
  flex-flow: column;
  justify-content: flex-start;
  align-items: stretch;
  display: flex;
}

.step-timeline__item {
  grid-column-gap: 3em;
  grid-row-gap: 3em;
  justify-content: flex-start;
  align-items: flex-start;
  display: flex;
  position: relative;
}

.step-timeline__line {
  pointer-events: none;
  background-color: #22201c24;
  width: 2px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 1.5em;
}

.step-timeline__fill {
  transform-origin: 50% 0;
  /* ⚠️DEVIATION #3: Use Volley green progress fill */
  background-color: #4C753B;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0%;
}

.step-timeline__marker {
  /* ⚠️DEVIATION #4: Use Volley soft lime green for upcoming step circles (never blue) */
  color: #1E3316;
  background-color: #D9EFC0;
  border: 1px solid #B7DBA0;
  border-radius: 100em;
  flex: none;
  justify-content: center;
  align-items: center;
  width: 3em;
  height: 3em;
  transition: all .4s cubic-bezier(.645, .045, .355, 1);
  display: flex;
  position: relative;
}

/* Marker inside 'active' step item */
[data-step-timeline-item][data-status="active"] [data-step-timeline-marker] {
  /* ⚠️DEVIATION #5: Use Volley dark forest green on active step circles */
  background: #2F4A25;
  color: #FFFFFF;
  border-color: #2F4A25;
}

/* Marker inside 'current' step item */
[data-step-timeline-item][data-current] [data-step-timeline-marker] {
  box-shadow: 0 0 0 0.5em rgba(76, 117, 59, 0.20);
}

.step-timeline__content {
  grid-column-gap: 1em;
  grid-row-gap: 1em;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 28em;
  padding-top: .4em;
  transition: opacity .25s;
  display: flex;
}

/* Inactive state of the content wrapper */
[data-step-timeline-item] .step-timeline__content {
  opacity: 0.25;
}

/* Make content full opacity in current step */
[data-step-timeline-item][data-status="active"] .step-timeline__content {
  opacity: 0.5;
}

/* Make content full opacity in current step */
[data-step-timeline-item][data-current] .step-timeline__content {
  opacity: 1;
}

.step-timeline__content-h {
  letter-spacing: -.04em;
  margin-top: 0;
  margin-bottom: 0;
  /* ⚠️DEVIATION #6: Use Volley serif font token */
  font-family: var(--nm-serif);
  font-size: 2em;
  font-weight: 400;
  line-height: 1;
}

@media screen and (max-width: 767px) {
  .step-timeline {
    max-width: none;
  }

  .step-timeline__list {
    grid-column-gap: 6em;
    grid-row-gap: 6em;
  }

  .step-timeline__item {
    grid-column-gap: 1.5em;
    grid-row-gap: 1.5em;
  }
}

/* ⚠️DEVIATION #7: Hover and focus link state on each timeline step so hovering reveals the direct link to that step page */
.step-timeline__link {
  color: inherit;
  text-decoration: none;
  padding: 16px 20px;
  margin: -12px -20px;
  border-radius: var(--nm-radius-md);
  transition: opacity .25s ease, background-color .2s ease, transform .2s ease;
}
.step-timeline__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  color: #4C753B;
  font: 600 13px/18px var(--nm-sans);
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity .2s ease, transform .2s ease;
}
[data-step-timeline-item]:hover .step-timeline__content,
[data-step-timeline-item]:focus-within .step-timeline__content {
  opacity: 1;
  background-color: rgba(76, 117, 59, 0.08);
}
[data-step-timeline-item]:hover .step-timeline__cta,
[data-step-timeline-item]:focus-within .step-timeline__cta {
  opacity: 1;
  transform: translateX(0);
}
[data-step-timeline-item]:hover [data-step-timeline-marker],
[data-step-timeline-item]:focus-within [data-step-timeline-marker] {
  background: #2F4A25;
  color: #FFFFFF;
  border-color: #2F4A25;
  box-shadow: 0 0 0 0.4em rgba(76, 117, 59, 0.18);
}
</style>
"""

TIMELINE_12_STEPS = [
    ("1", "How It Works", "Start with the 12-card overview so you can follow our website build process one step at a time.", "get-started.html"),
    ("2", "Starter Kit", "Download the AI starter kit, copy the Step Zero prompt, and review the pilot examples before your first build.", "starter-pack-wss.html"),
    ("3", "Tools & Links", "Bookmark the 12 daily tools you need for every task, including Volley, Photo Sizer, The Tunnel, Fastr, and Code Share.", "step-tools.html"),
    ("4", "Site Updates List", "Open your assigned task in ClickUp Site Change Requests so you have the approved copy, launch date, and product picks.", "step-clickup.html"),
    ("5", "Figma Library", "Enable the Cabana 8 library in your Figma Assets panel, pull a pre-coded block into your frame, and add your Figma annotations.", "step-figma.html"),
    ("6", "Working With Images", "Size your JPG photos in Photo Sizer under 300 KB for desktop heroes and 200 KB for cards, then upload them to Box.", "step-images.html"),
    ("7", "Working With Links", "Take every destination URL from the Link Book and product picks from The Tunnel, then give your AI the Step Zero prompt.", "step-links.html"),
    ("8", "Fastr CMS", "Check your final HTML file in Safari, copy it from Visual Studio Code into Fastr with the three heights, and copy the Reserves space embed.", "step-fastr.html"),
    ("9", "Testing", "Check your test page in a second browser and across five screen widths in Responsively, then run PageSpeed and record a Jam.", "step-testing.html"),
    ("10", "Video Guides", "Watch the 24-minute workshop walkthrough or jump straight to any of the six short step-by-step video clips.", "videos.html"),
    ("11", "Your First Build", "Follow the click-by-click practice walkthrough on your own store test page from start to finish.", "first-build.html"),
    ("12", "Hand In & Code Share", "Paste your final HTML into Code Share to create one link for ClickUp, attach your seven handoff items, and move the task to UX review.", "step-handin.html"),
]

TIMELINE_ITEMS_HTML = "\n".join(
    f"""        <div data-step-timeline-item class="step-timeline__item">
          <a href="{href}" data-step-timeline-marker class="step-timeline__marker" style="text-decoration:none" aria-label="Step {num}: {title}"><span>{num}</span></a>
          <a href="{href}" class="step-timeline__content step-timeline__link">
            <h2 class="step-timeline__content-h">{title}</h2>
            <p class="step-timeline__p">{text}</p>
            <span class="step-timeline__cta">Open step {num.zfill(2)} &rarr;</span>
          </a>
        </div>"""
    for num, title, text, href in TIMELINE_12_STEPS
)

OSMO_TIMELINE_BODY = f"""<div data-step-timeline-init data-step-timeline-activation="0.5" class="step-timeline">
  <div class="step-timeline__header">
    <span class="step-timeline__eyebrow">our process</span>
    <h1 class="step-timeline__h2">How It Works</h1>
  </div>
  <div class="step-timeline__wrapper">
    <div data-step-timeline-line class="step-timeline__line">
      <div data-step-timeline-fill class="step-timeline__fill"></div>
    </div>
    <div class="step-timeline__collection">
      <div class="step-timeline__list">
{TIMELINE_ITEMS_HTML}
      </div>
    </div>
  </div>
</div>
<div style="max-width:50em;margin:64px auto 0;display:flex;flex-wrap:wrap;gap:12px">
  <a class="nm-btn" href="starter-pack-wss.html"><span>Next: 02 · Starter Kit</span></a>
  <a class="nm-btn nm-btn--outline" href="get-started.html"><span>All 12 step cards</span></a>
</div>
"""

OSMO_TIMELINE_SCRIPT = """<script>
gsap.registerPlugin(ScrollTrigger);

function initStepByStepTimeline() {
  const root = document.querySelector("[data-step-timeline-init]");
  if (!root) return;

  const line = root.querySelector("[data-step-timeline-line]");
  const fill = root.querySelector("[data-step-timeline-fill]");
  const items = Array.from(root.querySelectorAll("[data-step-timeline-item]"));
  if (!line || !fill || !items.length) return;

  const anchors = items.map(
    (item) => item.querySelector("[data-step-timeline-marker]") || item
  );

  const activationInput = parseFloat(root.dataset.stepTimelineActivation);
  const activation = Number.isNaN(activationInput)
    ? 0.5
    : Math.min(Math.max(activationInput, 0), 1);
  const activationPercent = activation * 100;
  const lastIndex = items.length - 1;

  let anchorFractions = [0];

  function measureLine() {
    if (items.length < 2) {
      line.style.height = "0px";
      anchorFractions = [0];
      return;
    }
    const base = line.parentElement.getBoundingClientRect().top;
    const centers = anchors.map((anchor) => {
      const box = anchor.getBoundingClientRect();
      return box.top + box.height / 2 - base;
    });
    const firstCenter = centers[0];
    const span = centers[lastIndex] - firstCenter;
    line.style.top = firstCenter + "px";
    line.style.height = span + "px";
    anchorFractions = centers.map((center) =>
      span > 0 ? (center - firstCenter) / span : 0
    );
  }

  let currentIndex = -2;

  function setCurrentIndex(index) {
    if (index === currentIndex) return;
    currentIndex = index;
    items.forEach((item, i) => {
      const status = index >= 0 && i <= index ? "active" : "inactive";
      if (item.getAttribute("data-status") !== status) {
        item.setAttribute("data-status", status);
      }
      item.toggleAttribute("data-current", i === index);
      item.toggleAttribute("data-previous", i === index - 1);
      item.toggleAttribute("data-next", i === index + 1);
    });
  }

  function indexForProgress(reached, progress) {
    if (!reached) return -1;
    let index = 0;
    for (let i = 0; i < anchorFractions.length; i++) {
      if (progress + 0.0001 >= anchorFractions[i]) index = i;
    }
    return index;
  }

  function updateFromScroll(self) {
    const reached = self.isActive || self.progress >= 1;
    setCurrentIndex(indexForProgress(reached, self.progress));
  }

  setCurrentIndex(-1);
  gsap.set(fill, { transformOrigin: "top", scaleY: 0 });

  if (root._stepTimelineMedia) root._stepTimelineMedia.revert();
  const mediaQueries = gsap.matchMedia();
  root._stepTimelineMedia = mediaQueries;

  mediaQueries.add("(prefers-reduced-motion: no-preference)", () => {
    measureLine();
    ScrollTrigger.addEventListener("refreshInit", measureLine);

    if (items.length > 1) {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: line,
            start: "top " + activationPercent + "%",
            end: "bottom " + activationPercent + "%",
            scrub: true,
            onUpdate: updateFromScroll,
            onToggle: updateFromScroll,
            onRefresh: updateFromScroll,
          },
        }
      );
    } else {
      setCurrentIndex(0);
    }

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("load", refresh);
      ScrollTrigger.removeEventListener("refreshInit", measureLine);
    };
  });

  mediaQueries.add("(prefers-reduced-motion: reduce)", () => {
    measureLine();
    gsap.set(fill, { scaleY: 1 });
    setCurrentIndex(lastIndex);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initStepByStepTimeline();
});
</script>
"""

(HERE / "how-it-works.html").write_text(
    page_template(
        "01 - How It Works",
        "Six simple steps from a ClickUp brief to a verified Fastr handoff.",
        OSMO_TIMELINE_BODY,
        extra_head=OSMO_TIMELINE_HEAD,
        extra_scripts=OSMO_TIMELINE_SCRIPT,
    ),
    encoding="utf-8",
)


# 4. EXTRACT SHORT SINGLE-TOPIC STEP PAGES FROM designer-guide.html
GUIDE_TEXT = (HERE / "designer-guide.html").read_text(encoding="utf-8")


def extract_section(sec_id, strip_head=True):
    m = re.search(
        rf'(<section class="nm-section" id="{re.escape(sec_id)}">.*?</section>)',
        GUIDE_TEXT,
        re.S,
    )
    if not m:
        raise SystemExit(f"Missing section #{sec_id} in designer-guide.html")
    sec = m.group(1)
    if strip_head:
        sec = re.sub(r'<div class="nm-section__head">.*?</div>\s*', "", sec, count=1, flags=re.S)
    return sec


FIGMA_SECTION_HTML = """<section class="nm-section" id="figma-library">
<div class="nm-cards nm-cards--3">
  <article class="nm-card nm-card--open"><div><span class="nm-eyebrow">1. Enable Library</span><h3 class="nm-card__title">Use the Assets panel</h3></div><p class="nm-card__text">In your own working Figma file, open the <strong>Assets</strong> tab (or press <span class="nm-code">Shift + I</span>), click the Library book icon, and turn on <strong>Cabana 8</strong>. Never open or edit the master Cabana 8 file directly.</p></article>
  <article class="nm-card nm-card--open"><div><span class="nm-eyebrow">2. Pull a Block</span><h3 class="nm-card__title">Code Blocks Builders</h3></div><p class="nm-card__text">Drag the matching pre-coded block from Cabana 8 into your frame, set the <strong>Brand</strong> property on the outer block and inner pieces, and keep Auto Layout intact.</p></article>
  <article class="nm-card nm-card--open"><div><span class="nm-eyebrow">3. Annotate</span><h3 class="nm-card__title">Figma Annotations</h3></div><p class="nm-card__text">Attach a short Figma Annotation to your frame noting the destination URLs from the Link Book, the Box photo filenames, and any MotionFX preset.</p></article>
</div>
<h3 class="nm-h3">How slots work in Figma</h3>
<div class="nm-prose">
<p>A slot is an empty pocket inside a component. The outer frame stays the same while you drop different content into the pocket.</p>
<p>In the hero component, the Words slot can hold campaign lettering, an everyday headline with copy and a button, or stay empty for a photo-only hero. Set Brand on each piece separately: the hero, the text inside it, and the button inside that. Use a slot when changing the structure inside a container; use a regular text field or toggle when only changing words or hiding one element.</p>
</div>
</section>"""


STEP_SPECS = [
    (
        "step-tools.html",
        "03 - Tools & Links",
        "Your 12 daily tools, bookmarks, and Box folder paths.",
        ["before"],
        ("starter-pack-wss.html", "02 · Starter Kit"),
        ("step-clickup.html", "04 · Site Updates List"),
    ),
    (
        "step-clickup.html",
        "04 - Site Updates List",
        "Why every request starts in ClickUp Site Change Requests and how the 12 statuses work.",
        ["step-1"],
        ("step-tools.html", "03 · Tools & Links"),
        ("step-figma.html", "05 · Figma Library"),
    ),
    (
        "step-figma.html",
        "05 - Figma Library",
        "Pulling Cabana 8 code blocks, using Auto Layout, and writing Figma annotations.",
        ["step-2"],
        ("step-clickup.html", "04 · Site Updates List"),
        ("step-images.html", "06 · Working With Images"),
    ),
    (
        "step-images.html",
        "06 - Working With Images",
        "Sizing JPG photos in Photo Sizer under 300 KB and 200 KB and uploading to Box.",
        ["step-2"],
        ("step-figma.html", "05 · Figma Library"),
        ("step-links.html", "07 · Working With Links"),
    ),
    (
        "step-links.html",
        "07 - Working With Links",
        "Using the Link Book (SITE-LINKS), Tunnel product picks, and the Step Zero prompt.",
        ["step-3", "prompt"],
        ("step-images.html", "06 · Working With Images"),
        ("step-fastr.html", "08 · Fastr CMS"),
    ),
    (
        "step-fastr.html",
        "08 - Fastr CMS",
        "Checking in Safari, copying from VS Code into Fastr with the 3 heights, and using Reserves space.",
        ["step-4"],
        ("step-links.html", "07 · Working With Links"),
        ("step-testing.html", "09 · Testing"),
    ),
    (
        "step-testing.html",
        "09 - Testing",
        "Testing across 5 widths in Responsively, checking a second browser, PageSpeed, and Jam.",
        ["step-5"],
        ("step-fastr.html", "08 · Fastr CMS"),
        ("videos.html", "10 · Video Guides"),
    ),
    (
        "step-handin.html",
        "12 - Hand In & Code Share",
        "Turning your final HTML into one Code Share link and attaching your 7 ClickUp handoff items.",
        ["step-6"],
        ("first-build.html", "11 · Your First Build"),
        ("blocks.html", "Browse Components"),
    ),
]

for filename, title, desc, sec_ids, prev_link, next_link in STEP_SPECS:
    if filename == "step-figma.html":
        sections_html = FIGMA_SECTION_HTML
    elif filename == "step-images.html":
        sec = extract_section("step-2", strip_head=True)
        sec = re.sub(r'<h3 class="nm-h3">How slots work in Figma</h3>.*?</div>\s*', "", sec, flags=re.S)
        sections_html = sec
    else:
        sections_html = "\n".join(extract_section(sid, strip_head=(i == 0)) for i, sid in enumerate(sec_ids))
    prev_href, prev_label = prev_link
    next_href, next_label = next_link
    body = f"""<div class="nm-title">
  <span class="nm-eyebrow" style="color:var(--nm-accent)">GETTING STARTED</span>
  <h1>{title}</h1>
  <p class="nm-lede">{desc}</p>
  <hr class="nm-divider">
</div>
{sections_html}
<div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;margin-top:48px">
  <a class="nm-btn nm-btn--outline" href="{prev_href}"><span>Previous: {prev_label}</span></a>
  <a class="nm-btn" href="{next_href}"><span>Next: {next_label}</span></a>
</div>
"""
    (HERE / filename).write_text(
        page_template(title, desc, body),
        encoding="utf-8",
    )

# 5. PHOTO SIZER IN VOLLEY SHELL (nutmeg/photo-sizer.html + photo-sizer/index.html)
OLD_SIZER = (HERE.parent / "photo-sizer" / "index.html").read_text(encoding="utf-8")
SIZER_JS_MATCH = re.search(r"(<script>\s*\(function \(\) \{.*?</script>)", OLD_SIZER, re.S)
SIZER_JS = SIZER_JS_MATCH.group(1)
# Remove the old skyvideo vimeo iframe loader and replace the em dash in the JS
SIZER_JS = re.sub(
    r"if \(!\(window\.matchMedia && window\.matchMedia\('\(prefers-reduced-motion: reduce\)'\)\.matches\)\) \{.*?\}\s*\}\)\(\);",
    "})();",
    SIZER_JS,
    flags=re.S,
)
SIZER_JS = SIZER_JS.replace("Over limit — use a simpler crop", "Over limit: use a simpler crop")

PHOTO_SIZER_STYLE = """<style>
.ps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 24px; }
.ps-card { background: var(--nm-white); border: 1px solid #DADADA; border-radius: var(--nm-radius-lg); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; gap: 18px; }
.ps-card__top { display: flex; flex-direction: column; gap: 14px; }
.ps-card__head { display: flex; align-items: center; gap: 10px; }
.ps-badge { width: 32px; height: 32px; border-radius: 50%; background: #2F4A25; color: #FFFFFF; font: 600 14px/1 var(--nm-sans); display: inline-flex; align-items: center; justify-content: center; flex: none; }
.ps-pill { display: inline-flex; align-items: center; padding: 5px 12px; border-radius: var(--nm-radius-pill); background: rgba(195, 232, 141, 0.35); color: #203417; font: 600 11px/1 var(--nm-sans); text-transform: uppercase; letter-spacing: 0.06em; }
.ps-card h2 { margin: 0; font: 400 28px/32px var(--nm-serif); color: var(--nm-title); }
.ps-card p { margin: 0; font: 400 15px/22px var(--nm-sans); color: var(--nm-text); }
.field-label { display: block; font: 500 14px/20px var(--nm-sans); color: var(--nm-title); margin-bottom: 6px; }
.select { width: 100%; appearance: none; background-color: #FFFFFF; background-image: linear-gradient(45deg, transparent 50%, #2F4A25 50%), linear-gradient(135deg, #2F4A25 50%, transparent 50%); background-position: calc(100% - 18px) 50%, calc(100% - 12px) 50%; background-size: 6px 6px, 6px 6px; background-repeat: no-repeat; border: 1px solid #C5C3BC; border-radius: var(--nm-radius-sm); padding: 11px 38px 11px 12px; font: 400 15px/20px var(--nm-sans); color: var(--nm-ink); }
.custom-dims { display: none; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 10px; }
.custom-dims.is-open { display: grid; }
.input { width: 100%; border: 1px solid #C5C3BC; border-radius: var(--nm-radius-sm); padding: 9px 10px; font: 400 14px/18px var(--nm-sans); }
.mini-label { display: block; font: 400 12px/16px var(--nm-sans); color: var(--nm-muted); margin-bottom: 4px; }
.spec-box { background: #F4F7F2; border: 1px solid #D5E0CE; border-radius: var(--nm-radius-sm); padding: 14px 16px; }
.spec-table { width: 100%; border-collapse: collapse; font: 400 13.5px/18px var(--nm-sans); margin-top: 8px; }
.spec-table th, .spec-table td { text-align: left; padding: 6px 8px 6px 0; border-top: 1px solid #D5E0CE; }
.spec-table th { font-weight: 600; color: #203417; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; border-top: 0; }
.dropzone { border: 2px dashed #8AA87B; border-radius: var(--nm-radius-md); background: #F4F7F2; padding: 28px 20px; text-align: center; cursor: pointer; transition: border-color .15s ease, background .15s ease; }
.dropzone:hover, .dropzone.is-over { border-color: #2F4A25; background: #E9F0E5; }
.dropzone__title { font: 500 16px/22px var(--nm-sans); color: #203417; margin: 0 0 4px; }
.dropzone__sub { font: 400 14px/20px var(--nm-sans); color: var(--nm-muted); margin: 0 0 14px; }
.dropzone__input { display: none; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 38px; padding: 0 18px; border-radius: var(--nm-radius-pill); border: 1px solid #4C753B; background: #FFFFFF; color: #2F4A25; font: 500 14px/20px var(--nm-sans); text-decoration: none; cursor: pointer; transition: background .15s ease, color .15s ease; }
.btn:hover:not(:disabled) { background: #F4F7F2; }
.btn.solid { background: #4C753B; border-color: #4C753B; color: #FFFFFF; }
.btn.solid:hover:not(:disabled) { background: #2F4A25; border-color: #2F4A25; }
.btn:disabled { opacity: 0.45; cursor: not-allowed; }
.results-card { background: var(--nm-white); border: 1px solid #DADADA; border-radius: var(--nm-radius-lg); padding: 24px; }
.toolbar { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid #EBEBEB; }
.toolbar__group { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.seg { display: inline-flex; flex-wrap: wrap; gap: 6px; }
.seg button { border: 1px solid #C5C3BC; border-radius: var(--nm-radius-pill); background: #F5F5F5; padding: 7px 14px; font: 500 13px/18px var(--nm-sans); color: var(--nm-title); cursor: pointer; }
.seg button[aria-pressed="true"] { background: #4C753B; border-color: #4C753B; color: #FFFFFF; }
.results-empty { color: var(--nm-muted); font: 400 15px/22px var(--nm-sans); margin: 0; }
.photo-block { border: 1px solid #DADADA; border-radius: var(--nm-radius-md); margin-bottom: 16px; overflow: hidden; background: #FFFFFF; }
.photo-block__head { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: baseline; justify-content: space-between; padding: 12px 18px; background: #F4F7F2; border-bottom: 1px solid #D5E0CE; }
.photo-block__name { font: 600 14px/20px var(--nm-sans); color: #203417; }
.photo-block__orig { font: 400 13px/18px var(--nm-sans); color: var(--nm-muted); }
.outputs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 16px; padding: 18px; }
.out-card { border: 1px solid #EBEBEB; border-radius: var(--nm-radius-sm); padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.out-card__top { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.out-card__label { font: 600 15px/20px var(--nm-sans); color: var(--nm-title); }
.out-card__dims { font: 400 13px/18px var(--nm-mono); color: var(--nm-muted); }
.stage { position: relative; width: 100%; background: #ECECE8; border: 1px solid #DADADA; border-radius: var(--nm-radius-sm); overflow: hidden; user-select: none; touch-action: none; }
.stage--draggable { cursor: grab; }
.stage--draggable:active { cursor: grabbing; }
.stage canvas { display: block; width: 100%; height: auto; }
.stage__hint { position: absolute; bottom: 6px; right: 8px; background: rgba(32, 52, 23, 0.88); color: #FFFFFF; font: 600 11px/16px var(--nm-sans); padding: 3px 10px; border-radius: var(--nm-radius-pill); pointer-events: none; }
.meter { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px; font: 400 13px/18px var(--nm-sans); padding: 8px 10px; border-radius: var(--nm-radius-xs); }
.meter--ok { background: #ECF6EF; color: #1B6E38; }
.meter--warn { background: #FDF4E7; color: #8F4F06; }
.meter--err { background: #FBEAE9; color: #B8292B; }
.meter__weight { font: 600 13px/18px var(--nm-mono); }
.meter__msg { font-size: 12px; }
.out-card__filename { font: 400 12px/16px var(--nm-mono); color: var(--nm-muted); word-break: break-all; }
.out-card__actions { display: flex; gap: 8px; margin-top: auto; }
</style>
"""

PHOTO_SIZER_BODY = """<div class="nm-title">
  <span class="nm-eyebrow" style="color:var(--nm-accent)">RESOURCES &amp; TOOLS</span>
  <h1>Photo Sizer</h1>
  <p class="nm-lede">Pick your block, drop your photo in, and download the sized JPG ready for the S3 bucket (under 300 KB for desktop heroes, under 200 KB for everything else).</p>
  <hr class="nm-divider">
</div>

<div class="ps-grid">
  <article class="ps-card">
    <div class="ps-card__top">
      <div class="ps-card__head">
        <span class="ps-badge">1</span>
        <span class="ps-pill">Block Preset</span>
      </div>
      <h2>Pick the block</h2>
      <div>
        <label class="field-label" for="preset">Component and photo slot</label>
        <select class="select" id="preset"></select>
        <div class="custom-dims" id="customDims">
          <div>
            <label class="mini-label" for="cw">Width (px)</label>
            <input class="input" id="cw" type="number" min="50" max="4000" value="1200">
          </div>
          <div>
            <label class="mini-label" for="ch">Height (px)</label>
            <input class="input" id="ch" type="number" min="50" max="4000" value="800">
          </div>
          <div>
            <label class="mini-label" for="ckb">Max KB</label>
            <input class="input" id="ckb" type="number" min="20" max="1000" value="200">
          </div>
        </div>
      </div>
      <div class="spec-box" id="specCard" aria-live="polite"></div>
    </div>
  </article>

  <article class="ps-card">
    <div class="ps-card__top">
      <div class="ps-card__head">
        <span class="ps-badge">2</span>
        <span class="ps-pill">JPG Export</span>
      </div>
      <h2>Drop your photo</h2>
      <p>Accepts JPG, PNG, or WebP and exports clean JPG files under the 300 KB hero or 200 KB card limit.</p>
      <label class="dropzone" id="dropzone" for="fileInput">
        <p class="dropzone__title">Drop photos here or click to choose</p>
        <p class="dropzone__sub">Exports both Desktop and Phone crops automatically.</p>
        <span class="btn solid">Choose Photos</span>
        <input class="dropzone__input" id="fileInput" type="file" accept="image/jpeg,image/png,image/webp" multiple>
      </label>
    </div>
  </article>
</div>

<div class="results-card">
  <div class="toolbar">
    <div class="toolbar__group">
      <span class="field-label" style="margin:0">Crop mode:</span>
      <div class="seg" role="group" aria-label="Crop mode">
        <button type="button" data-fit="cover" aria-pressed="true">Fill &amp; Crop (Drag to re-center)</button>
        <button type="button" data-fit="contain" aria-pressed="false">Fit with Bars</button>
      </div>
    </div>
    <div class="toolbar__group">
      <button type="button" class="btn solid" id="downloadAllBtn" disabled>Download All JPGs</button>
      <button type="button" class="btn" id="clearBtn" disabled>Clear</button>
    </div>
  </div>
  <div id="results">
    <p class="results-empty">No photos loaded yet. Pick a block in Step 1 and drop a photo in Step 2.</p>
  </div>
</div>
"""

(HERE / "photo-sizer.html").write_text(
    page_template(
        "Photo Sizer",
        "Pick the block, drop your photo in, and download the sized JPG ready for the S3 bucket.",
        PHOTO_SIZER_BODY,
        extra_head=PHOTO_SIZER_STYLE,
        extra_scripts=SIZER_JS,
    ),
    encoding="utf-8",
)

print("Built index.html, get-started.html, how-it-works.html, photo-sizer.html, and 8 step-*.html pages.")
