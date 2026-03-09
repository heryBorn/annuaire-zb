---
phase: 01-scaffold
plan: "01"
subsystem: infra
tags: [react, cra, create-react-app, react-scripts, dotenv, logo]

# Dependency graph
requires: []
provides:
  - CRA project scaffold at annuaire-zb-react/ with react-scripts 5.0.1
  - Logo asset at annuaire-zb-react/public/images/logo_zb_trans.png
  - REACT_APP_SHEET_API_URL env var in annuaire-zb-react/.env
affects: [02-tailwind, 03-routing, 04-directory, 05-registration, 06-deploy]

# Tech tracking
tech-stack:
  added: [create-react-app 5.0.1, react-scripts 5.0.1, react 18, react-dom 18]
  patterns: [CRA isolated subdirectory within existing static site repo, REACT_APP_ prefix for env vars exposed to browser]

key-files:
  created:
    - annuaire-zb-react/package.json
    - annuaire-zb-react/src/index.js
    - annuaire-zb-react/public/images/logo_zb_trans.png
    - annuaire-zb-react/.env
  modified:
    - annuaire-zb-react/.gitignore

key-decisions:
  - "CRA lives as a subdirectory inside the existing static site repo — existing index.html and inscription.html are untouched"
  - ".env added to annuaire-zb-react/.gitignore (CRA only excludes .env.local by default)"

patterns-established:
  - "REACT_APP_ prefix: All env vars accessed in browser code must use this prefix for CRA webpack DefinePlugin"
  - "public/ path for logo: Use <img src='/images/logo_zb_trans.png'> not JS import — consistent with later phases"

requirements-completed: [SCAF-01, SCAF-06, SCAF-07]

# Metrics
duration: 7min
completed: 2026-03-09
---

# Phase 1 Plan 01: Bootstrap CRA Summary

**CRA 5 project scaffolded as annuaire-zb-react/ subdirectory with react-scripts 5.0.1, logo asset copied to public/images/, and REACT_APP_SHEET_API_URL env var set — build passes with no compile errors**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-09T20:15:23Z
- **Completed:** 2026-03-09T20:22:39Z
- **Tasks:** 3
- **Files modified:** 20

## Accomplishments

- Bootstrapped annuaire-zb-react/ via `npx create-react-app` with react-scripts 5.0.1 — CRA 5 default ReactDOM.createRoot already in place
- Copied logo_zb_trans.png to annuaire-zb-react/public/images/ for /images/logo_zb_trans.png browser path
- Created annuaire-zb-react/.env with REACT_APP_SHEET_API_URL pointing to the Google Apps Script exec URL, and secured .env in .gitignore

## Task Commits

Each task was committed atomically:

1. **Task 1: Bootstrap CRA project** - `7fd3fbc` (feat)
2. **Task 2: Copy logo asset to CRA public directory** - `39a3cd8` (feat)
3. **Task 3: Create .env with REACT_APP_ prefix** - `d03e489` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `annuaire-zb-react/package.json` - CRA project manifest with react-scripts 5.0.1
- `annuaire-zb-react/src/index.js` - Entry point using ReactDOM.createRoot
- `annuaire-zb-react/src/App.js` - Default CRA App component (unmodified)
- `annuaire-zb-react/public/images/logo_zb_trans.png` - Logo asset copied from assets/images/
- `annuaire-zb-react/.env` - REACT_APP_SHEET_API_URL env var (gitignored)
- `annuaire-zb-react/.gitignore` - Added .env exclusion (CRA default only excludes .env.local)

## Decisions Made

- CRA lives as a subdirectory inside the existing static site repo — the existing `index.html` and `inscription.html` at the project root are untouched
- Added `.env` explicitly to `annuaire-zb-react/.gitignore` because CRA's generated .gitignore only excludes `.env.local` and `.env.*.local` variants, not `.env` itself
- Used `npm run build` as the smoke test instead of `npm start` since the dev server cannot be interactively verified in this context — build succeeded with no errors

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added .env to annuaire-zb-react/.gitignore**
- **Found during:** Task 3 (Create .env)
- **Issue:** CRA's generated .gitignore excludes `.env.local` variants but not `.env` itself — the file containing the API URL would have been committed
- **Fix:** Added `.env` line to annuaire-zb-react/.gitignore
- **Files modified:** annuaire-zb-react/.gitignore
- **Verification:** `git status` shows annuaire-zb-react/.env as ignored (not listed as untracked)
- **Committed in:** d03e489 (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Necessary security fix — prevents API URL from being committed to the repo. No scope creep.

## Issues Encountered

- `npm start` smoke test replaced with `npm run build` — build output confirmed zero compile errors and produced a valid production bundle (61 kB gzipped JS)

## User Setup Required

None - no external service configuration required. The .env file is created locally and gitignored.

## Next Phase Readiness

- CRA foundation complete; annuaire-zb-react/ is ready for Tailwind and routing configuration (Plans 02-03)
- node_modules installed (1314 packages), no manual steps required
- Dev server starts with `npm start` in annuaire-zb-react/

---
*Phase: 01-scaffold*
*Completed: 2026-03-09*
