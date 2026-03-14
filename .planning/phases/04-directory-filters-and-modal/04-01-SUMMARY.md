---
phase: 04-directory-filters-and-modal
plan: "01"
subsystem: ui
tags: [react, useMemo, hooks, filtering, directory]

# Dependency graph
requires:
  - phase: 03-directory-data-and-cards
    provides: useMemberFetch hook (named export), MemberCard component, SkeletonCard component
provides:
  - DirectoryPage refactored — single fetch via useMemberFetch, synchronous useMemo filtering
  - selectedMember state stub ready for Plan 03 modal wiring
  - Search-clear bug eliminated by removing flushSync/runSearch pattern
affects:
  - 04-02 (MemberModal — will read selectedMember state and setSelectedMember)
  - 04-03 (modal wiring — DirectoryPage already passes onClick to MemberCard)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Separate data loading (async, once) from filter application (synchronous, derived via useMemo)"
    - "trigger integer pattern: 0 = no fetch; increment to trigger; never reset (cache preserved)"
    - "hasSearched flag gates filteredResults derivation and stats display"

key-files:
  created: []
  modified:
    - annuaire-zb-react/src/pages/DirectoryPage.jsx

key-decisions:
  - "trigger state never reset on resetSearch — members stay cached so subsequent searches are instant"
  - "filteredResults derived via useMemo (not useState) — eliminates entire class of stale-result bugs"
  - "selectedMember state added as stub only — modal implementation deferred to Plan 02/03"

patterns-established:
  - "fetch-once / filter-many: load data once on first click, apply all filters in-memory via useMemo"
  - "hasSearched controls EmptyPrompt vs results rendering — replaces phase string state machine"

requirements-completed: [DIR-04, DIR-05, DIR-06, DIR-07]

# Metrics
duration: 2min
completed: 2026-03-14
---

# Phase 4 Plan 01: DirectoryPage Refactor — useMemberFetch + useMemo Filtering Summary

**DirectoryPage rewritten to load members once via useMemberFetch hook and derive all filtered results synchronously via useMemo, eliminating the flushSync/runSearch race condition**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-14T09:27:02Z
- **Completed:** 2026-03-14T09:28:49Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Removed flushSync import, fetchId ref, runSearch async function, and phase/results/errorMsg state
- Replaced inline fetch logic with useMemberFetch hook — data loads once on first Rechercher click
- filteredResults derived via useMemo — reactive to all five filter state changes, no extra button press needed
- selectedMember state stub added for Plan 03 modal wiring; MemberCard now receives onClick prop
- Build passes cleanly; grep confirms no flushSync/runSearch/fetchId references remain

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace runSearch/flushSync with useMemberFetch + useMemo** - `f413d15` (feat)

**Plan metadata:** (see final commit below)

## Files Created/Modified

- `annuaire-zb-react/src/pages/DirectoryPage.jsx` — Refactored with useMemberFetch hook, useMemo filtering, hasSearched flag, selectedMember stub

## Decisions Made

- `trigger` state is never reset in resetSearch — this preserves the cached member list so subsequent searches after reset are instant (no second network call)
- `hasSearched` flag replaces the `phase` string state machine (`'idle' | 'loading' | 'done' | 'error'`) — simpler and more direct
- selectedMember state added as stub only; no modal rendered yet (Plan 02 creates MemberModal, Plan 03 wires it)

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan 02 can now create MemberModal component (receives member prop)
- Plan 03 will wire selectedMember into the modal by reading it from DirectoryPage state
- The onClick={() => setSelectedMember(m)} prop is already on MemberCard — Plan 03 has a clean hook-in point
- No blockers

---
*Phase: 04-directory-filters-and-modal*
*Completed: 2026-03-14*
