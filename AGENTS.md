# Rules for agents working in Sachawd/sei-component-library

This repository powers the public **Sports Endeavors Marketing Code Library** (`https://sachawd.github.io/sei-component-library/`).

## 1. Public repository safety (mandatory)
- **No secrets or real promo codes:** Never include real promo codes (use `XXXXX`), API keys, passwords, internal tokens, or colleague surnames in any file, comment, or commit message.
- **No deletions:** Never delete files. Prefix superseded drafts with `zz_` so they are ignored by `.gitignore`.
- **Pull requests only for background agents:** Background workers (such as Google Jules) must never push directly to `main` or deploy. Open a pull request on a branch for human review.

## 2. Five Fastr CMS paste rules for every HTML block (`blocks/**/fastr-paste.html`)
1. **Eager images only:** Never use `loading="lazy"` on any `<img>`. The first visible hero/banner image in a block carries `fetchpriority="high"`. Every `<img>` carries explicit `width` and `height` attributes.
2. **Top-window links:** Every `<a href="...">` link must carry `target="_top"` so clicks navigate the parent storefront window rather than trapping inside the Fastr iframe.
3. **Locked heights (no `aspect-ratio` or `min-height` for block sizing, no `vh`/`vw`):** Every block wrapper and its header comment must declare explicit pixel heights at desktop (`1440px`), tablet (`768px`), and mobile (`390px`) to prevent layout shift. Any deliberate exception must carry a numbered `⚠️DEVIATION` comment.
4. **Scoped styles and scripts:** Every CSS selector must be scoped under the block's unique root ID (no bare `html`, `body`, `:root`, or `*` selectors).
5. **Production-clean code (no Figma words):** No Figma node IDs, layer names, or working notes in HTML or CSS comments. Keep only the top Fastr embed height header and any numbered `⚠️DEVIATION` markers.
