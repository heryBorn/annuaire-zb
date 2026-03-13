# Phase 3: Directory Data and Cards - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

The directory page (`/`) fetches members from Google Apps Script and renders them as a card grid with skeleton loading, stats counters, and an empty state. No filtering, searching, or detail pages — those are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Card grid layout
- **4 columns** on desktop
- Responsive breakpoints at Claude's discretion (expected: 1 col mobile → 2 col tablet → 4 col desktop)

### Card visual structure
- Square photo fills the card width at the top (portrait/landscape cropped)
- Info stacked below the photo: Name → Title → Company → Availability badge
- This applies to all cards — both populated and skeleton

### Card fields
- All 5 fields visible without clicking: photo, name, title, company, availability badge
- No expand/detail interaction in this phase

### Card hover interaction
- Shadow increases on hover (stronger shadow than resting state)
- Slight scale zoom (e.g. `scale(1.02)`) on the card
- CSS transition — no JS needed

### Claude's Discretion
- Skeleton loading card design (full card shape shimmer recommended)
- Empty state design (text + optional subtle illustration)
- Stats counters placement and exact styling
- Availability badge colors and shape (dot + label vs pill badge)
- Card border-radius, internal padding, typography scale
- Exact responsive breakpoints

</decisions>

<specifics>
## Specific Ideas

- No specific references provided — standard card directory approach is fine
- The hover effect should feel like the card "lifts" toward the user (shadow + zoom together)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-directory-data-and-cards*
*Context gathered: 2026-03-13*
