# Phase 6: Design Polish - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Production-quality visual finish across all pages and components — earthy palette consistency, hero section on DirectoryPage, responsive layout on mobile, micro-animations, and a visual audit focused on DirectoryPage. No new capabilities added.

</domain>

<decisions>
## Implementation Decisions

### Hero Section

- **Background:** Solid brand color (not gradient) — pick the most fitting token from the palette (soil or terracotta)
- **Heading:** "Annuaire Zanak'i Bongolava" as the primary heading
- **Stats counters:** Three side-by-side chips — large bold number + small label below (members, domains, regions). Fetched live from the loaded member data.
- **Decorative elements:** None — text + solid background only. No illustration, pattern, or watermark.

### Mobile Layout

- **Filter panel:** Collapsible — a "Filtrer ▾" toggle button shows/hides the panel. Collapsed by default on mobile (≤ md breakpoint). Smooth height transition on open/close (~200ms ease-out).
- **Card grid:** 1 column on mobile (sm screens), existing 2-col (md) and 4-col (lg) breakpoints preserved.
- **Header:** Same fixed header on mobile, but hide the association name text on small screens — logo + "Rejoindre" button only. No hamburger menu needed.
- **InscriptionPage:** Photo zone stacks above all fields in a single column on mobile. Existing `md:grid-cols-[200px_1fr]` grid already handles this — audit and confirm it works correctly.

### Micro-animations

- **Overall tone:** Noticeable and smooth — 250–350ms durations, ease-out. Animations should feel fluid, not subtle to the point of being invisible.
- **Card entrance (after search):** Fade + slide up staggered — each card animates `opacity 0→1` and `translateY 8px→0`, with a ~50ms delay between cards. Use Tailwind `animate-` utilities or CSS custom properties for the stagger.
- **Filter panel collapse (mobile):** Smooth max-height / height transition (~200ms ease-out) when toggling open/closed.
- **Page transitions:** None — routes swap instantly. No React Router transition wrapper needed.
- **Existing hover effects (card scale, link color):** Keep as-is.

### Visual Consistency Audit

- **AvailabilityBadge:** Add back to MemberCard — show below the member name (small colored dot + short label). Must be visually identical to the badge in MemberModal.
- **Metier field in card:** Add a muted line with the job title (`m.metier`) below the member name in MemberCard, above the localisation row.
- **Focus:** DirectoryPage is the primary audit target — hero, filter panel, card grid, skeleton cards, stats.
- **Color audit:** Scan all components for raw hex values or default Tailwind colors (gray-*, blue-*, etc.) that slipped through. Replace with custom palette tokens: soil, terracotta, sand, wheat, sage, cream, ink, muted.

### Claude's Discretion

- Exact gradient direction / shade selection for the hero solid color
- Stagger delay increments for card entrance (target feel: all cards visible within ~400ms)
- Height transition implementation detail for the collapsible filter panel (max-height trick vs CSS grid rows)
- Whether to use Tailwind's `@keyframes` config or inline style for the stagger delay

</decisions>

<specifics>
## Specific Ideas

- Card entrance animation should feel like a "reveal" — grid populates progressively, not all at once
- The hero heading "Annuaire Zanak'i Bongolava" should use `font-serif` (Playfair Display), large size, contrasting color against the solid background
- AvailabilityBadge in card should not add visual noise — keep it compact, same component as in modal

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-design-polish*
*Context gathered: 2026-03-14*
