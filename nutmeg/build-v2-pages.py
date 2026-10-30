#!/usr/bin/env python3
"""Writes the V2 hub, the Button, Input and Card pages and the estate index.

Run: python3 build-v2-pages.py, then python3 nm-shell.py to add the navigation.
Values are the placeholders from the V2 shadcn page of 29 Oct 2026.
"""
import html, json, pathlib, re, importlib.util, datetime, sys

LIB = pathlib.Path(__file__).resolve().parent.parent
NM = LIB / "nutmeg"
esc = lambda s: html.escape(str(s), quote=True)

BRANDS = [("soccer", "Soccer.com"), ("wss", "WorldSoccerShop"), ("431", "431 Sports")]
V = {
 "soccer": {"background":"#ffffff","foreground":"#27272a","card":"#ffffff","card-foreground":"#27272a","popover":"#ffffff","popover-foreground":"#27272a","primary":"#27272a","primary-foreground":"#ffffff","secondary":"#f5f5f5","secondary-foreground":"#27272a","muted":"#f5f5f5","muted-foreground":"#525252","accent":"#f5f5f5","accent-foreground":"#27272a","destructive":"#991b1b","border":"#e5e5e5","input":"#525252","ring":"#171717","brand":"#e0154a","loyalty":"#6a5411","sale":"#9d0f34","cart":"#0348cf","info":"#1d4ed8","success":"#3f6212","warning":"#854d0e","font-sans":"Figtree","font-heading":"Figtree","radius":"0.625rem"},
 "wss": {"background":"#ffffff","foreground":"#27272a","card":"#ffffff","card-foreground":"#27272a","popover":"#ffffff","popover-foreground":"#27272a","primary":"#27272a","primary-foreground":"#ffffff","secondary":"#f5f5f5","secondary-foreground":"#27272a","muted":"#f5f5f5","muted-foreground":"#525252","accent":"#f5f5f5","accent-foreground":"#27272a","destructive":"#991b1b","border":"#e5e5e5","input":"#525252","ring":"#171717","brand":"#796a39","loyalty":"#6a5411","sale":"#9d0f34","cart":"#0348cf","info":"#1d4ed8","success":"#3f6212","warning":"#854d0e","font-sans":"Inter","font-heading":"Chakra Petch","radius":"0.625rem"},
 "431": {"background":"#ffffff","foreground":"#042540","card":"#ffffff","card-foreground":"#042540","popover":"#ffffff","popover-foreground":"#042540","primary":"#317f89","primary-foreground":"#ffffff","secondary":"#f5f5f5","secondary-foreground":"#042540","muted":"#f5f5f5","muted-foreground":"#525252","accent":"#f5f5f5","accent-foreground":"#042540","destructive":"#991b1b","border":"#e5e5e5","input":"#525252","ring":"#031e33","brand":"#317f89","loyalty":"#6a5411","sale":"#9d0f34","cart":"#0348cf","info":"#1d4ed8","success":"#3f6212","warning":"#854d0e","font-sans":"Roboto Condensed","font-heading":"Roboto Condensed","radius":"0.625rem"},
}
TWIN = {"background":"surface.page","foreground":"text.default","card":"surface.default","card-foreground":"text.default","primary":"action.primary.default","primary-foreground":"text.on-primary","secondary":"surface.sunken","secondary-foreground":"text.default","muted":"surface.sunken","muted-foreground":"text.muted","accent":"none, takes surface.sunken","accent-foreground":"text.default","destructive":"tone.error.text","border":"border.subtle","input":"input.border.default","ring":"border.action.focus","radius":"none, replaces the button radius","font-sans":"font.body"}
PATH = lambda n: "radius" if n == "radius" else ("font.sans" if n == "font-sans" else "color." + n)

def rgb(h): h = h.lstrip("#"); return [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
def lum(c): return sum(w * (x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4) for w, x in zip((0.2126, 0.7152, 0.0722), c))
def mix(a, b, t): return [x * t + y * (1 - t) for x, y in zip(a, b)]
def ratio(a, b):
    A, B = lum(a), lum(b); return (max(A, B) + 0.05) / (min(A, B) + 0.05)

def pair(b, fg, bg, need, label, fg_alpha=1.0):
    vb = V[b]
    f = rgb(vb[fg]) if fg in vb else rgb(fg)
    g = rgb(vb[bg]) if bg in vb else rgb(bg)
    if fg_alpha < 1: f = mix(f, g, fg_alpha)
    return (label, ratio(f, g), need)

ICON_COPY = '<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16 2H8V5H16V2Z" stroke="currentColor" stroke-miterlimit="10"/><path d="M16 3H17.5L19 4.5V19.5L17.5 21H6.5L5 19.5V4.5L6.5 3H8" stroke="currentColor" stroke-miterlimit="10"/></svg>'
ANCHOR = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="9" width="8" height="6" rx="3" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="9" width="8" height="6" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M9 12h6" stroke="currentColor" stroke-width="1.6"/></svg>'

def h2(text, sid, desc=""):
    d = '<p class="nm-section__desc">%s</p>' % desc if desc else ""
    return '<section class="nm-section" id="%s"><div class="nm-section__head"><h2 class="nm-h2">%s<button type="button" class="nm-anchor" aria-label="Copy a link to %s">%s</button></h2>%s</div>' % (sid, esc(text), esc(text), ANCHOR, d)

def codeblock(lang, code):
    return '<div class="nm-codeblock"><div class="nm-codeblock__bar"><span>%s</span><button type="button" class="nm-copy">%s<span>Copy code</span></button></div><pre><code>%s</code></pre></div>' % (esc(lang), ICON_COPY, esc(code))

def result(r, need):
    if r >= need: return '<span class="nm-result nm-result--pass">Pass</span>'
    if need == 4.5 and r >= 3: return '<span class="nm-result nm-result--fail">Fail for small text, passes for large text only</span>'
    return '<span class="nm-result nm-result--fail">Fail</span>'

def page(title, desc, body, extra_head=""):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)} · Nutmeg</title>
<meta name="description" content="{esc(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Adamina&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="nutmeg.css">
{extra_head}</head>
<body data-hub="nutmeg">
<a class="nm-skip" href="#nm-main">Skip to content</a>
<nav></nav>
<main class="nm-main" id="nm-main">
<div class="nm-panel"><div class="nm-content">
{body}
<footer class="nm-footer"><span>Nutmeg, started 24 Oct 2026. Sports Endeavors design team.</span><a href="https://github.com/Sachawd/sei-component-library" target="_blank" rel="noopener">View on GitHub</a></footer>
</div></div>
</main>
</div>
<script src="nm-pages.js"></script>
<script src="nutmeg.js"></script>
<script src="v2/v2.js"></script>
</body>
</html>
'''

def title_block(h1, lede):
    return '<div class="nm-title"><p class="nm-eyebrow">V2 design system</p><h1>%s</h1><p class="nm-lede">%s</p><hr class="nm-divider"></div>' % (esc(h1), esc(lede))

PLACEHOLDER_CALLOUT = ('<div class="nm-callout"><strong>Every value here is a placeholder.</strong>'
    "<p>Names and values come from Neil's V2 shadcn page (29 Oct 2026). The design team sets the real values in the Tokens Studio set. "
    "Type sizes, spacing, shadows and motion are shadcn's defaults. None of them are decided yet.</p></div>")

def brand_tabs(prefix):
    out = ['<div class="nm-tabs" role="tablist" aria-label="Brand" data-v2-brand>']
    for i, (k, name) in enumerate(BRANDS):
        out.append('<button type="button" class="nm-tab" role="tab" id="tab-%s" data-hash="%s" data-brand="%s" aria-controls="%s-%s" aria-selected="%s" tabindex="%d">%s</button>'
                   % (k, k, k, prefix, k, "true" if i == 0 else "false", 0 if i == 0 else -1, esc(name)))
    out.append("</div>")
    return "".join(out)

def demo(part, heights, title):
    return ('<div class="nm-demo"><div class="nm-demo__stage"><iframe class="nm-demo__frame" data-v2-frame src="v2/demo.html?part=%s#soccer" height="%d" data-heights="%s" title="%s"></iframe></div></div>'
            % (part, heights[2], ",".join(map(str, heights)), esc(title)))

def var_table(names):
    rows = []
    for n in names:
        vals = "".join('<td>%s</td>' % esc(V[k][n].upper() if V[k][n].startswith("#") else V[k][n]) for k, _ in BRANDS)
        rows.append('<tr><td><span class="nm-code">--%s</span></td><td>%s</td>%s</tr>' % (n, esc(PATH(n)), vals))
    head = "".join("<th>%s, placeholder</th>" % esc(b) for _, b in BRANDS)
    return '<div class="nm-table-wrap"><table class="nm-table"><thead><tr><th>shadcn name</th><th>Neil\'s token path</th>%s</tr></thead><tbody>%s</tbody></table></div>' % (head, "".join(rows))

def contrast_panels(checks):
    out = []
    for i, (k, name) in enumerate(BRANDS):
        rows = []
        for label, r, need in checks(k):
            rows.append('<tr><td>%s</td><td>%s</td><td>%.2f to 1</td><td>%s</td></tr>' % (esc(label), "4.5 to 1" if need == 4.5 else "3 to 1", r, result(r, need)))
        out.append('<div class="nm-tabpanel" role="tabpanel" id="contrast-%s" aria-labelledby="tab-%s"%s><h3 class="nm-h3">%s</h3><div class="nm-table-wrap"><table class="nm-table"><thead><tr><th>Pair</th><th>Needs</th><th>Measured</th><th>Result</th></tr></thead><tbody>%s</tbody></table></div></div>'
                   % (k, k, "" if i == 0 else " hidden", esc(name), "".join(rows)))
    return "".join(out)

def bullets(items):
    return '<ul class="nm-list">%s</ul>' % "".join("<li>%s</li>" % esc(i) for i in items)

CABANA_SOURCE = {
    "Button": ["Button/Primary, as the default Button", "Button/Secondary, as variant secondary", "Button/White, as variant outline (proposed)", "Button/Text, as variant ghost", "Button/Action and Button/Special, needing a cart and a brand variant from Neil", "Icon Button and icon button/favorites, as size icon", "Text Link/Primary and Text Link/Secondary, as variant link"],
    "Input": ["Input Field"],
    "Card": ["Content Block", "Comment, as a Card with an Avatar (proposed)"],
}

def part_page(slug, name, lede, heights, names, checks, a11y, dos, donts, code, states_note):
    body = title_block(name, lede) + PLACEHOLDER_CALLOUT
    src = CABANA_SOURCE.get(name, [])
    if src:
        body += h2("Cabana 8 (V1) source", "cabana", "The Cabana 8 components this part replaces. Full list on the Cabana 8 to V2 page.") + bullets(src) + "</section>"
    body += h2("Live example", "example", "Pick a brand. Every state is shown at once. " + states_note)
    body += brand_tabs("contrast") + demo(slug, heights, "%s, live example" % name) + "</section>"
    body += h2("Variables it reads", "variables", "The shadcn recipe reads these and nothing else.") + var_table(names) + "</section>"
    body += h2("Contrast, measured", "contrast", "Measured from the placeholder values for the brand picked above. Text needs 4.5 to 1. Lines and focus rings need 3 to 1. Fails are shown, never hidden.") + contrast_panels(checks) + "</section>"
    body += h2("Accessibility", "accessibility") + bullets(a11y) + "</section>"
    body += h2("Do and don't", "do-dont") + '<h3 class="nm-h3">Do</h3>' + bullets(dos) + '<h3 class="nm-h3">Don\'t</h3>' + bullets(donts) + "</section>"
    body += h2("Code", "code", "shadcn's published recipe. The classes read the variables above, so there is no separate CSS to keep in step.") + codeblock("Vue", code) + "</section>"
    body += h2("Used in", "used-in") + '<p class="nm-prose">No blocks use this part yet. Blocks start next week.</p></section>'
    return page(name + " · V2", lede, body)

def halo(k): return pair(k, "ring", "background", 3, "Focus ring halo on the page", fg_alpha=0.5)

BUTTON_CHECKS = lambda k: [
    pair(k, "primary-foreground", "primary", 4.5, "Default: label on fill"),
    pair(k, "primary-foreground", mix(rgb(V[k]["primary"]), rgb(V[k]["background"]), 0.9) and "#%02x%02x%02x" % tuple(round(x * 255) for x in mix(rgb(V[k]["primary"]), rgb(V[k]["background"]), 0.9)), 4.5, "Default, hover: label on 90% fill"),
    pair(k, "#ffffff", "destructive", 4.5, "Destructive: white label on fill"),
    pair(k, "secondary-foreground", "secondary", 4.5, "Secondary: label on fill"),
    pair(k, "foreground", "background", 4.5, "Outline: label on the page"),
    pair(k, "accent-foreground", "accent", 4.5, "Outline and Ghost, hover: label on hover wash"),
    pair(k, "primary", "background", 4.5, "Link: text on the page"),
    pair(k, "border", "background", 3, "Outline: edge on the page"),
    halo(k),
]
INPUT_CHECKS = lambda k: [
    pair(k, "foreground", "background", 4.5, "Typed text on the page"),
    pair(k, "muted-foreground", "background", 4.5, "Placeholder text on the page"),
    pair(k, "foreground", "background", 4.5, "Label on the page"),
    pair(k, "input", "background", 3, "Field edge on the page"),
    pair(k, "destructive", "background", 3, "Error: field edge on the page"),
    pair(k, "destructive", "background", 4.5, "Error: message text on the page"),
    halo(k),
]
CARD_CHECKS = lambda k: [
    pair(k, "card-foreground", "card", 4.5, "Title and body text on the card"),
    pair(k, "muted-foreground", "card", 4.5, "Description text on the card"),
    pair(k, "border", "background", 3, "Card edge on the page"),
    pair(k, "brand", "#%02x%02x%02x" % tuple(round(x * 255) for x in mix(rgb(V[k]["brand"]), rgb(V[k]["background"]), 0.1)), 4.5, "Brand text on a 10% brand tint (for brand-tinted cards)"),
]

BUTTON_CODE = '''<!-- shadcn-vue Button, published recipe -->
<Button>Add to bag</Button>
<Button variant="secondary">Save for later</Button>
<Button variant="outline">Size guide</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="destructive">Remove</Button>
<Button variant="link">See all reviews</Button>

base:        inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive
default:     bg-primary text-primary-foreground shadow-xs hover:bg-primary/90
destructive: bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20
outline:     border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground
secondary:   bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80
ghost:       hover:bg-accent hover:text-accent-foreground
link:        text-primary underline-offset-4 hover:underline
size:        default h-9 px-4 py-2 · sm h-8 px-3 · lg h-10 px-6 · icon size-9'''
INPUT_CODE = '''<!-- shadcn-vue Input and Label, published recipe -->
<Label for="email">Email</Label>
<Input id="email" type="email" placeholder="you@example.com" />

input: file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive
label: flex items-center gap-2 text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50'''
CARD_CODE = '''<!-- shadcn-vue Card, published recipe -->
<Card>
  <CardHeader>
    <CardTitle>Delivery details</CardTitle>
    <CardDescription>Where should we send your order?</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter><Button>Continue</Button></CardFooter>
</Card>

card:        bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm
header:      grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6
title:       leading-none font-semibold
description: text-muted-foreground text-sm
content:     px-6
footer:      flex items-center px-6'''

PAGES = {
 "v2-button.html": part_page("button", "Button", "Starts an action: add to bag, save, continue. Six looks, one recipe.", (1000, 760, 640),
    ["primary", "primary-foreground", "secondary", "secondary-foreground", "accent", "accent-foreground", "destructive", "background", "foreground", "border", "ring", "radius", "font-sans"],
    BUTTON_CHECKS,
    ["Use a real button element for actions and a link for going to another page. The Link look is still a button unless it navigates.",
     "Tab reaches every button. Enter and Space press it.",
     "The focus ring is a 3px halo in the ring colour at half strength, on top of the button's own edge. Never remove it.",
     "A button with only an icon needs a spoken label, for example aria-label set to Close.",
     "Disabled buttons fade to half strength and can't be pressed. Faded buttons are exempt from contrast rules, so say nearby why the action isn't available.",
     "Hover and focus change colour instantly. If motion is added later, it must stop when the shopper has asked for reduced motion."],
    ["Use one Default button per area for the main action.", "Use Outline or Ghost for the actions beside it.", "Write labels as verbs: Add to bag, Continue, Remove."],
    ["Don't put two Default buttons side by side.", "Don't use Destructive for anything that can't be undone without a confirm step.", "Don't change a button's colour by hand. Change the variable, so every brand follows."],
    BUTTON_CODE, "Hover and focus are shown here with the recipe's own hover and focus classes, so they're visible without a mouse."),
 "v2-input.html": part_page("input", "Input", "Lets a shopper type one line: an email, a postcode, a search.", (980, 820, 700),
    ["background", "foreground", "muted-foreground", "input", "ring", "destructive", "primary", "primary-foreground", "radius", "font-sans"],
    INPUT_CHECKS,
    ["Every field needs a visible label tied to it, never a placeholder alone.",
     "Tab reaches the field. The focus ring is a 3px halo in the ring colour at half strength.",
     "For an error, set aria-invalid on the field and link the message with aria-describedby, so screen readers read it.",
     "Placeholder text is a hint, not an answer. It disappears as soon as the shopper types.",
     "Disabled fields fade to half strength. Say nearby why the field is locked.",
     "The recipe has no hover change. If motion is added later, it must stop when the shopper has asked for reduced motion."],
    ["Put the label above the field.", "Use the right type, for example email or tel, so phones show the right keyboard.", "Write error messages that say how to fix it."],
    ["Don't use the placeholder as the label.", "Don't show an error before the shopper has finished typing.", "Don't make the field narrower than the answer it expects."],
    INPUT_CODE, "The recipe has no hover look. Focus is shown with the recipe's own focus classes."),
 "v2-card.html": part_page("card", "Card", "Groups related content on its own surface: a form step, a summary, a set of options.", (920, 760, 600),
    ["card", "card-foreground", "muted-foreground", "border", "background", "radius", "font-sans"],
    CARD_CHECKS,
    ["A card is a box, not a control. It has no hover or focus of its own. The buttons and links inside carry those states.",
     "If the whole card is a link, make one link inside it and stretch its click area. Don't wrap buttons inside a link.",
     "Start the card with a heading at the right level for the page, so screen reader users can jump to it.",
     "The card's edge is only 1.26 to 1 against the page. Don't rely on the edge alone to show where the card ends. Keep the spacing and the heading.",
     "Cards don't move. If motion is added later, it must stop when the shopper has asked for reduced motion."],
    ["Use a card to group one task or one summary.", "Keep one main action in the footer.", "Use the same padding on every card in a row."],
    ["Don't nest a card inside a card.", "Don't fill a card with brand colour behind small text. Brand text on a 10% brand tint fails on Soccer.com and 431 Sports.", "Don't use a card just to add a border. Use spacing instead."],
    CARD_CODE, "Cards have no states of their own. Two common layouts are shown."),
}

# ---------- estate ----------
spec = importlib.util.spec_from_file_location("nmshell", NM / "nm-shell.py")
sh = importlib.util.module_from_spec(spec); spec.loader.exec_module(sh)

def library_meta(fname):
    p = NM / fname
    if not p.exists(): return {}
    return sh.old_card_meta(p.read_text(encoding="utf-8"))

meta = {}
for f in ("blocks.html", "email.html", "pages.html"):
    meta.update(library_meta(f))

def status_of(word):
    if word == "Live": return "Live"
    if word in ("Ready", "In progress", "On hold"): return "Preview"
    return "Unknown"

def changed(path):
    try: return datetime.date.fromtimestamp(path.stat().st_mtime).strftime("%-d %b %Y")
    except FileNotFoundError: return "Unknown"

rows = []
def add(name, brand, layer, sits, word, lives, href, date):
    rows.append(dict(name=name, brand=brand or "Unknown", layer=layer, sits=sits, status=status_of(word), word=word or "Not recorded", lives=lives, href=href, date=date))

for tname, items in sh.TYPES:
    for label, href in items:
        brand, st = meta.get(href, ("", ("", "")))
        slug = href[:-5]
        folder = LIB / "blocks" / slug
        lives = "Code library, blocks folder" if folder.exists() else "Volley page only"
        add(label, brand, "Block", "Build", st[1], lives, href, changed(NM / href))
for tname, items in sh.EMAIL_TYPES:
    for label, href in items:
        x = sh.EXTRA_CARDS.get(href)
        layer = "Page" if tname == "Full email templates" else "Block"
        add(label, x[0] if x else "", layer, "Build", x[1] if x else "", "Volley, Email", href, changed(NM / href))
for tname, items in sh.PAGE_TYPES:
    for label, href in items:
        x = sh.EXTRA_CARDS.get(href)
        add(label, x[0] if x else "", "Page", "Build", x[1] if x else "", "Volley, Pages", href, changed(NM / href))

TOOLS = [
 ("Holiday 2026 Hub", "All three brands", "Record", "../holiday-hub/index.html", LIB / "holiday-hub/index.html"),
 ("Brock's email builder", "Soccer.com", "Build", "../brock-email-builder/", LIB / "brock-email-builder"),
 ("Photo sizer", "All three brands", "Build", "photo-sizer.html", NM / "photo-sizer.html"),
 ("Tunnel image viewer", "Soccer.com", "Record", "../tunnel/", LIB / "tunnel"),
 ("Nutmeg and Volley documentation site", "All three brands", "Rules", "foundations.html", NM / "foundations.html"),
]
for name, brand, sits, href, p in TOOLS:
    if p.exists():
        add(name, brand, "Tool", sits, "", "Code library", href, changed(p))

for slug, name in (("v2-button.html", "Button"), ("v2-input.html", "Input"), ("v2-card.html", "Card")):
    add(name + " (V2 part)", "All three brands", "Part", "Build", "", "Nutmeg, V2", slug, datetime.date.today().strftime("%-d %b %Y"))

for r in rows:
    if r["layer"] == "Part": r["status"] = "Preview"; r["word"] = "Placeholder values"

order = {"Part": 0, "Block": 1, "Page": 2, "Tool": 3}
rows.sort(key=lambda r: (order[r["layer"]], r["name"].lower()))
count = lambda l: sum(1 for r in rows if r["layer"] == l)
live = sum(1 for r in rows if r["status"] == "Live")

stats = '<div class="nm-stats">' + "".join('<div class="nm-stat"><span class="nm-stat__num">%d</span><span class="nm-stat__cap">%s</span></div>' % (n, esc(c)) for n, c in [
    (len(rows), "things built so far, listed once each."),
    (count("Block"), "blocks: sections that sit on a page."),
    (count("Page"), "full pages and full email templates."),
    (live, "marked Live in the library. Everything else is Preview or Unknown."),
]) + "</div>"

trs = "".join('<tr><td><a href="%s">%s</a></td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>' % (
    esc(r["href"]), esc(r["name"]), esc(r["brand"]), esc(r["layer"]), esc(r["sits"]), esc(r["status"]), esc(r["word"]), esc(r["lives"]), esc(r["date"])) for r in rows)
est_body = title_block("Everything built so far", "One list of every part, block, page and tool built with Components. Listed here, documented on its own page.")
est_body += ('<div class="nm-callout"><strong>How to read this list.</strong><p>Status is Live only where the library already says Live. '
             'Ready, In progress and On hold are shown as Preview, with the library\'s own word beside it. Where nothing is recorded, it says Unknown. '
             'Last changed is the date the page was last saved. "Where it sits" uses the seven parts: Ask, Rules, Data, Build, Check, Record, Numbers.</p></div>')
est_body += stats
est_body += h2("The list", "list", "Parts first, then blocks, pages and tools.") + '<div class="nm-table-wrap"><table class="nm-table"><thead><tr><th>Name</th><th>Brand</th><th>Layer</th><th>Where it sits</th><th>Status</th><th>Library says</th><th>Where it lives</th><th>Last changed</th></tr></thead><tbody>' + trs + "</tbody></table></div></section>"
PAGES["estate.html"] = page("Everything built so far", "One list of every part, block, page and tool built with Components.", est_body)

# ---------- hub ----------
known_fails = []
for k, name in BRANDS:
    known_fails.append(("%s: card and outline edge on the page" % name, ratio(rgb(V[k]["border"]), rgb(V[k]["background"])), 3))
    t = ratio(rgb(V[k]["brand"]), mix(rgb(V[k]["brand"]), rgb(V[k]["background"]), 0.1))
    known_fails.append(("%s: brand text on a 10%% brand tint" % name, t, 4.5))
fails = [f for f in known_fails if f[1] < f[2]]

PARTS = [
 ("Button", "v2-button.html", "Starts an action.", ["primary", "secondary", "accent", "destructive", "border", "ring"], True),
 ("Input", "v2-input.html", "Lets a shopper type one line.", ["input", "muted-foreground", "ring", "destructive"], True),
 ("Card", "v2-card.html", "Groups related content on its own surface.", ["card", "card-foreground", "muted-foreground", "border"], True),
 ("Badge", None, "A short label: Sale, New, Members.", [], False),
 ("Tabs", None, "Switches between views in one place.", [], False),
 ("Drawer", None, "A panel that slides in from the side.", [], False),
 ("Dialog", None, "A box that asks for one decision.", [], False),
]
def part_card(name, href, desc, ready):
    chip = '<span class="nm-chip nm-chip--sm nm-chip--green">Ready to review</span>' if ready else '<span class="nm-chip nm-chip--sm nm-chip--grey">Next week</span>'
    title = '<a class="nm-card__link" href="%s">%s</a>' % (href, esc(name)) if href else esc(name)
    btn = '<button type="button" class="nm-btn nm-btn--outline v2-details" data-v2-open="d-%s">Details</button>' % name.lower() if ready else ""
    return '<article class="nm-card"><h3 class="nm-card__title">%s</h3><p class="nm-card__text">%s</p><p class="nm-card__meta">%s</p>%s</article>' % (title, esc(desc), chip, btn)

def drawer(name, href, desc, vars_):
    vlist = "".join('<li><span class="nm-code">--%s</span></li>' % v for v in vars_)
    return ('<dialog class="v2-drawer" id="d-%s" aria-labelledby="d-%s-title"><div class="v2-drawer__inner"><button type="button" class="nm-btn nm-btn--text v2-drawer__close" data-v2-close>Close</button>'
            '<p class="nm-eyebrow">Part</p><h2 class="nm-h2" id="d-%s-title">%s</h2><p class="nm-prose">%s</p><h3 class="nm-h3">Main variables</h3><ul class="nm-list">%s</ul>'
            '<p class="nm-prose">Values are placeholders until the Tokens Studio set is filled.</p><a class="nm-btn" href="%s">Open the full page</a></div></dialog>'
            % (name.lower(), name.lower(), name.lower(), esc(name), esc(desc), vlist, href))

sys.path.insert(0, str(NM))
from v2_howto import howto_drawer, HOWTO_BUTTON
HOME_CARDS = [("v2-button.html", "Button", "Part"), ("v2-input.html", "Input", "Part"), ("v2-card.html", "Card", "Part"), ("estate.html", "Everything built", "Index")]
hub_body = ('<div class="v2-howto-row">' + HOWTO_BUTTON + '</div>' + '<div class="nm-whats-new-bar"><span class="nm-whats-new-bar__badge"><span class="nm-whats-new-bar__dot" aria-hidden="true">'
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 9C19.5 12.2 19.5 16.5 17 19C15.6 20.2 13.8 20.9 12 20.9C10.2 20.9 8.4 20.2 7 19C4.5 16.5 4.5 12.2 7 9L12 2.5L17 9Z"/></svg></span>What&#x27;s New</span>'
  '<span class="nm-whats-new-bar__sep" aria-hidden="true">|</span><span>Button, Input and Card ready to review, 30 October</span>'
  '<span class="nm-whats-new-bar__sep" aria-hidden="true">|</span><a class="nm-whats-new-bar__link" href="#fails">See the known contrast fails</a></div>'
  '<section class="nm-hero-banner" aria-label="V2 design system overview">'
  '<video class="nm-hero-banner__video" autoplay muted loop playsinline width="1920" height="1080" poster="patterns/Volley%20Pattern%20Muted.png" src="patterns/Volley%20Pattern%20Muted.mp4" aria-hidden="true" tabindex="-1"></video>'
  '<div class="nm-hero-banner__scrim" aria-hidden="true"></div><div class="nm-hero-banner__content"><h1 class="nm-hero-banner__title">V2 design system</h1>'
  '<p class="nm-hero-banner__sub">The parts and blocks every store page will be built from. Three brands, one set of names.</p></div></section>'
  '<div class="nm-double-rule" aria-hidden="true"></div>'
  '<section class="v2-home-nav" aria-label="Quick navigation"><div class="nm-home-grid">' + "".join(
    '<a class="nm-home-card" href="%s"><span class="nm-home-card__media"><img src="patterns/Volley%%20Pattern%%20Muted.png" width="1920" height="1080" alt=""></span>'
    '<span class="nm-home-card__foot"><span class="nm-home-card__title">%s</span><span class="nm-home-card__tag">%s</span></span></a>' % c for c in HOME_CARDS) + '</div></section>')
hub_body += PLACEHOLDER_CALLOUT
hub_body += '<div class="nm-stats">' + "".join('<div class="nm-stat"><span class="nm-stat__num">%s</span><span class="nm-stat__cap">%s</span></div>' % (n, esc(c)) for n, c in [
    ("36", "named values in the Figma file, each with a Soccer.com, WorldSoccerShop and 431 Sports version."),
    ("3", "parts documented: Button, Input and Card."),
    (str(len(fails)), "known contrast fails, shown below and on each page until they're fixed."),
]) + "</div>"
hub_body += h2("See all three brands", "brands", "The same three parts, switched by brand. Nothing is mixed between stores.") + brand_tabs("hubpanel")
for i, (k, name) in enumerate(BRANDS):
    hub_body += '<div class="nm-tabpanel" role="tabpanel" id="hubpanel-%s" aria-labelledby="tab-%s"%s><p class="nm-prose">%s: headings in %s, body in %s.</p></div>' % (k, k, "" if i == 0 else " hidden", esc(name), esc(V[k]["font-heading"]), esc(V[k]["font-sans"]))
hub_body += demo("overview", (760, 520, 420), "Button, Input and Card, live") + "</section>"
hub_body += h2("Parts", "parts", "The small pieces. Each one is a shadcn recipe reading the V2 variables.") + '<div class="nm-cards nm-cards--3">' + "".join(part_card(n, h, d, r) for n, h, d, _v, r in PARTS) + "</div></section>"
hub_body += h2("Blocks", "blocks", "Whole store sections built from parts.") + '<div class="nm-cards nm-cards--3">' + part_card("Product tile", None, "Card, Badge and Button together. Reads the live product feed, one store at a time.", False) + '<article class="nm-card"><h3 class="nm-card__title"><a class="nm-card__link" href="estate.html">Everything built so far</a></h3><p class="nm-card__text">Every block, page and tool built with Components, in one list.</p><p class="nm-card__meta"><span class="nm-chip nm-chip--sm nm-chip--green">Ready to review</span></p></article></div></section>'
fail_rows = "".join('<tr><td>%s</td><td>%s</td><td>%.2f to 1</td><td>%s</td></tr>' % (esc(l), "4.5 to 1" if n == 4.5 else "3 to 1", r, result(r, n)) for l, r, n in fails)
hub_body += h2("Known contrast fails", "fails", "Measured from the placeholder values. They get fixed before V2 is called done.") + '<div class="nm-table-wrap"><table class="nm-table"><thead><tr><th>Pair</th><th>Needs</th><th>Measured</th><th>Result</th></tr></thead><tbody>%s</tbody></table></div></section>' % fail_rows
hub_body += "".join(drawer(n, h, d, v) for n, h, d, v, r in PARTS if r)
hub_body += howto_drawer()
HUB_HEAD = '<link rel="stylesheet" href="v2/v2.css">\n'
PAGES["v2.html"] = page("V2 design system", "The parts and blocks every store page will be built from.", hub_body, HUB_HEAD)

for name, text in PAGES.items():
    (NM / name).write_text(text, encoding="utf-8")
print("written", sorted(PAGES), "rows", len(rows), "fails", [(l, round(r, 2)) for l, r, n in fails])
