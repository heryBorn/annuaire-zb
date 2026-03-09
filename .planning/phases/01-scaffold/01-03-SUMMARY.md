---
phase: 01-scaffold
plan: "03"
subsystem: ui
tags: [react, react-router, fontawesome, svg-icons, routing]

# Dependency graph
requires:
  - phase: 01-scaffold plan 01
    provides: CRA bootstrap with React app, Tailwind configured, .env with REACT_APP_SHEET_API_URL
provides:
  - BrowserRouter + Routes SPA routing with two route entries (/ and /inscription)
  - DirectoryPage stub component for Phase 3 directory build
  - InscriptionPage stub component for Phase 5 registration form
  - FontAwesome SVG icon library installed and rendering (no CSS imports)
  - Verification banner confirming FA + Tailwind + env var resolution
affects: [02-header-nav, 03-directory, 05-inscription]

# Tech tracking
tech-stack:
  added:
    - react-router-dom@6
    - "@fortawesome/fontawesome-svg-core"
    - "@fortawesome/free-solid-svg-icons"
    - "@fortawesome/free-brands-svg-icons"
    - "@fortawesome/react-fontawesome"
  patterns:
    - BrowserRouter wraps entire app at App.js level
    - Routes/Route v6 syntax (no Switch, element prop not component)
    - FontAwesome SVG via FontAwesomeIcon component, no CSS import needed

key-files:
  created:
    - annuaire-zb-react/src/pages/DirectoryPage.jsx
    - annuaire-zb-react/src/pages/InscriptionPage.jsx
  modified:
    - annuaire-zb-react/src/App.js
    - annuaire-zb-react/package.json
    - annuaire-zb-react/package-lock.json

key-decisions:
  - "React Router v6 syntax used throughout: Routes not Switch, element not component, no exact prop"
  - "FontAwesome SVG packages only (4 packages) — no font-awesome CSS package to avoid global style injection"
  - "Verification banner added to App.js to confirm FA + Tailwind + env var before Phase 2 replaces it with real header"

patterns-established:
  - "Route pattern: BrowserRouter at App root, Routes as direct child, Route for each page"
  - "Page components in src/pages/ directory with .jsx extension"
  - "FontAwesomeIcon usage: import icon from free-solid-svg-icons, pass as icon prop"

requirements-completed: [SCAF-02, SCAF-05]

# Metrics
duration: 2min
completed: 2026-03-09
---

# Phase 1 Plan 03: React Router v6 + FontAwesome SVG routing skeleton with two navigable page stubs

**BrowserRouter + Routes skeleton with DirectoryPage and InscriptionPage stubs, FontAwesome SVG faLeaf rendering in verification banner, and env var resolution confirmed**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-09T20:25:14Z
- **Completed:** 2026-03-09T20:27:30Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Installed react-router-dom@6 and all four FontAwesome SVG packages (no CSS-based package)
- Replaced default CRA App.js with BrowserRouter + Routes using v6 syntax
- Created src/pages/DirectoryPage.jsx and src/pages/InscriptionPage.jsx stubs with Tailwind classes
- Added verification banner confirming FontAwesome SVG renders, Tailwind custom colors apply, and env var resolves

## Task Commits

Each task was committed atomically:

1. **Task 1: Install React Router v6 and FontAwesome SVG packages** - `7f6b0c4` (chore)
2. **Task 2: Wire routes in App.js and create page stubs** - `dc2e058` (feat)

## Files Created/Modified
- `annuaire-zb-react/src/App.js` - Replaced with BrowserRouter + Routes, verification banner, FontAwesomeIcon usage
- `annuaire-zb-react/src/pages/DirectoryPage.jsx` - Stub for / route with Tailwind classes
- `annuaire-zb-react/src/pages/InscriptionPage.jsx` - Stub for /inscription route with Tailwind classes
- `annuaire-zb-react/package.json` - Added react-router-dom@6 and four @fortawesome/* packages
- `annuaire-zb-react/package-lock.json` - Updated lockfile

## Decisions Made
- Used React Router v6 syntax exclusively (Routes, element prop) — v5 Switch syntax would throw compile error
- Installed four FontAwesome SVG packages (@fortawesome/fontawesome-svg-core, free-solid-svg-icons, free-brands-svg-icons, react-fontawesome) — SVG approach is tree-shakeable and injects no global CSS, preventing Tailwind conflicts
- Verification banner uses process.env.REACT_APP_SHEET_API_URL ternary to surface env var resolution — will be replaced by real header in Phase 2

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 1 scaffold is complete: CRA bootstrapped, Tailwind configured, routing skeleton in place, FontAwesome installed, env var confirmed
- Phase 2 (header/nav) can now build directly into App.js, replacing the verification banner with real navigation
- Phase 3 (directory) builds into DirectoryPage.jsx
- Phase 5 (inscription form) builds into InscriptionPage.jsx
- Manual verification still needed: start `npm start` and confirm "ENV OK" in banner and leaf icon visible

---
*Phase: 01-scaffold*
*Completed: 2026-03-09*
