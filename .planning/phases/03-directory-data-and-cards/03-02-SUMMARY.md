---
phase: 03-directory-data-and-cards
plan: "02"
subsystem: ui
tags: [react, tailwind, jsx, card, skeleton]

# Dependency graph
requires:
  - phase: 03-01
    provides: AvailabilityBadge component and member object shape
provides:
  - MemberCard JSX component — renders live member object with photo/initials, name, title, company, AvailabilityBadge
  - SkeletonCard JSX component — 4-row pulse placeholder matching MemberCard DOM shape
affects:
  - 03-03 (DirectoryPage assembles card grid using these components)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - aspect-square + object-cover for image blocks with no layout shift
    - animate-pulse on outer wrapper for unified skeleton animation
    - Non-breaking space fallback (\u00A0) for optional text fields to preserve card height

key-files:
  created:
    - annuaire-zb-react/src/components/MemberCard.jsx
    - annuaire-zb-react/src/components/SkeletonCard.jsx
  modified: []

key-decisions:
  - "aspect-square on photo block (not fixed h-48) — card height never depends on image dimensions"
  - "hover effect is CSS-only (transition-all + hover:scale-[1.02] + hover:shadow-xl) — no JS state"
  - "animate-pulse on outer SkeletonCard div (not individual rows) — single unified animation is less noisy"
  - "bg-sand placeholder color used in both real initials fallback and skeleton fills — palette consistency"

patterns-established:
  - "Card components: square media block on top, stacked info below (name, subtitle, subtitle, badge)"
  - "Skeleton mirrors live component DOM shape exactly — same block count, similar proportions"

requirements-completed: [DIR-02, DIR-03]

# Metrics
duration: 2min
completed: 2026-03-13
---

# Phase 3 Plan 02: MemberCard and SkeletonCard Summary

**Square-photo card with CSS hover lift and a matching pulse-skeleton placeholder, both using Tailwind aspect-square to prevent layout shift**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-13T16:15:28Z
- **Completed:** 2026-03-13T16:17:46Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- MemberCard renders member photo (or initials fallback), name, title, company, and AvailabilityBadge in a fixed DOM order with hover shadow and scale transition
- SkeletonCard mirrors MemberCard's DOM shape exactly with 4 pulse rows (name, title, company, badge) and a square image placeholder
- CRA build passes with no compilation errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create MemberCard component** - `f586227` (feat)
2. **Task 2: Create SkeletonCard component** - `15f9fcd` (feat)

## Files Created/Modified
- `annuaire-zb-react/src/components/MemberCard.jsx` - Populated member card: square photo or initials, stacked info, CSS hover effect
- `annuaire-zb-react/src/components/SkeletonCard.jsx` - 4-row animate-pulse placeholder matching MemberCard structure

## Decisions Made
- Photo block uses `aspect-square` (not `h-48`) so card height is never tied to image dimensions — prevents layout shift
- Hover effect is pure CSS (`transition-all duration-200 hover:shadow-xl hover:scale-[1.02]`) with no JS state
- `\u00A0` (non-breaking space) used as fallback for empty `metier`/`entreprise` — keeps card height consistent across members
- `animate-pulse` placed on outer wrapper div so the entire card pulses as one unit (less visually noisy than per-element animation)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- MemberCard and SkeletonCard are ready to be imported in DirectoryPage (Plan 03-03)
- Interface contract: `<MemberCard member={m} />` and `<SkeletonCard />` (no props)
- No blockers.

---
*Phase: 03-directory-data-and-cards*
*Completed: 2026-03-13*
