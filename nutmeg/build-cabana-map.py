#!/usr/bin/env python3
"""Writes cabana-map.html: every Cabana 8 component and the V2 piece it becomes.

Source: the Cabana 8 - SEI Figma file, base and DX component pages, read 30 Oct 2026.
V2 names are shadcn's own, as agreed with Neil. Edit ROWS, then run:
python3 build-cabana-map.py && python3 nm-shell.py
"""
import html
import pathlib

NM = pathlib.Path(__file__).resolve().parent
esc = html.escape

# (Cabana 8 page, Cabana 8 component, V2 name, layer, status, what changes for developers)
ROWS = [
 ("Buttons and Links", "Button/Primary", "Button", "Part", "Documented", "Same job. Default Button, reads primary."),
 ("Buttons and Links", "Button/Secondary", "Button", "Part", "Documented", "One Button with variant secondary. No separate component."),
 ("Buttons and Links", "Button/White", "Button", "Part", "Documented", "Button variant outline. Proposed, check with Neil."),
 ("Buttons and Links", "Button/Text", "Button", "Part", "Documented", "Button variant ghost."),
 ("Buttons and Links", "Button/Action", "Button", "Part", "Documented", "Add-to-cart buttons read the cart colour. Proposed, check with Neil."),
 ("Buttons and Links", "Button/Special", "Button", "Part", "Documented", "Brand-coloured Button. Needs a brand variant from Neil."),
 ("Buttons and Links", "Icon Button", "Button", "Part", "Documented", "Button size icon, with an aria-label."),
 ("Buttons and Links", "Text Link/Primary, Text Link/Secondary", "Button", "Part", "Documented", "Button variant link. Two Cabana links become one."),
 ("Buttons and Links", "Social Login Button", "Button", "Part", "Later", "Button variant outline with a logo."),
 ("Buttons and Links", "Mobile App Store Button", "App store badge", "Block", "Later", "Not a shadcn part. Uses the official store badges."),
 ("Buttons and Links", "Input Counter Buttons", "Quantity stepper", "Part", "Later", "Not in shadcn's core set. Built from Button and Input."),
 ("Button Groups", "Button Group", "Toggle Group", "Part", "Later", "Same job, new name."),
 ("Chips (new)", "Chip / Base", "Badge", "Part", "Next week", "Same job, new name."),
 ("Chips (new)", "Chip/Size", "Toggle Group", "Part", "Later", "Size pickers are a Toggle Group, not a Badge, because they can be selected."),
 ("Chips (new)", "Chip/color", "Colour swatch", "Block", "Later", "Not a shadcn part. Lives inside Product tile."),
 ("Chips (new)", "Chip/Stock", "Badge", "Part", "Next week", "Badge reading success or warning."),
 ("Chips (new)", "Chip/Product Tile", "Badge", "Part", "Next week", "Badge, placed by Product tile."),
 ("Chips (new)", "Chip/Loyalty", "Badge", "Part", "Next week", "Badge reading loyalty."),
 ("Chips (new)", "Chip/PP-Uniform", "Badge", "Part", "Next week", "Badge, placed by the PlayerPass tiles."),
 ("Calendars", "Calendar Full, Split, Years, Months, Days", "Calendar", "Part", "Later", "One Calendar with options instead of five components."),
 ("Elements", "Scrollbar", "Scroll Area", "Part", "Later", "Same job, new name."),
 ("Elements", "Status Indicator, Dot", "Badge", "Part", "Next week", "A small Badge with a dot. Proposed."),
 ("Elements", "Tooltip", "Tooltip", "Part", "Later", "Same name."),
 ("Elements", "Ratings Bar", "Rating", "Block", "Later", "Not a shadcn part. Lives inside Product tile and reviews."),
 ("Elements", "Tag, Tag/Label", "Badge", "Part", "Next week", "Tag and Label become Badge."),
 ("Elements", "Avatar", "Avatar", "Part", "Later", "Same name."),
 ("Elements", "Branding logos", "Brand assets", "Not a component", "Later", "Logo files, not a coded part."),
 ("Elements", "Divider / Vertical, Divider / Horizontal", "Separator", "Part", "Later", "One Separator with an orientation option."),
 ("Elements", "Resizer", "Resizable", "Part", "Later", "Same job, new name."),
 ("Content", "Accordion / Panel, Accordion / Header", "Accordion", "Part", "Later", "One Accordion instead of two pieces."),
 ("Content", "Content Block", "Card", "Part", "Documented", "Same job, new name."),
 ("Content", "Comment", "Card", "Part", "Documented", "A Card with an Avatar. Proposed."),
 ("Content", "Placeholder", "Skeleton", "Part", "Later", "Same job, new name."),
 ("Content", "List, List Items", "List", "Block", "Later", "Not a shadcn part. Plain list markup with V2 colours."),
 ("Content", "Map", "Map", "Block", "Later", "Not a shadcn part. Store finder only."),
 ("Forms", "Input Field", "Input", "Part", "Documented", "Same job, new name."),
 ("Forms", "Textarea", "Textarea", "Part", "Later", "Same name."),
 ("Forms", "Select Field, Select Menu, Select Menu Item", "Select", "Part", "Later", "One Select instead of three pieces."),
 ("Forms", "Checkbox", "Checkbox", "Part", "Later", "Same name."),
 ("Forms", "Radio Button", "Radio Group", "Part", "Later", "Radios always come as a group."),
 ("Forms", "Toggle", "Switch", "Part", "Later", "Same job, new name. shadcn's Toggle is a different thing, a pressable button."),
 ("Forms", "number input, input - add remove items", "Quantity stepper", "Part", "Later", "Not in shadcn's core set. Built from Button and Input."),
 ("Forms", "Alert", "Alert", "Part", "Later", "Same name."),
 ("Forms", "Drop Area", "File drop", "Block", "Later", "Not a shadcn part."),
 ("Forms", "Log In Form #01 to #04", "Login form", "Block", "Later", "Four Cabana forms become one block built from Input, Button and Card."),
 ("Table (new)", "Table", "Table", "Part", "Later", "Same name."),
 ("Navigation", "Tab Navigation, Tab Bar", "Tabs", "Part", "Next week", "Same job, new name."),
 ("Navigation", "Pill Bar", "Toggle Group", "Part", "Later", "Same job, new name."),
 ("Navigation", "Pagination Numbers, Buttons", "Pagination", "Part", "Later", "One Pagination instead of many sizes."),
 ("Navigation", "Pagination Dots, Indicators, Squares, Carousel Icons", "Carousel", "Part", "Later", "Slide dots and arrows belong to Carousel."),
 ("Navigation", "Menu Bar", "Navigation Menu", "Part", "Later", "Same job, new name."),
 ("Navigation", "Dropdown Menu", "Dropdown Menu", "Part", "Later", "Same name."),
 ("Navigation", "Breadcrumb Bar", "Breadcrumb", "Part", "Later", "Same job, new name."),
 ("Overlays", "Modal (all ten)", "Dialog", "Part", "Next week", "Ten Cabana modals become one Dialog. The layouts inside are blocks."),
 ("Overlays", "Notification Badge", "Badge", "Part", "Next week", "Same job, new name."),
 ("Overlays", "Notification Bar", "Alert", "Part", "Later", "Proposed. A pop-up message would be Sonner, check with Neil."),
 ("Sliders + Bars", "Seek Bar, Range Slider", "Slider", "Part", "Later", "One Slider instead of two."),
 ("Sliders + Bars", "Progress Bar", "Progress", "Part", "Later", "Same job, new name."),
 ("Side Draw (new)", "Side Draw", "Drawer", "Part", "Next week", "In shadcn a side panel is called Sheet, and Drawer slides up from the bottom. Which one Neil means is open."),
 ("Pop Ups", "Pop Up / Help Bubble", "Popover", "Part", "Later", "Same job, new name."),
 ("Pop Ups", "Pop Up / Overlay Modal", "Dialog", "Part", "Next week", "Same as the Cabana modals."),
 ("Pop Ups", "Pop Up / Slide Note", "Drawer", "Part", "Next week", "Proposed."),
 ("Product Tiles (new)", "Product Tile/Consumer", "Product tile", "Block", "Next week", "Built from Card, Badge and Button. Reads the product feed, one store at a time."),
 ("Product Tiles (new)", "Product Tile/PlayerPass Uniform, Fanwear, Recommended, X-Sell", "Product tile", "Block", "Later", "Same block with PlayerPass options, not four separate tiles."),
 ("Product Tiles (new)", "icon button/favorites", "Button", "Part", "Documented", "Button size icon."),
 ("Product Carousel", "carousel", "Product carousel", "Block", "Later", "Built from Carousel and Product tile."),
 ("Cart (new)", "Product Item", "Cart item", "Block", "Later", "Built from Card, Button and Quantity stepper."),
 ("HCL - Free Gift with Purchase", "Cart Item, Free Gift, Free Gift Modal", "Free gift", "Block", "Later", "Built from Card, Badge and Dialog or Drawer."),
 ("Customization Components", "view tabs, navigation, designs, Button/Customization", "Customizer", "Block", "Later", "Built from Tabs, Toggle Group and Button."),
 ("Goal Club", "Goal Club Sticker", "Goal Club sticker", "Block", "Later", "A campaign piece, not a store part."),
 ("Page Titles (new)", "DX/Text/Titles, DX/Hero Divider", "Page title", "Block", "Later", "A block on the page, uses the V2 heading font."),
 ("Reflektion (new)", "Reflektion Tile, Reflektion/Quicklinks", "Search result tile, Quick links", "Block", "Later", "Search pieces. Same parts as Product tile."),
 ("DX - Authorable Widgets", "DX/Hero, Redo/Hero", "Hero", "Block", "Later", "A Fastr block. Two Cabana heroes become one."),
 ("DX - Authorable Widgets", "DX/Ups/Small, Large, Large Story, Redo/Ups", "Promo tiles", "Block", "Later", "A Fastr block."),
 ("DX - Authorable Widgets", "Redo/Mosaic Tile, Redo/Featured Tile Set", "Feature grid", "Block", "Later", "A Fastr block."),
 ("DX - Authorable Widgets", "Redo/Inline Text, Redo/Hotspot", "Text block, Hotspot image", "Block", "Later", "Fastr blocks."),
 ("DX - Authorable Widgets", "DX/Space Divider, accent line", "Separator", "Part", "Later", "Spacing comes from the layout, not a divider component."),
 ("PLP Widgets", "PLP Category Carousel Items", "Category carousel", "Block", "Later", "Built from Carousel and Card."),
 ("PLP Widgets", "PLP Header & Footer", "Category header", "Block", "Later", "A block on the listing page."),
 ("PLP Widgets", "DX/Custom Navigation Links", "Quick links", "Block", "Later", "Built from Button variant outline."),
]
DOC = {"Button": "v2-button.html", "Input": "v2-input.html", "Card": "v2-card.html"}
CHIP = {"Documented": "green", "Next week": "purple", "Later": "grey"}

def v2cell(name):
    return '<a href="%s">%s</a>' % (DOC[name], esc(name)) if name in DOC else esc(name)

rows, last = [], None
for p_, c, v, l, s_, n in ROWS:
    if p_ != last:
        rows.append('<tr class="cm-group"><th colspan="5" scope="colgroup">%s</th></tr>' % esc(p_))
        last = p_
    rows.append('<tr><td>%s</td><td><strong>%s</strong></td><td>%s</td><td><span class="nm-chip nm-chip--sm nm-chip--%s">%s</span></td><td>%s</td></tr>'
                % (esc(c), v2cell(v), esc(l), CHIP[s_], esc(s_), esc(n)))
rows = "".join(rows)
v2_names = sorted({r[2] for r in ROWS})
n_parts = len({r[2] for r in ROWS if r[3] == "Part"})
n_blocks = len({r[2] for r in ROWS if r[3] == "Block"})
stats = [(len(ROWS), "Cabana 8 components and groups, read from the Figma file on 30 Oct 2026."),
         (n_parts, "V2 parts they become. Many Cabana pieces merge into one part."),
         (n_blocks, "V2 blocks: store sections built from those parts.")]

body = ('<div class="nm-title"><p class="nm-eyebrow">V2 design system</p><h1>Cabana 8 to V2</h1>'
        '<p class="nm-lede">Every Cabana 8 component and the V2 piece it becomes, so developers know what changed and what stays.</p><hr class="nm-divider"></div>'
        '<div class="nm-callout"><strong>How to read this map.</strong><p>Cabana 8 is V1. V2 uses shadcn\'s own names, as agreed with Neil. '
        'Rows marked "Proposed" or "check with Neil" are Components\' best match, not decided. Nothing in Cabana 8 is copied into V2. Each part is rebuilt on the V2 colours when its turn comes.</p></div>'
        '<div class="nm-stats">' + "".join('<div class="nm-stat"><span class="nm-stat__num">%s</span><span class="nm-stat__cap">%s</span></div>' % (n, esc(c)) for n, c in stats) + '</div>'
        '<section class="nm-section" id="map"><div class="nm-section__head"><h2 class="nm-h2">The map</h2>'
        '<p class="nm-section__desc">In Cabana 8\'s own page order. Documented means a V2 page exists now.</p></div>'
        '<div class="nm-table-wrap"><table class="nm-table"><thead><tr><th>Cabana 8 component</th><th>V2 name</th><th>Layer</th><th>Status</th><th>What changes for developers</th></tr></thead>'
        '<tbody>%s</tbody></table></div></section>'
        '<section class="nm-section" id="rules"><div class="nm-section__head"><h2 class="nm-h2">Three rules for developers</h2></div><ul class="nm-list">'
        '<li>Use the V2 name in code. The Cabana name is only for finding the old design.</li>'
        '<li>One part, many looks. Cabana\'s separate components become options (variant, size) on one part.</li>'
        '<li>Never hard-code a colour. Every part reads the V2 variables, so the three brands switch on their own.</li></ul></section>') % rows

shell = (NM / "estate.html").read_text(encoding="utf-8")
start = shell.index('<div class="nm-panel"><div class="nm-content">') + len('<div class="nm-panel"><div class="nm-content">')
end = shell.index('<footer class="nm-footer">')
out = shell[:start] + "\n" + body + "\n" + shell[end:]
out = out.replace("<title>Everything built so far · Nutmeg</title>", "<title>Cabana 8 to V2 · Nutmeg</title>")
import re
out = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="Every Cabana 8 component and the V2 piece it becomes.">', out, count=1)
if "v2/v2.css" not in out:
    out = out.replace("</head>", '<link rel="stylesheet" href="v2/v2.css">\n</head>', 1)
(NM / "cabana-map.html").write_text(out, encoding="utf-8")
print("rows", len(ROWS), "parts", n_parts, "blocks", n_blocks)
