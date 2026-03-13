# Phase 2: Layout Shell - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

A persistent navigation header with the ZB logo and a "Rejoindre" CTA button that sits above both route stubs (`/` and `/inscription`). The header must be sticky, always visible on scroll, and navigable via React Router (no full page reload). Page-specific content inside the stubs is out of scope.

</domain>

<decisions>
## Implementation Decisions

### Header visual style
- Background: `bg-soil` (#2C1A0E) — dark brown, strong brand presence
- Height: `h-14` (56px) — compact, leaves maximum space for content
- Shadow: `shadow-md` always visible — floats above content, reinforces sticky feel
- No conditional scroll-based shadow (no JS state needed)

### Scroll behavior
- Always fixed at top: `position: fixed` or `sticky top-0`
- Shadow is always present — no scroll listener required
- Content below must have top padding/margin equal to header height to avoid overlap

### Mobile treatment
- Logo and CTA button visible on all screen sizes — no hamburger, no collapse
- Logo scales: `h-7` on mobile → `h-8` on `sm:` and above
- CTA shows full text "Rejoindre" on all breakpoints — no abbreviated version

### Logo + CTA layout
- Layout: logo left, CTA right — flex justify-between items-center, full width with horizontal padding
- CTA style: `bg-terracotta text-cream` (filled, warm) — stands out on the dark soil header
- CTA navigates to `/inscription` via React Router `<Link>` (no browser navigation event)

### Claude's Discretion
- Exact padding values inside the header (px-4 vs px-6 vs px-8)
- Button border-radius and font-weight on the CTA
- Whether to use `sticky` or `fixed` (both satisfy the requirement — use whichever avoids layout jank in CRA)
- Inner max-width container (e.g. `max-w-7xl mx-auto`) if needed for wide screens

</decisions>

<specifics>
## Specific Ideas

- Verification banner from Phase 1 (01-03) used the same `bg-soil` — header should feel continuous with that established pattern
- The logo file already lives at `annuaire-zb-react/public/images/logo_zb_trans.png` — must render without a 404

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-layout-shell*
*Context gathered: 2026-03-13*
