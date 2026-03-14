---
phase: 04-directory-filters-and-modal
plan: "03"
subsystem: ui
tags: [react, tailwind, modal, member-card, directory]

# Dependency graph
requires:
  - phase: 04-02-member-modal
    provides: MemberModal component with { member, onClose } props contract
  - phase: 04-01-directory-refactor
    provides: selectedMember state and onClick stub in DirectoryPage
provides:
  - MemberCard with onClick prop — clicking a card calls setSelectedMember(m)
  - DirectoryPage wired to MemberModal — renders modal conditionally on selectedMember
  - End-to-end Phase 4 feature: search, filters, stats, empty state, modal open/close all verified
affects: [05-registration-form, any plan importing DirectoryPage or MemberCard]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - onClick prop on card component triggers parent state setter — standard React lifting-state-up
    - keyboard accessibility on interactive div: role=button + tabIndex=0 + onKeyDown(Enter/Space)
    - Conditional modal render in page-level component: {selectedMember && <MemberModal ... />}

key-files:
  created: []
  modified:
    - annuaire-zb-react/src/components/MemberCard.jsx
    - annuaire-zb-react/src/pages/DirectoryPage.jsx

key-decisions:
  - "onKeyDown handler uses onClick?.() (optional chaining) — safe if onClick not provided"

patterns-established:
  - "Footer link e.stopPropagation() preserved — prevents card onClick from firing on link clicks"
  - "Modal conditionally rendered inline in page JSX: {selectedMember && <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />}"

requirements-completed: [DIR-05, DIR-06, DIR-07, DIR-08, DIR-09]

# Metrics
duration: ~5min
completed: 2026-03-14
---

# Phase 04 Plan 03: Wire MemberCard onClick and MemberModal Summary

**MemberCard wired with onClick + keyboard a11y, MemberModal imported into DirectoryPage and rendered conditionally — completing end-to-end Phase 4: search, filters, stats, empty state, and member detail modal all human-verified**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-14T16:00:00Z
- **Completed:** 2026-03-14T16:05:00Z
- **Tasks:** 2 (1 auto + 1 human-verify checkpoint)
- **Files modified:** 2

## Accomplishments
- Added `onClick` prop to MemberCard function signature and wired it to the outer card div
- Added keyboard accessibility (`role="button"`, `tabIndex={0}`, `onKeyDown` for Enter/Space) to make cards usable without a mouse
- Imported MemberModal into DirectoryPage and rendered it conditionally when `selectedMember` is non-null
- Wired `onClose={() => setSelectedMember(null)}` to clear modal state on any close trigger
- Human verified all nine Phase 4 checklist items: search reactivity, dropdown filters, empty state, stats, search-clear bug fix, modal open/close, and footer link non-interference

## Task Commits

Each task was committed atomically:

1. **Task 1: Add onClick prop to MemberCard and wire MemberModal in DirectoryPage** - `eae181b` (feat)
2. **Task 2: Human verify Phase 4 end-to-end** - human approved (checkpoint, no commit)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `annuaire-zb-react/src/components/MemberCard.jsx` - Added onClick prop, role/tabIndex/onKeyDown on outer div; footer e.stopPropagation() preserved
- `annuaire-zb-react/src/pages/DirectoryPage.jsx` - Imported MemberModal; conditional render block added before closing </main>

## Decisions Made
- Used `onClick?.()` optional chaining in onKeyDown handler — safe no-op if onClick not provided, consistent with typical card usage.

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None — build passed cleanly and human verification confirmed all nine checklist items.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 4 is fully complete and human-verified
- Phase 5 (registration form) can begin: all directory/modal infrastructure is stable
- Blocker to verify before Phase 5: registration form field names must match exactly what inscription.html currently POSTs

---
*Phase: 04-directory-filters-and-modal*
*Completed: 2026-03-14*
