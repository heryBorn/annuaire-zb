---
phase: 06-design-polish
plan: 02
subsystem: ui
tags: [react, tailwind, animation, availability-badge, member-card, member-modal]

# Dependency graph
requires:
  - phase: 06-design-polish plan 01
    provides: animate-fade-slide-up Tailwind utility in tailwind.config.js
  - phase: 04-directory-filters-and-modal
    provides: AvailabilityBadge component, MemberModal portal pattern
provides:
  - AvailabilityBadge without hardcoded mt-2 (caller-controlled margin)
  - MemberCard with metier line and AvailabilityBadge below name
  - MemberModal with 300ms fade/scale animation on overlay and card
  - DirectoryPage card grid with stagger entrance animation (animate-fade-slide-up)
affects:
  - 06-03-PLAN.md (any further card or modal work)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Leaf component margin policy: leaf UI components own no external margin; callers control spacing via gap or wrapper margin
    - Stagger animation cap: Math.min(index * 50, 400) caps delay at 400ms so late-list cards don't wait excessively
    - key prop on outermost returned element when wrapping map results in a div

key-files:
  created: []
  modified:
    - annuaire-zb-react/src/components/AvailabilityBadge.jsx
    - annuaire-zb-react/src/components/MemberCard.jsx
    - annuaire-zb-react/src/components/MemberModal.jsx
    - annuaire-zb-react/src/pages/DirectoryPage.jsx

key-decisions:
  - "AvailabilityBadge owns no external margin — mt-2 removed; MemberCard uses gap-2, MemberModal uses mt-3 wrapper"
  - "MemberModal animation duration locked to 300ms (duration-300) — centered in 250-350ms target range"
  - "Stagger delay capped at 400ms (Math.min(index * 50, 400)) — cards 8+ share max delay to avoid long waits"

patterns-established:
  - "Leaf component margin policy: leaf UI components own no external margin; callers control via gap or wrapper"
  - "Stagger cap pattern: Math.min(index * N, maxMs) for entrance animations on result lists"

requirements-completed: [DES-03, DES-04]

# Metrics
duration: 2min
completed: 2026-03-14
---

# Phase 6 Plan 02: Visual Consistency and Animation Polish Summary

**AvailabilityBadge margin decoupled from component, metier+badge added to MemberCard, MemberModal duration fixed to 300ms, card grid stagger entrance animation wired**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-14T19:22:14Z
- **Completed:** 2026-03-14T19:24:08Z
- **Tasks:** 4
- **Files modified:** 4

## Accomplishments

- Removed hardcoded `mt-2` from AvailabilityBadge so callers fully control spacing
- MemberCard now shows metier line and AvailabilityBadge between name and location
- MemberModal overlay and card animate at 300ms (was 200ms, below the 250-350ms design target)
- DirectoryPage card grid wraps each result in `animate-fade-slide-up` with stagger delay capped at 400ms

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove mt-2 from AvailabilityBadge** - `76446e3` (fix)
2. **Task 2: Add metier line and AvailabilityBadge to MemberCard** - `88aa2ee` (feat)
3. **Task 3: Fix MemberModal animation duration to 300ms** - `fd27746` (fix)
4. **Task 4: Wire card entrance stagger animation in DirectoryPage** - `2e2902e` (feat)

## Files Created/Modified

- `annuaire-zb-react/src/components/AvailabilityBadge.jsx` - Removed hardcoded `mt-2` from span className
- `annuaire-zb-react/src/components/MemberCard.jsx` - Added AvailabilityBadge import, metier paragraph, and availability badge block
- `annuaire-zb-react/src/components/MemberModal.jsx` - Changed both animated elements from duration-200 to duration-300
- `annuaire-zb-react/src/pages/DirectoryPage.jsx` - Wrapped card map results in stagger animation div with animate-fade-slide-up

## Decisions Made

- Removed `mt-2` from AvailabilityBadge: leaf components should not own their external margin. MemberCard's `flex-col gap-2` and MemberModal's `<div className="mt-3">` wrapper each control spacing for their context.
- 300ms animation duration: matches the card fade-slide-up duration, centered in the 250-350ms locked range.
- Stagger cap at 400ms: `Math.min(index * 50, 400)` ensures cards at positions 8+ don't wait longer than 400ms — prevents perceived sluggishness on large result sets.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All four DES-03 and DES-04 requirements fulfilled
- Card visual hierarchy is complete: domaine > name > metier > availability badge > location > bio
- Modal animation is polished at 300ms
- Stagger entrance animation active on card grid results
- Ready for Plan 03 (remaining design polish tasks)

---
*Phase: 06-design-polish*
*Completed: 2026-03-14*
