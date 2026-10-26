#!/usr/bin/env python3
"""Writes the Nutmeg header, icon rail and section drawer into every page.

Edit the lists below, then run:  python3 nm-shell.py
Each page keeps its own content. Only the block from the skip link to the
end of the navigation is replaced, and the body tag gets its hub theme.
"""
import html
import pathlib
import re

HERE = pathlib.Path(__file__).resolve().parent

ICONS = {
    "home": '<path d="M6 22H18L17 19H7L6 22Z"/><path d="M11 15L10 19"/><path d="M13 15L14 19"/><path d="M6 2V9C6 10.5913 6.63214 12.1174 7.75736 13.2426C8.88258 14.3679 10.4087 15 12 15C13.5913 15 15.1174 14.3679 16.2426 13.2426C17.3679 12.1174 18 10.5913 18 9V2H6Z"/><path d="M17.93 9.93C18.1159 9.97908 18.3077 10.0026 18.5 10C19.163 10 19.7989 9.73661 20.2678 9.26777C20.7366 8.79893 21 8.16304 21 7.5C21 6.83696 20.7366 6.20107 20.2678 5.73223C19.7989 5.26339 19.163 5 18.5 5C18.3337 4.98471 18.1663 4.98471 18 5"/><path d="M6 5.05C5.83368 5.03471 5.66632 5.03471 5.5 5.05C4.83696 5.05 4.20107 5.31339 3.73223 5.78223C3.26339 6.25107 3 6.88696 3 7.55C3 8.21304 3.26339 8.84893 3.73223 9.31777C4.20107 9.78661 4.83696 10.05 5.5 10.05C5.6923 10.0526 5.88405 10.0291 6.07 9.98"/>',
    "drop": '<path d="M17 9C19.5 12.2 19.5 16.5 17 19C15.6152 20.2097 13.8388 20.8764 12 20.8764C10.1612 20.8764 8.3848 20.2097 7 19C4.5 16.5 4.5 12.2 7 9L12 2.5L17 9Z"/>',
    "flag": '<path d="M5 20V15M5 15C5.65678 14.3485 6.43787 13.8357 7.29683 13.4921C8.15579 13.1485 9.07507 12.9812 10 13C13 13 14 15 16 15C17.0807 14.993 18.1312 14.6428 19 14V5C18.1312 5.64277 17.0807 5.99294 16 6C14 6 13 4 10 4C9.07507 3.98115 8.15579 4.14849 7.29683 4.49208C6.43787 4.83566 5.65678 5.34847 5 6V15Z" stroke-miterlimit="10"/>',
    "diamond": '<path d="M23 11L12 22L1 11L6 3H18L23 11Z"/><path d="M1 11H23"/><path d="M10 3L8 11"/><path d="M14 3L16 11"/><path d="M12 22L16 11"/><path d="M8 11L12 22"/>',
    "swatch": '<path d="M7 20H20V13H15.34"/><path d="M10 18.7L19.5 8.56L15 4L11 7.5"/><path d="M3 3H11V16C11 17.0609 10.5786 18.0783 9.82843 18.8284C9.07828 19.5786 8.06087 20 7 20C5.93913 20 4.92172 19.5786 4.17157 18.8284C3.42143 18.0783 3 17.0609 3 16V3Z"/><path d="M7.5 16C7.5 15.7239 7.27614 15.5 7 15.5C6.72386 15.5 6.5 15.7239 6.5 16C6.5 16.2761 6.72386 16.5 7 16.5C7.27614 16.5 7.5 16.2761 7.5 16Z"/>',
    "code": '<path d="M6 7L1 12L6 17" stroke-miterlimit="10"/><path d="M18 17L23 12L18 7" stroke-miterlimit="10"/><path d="M8.5 20L15.5 4" stroke-miterlimit="10"/>',
    "layout": '<path d="M22 4H2V21H22V4Z"/><path d="M8 9V21"/><path d="M2 9H22"/>',
    "book": '<path d="M19 21.5H6.5L5 20V4L6.5 2.5H19V21.5Z" stroke-miterlimit="10"/><path d="M5 19L6.5 17.5H19" stroke-miterlimit="10"/><path d="M15 7.5H9" stroke-miterlimit="10"/>',
    "tray": '<path d="M21.5 10H2.5V20H21.5V10Z"/><path d="M4 10V7H20V10"/><path d="M6 7V4H18V7"/>',
    "command": '<path d="M21.5 5.8C21.4749 4.95926 21.1297 4.15984 20.5349 3.56508C19.9402 2.97032 19.1407 2.62511 18.3 2.6H18.2C17.3757 2.62349 16.5901 2.95472 15.9979 3.52847C15.4056 4.10221 15.0496 4.8769 15 5.7V18.3C15.026 19.1578 15.3851 19.9717 16.0012 20.5691C16.6173 21.1665 17.4418 21.5004 18.3 21.5C19.1407 21.4749 19.9402 21.1297 20.5349 20.5349C21.1297 19.9402 21.4749 19.1407 21.5 18.3C21.5004 17.4418 21.1665 16.6173 20.5691 16.0012C19.9717 15.3851 19.1578 15.026 18.3 15H5.7C4.85926 15.0251 4.05984 15.3703 3.46508 15.9651C2.87032 16.5598 2.52511 17.3593 2.5 18.2C2.52511 19.0407 2.87032 19.8402 3.46508 20.4349C4.05984 21.0297 4.85926 21.3749 5.7 21.4H5.8C6.62426 21.3765 7.40986 21.0453 8.00211 20.4715C8.59437 19.8978 8.95036 19.1231 9 18.3V5.7C8.97489 4.85926 8.62968 4.05984 8.03492 3.46508C7.44016 2.87032 6.64074 2.52511 5.8 2.5H5.7C4.85926 2.52511 4.05984 2.87032 3.46508 3.46508C2.87032 4.05984 2.52511 4.85926 2.5 5.7C2.49961 6.55816 2.83352 7.38272 3.43093 7.9988C4.02833 8.61487 4.84223 8.974 5.7 9H18.3C19.1407 8.97489 19.9402 8.62968 20.5349 8.03492C21.1297 7.44016 21.4749 6.64074 21.5 5.8Z"/>',
    "window": '<path d="M2 9V20H22V7H13.5L11 9H2Z" stroke-miterlimit="10"/><path d="M2 9V4H22V7" stroke-miterlimit="10"/><path d="M4.5 6V7" stroke-miterlimit="10"/><path d="M7 6V7" stroke-miterlimit="10"/><path d="M9.5 6V7" stroke-miterlimit="10"/>',
    "mail": '<path d="M21.5 5H2.5V19H21.5V5Z" stroke-miterlimit="10"/><path d="M2.5 5L12 12L21.5 5" stroke-miterlimit="10"/>',
    "bell": '<path d="M6 8.5V10C5.99597 10.7737 5.71177 11.5197 5.2 12.1L4 13.7C3.35723 14.5688 3.00706 15.6193 3 16.7V17.5H21V16.7C20.9929 15.6193 20.6428 14.5688 20 13.7L18.8 12.1C18.2882 11.5197 18.004 10.7737 18 10V8.5C18 6.9087 17.3679 5.38258 16.2426 4.25736C15.1174 3.13214 13.5913 2.5 12 2.5C10.4087 2.5 8.88258 3.13214 7.75736 4.25736C6.63214 5.38258 6 6.9087 6 8.5Z"/><path d="M15 18C15 18.7956 14.6839 19.5587 14.1213 20.1213C13.5587 20.6839 12.7956 21 12 21C11.2044 21 10.4413 20.6839 9.87868 20.1213C9.31607 19.5587 9 18.7956 9 18" stroke-linejoin="bevel"/>',
}

SE_MARK = ('<svg class="nm-logo__mark" width="39" height="39" viewBox="0 0 39 39" fill="none" aria-hidden="true" focusable="false">'
           '<path d="M5.81943 12.7935C6.21922 12.5185 6.66399 12.3861 7.17872 12.3861H38.5322V7.40527H7.18371C5.42964 7.40527 3.87546 7.94512 2.57114 9.00443C1.1269 10.186 0.362305 11.7546 0.362305 13.532V16.2312C0.362305 18.0137 1.1269 19.5772 2.56614 20.7537C3.87046 21.8334 5.42464 22.3783 7.18371 22.3783H14.1201C14.6498 22.3783 15.1045 22.5158 15.5043 22.7857C15.9041 23.0709 15.9641 23.3052 15.9641 23.5242V26.2438C15.9641 26.4577 15.9091 26.6971 15.5143 26.9772C15.1095 27.2573 14.6548 27.3948 14.1251 27.3948H0.362305V32.3756H14.1201C15.8292 32.3756 17.3584 31.8561 18.6777 30.8274C20.1719 29.6458 20.9615 28.062 20.9615 26.2489V23.5293C20.9615 21.7519 20.1969 20.1833 18.7426 18.9966C17.4283 17.9373 15.8741 17.4026 14.1201 17.4026H7.18371C6.66899 17.4026 6.22922 17.2651 5.83442 16.985C5.36467 16.6437 5.36467 16.3789 5.36467 16.2363V13.5371C5.36467 13.3283 5.41964 13.094 5.82443 12.7986" fill="#EF433F"/>'
           '<path d="M24.4502 22.3773H38.5377V17.3965H22.2363C23.4657 18.8225 24.2253 20.5286 24.4452 22.3773" fill="#5B7DBC"/>'
           '<path d="M22.2363 32.3705H38.5328V27.3896H24.4502C24.2303 29.2435 23.4657 30.9496 22.2363 32.3705Z" fill="#28387A"/></svg>')

CHEV = '<svg class="nm-drawer__chev" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M5 9L12 16L19 9" stroke="currentColor" stroke-width="1.5"/></svg>'
OUT = '<span class="nm-visually-hidden"> (opens in a new tab)</span>'

# Top bar. href None means the hub has no page yet, so it is left out.
HUBS = [
    ("The Tunnel", "https://the-tunnel.netlify.app/", None),
    ("Volley", "index.html", "volley"),
    ("Our Brands", None, None),
    ("Tools", "step-tools.html", None),
    ("Design System", "foundations.html", "nutmeg"),
    ("Guides", "get-started.html", None),
]

HUB_NAMES = {"nutmeg": "Nutmeg", "volley": "Volley"}

# Icon rail per hub: (key, label, icon, href). href None is left out until
# its page exists. "split" draws the extra divider.
RAILS = {
    "nutmeg": [
        ("home", "Home", "home", None),
        ("nutmeg", "Nutmeg", "drop", None),
        ("get-started", "Get Started", "flag", None),
        ("foundations", "Foundations", "diamond", "foundations.html"),
        ("styles", "Styles", "swatch", "v2-tokens.html"),
        ("develop", "Develop", "code", None),
        ("components", "Components", "layout", "components.html"),
        ("resources", "Resources", "book", None),
    ],
    "volley": [
        ("home", "Home", "home", "index.html"),
        ("volley", "Volley", "tray", "index.html"),
        ("how", "How it Works", "command", "how-it-works.html"),
        ("get-started", "Get Started", "flag", "get-started.html"),
        "split",
        ("components", "Components", "layout", "blocks.html"),
        ("pages", "Pages", "window", "pages.html"),
        ("email", "Email", "mail", "email.html"),
        ("changelog", "Changelog", "bell", "changelog.html"),
        ("resources", "Resources", "book", "photo-sizer.html"),
    ],
}

BLOCK_PAGES = [
    ("Product Tile Gallery", "product-tile-gallery.html"),
    ("Sale category tiles", "sale-category-tiles.html"),
    ("Sale hero", "sale-hero.html"),
    ("Sale quick links strip", "sale-quick-links.html"),
    ("Section Breaker", "section-breaker.html"),
    ("Selection Section, cleat deals", "selection-section-cleat-deals.html"),
    ("Selection Section, home page", "selection-section-home-page.html"),
    ("Shop by Club logo rail, Champions League", "shop-by-club-logo-rail-champions-league.html"),
    ("Shop by Club section", "shop-by-club-section.html"),
    ("Shop by Player, Trending Players", "shop-by-player-trending-players.html"),
    ("Showcase Slider", "showcase-slider.html"),
]

CANON_PAGES = [
    ('Marquee, Back to Season', "marquee-back-to-season.html"),
    ('Wall, New Arrivals', "wall-new-arrivals.html"),
    ('Wall, July launches', "wall-july-launches.html"),
    ('Marquee and Wall', "marquee-and-wall.html"),
    ('Launch Carousel, jerseys', "launch-carousel-jerseys.html"),
    ('Launch Carousel, New Arrivals', "launch-carousel-new-arrivals.html"),
    ('Intent Selector, small', "intent-selector-small.html"),
    ('Spotlight Rail, Spezial', "spotlight-rail-spezial.html"),
    ('Quick Links Rail, new products', "quick-links-rail-new.html"),
    ('Kit Rail, home page', "kit-rail-home.html"),
    ('Selection Section, Jersey Shop', "selection-section-jersey-shop.html"),
    ('Selection Section, Fall Sale', "selection-section-fall-sale.html"),
    ('Shop-by Rail, leagues', "shop-by-rail-leagues.html"),
    ('Shop-by Rail, players', "shop-by-rail-players.html"),
    ('Intent Selector Chips, promo eligible', "intent-chips-promo.html"),
    ('Intent Selector Chips, sale', "intent-chips-sale.html"),
    ('Team Logo Marquee, promo eligible', "team-logo-marquee-promo.html"),
    ('Team Logo Marquee, sale', "team-logo-marquee-sale.html"),
    ('Promo Lightbox, clubs', "promo-lightbox-clubs.html"),
    ('Promo Lightbox, nations', "promo-lightbox-nations.html"),
    ('Shop Lightbox, nations', "shop-lightbox-nations.html"),
    ('Matchup Rail', "matchup-rail.html"),
    ('Hero, parallax image layers', "hero-parallax-layers.html"),
    ('Hero, falling objects', "hero-falling-objects.html"),
    ('Spatial Cards Slider', "spatial-cards-slider.html"),
    ('Shop the Look, clubs', "shop-the-look-clubs.html"),
    ('Shop by Nation accordion', "shop-by-nation-accordion.html"),
    ('Shop by Club rail', "shop-by-club-rail.html"),
]

# Components by type, in drawer order (Sacha and Argon, 26 Oct 2026).
TYPES = [
    ("Carousels", [
        ("Showcase Slider", "showcase-slider.html"),
        ("Launch Carousel, jerseys", "launch-carousel-jerseys.html"),
        ("Launch Carousel, New Arrivals", "launch-carousel-new-arrivals.html"),
        ("Spotlight Rail, Spezial", "spotlight-rail-spezial.html"),
        ("Kit Rail, home page", "kit-rail-home.html"),
        ("Quick Links Rail, new products", "quick-links-rail-new.html"),
        ("Sale quick links strip", "sale-quick-links.html"),
        ("Shop by Player, Trending Players", "shop-by-player-trending-players.html"),
        ("Shop-by Rail, players", "shop-by-rail-players.html"),
        ("Shop-by Rail, leagues", "shop-by-rail-leagues.html"),
        ("Shop by Club rail", "shop-by-club-rail.html"),
        ("Shop by Club logo rail, Champions League", "shop-by-club-logo-rail-champions-league.html"),
        ("Matchup Rail", "matchup-rail.html"),
    ]),
    ("Heroes", [
        ("Sale hero", "sale-hero.html"),
        ("Hero, parallax image layers", "hero-parallax-layers.html"),
        ("Hero, falling objects", "hero-falling-objects.html"),
    ]),
    ("Galleries", [
        ("Product Tile Gallery", "product-tile-gallery.html"),
        ("Wall, New Arrivals", "wall-new-arrivals.html"),
        ("Wall, July launches", "wall-july-launches.html"),
        ("Marquee and Wall", "marquee-and-wall.html"),
    ]),
    ("Sections", [
        ("Shop by Nation accordion", "shop-by-nation-accordion.html"),
        ("Selection Section, home page", "selection-section-home-page.html"),
        ("Selection Section, cleat deals", "selection-section-cleat-deals.html"),
        ("Selection Section, Jersey Shop", "selection-section-jersey-shop.html"),
        ("Selection Section, Fall Sale", "selection-section-fall-sale.html"),
        ("Section Breaker", "section-breaker.html"),
        ("Shop the Look, clubs", "shop-the-look-clubs.html"),
        ("Spatial Cards Slider", "spatial-cards-slider.html"),
    ]),
    ("Lightboxes", [
        ("Promo Lightbox, clubs", "promo-lightbox-clubs.html"),
        ("Promo Lightbox, nations", "promo-lightbox-nations.html"),
        ("Shop Lightbox, nations", "shop-lightbox-nations.html"),
    ]),
    ("Products", [
        ("Sale category tiles", "sale-category-tiles.html"),
    ]),
    ("Headers", [
        ("Shop by Club section", "shop-by-club-section.html"),
        ("Intent Selector, small", "intent-selector-small.html"),
        ("Intent Selector Chips, promo eligible", "intent-chips-promo.html"),
        ("Intent Selector Chips, sale", "intent-chips-sale.html"),
    ]),
    ("Promo", [
        ("Marquee, Back to Season", "marquee-back-to-season.html"),
        ("Team Logo Marquee, promo eligible", "team-logo-marquee-promo.html"),
        ("Team Logo Marquee, sale", "team-logo-marquee-sale.html"),
    ]),
]

EMAIL_TYPES = [
    ("Campaign emails", [
        ("Chivas 2027 Third, rotating hero", "email-chivas-third-rotating.html"),
        ("Chivas 2027 Third, still hero", "email-chivas-third-still.html"),
    ]),
    ("Team sales emails", [
        ("Team Holiday Pop-Up Store", "email-team-holiday-pop-up.html"),
    ]),
]

PAGE_TYPES = [
    ("Landing pages", [
        ("WorldSoccerShop Sale page", "page-wss-sale.html"),
    ]),
    ("Project hubs", [
        ("Holiday 2026 Hub", "page-holiday-hub.html"),
        ("Team Sales Holiday Pop-Up package", "page-holiday-pop-up-package.html"),
    ]),
]

# Card details for the Email and Pages grids: brand, status, picture (or None).
EXTRA_CARDS = {
    "email-chivas-third-rotating.html": ("Soccer.com", "In progress", "../chivas-email/assets/chivas-hero-static.jpg", 600, 800),
    "email-chivas-third-still.html": ("Soccer.com", "In progress", "../chivas-email/assets/chivas-hero-static.jpg", 600, 800),
    "email-team-holiday-pop-up.html": ("Soccer.com", "In progress", "../holiday-popup-emails/assets/ncfc-holiday-hero.jpg", 600, 500),
    "page-wss-sale.html": ("WorldSoccerShop", "In progress", None, 0, 0),
    "page-holiday-hub.html": ("All brands", "In progress", None, 0, 0),
    "page-holiday-pop-up-package.html": ("Soccer.com", "In progress", None, 0, 0),
}

COLLECTIONS = {
    "blocks.html": TYPES,
    "email.html": EMAIL_TYPES,
    "pages.html": PAGE_TYPES,
}

# Drawer per (hub, section): title and items. An item is (label, href) or
# (label, [(label, href), ...]) for a group that opens and closes.
DRAWERS = {
    ("volley", "home"): ("Home", [
        ("Start here", "index.html"),
        ("What's new", "index.html#whats-new"),
        ("Tools", "index.html#tools"),
        ("At a glance", "index.html#at-a-glance"),
    ]),
    ("volley", "get-started"): ("Get Started", [
        ("Start Here", "get-started.html"),
        ("01 - How It Works", "how-it-works.html"),
        ("02 - Starter Kit", "starter-pack-wss.html"),
        ("03 - Tools & Links", "step-tools.html"),
        ("04 - Site Updates List", "step-clickup.html"),
        ("05 - Figma Library", "step-figma.html"),
        ("06 - Working With Images", "step-images.html"),
        ("07 - Working With Links", "step-links.html"),
        ("08 - Fastr CMS", "step-fastr.html"),
        ("09 - Testing", "step-testing.html"),
        ("10 - Video Guides", "videos.html"),
        ("11 - Your First Build", "first-build.html"),
        ("12 - Hand In & Code Share", "step-handin.html"),
        ("Full one-page guide", "designer-guide.html"),
    ]),
    ("volley", "components"): ("Components", [("Overview", "blocks.html")] + TYPES),
    ("volley", "email"): ("Email", [("Overview", "email.html")] + EMAIL_TYPES),
    ("volley", "pages"): ("Pages", [("Overview", "pages.html")] + PAGE_TYPES),
    ("volley", "resources"): ("Resources", [
        ("Photo Sizer", "photo-sizer.html"),
        ("All 12 Daily Tools", "step-tools.html"),
        ("The Tunnel", "https://the-tunnel.netlify.app/"),
        ("Code Share", "https://the-tunnel.netlify.app/code-share/"),
    ]),
    ("nutmeg", "foundations"): ("Foundations", [
        ("Overview", "foundations.html"),
        ("Colour", "foundations.html#colour"),
        ("Type", "foundations.html#type"),
        ("Space and corners", "foundations.html#space"),
        ("Contrast", "foundations.html#contrast"),
    ]),
    ("nutmeg", "styles"): ("Styles", [
        ("V2 tokens", [
            ("Overview", "v2-tokens.html"),
            ("Soccer.com", "v2-tokens.html#soccer"),
            ("WorldSoccerShop", "v2-tokens.html#wss"),
            ("431 Sports", "v2-tokens.html#431"),
        ]),
        ("Icons", "icons.html"),
    ]),
    ("nutmeg", "components"): ("Components", [
        ("Overview", "components.html"),
        ("Buttons", "components.html#buttons"),
        ("Chips", "components.html#chips"),
        ("Tabs", "components.html#tabs"),
        ("Cards", "components.html#cards"),
        ("List", "components.html#list"),
        ("Table", "components.html#table"),
        ("Steps", "components.html#steps"),
        ("Video cards", "components.html#video-cards"),
        ("Callout", "components.html#callout"),
        ("Code block", "components.html#code"),
    ]),
}

# Every page: (hub, rail section).
PAGES = {
    "index.html": ("volley", "volley"),
    "changelog.html": ("volley", "changelog"),
    "photo-sizer.html": ("volley", "resources"),
    "get-started.html": ("volley", "get-started"),
    "how-it-works.html": ("volley", "get-started"),
    "step-tools.html": ("volley", "get-started"),
    "step-clickup.html": ("volley", "get-started"),
    "step-figma.html": ("volley", "get-started"),
    "step-images.html": ("volley", "get-started"),
    "step-links.html": ("volley", "get-started"),
    "step-fastr.html": ("volley", "get-started"),
    "step-testing.html": ("volley", "get-started"),
    "step-handin.html": ("volley", "get-started"),
    "designer-guide.html": ("volley", "get-started"),
    "first-build.html": ("volley", "get-started"),
    "starter-pack-wss.html": ("volley", "get-started"),
    "videos.html": ("volley", "get-started"),
    "blocks.html": ("volley", "components"),
    "foundations.html": ("nutmeg", "foundations"),
    "v2-tokens.html": ("nutmeg", "styles"),
    "icons.html": ("nutmeg", "styles"),
    "components.html": ("nutmeg", "components"),
}
PAGES["email.html"] = ("volley", "email")
PAGES["pages.html"] = ("volley", "pages")
for _section, _groups in (("components", TYPES), ("email", EMAIL_TYPES), ("pages", PAGE_TYPES)):
    for _type, _items in _groups:
        for _label, _href in _items:
            PAGES[_href] = ("volley", _section)
BLOCK_HREFS = {h for _g in (TYPES, EMAIL_TYPES, PAGE_TYPES) for _t, _items in _g for _l, h in _items}
assert {h for _l, h in BLOCK_PAGES + CANON_PAGES} == {h for _t, _items in TYPES for _l, h in _items}


def esc(s):
    return html.escape(s, quote=True)


def icon(name):
    return ('<svg class="nm-rail__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            'aria-hidden="true" focusable="false">' + ICONS[name] + '</svg>')


def ext(href):
    return href.startswith("http")


def link_attrs(href, current):
    a = ' href="%s"' % esc(href)
    if ext(href):
        a += ' target="_blank" rel="noopener"'
    if current:
        a += ' aria-current="page"'
    return a


def header(hub):
    items = []
    for label, href, key in HUBS:
        dot = '<span class="nm-hubs__dot" aria-hidden="true"></span>'
        if href is None or (hub == "volley" and key == "nutmeg"):
            continue
        cur = ' aria-current="true"' if key == hub else ""
        tail = OUT if ext(href) else ""
        attrs = ' href="%s"' % esc(href) + (' target="_blank" rel="noopener"' if ext(href) else "")
        items.append('<li><a class="nm-hubs__link"%s%s>%s%s%s</a></li>' % (attrs, cur, dot, esc(label), tail))
    home = "index.html" if hub == "volley" else "foundations.html"
    return f'''<a class="nm-skip" href="#nm-main">Skip to content</a>
<header class="nm-header">
  <div class="nm-header__left">
    <a class="nm-logo" href="{home}">{SE_MARK}<span class="nm-visually-hidden">Sports Endeavors design hub, {HUB_NAMES[hub]} home</span></a>
    <div class="nm-search" role="search">
      <label class="nm-search__field">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M12.6 12.6L17 17" stroke="currentColor" stroke-width="1.5"/></svg>
        <span class="nm-visually-hidden">Search {HUB_NAMES[hub]}</span>
        <input class="nm-search__input" type="search" placeholder="Search" autocomplete="off" aria-controls="nm-search-results">
        <span class="nm-kbd" aria-hidden="true">&#8984;</span><span class="nm-kbd" aria-hidden="true">K</span>
      </label>
      <div class="nm-search__results" id="nm-search-results" role="listbox" hidden></div>
    </div>
  </div>
  <nav class="nm-hubs" aria-label="Hubs"><ul>{"".join(items)}</ul></nav>
  <button type="button" class="nm-menu-btn" aria-expanded="false" aria-controls="nm-nav" aria-label="Open the menu"><span class="nm-menu-btn__open"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="1.5"/></svg></span><span class="nm-menu-btn__close"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 5L5 19M5 5L19 19" stroke="currentColor"/></svg></span></button>
</header>'''


def rail(hub, section):
    out = []
    for item in RAILS[hub]:
        if item == "split":
            out.append('<li class="nm-rail__split" aria-hidden="true"></li>')
            continue
        key, label, ico, href = item
        if href is None:
            continue
        cur = ' aria-current="true"' if key == section else ""
        out.append('<li><a class="nm-rail__item" href="%s"%s>%s<span class="nm-rail__label">%s</span></a></li>' % (esc(href), cur, icon(ico), esc(label)))
    return '<ul class="nm-rail">' + "".join(out) + "</ul>"


def drawer(hub, section, page):
    entry = DRAWERS.get((hub, section))
    if not entry:
        return ""
    title, items = entry
    rows = []
    n = 0
    for label, target in items:
        if isinstance(target, list):
            n += 1
            sid = "nm-sub-%s-%d" % (section, n)
            open_ = any(h == page for _l, h in target)
            subs = "".join('<li><a class="nm-drawer__sublink"%s><span class="nm-bullet" aria-hidden="true">&#8226;</span>%s%s</a></li>' % (link_attrs(h, h == page), esc(l), OUT if ext(h) else "") for l, h in target)
            rows.append('<li class="nm-drawer__group"><button type="button" class="nm-drawer__toggle" aria-expanded="%s" aria-controls="%s"><span>%s</span>%s</button><ul class="nm-drawer__sub" id="%s"%s>%s</ul></li>'
                        % ("true" if open_ else "false", sid, esc(label), CHEV, sid, "" if open_ else " hidden", subs))
        else:
            rows.append('<li><a class="nm-drawer__link"%s>%s%s</a></li>' % (link_attrs(target, target == page), esc(label), OUT if ext(target) else ""))
    return ('<div class="nm-drawer"><p class="nm-drawer__title">%s</p><ul class="nm-drawer__list">%s</ul></div>' % (esc(title), "".join(rows)))


def extras(hub):
    out = []
    for label, href, key in HUBS:
        if href is None or (hub == "volley" and key == "nutmeg"):
            continue
        attrs = ' href="%s"' % esc(href) + (' target="_blank" rel="noopener"' if ext(href) else "")
        out.append('<a class="nm-nav__extra"%s><span class="nm-hubs__dot" aria-hidden="true"></span>%s%s</a>' % (attrs, esc(label), OUT if ext(href) else ""))
    return '<div class="nm-nav__extras">' + "".join(out) + "</div>"


def shell(page):
    hub, section = PAGES[page]
    return (header(hub) + '\n<div class="nm-shell">\n<div class="nm-scrim" hidden></div>\n'
            + '<nav class="nm-nav" id="nm-nav" aria-label="%s">' % HUB_NAMES[hub]
            + rail(hub, section) + drawer(hub, section, page) + extras(hub) + "</nav>\n")


NUTMEG_FOOTER = "<span>Nutmeg, started 24 Oct 2026. Sports Endeavors design team.</span>"
VOLLEY_FOOTER = "<span>Volley · Sports Endeavors design &amp; marketing hub.</span>"

BLOCK = re.compile(r'<a class="nm-skip".*?</nav>\n(?=<main)', re.S)
BODY = re.compile(r'<body[^>]*>(?:\n?<script>[^<]*nm-js[^<]*</script>)?')
JS_FLAG = ('<script>document.documentElement.classList.add("nm-js");'
           'setTimeout(function(){if(!window.NM_READY)document.documentElement.classList.remove("nm-js")},3000)</script>')


def main():
    done = []
    for page in sorted(PAGES):
        path = HERE / page
        text = path.read_text(encoding="utf-8")
        hub = PAGES[page][0]
        new, count = BLOCK.subn(lambda m: shell(page), text, count=1)
        if count != 1:
            raise SystemExit("Could not find the navigation block in " + page)
        kind = ' data-page="block"' if page in BLOCK_HREFS else ""
        new = BODY.sub(lambda m: '<body data-hub="%s"%s>\n%s' % (hub, kind, JS_FLAG), new, count=1)
        if hub == "volley":
            new = re.sub(r"(<title>[^<]*?) · Nutmeg</title>", r"\1 · Volley</title>", new, count=1)
            new = new.replace(NUTMEG_FOOTER, VOLLEY_FOOTER)
        if new != text:
            path.write_text(new, encoding="utf-8")
        done.append(page)
    missing = sorted(p.name for p in HERE.glob("*.html") if p.name not in PAGES and not p.name.startswith("zz_"))
    print("Shell written to %d pages." % len(done))
    print("Cards written by type: %d." % write_collections())
    if missing:
        print("Not in the page list, left alone: " + ", ".join(missing))


PLAY = '<svg class="nm-icon-play" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>'
PAUSE = '<svg class="nm-icon-pause" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor"/></svg>'
ARTICLE = re.compile(r'<article class="nm-card[^"]*"[^>]*>.*?</article>', re.S)
REGION = re.compile(r'<div class="nm-tabs" role="tablist" aria-label="(?:Brand|Type)" id="block-filter">.*?(?=<p class="nm-contrast-note">)', re.S)


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def old_card_meta(text):
    meta = {}
    for art in ARTICLE.findall(text):
        href = re.search(r'class="[^"]*nm-card__link" href="([^"]+)"', art)
        if not href:
            continue
        brand = re.search(r'data-brand="([^"]*)"', art)
        status = re.search(r'<span class="nm-chip nm-chip--sm nm-chip--(\w+)">([^<]+)</span>', art)
        meta[href.group(1)] = (html.unescape(brand.group(1)) if brand else "",
                               (status.group(1), status.group(2)) if status else ("yellow", "In progress"))
    return meta


def media_for(href):
    if href in EXTRA_CARDS:
        _b, _s, img, w, h = EXTRA_CARDS[href]
        if img:
            return '<div class="nm-card__media"><img src="%s" width="%d" height="%d" alt=""></div>' % (img, w, h)
        return '<div class="nm-card__media"><img class="nm-card__pattern" src="patterns/Volley%20Pattern%20Muted.png" width="1920" height="1080" alt=""></div>'
    slug = href[:-5]
    folder = HERE.parent / "blocks" / slug
    if (folder / "preview.mp4").exists() and (folder / "preview--poster.jpg").exists():
        return ('<div class="nm-card__media"><video class="nm-card__video" muted loop playsinline preload="none" '
                'width="1440" height="900" poster="../blocks/%s/preview--poster.jpg" data-src="../blocks/%s/preview.mp4" '
                'aria-hidden="true" tabindex="-1"></video><button type="button" class="nm-card__video-btn" '
                'aria-label="Play preview video" data-playing="false">%s%s</button></div>' % (slug, slug, PLAY, PAUSE))
    return '<div class="nm-card__media"><img class="nm-card__pattern" src="patterns/Volley%20Pattern%20Muted.png" width="1920" height="1080" alt=""></div>'


def card(type_name, label, href, brand, status):
    colour, word = status
    return ('<article class="nm-card nm-card--thumb" data-type="%s" data-brand="%s">%s<div class="nm-card__body">'
            '<h3 class="nm-card__title"><a class="nm-card__link" href="%s">%s</a></h3>'
            '<p class="nm-card__meta"><span>%s</span><span class="nm-chip nm-chip--sm nm-chip--%s">%s</span></p></div></article>'
            % (esc(type_name), esc(brand), media_for(href), esc(href), esc(label), esc(brand), colour, esc(word)))


def write_collections():
    count = 0
    for name, groups in COLLECTIONS.items():
        path = HERE / name
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        meta = old_card_meta(text)
        tabs = ['<button type="button" class="nm-tab" role="tab" aria-controls="block-grid" data-filter="all" aria-selected="true" tabindex="0">All</button>']
        sections = []
        for type_name, items in groups:
            tid = slugify(type_name)
            tabs.append('<button type="button" class="nm-tab" role="tab" aria-controls="block-grid" data-filter="%s" data-hash="%s" aria-selected="false" tabindex="-1">%s</button>' % (esc(type_name), tid, esc(type_name)))
            cards = []
            for label, href in items:
                if href in EXTRA_CARDS:
                    brand, word = EXTRA_CARDS[href][0], EXTRA_CARDS[href][1]
                    status = ("green" if word == "Live" else "yellow", word)
                else:
                    brand, status = meta.get(href, ("", ("yellow", "In progress")))
                cards.append(card(type_name, label, href, brand, status))
                count += 1
            sections.append('<section class="nm-type" id="type-%s" data-type="%s"><h3 class="nm-type__title">%s <span class="nm-type__count">%d</span></h3><div class="nm-cards nm-cards--3 nm-type-grid">%s</div></section>'
                            % (tid, esc(type_name), esc(type_name), len(items), "".join(cards)))
        region = ('<div class="nm-tabs" role="tablist" aria-label="Type" id="block-filter">%s</div><div id="block-grid" class="nm-collection">%s</div>\n'
                  % ("".join(tabs), "".join(sections)))
        new, n = REGION.subn(lambda m: region, text, count=1)
        if n != 1:
            raise SystemExit("Could not find the card grid in " + name)
        if new != text:
            path.write_text(new, encoding="utf-8")
    return count


if __name__ == "__main__":
    main()
