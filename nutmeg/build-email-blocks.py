#!/usr/bin/env python3
"""Generates standalone email block preview files and individual Volley email component pages."""
import html
import pathlib
import re

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
SDC_EMAIL = ROOT / "sdc-holiday-email"
CHIVAS_EMAIL = ROOT / "chivas-email"
CHIVAS_BLOCKS = CHIVAS_EMAIL / "blocks"

MONO = "'Aeonik Mono','Courier New',Courier,monospace"
SANS = "Aeonik,Figtree,Arial,Helvetica,sans-serif"
DISPLAY = "'Trim Poster',Impact,'Arial Narrow',Arial,sans-serif"
PATTERN_BLUE = "#2162E4"
NEON = "#EEFF4F"
LINK = "https://www.soccer.com/"

CHIVAS_HEAD = """<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>{title}</title>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500&family=Inter:wght@400;500;600&family=Mohave:wght@600;700&display=swap" rel="stylesheet">
<style>
body {{ margin:0; padding:0; background:#0E0E0E; }}
table {{ border-collapse:collapse; }}
img {{ display:block; border:0; outline:none; text-decoration:none; }}
a {{ text-decoration:none; }}
@media only screen and (max-width:620px){{
  .wrap{{width:100% !important;}}
  .fluid{{width:100% !important;max-width:100% !important;height:auto !important;}}
  .stack{{display:block !important;width:100% !important;box-sizing:border-box !important;}}
  .pad-x{{padding-left:24px !important;padding-right:24px !important;}}
  .details-photo{{padding:0 0 32px 0 !important;text-align:center !important;}}
  .details-photo img{{margin:0 auto !important;}}
  .details-copy{{padding:0 24px 36px 24px !important;}}
  .hero-body{{font-size:20px !important;line-height:28px !important;}}
  .closing{{font-size:32px !important;line-height:36px !important;}}
}}
</style>
</head>
<body style="margin:0;padding:0;background-color:#0E0E0E;">
{body}
</body>
</html>
"""

CHIVAS_HERO_GIF_SNIPPET = """<table role="presentation" class="wrap" cellpadding="0" cellspacing="0" border="0" width="600" align="center" bgcolor="#0E0E0E" style="width:100%;max-width:600px;background-color:#0E0E0E;">
  <tr>
    <td bgcolor="#0E0E0E" style="background-color:#0E0E0E;">
      <a href="https://www.worldsoccershop.com/shop/clubs/chivas" target="_blank" style="display:block;">
        <img src="https://sachawd.github.io/sei-component-library/chivas-email/assets/chivas-hero-rotating.gif" width="600" height="800" alt="Chivas 26/27 Third Jersey. C.D. Guadalajara, El Rebaño." class="fluid" style="display:block;width:100%;max-width:600px;height:auto;border:0;color:#FFE014;font-family:Mohave,'Arial Narrow',Arial,sans-serif;font-size:40px;line-height:44px;font-weight:700;text-align:center;background-color:#2B2B2B;">
      </a>
    </td>
  </tr>
  <tr>
    <td class="pad-x" align="center" bgcolor="#0E0E0E" style="padding:56px 40px 52px 40px;background-color:#0E0E0E;">
      <div style="font-family:Inter,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:22px;line-height:26px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#FFE014;padding-bottom:16px;">El charro no se hace, nace</div>
      <div class="hero-body" style="font-family:Inter,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:24px;line-height:30px;font-weight:400;color:#FFE014;">A tribute to rich Mexican cultural heritage. A tribute to every charro, every Rojiblanco.</div>
    </td>
  </tr>
</table>"""

CHIVAS_HERO_STILL_SNIPPET = CHIVAS_HERO_GIF_SNIPPET.replace("chivas-hero-rotating.gif", "chivas-hero-static.jpg")

CHIVAS_DETAILS_SNIPPET = """<table role="presentation" class="wrap" cellpadding="0" cellspacing="0" border="0" width="600" align="center" bgcolor="#0E0E0E" style="width:100%;max-width:600px;background-color:#0E0E0E;">
  <tr>
    <td bgcolor="#0E0E0E" style="padding:24px 0 21px 0;background-color:#0E0E0E;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td class="stack details-photo" width="333" valign="middle" style="width:333px;padding:0;">
            <img src="https://sachawd.github.io/sei-component-library/chivas-email/assets/chivas-details.jpg" width="333" height="630" alt="Close-up of the Chivas 2027 Third jersey: polo-style collar, golden piteado detailing and the original crest." class="fluid" style="display:block;width:333px;max-width:333px;height:auto;border:0;color:#F4EDE1;font-family:Inter,Arial,sans-serif;font-size:14px;background-color:#2B2B2B;">
          </td>
          <td class="stack details-copy" valign="middle" style="padding:0 24px 0 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="padding-bottom:28px;">
                  <div style="font-family:Mohave,'Arial Narrow',Arial,sans-serif;font-size:18px;line-height:20px;font-weight:600;letter-spacing:1.4px;color:#FFE014;padding-bottom:4px;">01</div>
                  <div style="font-family:Inter,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;color:#F4EDE1;">Single-button, polo-style collar</div>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:28px;">
                  <div style="font-family:Mohave,'Arial Narrow',Arial,sans-serif;font-size:18px;line-height:20px;font-weight:600;letter-spacing:1.4px;color:#FFE014;padding-bottom:4px;">02</div>
                  <div style="font-family:Inter,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;color:#F4EDE1;">Ornate, golden detailing inspired by charro piteado belts</div>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:28px;">
                  <div style="font-family:Mohave,'Arial Narrow',Arial,sans-serif;font-size:18px;line-height:20px;font-weight:600;letter-spacing:1.4px;color:#FFE014;padding-bottom:4px;">03</div>
                  <div style="font-family:Inter,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;color:#F4EDE1;">Historic, original club crest used from 1908-1911</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style="font-family:Mohave,'Arial Narrow',Arial,sans-serif;font-size:18px;line-height:20px;font-weight:600;letter-spacing:1.4px;color:#FFE014;padding-bottom:4px;">04</div>
                  <div style="font-family:Inter,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;color:#F4EDE1;">Built to reflect traditional traje de charros</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>"""

CHIVAS_CTA_SNIPPET = """<table role="presentation" class="wrap" cellpadding="0" cellspacing="0" border="0" width="600" align="center" bgcolor="#0E0E0E" style="width:100%;max-width:600px;background-color:#0E0E0E;">
  <tr>
    <td class="pad-x" align="center" bgcolor="#0E0E0E" style="padding:52px 36px 64px 36px;background-color:#0E0E0E;">
      <div class="closing" style="font-family:Mohave,'Arial Narrow','Helvetica Neue',Arial,sans-serif;font-size:40px;line-height:44px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#FFE014;padding-bottom:28px;">Worn with Pride. Built for El Reba&ntilde;o.</div>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
        <tr>
          <td align="center" bgcolor="#FFE014" style="background-color:#FFE014;border-radius:2px;">
            <a href="https://www.worldsoccershop.com/shop/clubs/chivas" target="_blank" style="display:inline-block;padding:15px 48px;font-family:'Chakra Petch','Arial Narrow',Arial,sans-serif;font-size:16px;line-height:20px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:#0E0E0E;text-decoration:none;">Shop Chivas</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>"""


def extract_sdc_snippet(block_file):
    text = (SDC_EMAIL / "blocks" / block_file).read_text(encoding="utf-8")
    m = re.search(r'(<table role="presentation".*</table>)\s*</body>', text, re.S)
    if not m:
        raise ValueError("No table in " + block_file)
    return m.group(1).replace("../assets/", "assets/")


EMAIL_BLOCKS = [
    {
        "slug": "email-block-hero",
        "title": "Holiday Photo Hero",
        "category": "Heroes",
        "brand": "Soccer.com",
        "status": "In progress",
        "lede": "Full-width 640px campaign photo hero on the blue check paper.",
        "desc": "One linked hero image at 640 wide (exported at 2x, 1280px). Use Brock's live editor below to swap the S3 image URL, alt text, background colour, and tracked destination link.",
        "iframe_src": "../sdc-holiday-email/blocks/hero.html",
        "height": 859,
        "thumb": "../sdc-holiday-email/assets/hero.jpg",
        "thumb_w": 640,
        "thumb_h": 859,
        "snippet_fn": lambda: extract_sdc_snippet("hero.html"),
    },
    {
        "slug": "email-block-gift-box",
        "title": "Gift Box Hero",
        "category": "Heroes",
        "brand": "Soccer.com",
        "status": "On hold",
        "lede": "Holiday gift box wrapped in blue check paper with a live-text subline underneath.",
        "desc": "Combines a 640x700 hero graphic with a live-text message row on dark holiday green so Brock can edit the copy without re-exporting the image.",
        "iframe_src": "../sdc-holiday-email/blocks/gift-box.html",
        "height": 780,
        "thumb": "../sdc-holiday-email/assets/gift-box-hero.jpg",
        "thumb_w": 1280,
        "thumb_h": 1400,
        "snippet_fn": lambda: extract_sdc_snippet("gift-box.html"),
    },
    {
        "slug": "email-block-chivas-hero-gif",
        "title": "Chivas Rotating GIF Hero",
        "category": "Heroes",
        "brand": "WorldSoccerShop",
        "status": "Ready",
        "lede": "Four-frame rotating GIF hero with live Spanish eyebrow and tribute copy below.",
        "desc": "The rotating GIF sits above a live-text headline and body block in #FFE014 on #0E0E0E. Edit the copy, colours, image URL, and UTM link below.",
        "iframe_src": "../chivas-email/blocks/chivas-hero-gif.html",
        "height": 1020,
        "thumb": "../chivas-email/assets/chivas-hero-static.jpg",
        "thumb_w": 600,
        "thumb_h": 800,
        "snippet_fn": lambda: CHIVAS_HERO_GIF_SNIPPET,
    },
    {
        "slug": "email-block-chivas-hero-still",
        "title": "Chivas Still Hero",
        "category": "Heroes",
        "brand": "WorldSoccerShop",
        "status": "Ready",
        "lede": "Static photo hero with live Spanish eyebrow and tribute copy below.",
        "desc": "Same structure as the rotating hero, using a single static JPEG for lighter file weight.",
        "iframe_src": "../chivas-email/blocks/chivas-hero-still.html",
        "height": 1020,
        "thumb": "../chivas-email/assets/chivas-hero-static.jpg",
        "thumb_w": 600,
        "thumb_h": 800,
        "snippet_fn": lambda: CHIVAS_HERO_STILL_SNIPPET,
    },
    {
        "slug": "email-block-offer",
        "title": "Offer Card, 30% Off GIF",
        "category": "Offers & promo cards",
        "brand": "Soccer.com",
        "status": "In progress",
        "lede": "Animated 30% OFF headline GIF framed by blue check paper, with a live-text promo code box.",
        "desc": "The 30% OFF letters rise one by one (with a full first frame for desktop Outlook). The promo code box is live HTML text so Brock can change the code in seconds.",
        "iframe_src": "../sdc-holiday-email/blocks/offer.html",
        "height": 416,
        "thumb": "../sdc-holiday-email/assets/offer.gif",
        "thumb_w": 586,
        "thumb_h": 245,
        "snippet_fn": lambda: extract_sdc_snippet("offer.html"),
    },
    {
        "slug": "email-block-offer-gift-tag",
        "title": "Offer Card with Gift Tag",
        "category": "Offers & promo cards",
        "brand": "Soccer.com",
        "status": "In progress",
        "lede": "Animated offer card paired with a dashed neon gift-tag promo code box.",
        "desc": "Both the To/From gift tag and the promo code are live text inside a bordered HTML table, so Brock can customize the sender, recipient, and code live.",
        "iframe_src": "../sdc-holiday-email/blocks/offer-gift-tag.html",
        "height": 416,
        "thumb": "../sdc-holiday-email/assets/offer.gif",
        "thumb_w": 586,
        "thumb_h": 245,
        "snippet_fn": lambda: extract_sdc_snippet("offer-gift-tag.html"),
    },
    {
        "slug": "email-block-circles-2up",
        "title": "Category Circles, 2-up",
        "category": "Category & product grids",
        "brand": "Soccer.com",
        "status": "In progress",
        "lede": "Two circular category cutouts side by side with live-text labels and links.",
        "desc": "Each 320px column has its own cutout image, alt text, live category label, and destination link.",
        "iframe_src": "../sdc-holiday-email/blocks/circles-2up.html",
        "height": 360,
        "thumb": "../sdc-holiday-email/assets/circle-jerseys.png",
        "thumb_w": 320,
        "thumb_h": 299,
        "snippet_fn": lambda: extract_sdc_snippet("circles-2up.html"),
    },
    {
        "slug": "email-block-circles-3up",
        "title": "Category Circles, 3-up",
        "category": "Category & product grids",
        "brand": "Soccer.com",
        "status": "In progress",
        "lede": "Three 213px circular category cutouts in a single row with live-text labels.",
        "desc": "Ideal for highlighting three departments or silos across a 640px row.",
        "iframe_src": "../sdc-holiday-email/blocks/circles-3up.html",
        "height": 260,
        "thumb": "../sdc-holiday-email/assets/circle3-jerseys.png",
        "thumb_w": 213,
        "thumb_h": 197,
        "snippet_fn": lambda: extract_sdc_snippet("circles-3up.html"),
    },
    {
        "slug": "email-block-squares-2up",
        "title": "Photo Squares, 2-up",
        "category": "Category & product grids",
        "brand": "Soccer.com",
        "status": "In progress",
        "lede": "Two lifestyle or product photo cards with live display headings and offer sublines.",
        "desc": "Each card pairs a 289x330 photo with a live uppercase title in neon yellow and a live offer subtitle in white.",
        "iframe_src": "../sdc-holiday-email/blocks/squares-2up.html",
        "height": 450,
        "thumb": "../sdc-holiday-email/assets/square-a.jpg",
        "thumb_w": 289,
        "thumb_h": 330,
        "snippet_fn": lambda: extract_sdc_snippet("squares-2up.html"),
    },
    {
        "slug": "email-block-circles-ornament",
        "title": "Ornament Circles, 2-up",
        "category": "Category & product grids",
        "brand": "Soccer.com",
        "status": "On hold",
        "lede": "Two hanging ornament circles with staggered strings and live category labels.",
        "desc": "Currently being redesigned by Sacha. Do not ship this version until the new ornament artwork lands.",
        "iframe_src": "../sdc-holiday-email/blocks/circles-ornament.html",
        "height": 390,
        "thumb": "../sdc-holiday-email/assets/circle-jerseys-ornament.png",
        "thumb_w": 320,
        "thumb_h": 319,
        "snippet_fn": lambda: extract_sdc_snippet("circles-ornament.html"),
    },
    {
        "slug": "email-block-marquee",
        "title": "Scrolling Offer Marquee",
        "category": "Marquees & dividers",
        "brand": "Soccer.com",
        "status": "In progress",
        "lede": "Full-width 640x32 neon scrolling GIF banner.",
        "desc": "Opens on a complete, readable frame so desktop Outlook displays the full offer line even without animation.",
        "iframe_src": "../sdc-holiday-email/blocks/marquee.html",
        "height": 48,
        "thumb": "../sdc-holiday-email/assets/marquee.gif",
        "thumb_w": 640,
        "thumb_h": 32,
        "snippet_fn": lambda: extract_sdc_snippet("marquee.html"),
    },
    {
        "slug": "email-block-ribbon-strip",
        "title": "Everything Soccer Ribbon",
        "category": "Marquees & dividers",
        "brand": "Soccer.com",
        "status": "On hold",
        "lede": "Static 640x48 neon Everything Soccer ribbon divider on blue check paper.",
        "desc": "On hold per Sacha's 26 Oct ruling. Kept in the library for reference.",
        "iframe_src": "../sdc-holiday-email/blocks/ribbon-strip.html",
        "height": 64,
        "thumb": "../sdc-holiday-email/assets/ribbon-strip.png",
        "thumb_w": 640,
        "thumb_h": 48,
        "snippet_fn": lambda: extract_sdc_snippet("ribbon-strip.html"),
    },
    {
        "slug": "email-block-ribbon-marquee",
        "title": "Everything Soccer Ribbon, Moving",
        "category": "Marquees & dividers",
        "brand": "Soccer.com",
        "status": "On hold",
        "lede": "Scrolling GIF version of the Everything Soccer ribbon divider.",
        "desc": "On hold per Sacha's 26 Oct ruling. Kept in the library for reference.",
        "iframe_src": "../sdc-holiday-email/blocks/ribbon-marquee.html",
        "height": 48,
        "thumb": "../sdc-holiday-email/assets/ribbon-marquee.gif",
        "thumb_w": 640,
        "thumb_h": 32,
        "snippet_fn": lambda: extract_sdc_snippet("ribbon-marquee.html"),
    },
    {
        "slug": "email-block-heading",
        "title": "Section Heading",
        "category": "Headings & story details",
        "brand": "Soccer.com",
        "status": "In progress",
        "lede": "640x60 Trim Poster display section header image on a dark background.",
        "desc": "Exported as a 2x PNG because Gmail and Windows Outlook strip custom @font-face rules.",
        "iframe_src": "../sdc-holiday-email/blocks/heading.html",
        "height": 125,
        "thumb": "../sdc-holiday-email/assets/heading-shop-top-categories.png",
        "thumb_w": 640,
        "thumb_h": 60,
        "snippet_fn": lambda: extract_sdc_snippet("heading.html"),
    },
    {
        "slug": "email-block-chivas-details",
        "title": "Jersey 4-Point Story Breakdown",
        "category": "Headings & story details",
        "brand": "WorldSoccerShop",
        "status": "Ready",
        "lede": "Two-column product close-up photo paired with four numbered live-text callouts.",
        "desc": "Stacks cleanly on phones below 620px. Every numbered callout (01 to 04) and description is live HTML text that Brock can edit directly below.",
        "iframe_src": "../chivas-email/blocks/chivas-details.html",
        "height": 680,
        "thumb": "../chivas-email/assets/chivas-details.jpg",
        "thumb_w": 333,
        "thumb_h": 630,
        "snippet_fn": lambda: CHIVAS_DETAILS_SNIPPET,
    },
    {
        "slug": "email-block-chivas-cta",
        "title": "Story Closing & CTA Button",
        "category": "Headings & story details",
        "brand": "WorldSoccerShop",
        "status": "Ready",
        "lede": "Bold closing statement with a bullet-proof HTML table button.",
        "desc": "Both the closing headline and the button label/background are 100% live HTML, requiring zero images.",
        "iframe_src": "../chivas-email/blocks/chivas-cta.html",
        "height": 240,
        "thumb": "../chivas-email/assets/chivas-hero-static.jpg",
        "thumb_w": 600,
        "thumb_h": 800,
        "snippet_fn": lambda: CHIVAS_CTA_SNIPPET,
    },
]


def main():
    CHIVAS_BLOCKS.mkdir(parents=True, exist_ok=True)
    for fname, title, snip in [
        ("chivas-hero-gif.html", "Chivas Rotating GIF Hero", CHIVAS_HERO_GIF_SNIPPET),
        ("chivas-hero-still.html", "Chivas Still Hero", CHIVAS_HERO_STILL_SNIPPET),
        ("chivas-details.html", "Jersey 4-Point Story Breakdown", CHIVAS_DETAILS_SNIPPET),
        ("chivas-cta.html", "Story Closing & CTA Button", CHIVAS_CTA_SNIPPET),
    ]:
        (CHIVAS_BLOCKS / fname).write_text(CHIVAS_HEAD.format(title=title, body=snip), encoding="utf-8")

    shell_ref = (HERE / "email-team-holiday-pop-up.html").read_text(encoding="utf-8")
    head_idx = shell_ref.index('<div class="nm-panel"><div class="nm-content">') + len('<div class="nm-panel"><div class="nm-content">')
    foot_idx = shell_ref.index('<footer class="nm-footer">')
    shell_top = shell_ref[:head_idx]
    shell_bot = shell_ref[foot_idx:]

    for b in EMAIL_BLOCKS:
        slug = b["slug"]
        title = b["title"]
        brand = b["brand"]
        status = b["status"]
        chip_col = "green" if status == "Ready" else ("grey" if status == "On hold" else "yellow")
        snip = b["snippet_fn"]()
        esc_snip = html.escape(snip, quote=False)

        top = re.sub(r"<title>[^<]*</title>", f"<title>{html.escape(title)} · Volley</title>", shell_top, count=1)
        top = re.sub(
            r'<meta name="description" content="[^"]*">',
            f'<meta name="description" content="{html.escape(b["lede"], quote=True)}">',
            top,
            count=1,
        )

        body = f"""
<div class="nm-title">
  <div class="nm-title__meta"><span class="nm-chip nm-chip--{chip_col}">{html.escape(status)}</span><span class="nm-chip nm-chip--grey">{html.escape(brand)}</span><span class="nm-chip nm-chip--grey">{html.escape(b["category"])}</span></div>
  <h1>{html.escape(title)}</h1>
  <p class="nm-lede">{html.escape(b["lede"])}</p>
  <hr class="nm-divider">
</div>
<section class="nm-section" id="demo">
<div class="nm-section__head"><h2 class="nm-h2">Preview &amp; Live Editor<button type="button" class="nm-anchor" aria-label="Copy a link to Preview"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="9" width="8" height="6" rx="3" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="9" width="8" height="6" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M9 12h6" stroke="currentColor" stroke-width="1.6"/></svg></button></h2><p class="nm-section__desc">{html.escape(b["desc"])}</p></div>
<div class="nm-demo" data-email-block="{html.escape(slug)}"><div class="nm-demo__bar"><div class="nm-tabs" role="tablist" aria-label="Screen width" data-demo-widths="frame-{html.escape(slug)}"><button type="button" class="nm-tab" role="tab" aria-controls="frame-{html.escape(slug)}" data-width="390" aria-selected="false" tabindex="-1">Phone</button><button type="button" class="nm-tab" role="tab" aria-controls="frame-{html.escape(slug)}" data-width="full" aria-selected="true" tabindex="0">Desktop (640px)</button></div><a class="nm-btn nm-btn--text" href="{html.escape(b["iframe_src"], quote=True)}" target="_blank" rel="noopener"><span>Open in a new tab</span><svg class="nm-out" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14 19L21 12L14 5" stroke="currentColor" stroke-miterlimit="10"/><path d="M21 12H2" stroke="currentColor" stroke-miterlimit="10"/></svg></a></div><div class="nm-demo__stage"><iframe class="nm-demo__frame" id="frame-{html.escape(slug)}" src="{html.escape(b["iframe_src"], quote=True)}" height="{b["height"]}" title="{html.escape(title)}, preview"></iframe></div></div>
<div class="nm-codeblock"><div class="nm-codeblock__bar"><span>HTML for a Zeta HTML block (updates live as you edit above)</span><button type="button" class="nm-copy"><svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" stroke="currentColor" stroke-width="1.6"/></svg><span>Copy code</span></button></div><pre><code>{esc_snip}</code></pre></div>
</section>
<section class="nm-section" id="zeta-notes">
<div class="nm-section__head"><h2 class="nm-h2">Zeta checklist<button type="button" class="nm-anchor" aria-label="Copy a link to Zeta checklist"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="9" width="8" height="6" rx="3" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="9" width="8" height="6" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M9 12h6" stroke="currentColor" stroke-width="1.6"/></svg></button></h2></div>
<div class="nm-cards nm-cards--3">
<article class="nm-card nm-card--open"><div><span class="nm-eyebrow">1. Images</span><h3 class="nm-card__title">S3 or Imagehandler</h3></div><ul class="nm-list nm-list--rule nm-list--compact"><li><span>Host email GIFs, PNGs, and JPGs on S3 so Brock skips uploading to Zeta.</span></li><li><span>Or type an article number in the editor to pull a product cutout from Imagehandler.</span></li><li><span>Check the visible Alt Text box so blocked images still read cleanly in Outlook.</span></li></ul></article>
<article class="nm-card nm-card--open"><div><span class="nm-eyebrow">2. Tracking</span><h3 class="nm-card__title">Zeta &amp; Google Analytics</h3></div><ul class="nm-list nm-list--rule nm-list--compact"><li><span>Zeta automatically wraps every link in its own click-tracking redirect at send time.</span></li><li><span>Enter the Campaign Name in the editor to append <span class="nm-code">utm_campaign</span> and <span class="nm-code">utm_content</span> automatically.</span></li></ul></article>
<article class="nm-card nm-card--open"><div><span class="nm-eyebrow">3. Paste</span><h3 class="nm-card__title">Drop into Zeta HTML block</h3></div><ul class="nm-list nm-list--rule nm-list--compact"><li><span>Click <strong>Copy code</strong> above after making your text, colour, image, and link edits.</span></li><li><span>Paste into a Zeta HTML block and send a test to Outlook and Gmail.</span></li></ul></article>
</div>
</section>
"""
        (HERE / f"{slug}.html").write_text(top + body + shell_bot, encoding="utf-8")

    print(f"Generated {len(EMAIL_BLOCKS)} email block pages and 4 Chivas block preview files.")


if __name__ == "__main__":
    main()
