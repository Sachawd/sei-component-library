# Design team code blocks: library plan

Ready-to-paste Fastr CMS blocks for WorldSoccerShop, Soccer.com and 431 Sports. Live, reviewed blocks only.

Agreed with Sacha, 16 Oct 2026. Modelled on the structure of REI's Cedar design system site (cedar.rei.com). We copy how it is organised, never its branding: the look is Cabana.

## Rules for this repo

- Public. A block goes in only after it is live on the site and has passed UX review.
- Nothing unreleased: no embargoed packs, no promo codes before launch.
- No passwords, keys or tokens, ever. A block that needs a key keeps it on a server.
- Production-clean files only. One folder per block, named by its plain title.
- Brands never mix. Each block page shows which brand it is for.

## Site menu

- About
- Guidelines
- Components, A to Z
- Contributing
- What's new

## Every block page, in this order

1. Name, one-line description, View on GitHub link
2. Live demo (the real CMS version, real photos)
3. How it's built, in plain words: which parts are photos, which are real text, what moves and how. Added 16 Oct 2026 after a designer made a GIF for a hero that is really a photo with live animated text.
4. When to use it, and when not to
5. What you change: photos, links, words
6. Images: size, format and weight for every photo slot, per screen size
7. Fastr heights: the three reserved heights (390 / 640 / 1024)
8. Accessibility: what the block already handles, what the builder still checks
9. The code, with a copy button
10. Contact

## Image rule for every block

Every photo slot is listed with its exact pixel size for phone and for desktop, the file type (JPG for photos, PNG for logos, never WebP) and the weight target (under 200 KB a photo). Photos must be on the image host before a block goes live, never on the preview site.
