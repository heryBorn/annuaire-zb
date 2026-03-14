---
phase: 06-design-polish
plan: 01
subsystem: ui
tags: [react, tailwind, css-animation, hero, responsive]

# Dependency graph
requires:
  - phase: 03-directory-data-and-cards
    provides: DirectoryPage, MemberCard, useMemberFetch hook, search-first UX pattern
  - phase: 04-directory-filters-and-modal
    provides: MemberModal, filters, trigger state pattern
provides:
  - Full-bleed bg-soil hero section in DirectoryPage with live stats on mount
  - fadeSlideUp Tailwind keyframe and animate-fade-slide-up animation utility
  - Header hides association text below md breakpoint
  - StatChip component (cream-on-soil styling)
  - trigger=1 on mount — members pre-fetched before user interaction
affects: [06-02-PLAN, 06-03-PLAN]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "fadeSlideUp keyframe with 'both' fill-mode prevents flash-then-fade for staggered card animations"
    - "React fragment root enables full-bleed section outside max-w container"
    - "trigger=useState(1) fires useMemberFetch on mount for pre-loaded stats"

key-files:
  created: []
  modified:
    - annuaire-zb-react/tailwind.config.js
    - annuaire-zb-react/src/pages/DirectoryPage.jsx
    - annuaire-zb-react/src/components/Header.jsx

key-decisions:
  - "React fragment (<>) not <div> as return root — div would prevent hero full-bleed width"
  - "trigger=useState(1) so fetch fires on mount; handleSearch only sets hasSearched=true"
  - "Stats use loading ? '…' : value — no hasSearched gate, visible on initial page load"
  - "animation fill-mode 'both' is critical — keeps cards invisible before stagger delay fires"
  - "setTrigger removed from useState destructure after handleSearch simplified — avoids unused-variable build warning"

patterns-established:
  - "Full-bleed hero: React fragment root + section before main, hero not inside max-w-7xl container"
  - "Mobile-responsive header: use hidden md:block to hide text on small screens while keeping logo and CTA"

requirements-completed: [DES-01, DES-02]

# Metrics
duration: 3min
completed: 2026-03-14
---

# Phase 6 Plan 01: Design Polish — Hero & Animation Foundation Summary

**Full-bleed bg-soil hero band with always-visible live stats, fadeSlideUp Tailwind animation utility, and mobile-responsive Header**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-14T19:16:44Z
- **Completed:** 2026-03-14T19:19:21Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Added `fadeSlideUp` keyframe and `animate-fade-slide-up` utility to tailwind.config.js — consumed by Plan 02 for card entrance animations
- Restructured DirectoryPage with a `<>` fragment root: full-bleed `<section className="bg-soil">` hero band outside the max-w container, with `pt-24` header clearance
- Hero stats now show `loading ? '…' : value` — real numbers on page load (no hasSearched gate), powered by `trigger=useState(1)` mounting fetch
- Header association text hidden below `md` breakpoint via `hidden md:block`

## Task Commits

Each task was committed atomically:

1. **Task 1: Add fadeSlideUp keyframe to tailwind.config.js** - `c2b061e` (feat)
2. **Task 2: Hide association text in Header on mobile** - `2e71634` (feat)
3. **Task 3: Restructure DirectoryPage — hero band, StatChip, always-visible stats** - `efcd5f3` (feat)

## Files Created/Modified
- `annuaire-zb-react/tailwind.config.js` - Added keyframes.fadeSlideUp and animation['fade-slide-up'] with both fill-mode
- `annuaire-zb-react/src/components/Header.jsx` - Association name span gets hidden md:block for mobile responsiveness
- `annuaire-zb-react/src/pages/DirectoryPage.jsx` - Fragment root, full-bleed bg-soil hero, StatChip, trigger=1, simplified handleSearch

## Decisions Made
- React fragment (`<>`) as return root — a `<div>` would constrain width and prevent the hero from spanning full viewport
- `trigger = useState(1)` so `useMemberFetch` fires immediately on mount, populating `stats` before any user interaction
- Stats show `loading ? '…' : stats.total` — the `hasSearched` gate is removed from hero stats (stats are independent of the search result display)
- `setTrigger` removed from useState destructure to avoid unused-variable ESLint error that blocks CRA build
- Animation `fill-mode: both` — prevents the flash-then-fade bug where cards briefly appear at full opacity before the stagger delay fires

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Removed unused setTrigger from useState destructure**
- **Found during:** Task 3 (DirectoryPage restructure)
- **Issue:** After simplifying handleSearch to not call setTrigger, the variable was declared but never used — CRA treats no-unused-vars as an error
- **Fix:** Changed `const [trigger, setTrigger] = useState(1)` to `const [trigger] = useState(1)`
- **Files modified:** annuaire-zb-react/src/pages/DirectoryPage.jsx
- **Verification:** `npm --prefix annuaire-zb-react run build` exits 0, "Compiled successfully"
- **Committed in:** efcd5f3 (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical — unused variable cleanup)
**Impact on plan:** Required for clean build. No scope creep.

## Issues Encountered
None beyond the auto-fixed unused variable noted above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `animate-fade-slide-up` Tailwind class is ready for Plan 02 to apply to MemberCard with staggered delays
- Hero structure is stable — Plan 03 can add collapsible filter panel inside `<main>` without touching the hero
- Build verified clean (Compiled successfully, 99.21 kB gzipped JS)

---
*Phase: 06-design-polish*
*Completed: 2026-03-14*
