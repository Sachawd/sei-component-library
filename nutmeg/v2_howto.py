HOWTO_TEAM = [
 "Every store brand has two connected layers: a locked Vue storefront base (SE V2) for everyday shopping, and a flexible CMS campaign layer (Volley) on top for launches and holidays.",
 "Layer 1, the Vue storefront base (SE V2): our everyday uniform across Soccer.com, WorldSoccerShop and 431 Sports, with Soccer Master later. It runs menus, checkout and standard product cards, so the store stays consistent all year.",
 "Layer 2, the CMS campaign layer (Volley): where Creative builds holiday gift guides, boot drops and matchday stories in Fastr CMS. It inherits the spacing and card bones from the Vue base so it feels like one store, and unlocks campaign fonts, headers, themed buttons and bento layouts without waiting on an engineering sprint.",
 "How Block Studio works: type a brief in plain words, load real in-stock products from the daily feed, check accessibility and links automatically, then export clean Fastr HTML or a Vue 3 recipe, all on one screen.",
]
HOWTO_ENG = [
 "Your variable names, not ours: the V2 hub and the Figma file use your shadcn names in all three brand modes. 36 of the 42 are in Figma now; the five chart colours stay unset until a chart ships. The Cabana 8 to V2 page maps every old Cabana part to its V2 replacement.",
 "Strict Vue baseline first: by default Block Studio runs your exact V2 values from the V2 pages, and flags where they fail contrast: the border at 1.26 to 1, and brand text on its 10% tint at 4.08 to 1 on Soccer.com and 4.09 to 1 on 431 Sports.",
 "Why the CMS campaign switch exists: turning on CMS Campaign Override (Volley) shows how Creative can fix a border or apply a campaign palette in a Fastr CMS block and ship it at 9 out of 9 today, without touching or blocking the core Vue storefront.",
 "Clean handoff: every approved block exports scoped Fastr HTML for today's CMS pages, plus a Vue 3 and shadcn-vue recipe that imports from @/components/ui.",
]
import html as _h
def howto_drawer():
    li = lambda xs: "".join("<li>%s</li>" % _h.escape(x) for x in xs)
    return ('<dialog class="v2-drawer" id="d-howto" aria-labelledby="d-howto-title"><div class="v2-drawer__inner">'
            '<button type="button" class="nm-btn nm-btn--text v2-drawer__close" data-v2-close>Close</button>'
            '<p class="nm-eyebrow">How this works</p><h2 class="nm-h2" id="d-howto-title">One foundation, two layers</h2>'
            '<section class="v2-howto__section" aria-labelledby="d-howto-team"><p class="nm-eyebrow">1. For the team</p>'
            '<h3 class="nm-h3" id="d-howto-team">One foundation, two layers per brand</h3><ul class="nm-list">' + li(HOWTO_TEAM) + '</ul></section>'
            '<section class="v2-howto__section" aria-labelledby="d-howto-eng"><p class="nm-eyebrow">2. For Neil and Engineering</p>'
            '<h3 class="nm-h3" id="d-howto-eng">How SE V2 and the CMS layer fit your 42 tokens</h3><ul class="nm-list">' + li(HOWTO_ENG) + '</ul></section>'
            '</div></dialog>')
HOWTO_BUTTON = '<button type="button" class="nm-btn nm-btn--outline v2-howto-btn" data-v2-open="d-howto" aria-controls="d-howto" aria-expanded="false">How this works</button>'
