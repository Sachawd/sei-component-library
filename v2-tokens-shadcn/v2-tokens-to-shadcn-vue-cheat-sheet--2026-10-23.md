# V2 Tokens to shadcn-vue (Reka UI) Architecture & Mapping (23 Oct 2026)

**Scope:** Design System V2 & Vue 3 Component Library Alignment
**Sources:** WEB-16658 (9 Sept 2026), V2 Role Vocabulary & 3-Brand Lab Mapping (14 Sept 2026), Cabana vs. Campaign Tokens (17 Oct 2026).

---

## 1. Executive Summary

Once Frontend reaches Vue 3, pairing **shadcn-vue** (built on **Reka UI** headless accessibility primitives) with our **68-role V2 token set** gives Soccer.com, WorldSoccerShop, and 431 Sports accessible components out of the box without building twice.

- **The V1 Lesson:** In V1, timeline constraints kept the build on Node 16 instead of modern Node LTS tooling, and Player Pass launched on an early V1 baseline requiring custom patches across design and logic. Sequencing the foundation first prevents repeating that maintenance burden in V2.
- **Why Sequence with Vue 3:** Vue 3 unlocks shadcn-vue and Reka UI (keyboard navigation, focus traps, ARIA roles built in). Sequencing PDP, Cart, and Checkout behind Vue 3 lets Engineering and Design build once on modern primitives.
- **Direct V2 Token Fit:** Our Sept 9 V2 proposal (WEB-16658) already sits on a Tailwind base layer with explicit fill and on-colour pairs that map 1-to-1 into a shadcn-vue editable preset per brand.

---

## 2. Core Preset Mapping (shadcn-vue Create Preset to V2 Lab Roles)

Every standard variable in a `shadcn-vue.com/create` preset has a direct home in the Sept 14 V2 Lab set. Values below are resolved hex codes from `004_Design-System/proposals/v2-lab/MAPPING--v1-to-v2--2026-09-14.md`:

| shadcn-vue Variable | Our V2 Semantic Role | Soccer.com | WorldSoccerShop | 431 Sports | Usage Rule |
|---|---|---|---|---|---|
| `--background` | `surface.page` | #ffffff | #ffffff | #ffffff | Default page background |
| `--foreground` | `text.default` | #27272a | #27272a | #042540 | Primary body copy |
| `--card` / `--popover` | `surface.default` | #ffffff | #ffffff | #ffffff | Cards, drawers, modals, popovers |
| `--primary` | `action.primary.default` | #27272a | #27272a | #317f89 | Primary action buttons |
| `--primary-foreground` | `text.on-primary` | #ffffff | #ffffff | #ffffff | Label on primary action button |
| `--secondary` / `--muted` | `surface.sunken` | #f5f5f5 | #f5f5f5 | #f5f5f5 | Quiet wells, filter bars, secondary fills |
| `--muted-foreground` | `text.muted` | #525252 | #525252 | #525252 | One quiet grey for helper and meta copy |
| `--accent` | `surface.brand` | #e0154a | #796a39 | #317f89 | Store brand accent surface |
| `--destructive` | `tone.error.bg` / `text` | #ef4444 / #991b1b | #ef4444 / #991b1b | #ef4444 / #991b1b | Error states and destructive actions |
| `--border` | `border.subtle` | #e5e5e5 | #e5e5e5 | #e5e5e5 | Default card and section dividers |
| `--input` | `input.border.default` | #525252 | #525252 | #525252 | Form input border at rest (AA 3:1 pass) |
| `--ring` | `border.action.focus` | #1f2937 | #1f2937 | #317f89 | Keyboard focus ring across Reka UI primitives |

---

## 3. Commerce & Multi-Brand Extensions (Registered in Tailwind `@theme`)

1. **Commerce Actions & Badges:**
   - **Add to Cart:** `action.cart.default` (#0348CF) and `action.cart.hover` (#0341ba) stay distinct from general primary buttons.
   - **Sale Pricing:** `sale.bg` and `sale.text` (#9d0f34) plus proposed `text.on-sale` pair.
   - **Goal Club Loyalty:** `loyalty.bg` (#f0eee7), `loyalty.text` (#837139), and `loyalty.icon`.
   - **Inventory Pills:** `stock.in` (#ecfccb), `stock.backorder` (#fef3c7), and `stock.out` (#fce8ed).
2. **Fluid Typography & Elevation:**
   - **Store Fonts:** Figtree on Soccer.com, Chakra Petch + Inter on WorldSoccerShop, Roboto Condensed on 431 Sports.
   - **Fluid Scale:** 6 semantic type roles using CSS `clamp()` so headings scale smoothly without breakpoint jumps.
   - **Elevation:** Cut from 14 unused template shadows down to 4 named steps: `raised`, `lifted`, `overlay`, and `pop`.
3. **Shared Motion & Campaign Layer:**
   - **One Shared Motion Set:** 9 semantic intents (`press`, `hover`, `focus`, `reveal`, `dismiss`, `story`) with reduced-motion handled at the token level once.
   - **Campaign Layer Stays Separate:** Seasonal Fastr blocks use the 5-role `--campaign-*` block (`surface`, `primary`, `on-primary`, `headline`, `body`) so short-lived sales never pollute Cabana.

---

## 4. Remaining V2 Token Scope (32 Hours — Sequenced with Vue 3)

- **Fix 2 Contrast Failures (6h):** White on `sale.bg` measures 3.76:1 on WorldSoccerShop and 2.80:1 on 431 (below AA). Goal Club chip measures 4.12:1 across all three brands. Add `text.on-sale` and darken badge fills.
- **Close 7 Unmapped V1 Holes (6h):** Decide whether `bg.Loyalty-Dark`, `bg.surface.scrollbar`, and `bg.surface.progress` become component tokens or retire.
- **Lock Motion & Stress Test (12h):** Finalize the 9 motion intent CSS strings and stress-test the shadcn-vue preset on 1 PDP, 1 Player Pass view, and 1 marketing block.
- **Vendor Token Handoff Guide (8h):** Document final token governance once Vue 3 preset naming is locked.

## 5. Open Architecture Decision

When creating the editable preset at `shadcn-vue.com/create`, decide whether Supernova emits shadcn's CSS variable names (`--primary`, `--muted-foreground`) directly or aliases them to our `--v2-*` role names.
