# Phase 6: Design Polish - Research

**Researched:** 2026-03-14
**Domain:** Tailwind CSS v3 animations, React responsive layout, component visual consistency
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Hero Section
- **Background:** Solid brand color (not gradient) — pick the most fitting token from the palette (soil or terracotta)
- **Heading:** "Annuaire Zanak'i Bongolava" as the primary heading
- **Stats counters:** Three side-by-side chips — large bold number + small label below (members, domains, regions). Fetched live from the loaded member data.
- **Decorative elements:** None — text + solid background only. No illustration, pattern, or watermark.

#### Mobile Layout
- **Filter panel:** Collapsible — a "Filtrer ▾" toggle button shows/hides the panel. Collapsed by default on mobile (≤ md breakpoint). Smooth height transition on open/close (~200ms ease-out).
- **Card grid:** 1 column on mobile (sm screens), existing 2-col (md) and 4-col (lg) breakpoints preserved.
- **Header:** Same fixed header on mobile, but hide the association name text on small screens — logo + "Rejoindre" button only. No hamburger menu needed.
- **InscriptionPage:** Photo zone stacks above all fields in a single column on mobile. Existing `md:grid-cols-[200px_1fr]` grid already handles this — audit and confirm it works correctly.

#### Micro-animations
- **Overall tone:** Noticeable and smooth — 250–350ms durations, ease-out. Animations should feel fluid, not subtle to the point of being invisible.
- **Card entrance (after search):** Fade + slide up staggered — each card animates `opacity 0→1` and `translateY 8px→0`, with a ~50ms delay between cards. Use Tailwind `animate-` utilities or CSS custom properties for the stagger.
- **Filter panel collapse (mobile):** Smooth max-height / height transition (~200ms ease-out) when toggling open/closed.
- **Page transitions:** None — routes swap instantly. No React Router transition wrapper needed.
- **Existing hover effects (card scale, link color):** Keep as-is.

#### Visual Consistency Audit
- **AvailabilityBadge:** Add back to MemberCard — show below the member name (small colored dot + short label). Must be visually identical to the badge in MemberModal.
- **Metier field in card:** Add a muted line with the job title (`m.metier`) below the member name in MemberCard, above the localisation row.
- **Focus:** DirectoryPage is the primary audit target — hero, filter panel, card grid, skeleton cards, stats.
- **Color audit:** Scan all components for raw hex values or default Tailwind colors (gray-*, blue-*, etc.) that slipped through. Replace with custom palette tokens: soil, terracotta, sand, wheat, sage, cream, ink, muted.

### Claude's Discretion
- Exact gradient direction / shade selection for the hero solid color
- Stagger delay increments for card entrance (target feel: all cards visible within ~400ms)
- Height transition implementation detail for the collapsible filter panel (max-height trick vs CSS grid rows)
- Whether to use Tailwind's `@keyframes` config or inline style for the stagger delay

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DES-01 | Modern hero section with gradient background and animated/prominent stats | Hero restructured to full-width bg-soil band outside main container; stats always visible from member data; heading "Annuaire Zanak'i Bongolava" in font-serif |
| DES-02 | Responsive layout — cards stack on mobile, filters collapse or scroll horizontally on small screens | useState collapsible panel with max-height transition; existing grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 already correct; Header hides association text below md |
| DES-03 | Reusable AvailabilityBadge component (colored dot + label) used consistently in cards and modal | AvailabilityBadge already exists and is used in MemberModal; add to MemberCard below name with metier field |
| DES-04 | Member modal has smooth fade/scale entrance and exit animation | Already implemented via requestAnimationFrame + isVisible state; verify duration matches 250–350ms requirement |
</phase_requirements>

---

## Summary

Phase 6 is a pure visual polish phase — no new data models, no new routes, no new API calls. The codebase is in good shape: Tailwind custom palette is fully defined with all tokens (soil, terracotta, sand, wheat, sage, cream, ink, muted), the AvailabilityBadge component already exists and is used in MemberModal, and the MemberModal entrance animation is already implemented with `requestAnimationFrame`. The work is surgical additions and layout restructuring.

The four concrete changes are: (1) restructure the DirectoryPage hero into a full-width colored band with the correct heading and always-visible stats, (2) add a collapsible filter panel for mobile with a smooth height transition, (3) add AvailabilityBadge and metier field back to MemberCard, and (4) hide the association name text in Header on small screens. The MemberModal animation (DES-04) needs only a duration audit — the mechanism is correct.

The main technical decision area is the stagger animation for card entrance. The project uses CRA (react-scripts 5) with Tailwind v3. CRA does not support arbitrary Tailwind JIT config at runtime, so inline `style` for stagger delay (per-index `--delay` CSS variable) is the most reliable pattern with no new dependencies.

**Primary recommendation:** Use inline `style={{ animationDelay: `${index * 50}ms` }}` for stagger; use `max-height` transition (0 → large value) for the collapsible filter panel; restructure the hero as a full-bleed section above `<main>`.

---

## Standard Stack

### Core (already installed — no new dependencies needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | v3 (configured) | Utility classes, custom tokens, keyframes | All palette tokens already defined; extend `@keyframes` for card fade-in |
| React | 18 (CRA) | Component state for collapsible panel and card index-based delay | useState for isFilterOpen; index prop for stagger |
| ReactDOM.createPortal | built-in | Modal portal (already used in MemberModal) | Confirmed working — no change needed |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| FontAwesome (already installed) | SVG React | Filter toggle chevron icon (faChevronDown / faChevronUp) | Filter toggle button icon |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline style for stagger delay | Tailwind `@keyframes` + CSS variable class | Inline style is simpler in CRA; Tailwind JIT custom delay classes require safelist or arbitrary values which work in v3 but inline is easier to reason about |
| max-height transition for collapse | CSS grid-rows (grid-rows-[0fr] trick) | grid-rows approach is cleaner but has limited browser support in older Safari; max-height is universally supported |
| max-height transition for collapse | Framer Motion AnimatePresence | No framer-motion installed; adding it for one transition is not justified |

**Installation:**
```bash
# No new packages required — all existing
```

---

## Architecture Patterns

### Recommended Component Structure (no new files needed)

```
src/
├── components/
│   ├── AvailabilityBadge.jsx   # EXISTS — used in MemberModal, add to MemberCard
│   ├── MemberCard.jsx          # ADD: metier line + AvailabilityBadge + entrance animation
│   ├── MemberModal.jsx         # AUDIT: verify animation duration is 250-350ms
│   └── Header.jsx              # ADD: hide association text below md breakpoint
└── pages/
    └── DirectoryPage.jsx       # RESTRUCTURE: hero band + collapsible filter panel
```

### Pattern 1: Full-Width Hero Band Outside Main Container

**What:** The hero is a separate `<section>` rendered before `<main>`, spanning the full viewport width. The `<main>` is constrained to max-w-7xl with px-6.

**When to use:** When a section needs full-bleed background color that breaks out of the page content container.

**Current state:** The hero is currently inside `<main className="px-6 py-8 max-w-7xl mx-auto">` — it cannot achieve full-width without restructuring. DirectoryPage must return a fragment `<>` with hero section + main separately.

**Example:**
```jsx
// DirectoryPage.jsx — structural change
return (
  <>
    {/* Hero — full bleed, outside max-w container */}
    <section className="bg-soil text-cream pt-28 pb-10 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream">
          Annuaire Zanak'i Bongolava
        </h1>
        <p className="font-sans text-sm text-cream/70 mt-3 max-w-lg mx-auto">
          Découvrez les compétences et savoir-faire...
        </p>
        <div className="flex justify-center gap-8 mt-6">
          <StatChip value={stats.total}   label="Membres" />
          <StatChip value={stats.domains} label="Domaines" />
          <StatChip value={stats.villes}  label="Villes" />
        </div>
      </div>
    </section>

    {/* Page content — constrained */}
    <main className="px-6 py-8 max-w-7xl mx-auto">
      {/* search panel, grid... */}
    </main>
  </>
);
```

**Note on `pt-28`:** The fixed header is `h-20` (80px). Hero section needs `pt-20` minimum to not be hidden under the header. `pt-28` gives comfortable breathing room.

### Pattern 2: Stats Always Visible

**Current issue:** Stats display `'—'` when `!hasSearched`. Per the decision, stats should be fetched live from loaded member data. Since `useMemberFetch` fetches on `trigger` increment, and the hero needs stats on load, the trigger must fire on mount.

**Approach:** Set initial `trigger` state to `1` instead of `0` — this fires the fetch immediately on mount. Stats will show real values once data loads, and `deriveStats(members)` already works correctly.

```jsx
// Change:
const [trigger, setTrigger] = useState(0);
// To:
const [trigger, setTrigger] = useState(1); // fetch on mount for hero stats
```

**Consequence:** `handleSearch` currently increments trigger only when `!hasSearched`. Since trigger starts at 1 and fetch fires on mount, `handleSearch` should just `setHasSearched(true)` — members are already cached. The `setTrigger` call in `handleSearch` is no longer needed (but harmless to keep, it will re-fetch).

### Pattern 3: Collapsible Filter Panel (Mobile)

**What:** A "Filtrer ▾" button visible only on mobile (md:hidden) toggles the filter selects panel. On desktop (md+), panel is always visible.

**max-height transition pattern:**
```jsx
// In DirectoryPage
const [filterOpen, setFilterOpen] = useState(false);

// Filter panel wrapper:
<div
  className={`overflow-hidden transition-all duration-200 ease-out md:block ${
    filterOpen ? 'max-h-96' : 'max-h-0'
  } md:max-h-none`}
>
  {/* selects */}
</div>
```

**Key points:**
- `md:block` and `md:max-h-none` override the collapse on desktop — panel always visible at md+
- `max-h-96` (384px) is more than enough for 4 selects + spacing
- Toggle button uses `md:hidden` to only appear on mobile
- `overflow-hidden` is required for the transition to clip content

### Pattern 4: Card Entrance Stagger Animation

**What:** Each card fades in and slides up when the grid populates, with a per-card delay.

**Tailwind @keyframes approach (recommended):**

Add a custom keyframe + animation to `tailwind.config.js`:
```js
// tailwind.config.js
theme: {
  extend: {
    keyframes: {
      fadeSlideUp: {
        '0%':   { opacity: '0', transform: 'translateY(8px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
    },
    animation: {
      'fade-slide-up': 'fadeSlideUp 300ms ease-out both',
    },
  },
},
```

Then in MemberCard or at the grid render site:
```jsx
// Pass index to MemberCard or apply wrapper div
<div
  className="animate-fade-slide-up"
  style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
>
  <MemberCard member={m} onClick={...} />
</div>
```

**Cap the delay** at 400ms so cards beyond card 8 don't wait too long (8 × 50ms = 400ms).

**`animation-fill-mode: both`** in the keyframe `both` value keeps cards invisible before the animation starts (prevents flash). This is included in `300ms ease-out both`.

### Pattern 5: Header Association Text Hide on Mobile

**Current state (Header.jsx L11):**
```jsx
<span className="font-sans text-cream/70 text-xl mt-0.5">Association Zanak'i Bongolava</span>
```

**Fix:** Add `hidden sm:block` (or `hidden md:block` per the decision that md is the breakpoint):
```jsx
<span className="font-sans text-cream/70 text-xl mt-0.5 hidden md:block">
  Association Zanak'i Bongolava
</span>
```

The "Annuaire" text and logo remain visible on all screen sizes.

### Pattern 6: AvailabilityBadge in MemberCard

**Current state:** AvailabilityBadge is imported and used in MemberModal but NOT in MemberCard.

**Fix:** Import AvailabilityBadge in MemberCard.jsx and add after the name:
```jsx
import AvailabilityBadge from './AvailabilityBadge';

{/* In card body, after name: */}
{/* Metier */}
{m.metier && (
  <p className="font-sans text-xs text-muted leading-tight -mt-1">
    {m.metier}
  </p>
)}
{/* Availability */}
{m.disponibilite && (
  <AvailabilityBadge disponibilite={m.disponibilite} />
)}
```

**Note on mt-2 in AvailabilityBadge:** The badge has `mt-2` hardcoded in its className. This may create unexpected spacing depending on surrounding elements. The `-mt-1` on metier compensates for the gap-2 container, keeping visual density appropriate.

### Anti-Patterns to Avoid

- **Wrapping DirectoryPage return in a div instead of fragment:** A containing div breaks the full-bleed hero because the outer div inherits the page padding.
- **Triggering fetch inside hero component:** Stats derive from `useMemberFetch` in DirectoryPage — do not create a second fetch. Use `deriveStats(members)` which is already implemented.
- **Putting `md:hidden` on the filter selects container and `block` on toggle:** Instead, show panel unconditionally on md+ (`md:block`) and toggle via state only on mobile. Using `hidden md:flex` on the selects container avoids duplicating the selects.
- **Using Tailwind's `transition-max-height`:** Tailwind does not have a `transition-max-height` utility by default. Use `transition-all` which includes max-height, or add `transitionProperty: 'max-height'` to the config.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Availability color logic | Custom switch in MemberCard | Import existing `AvailabilityBadge` | Already handles all 3 states (green/orange/grey) with correct Tailwind tokens |
| Animation timing library | Framer Motion or React Spring | Tailwind @keyframes + inline style delay | No new deps; CRA 5 / Tailwind v3 handles this natively |
| Collapsible component library | Headless UI Disclosure or Radix | useState + max-height CSS | One instance, zero dependency justification |
| Drive URL transformation | Second helper in MemberCard | Already implemented `driveThumb()` in MemberCard.jsx | Exists, copy logic to modal or extract to utils if needed |

**Key insight:** All visual primitives are in place. The phase is assembly + configuration, not new builds.

---

## Common Pitfalls

### Pitfall 1: Hero Clipped by Fixed Header

**What goes wrong:** Hero section top is hidden behind the fixed `h-20` header (80px).
**Why it happens:** The header has `fixed top-0` with `z-50`. Without a top offset, the hero starts at 0 and is covered.
**How to avoid:** Hero section must have `pt-20` minimum (header height). Current `<main>` already has `py-8` which accounts for this on the first element — but when hero moves before `<main>`, it must carry its own top padding of at least `pt-20`. Use `pt-24` or `pt-28` for visual breathing room.
**Warning signs:** Heading text appears cut off at the top of the viewport.

### Pitfall 2: Stats Show '—' Instead of Real Values

**What goes wrong:** Stats still depend on `hasSearched` state, showing `'—'` on page load.
**Why it happens:** Current code: `value={!hasSearched ? '—' : stats.total}`. Decision requires stats to be always visible.
**How to avoid:** Change trigger initial value to `1` so fetch fires on mount. Remove the `!hasSearched` conditional from stats rendering. Show the count or `'...'` while loading.
**Warning signs:** Stats show dashes on initial page load before any search.

### Pitfall 3: max-height Transition Jumps (Incorrect Value)

**What goes wrong:** Filter panel snaps open/closed instead of transitioning smoothly.
**Why it happens:** `max-height: 0` → `max-height: auto` does not animate in CSS. Must specify a fixed pixel/rem value for the open state.
**How to avoid:** Use `max-h-96` (384px) as the expanded value — far more than the filter content needs, but Tailwind has this utility and it will animate smoothly.
**Warning signs:** Transition only plays on close (height → 0), not on open.

### Pitfall 4: Animation Flash Before Delay

**What goes wrong:** Cards appear at full opacity for a frame before the fade-in animation starts.
**Why it happens:** Without `animation-fill-mode: backwards` or `both`, the element renders at its natural state (opacity: 1) before the animation begins.
**How to avoid:** Include `both` in the animation shorthand: `'fade-slide-up': 'fadeSlideUp 300ms ease-out both'`. The `both` value applies `forwards` and `backwards` fill mode.
**Warning signs:** Cards flash briefly at full opacity before disappearing and fading in again.

### Pitfall 5: AvailabilityBadge mt-2 Double-Spacing

**What goes wrong:** The badge has `mt-2` hardcoded in its own className, but the card body uses `flex flex-col gap-2`. This creates 4× extra spacing (gap-2 + mt-2) above and below the badge.
**Why it happens:** The `mt-2` in AvailabilityBadge was appropriate in modal context but conflicts with flex gap in card context.
**How to avoid:** Either remove `mt-2` from AvailabilityBadge (it should not have margin baked in — it's a leaf component), or wrap it in a `<div className="-mt-1">` in MemberCard to compensate. Prefer removing `mt-2` from the badge definition — the caller controls spacing.
**Warning signs:** Excessive gap between the name and the badge in the card, vs. a tight layout in the modal.

### Pitfall 6: Color Audit Miss — Emoji Usage

**What goes wrong:** DirectoryPage uses emoji in option labels (🗂, 📍, 🟢, 💼) and in EmptyPrompt/NoResults (🔎, 😕). These are not design tokens and may render inconsistently cross-platform.
**Why it happens:** Convenience shorthand from initial implementation.
**How to avoid:** Replace option-label emojis with FontAwesome icons or plain text. EmptyPrompt/NoResults emoji are acceptable as decorative elements (no requirement to replace), but should be audited per the color audit scope.
**Warning signs:** Inconsistent emoji rendering on Windows vs macOS vs Android.

---

## Code Examples

### Hero section structure
```jsx
// Source: analysis of current DirectoryPage.jsx + CONTEXT.md decisions
// DirectoryPage.jsx — replace current <main> single-root with fragment
return (
  <>
    <section className="bg-soil text-cream pt-24 pb-10 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream leading-tight">
          Annuaire Zanak'i Bongolava
        </h1>
        <p className="font-sans text-sm text-cream/70 mt-3 max-w-lg mx-auto">
          Découvrez les compétences et savoir-faire de vos voisins.
        </p>
        <div className="flex justify-center gap-8 sm:gap-12 mt-6">
          <StatChip value={loading ? '…' : stats.total}   label="Membres" />
          <StatChip value={loading ? '…' : stats.domains} label="Domaines" />
          <StatChip value={loading ? '…' : stats.villes}  label="Villes" />
        </div>
      </div>
    </section>
    <main className="px-6 py-8 max-w-7xl mx-auto">
      {/* search panel, grid */}
    </main>
  </>
);
```

### StatChip component (replaces StatInline)
```jsx
// Revised for cream-on-soil contrast
function StatChip({ value, label }) {
  return (
    <div className="text-center">
      <p className="font-serif text-3xl sm:text-4xl font-bold text-cream">{value}</p>
      <p className="font-sans text-xs text-cream/60 mt-0.5 uppercase tracking-wide">{label}</p>
    </div>
  );
}
```

### Collapsible filter panel (mobile)
```jsx
// DirectoryPage.jsx — add to state declarations
const [filterOpen, setFilterOpen] = useState(false);

// Toggle button — mobile only
<button
  className="md:hidden flex items-center gap-2 font-sans text-sm text-ink border border-sand rounded-lg px-4 py-2 w-full justify-between"
  onClick={() => setFilterOpen(o => !o)}
>
  <span>Filtrer</span>
  <FontAwesomeIcon icon={filterOpen ? faChevronUp : faChevronDown} className="text-muted text-xs" />
</button>

{/* Filter selects wrapper */}
<div
  className={`overflow-hidden transition-all duration-200 ease-out md:overflow-visible ${
    filterOpen ? 'max-h-96' : 'max-h-0'
  } md:max-h-none`}
>
  <div className="flex flex-wrap gap-2 mt-3">
    {/* existing selects */}
  </div>
</div>
```

### Card entrance animation — tailwind.config.js addition
```js
// tailwind.config.js — add to theme.extend
keyframes: {
  fadeSlideUp: {
    '0%':   { opacity: '0', transform: 'translateY(8px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
},
animation: {
  'fade-slide-up': 'fadeSlideUp 300ms ease-out both',
},
```

### Card entrance animation — render site
```jsx
// DirectoryPage.jsx — grid render
filteredResults.map((m, index) => (
  <div
    key={m.email || m.nom}
    className="animate-fade-slide-up"
    style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
  >
    <MemberCard member={m} onClick={() => setSelectedMember(m)} />
  </div>
))
```

### Header association text hide
```jsx
// Header.jsx — line 11 — add hidden md:block
<span className="font-sans text-cream/70 text-xl mt-0.5 hidden md:block">
  Association Zanak'i Bongolava
</span>
```

### MemberModal animation duration audit
```jsx
// MemberModal.jsx L59 + L64 — VERIFY these match 250-350ms
// Current: 'transition-opacity duration-200 ease-out'  → 200ms — BELOW target
// Current: 'transition-all duration-200 ease-out'      → 200ms — BELOW target
// Fix: change duration-200 to duration-300 on both elements
className={`... transition-opacity duration-300 ease-out ...`}
className={`... transition-all duration-300 ease-out ...`}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Framer Motion for enter animations | CSS @keyframes + Tailwind config | Tailwind v3 JIT (2021) | No external dep for simple animations |
| JS height calculation for collapsible | max-height CSS transition | CSS spec support ~2015, widely used | Pure CSS, no ResizeObserver needed |
| Separate animation component | inline style animationDelay | React render context (always valid) | Simpler; no wrapper component needed |

**Deprecated/outdated:**
- `transition-max-height` utility: Not a native Tailwind utility; `transition-all` covers max-height changes.
- `animation-fill-mode` as separate property: Include as part of animation shorthand (`300ms ease-out both`) for conciseness.

---

## Open Questions

1. **Hero color — soil vs terracotta**
   - What we know: CONTEXT.md says "most fitting token from soil or terracotta". Soil (#2C1A0E) is very dark brown; terracotta (#C1440E) is a warm orange-red. Either reads as "brand earthy".
   - What's unclear: Which reads better at full viewport width with cream text. Soil is more sophisticated; terracotta is more energetic.
   - Recommendation: Use `bg-soil` — it's the deepest earthy token and reads as more premium. Terracotta is accent color used for CTA buttons; using it as hero background may conflict with the "Rejoindre" button in the header.

2. **Stats fetch timing — initial load vs search trigger**
   - What we know: Stats are derived from `members` array. `useMemberFetch` fires when `trigger > 0`. Current `trigger` starts at `0`.
   - What's unclear: Whether changing `trigger` initial value to `1` has side effects in `handleSearch`.
   - Recommendation: Change `trigger` initial to `1`. In `handleSearch`, remove the `setTrigger(t => t + 1)` call — just `setHasSearched(true)`. Members are cached after mount fetch; results will populate via useMemo immediately.

3. **AvailabilityBadge mt-2 — modify or wrap**
   - What we know: The badge has `mt-2` hardcoded. In card `flex gap-2` context this doubles spacing.
   - Recommendation: Remove `mt-2` from AvailabilityBadge's own className — it is a leaf component and should not impose its own margin. This is the cleaner fix. Verify the modal rendering still looks correct after removing it (the modal uses `mt-3` on the wrapping `<div>` already).

---

## Sources

### Primary (HIGH confidence)
- Direct code inspection: `annuaire-zb-react/src/components/MemberCard.jsx` — current card structure, missing badge
- Direct code inspection: `annuaire-zb-react/src/components/MemberModal.jsx` — animation implementation, duration-200 confirmed
- Direct code inspection: `annuaire-zb-react/src/components/AvailabilityBadge.jsx` — badge exists, mt-2 issue identified
- Direct code inspection: `annuaire-zb-react/src/components/Header.jsx` — association text always shown
- Direct code inspection: `annuaire-zb-react/src/pages/DirectoryPage.jsx` — hero inside main, stats conditional, no collapsible panel
- Direct code inspection: `annuaire-zb-react/tailwind.config.js` — custom tokens confirmed, no keyframes defined yet
- `.planning/phases/06-design-polish/06-CONTEXT.md` — locked decisions, discretion areas

### Secondary (MEDIUM confidence)
- Tailwind CSS v3 docs — `animation` and `keyframes` config in `theme.extend` (standard pattern, well-documented)
- Tailwind CSS v3 docs — `transition-all` covers max-height transitions; `max-h-{size}` utilities available

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all required libraries already installed; no new deps
- Architecture: HIGH — based on direct code audit of actual files
- Pitfalls: HIGH — identified from actual current code state (duration-200, missing badge, stats conditional)
- Animation pattern: MEDIUM — Tailwind @keyframes in config is standard but not verified against Context7 in this session

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (stable stack — Tailwind v3, CRA, React 18)
