---
phase: 05-registration-form
plan: 02
subsystem: ui
tags: [react, forms, validation, fetch, no-cors, google-apps-script]

# Dependency graph
requires:
  - phase: 05-01
    provides: InscriptionPage form shell with all fields, photo upload, and state stubs
provides:
  - "Client-side validation for all 9 required fields with inline errors and scroll-to-first-error"
  - "no-cors POST to Google Apps Script with correct payload keys"
  - "Success screen swap (terracotta checkmark, heading, back link) on fetch resolve"
  - "Error toast (fixed top, terracotta, auto-dismiss 5s, x button) on network reject"
  - "Loading state on submit button (spinner + disabled) during in-flight fetch"
affects:
  - 06-deploy

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "validate() closes over fields/photoBase64 — called at start of handleSubmit, returns errors object"
    - "no-cors fetch: never read response.ok or response.json() — treat any resolve as success"
    - "Toast auto-dismiss via useEffect + setTimeout, returns clearTimeout cleanup"
    - "Early return pattern for success screen — if (submitted) return <main>..."

key-files:
  created: []
  modified:
    - annuaire-zb-react/src/pages/InscriptionPage.jsx

key-decisions:
  - "no-cors opaque response: setSubmitted(true) on resolve without reading response — treating any resolve as success is the only safe pattern"
  - "validate() as a plain function (not useCallback) — called synchronously in handleSubmit, no memoization needed"
  - "Toast as a string state (null = no toast) — simplest model for a single concurrent toast"

patterns-established:
  - "validate()-then-scroll pattern: collect all errs first, setErrors(errs), scroll to first key"
  - "Loading gate: setLoading(true) before fetch, setLoading(false) in finally — prevents double-submit"

requirements-completed: [REG-03, REG-04, REG-05, REG-06]

# Metrics
duration: checkpoint-gated
completed: 2026-03-14
---

# Phase 5 Plan 02: Registration Form Submit Flow Summary

**Client-side validation (9 fields), no-cors POST to GAS, success screen swap, and terracotta auto-dismiss error toast wired into InscriptionPage**

## Performance

- **Duration:** checkpoint-gated (human verify interlude)
- **Started:** 2026-03-14
- **Completed:** 2026-03-14
- **Tasks:** 2 (1 auto + 1 human-verify)
- **Files modified:** 1

## Accomplishments

- validate() checks all 9 required fields (photo, prenom, nom, email, metier, domaine, ville, bio min-50, consent), shows inline red errors, and scrolls the viewport to the first invalid field
- handleSubmit fires the no-cors POST with canonical payload keys, sets submitted=true on any resolve, and shows the terracotta toast on network reject
- Success screen (cream bg, terracotta checkmark circle, "Demande envoyee !", back link to /) replaces the form on resolve
- Toast (fixed top, terracotta bg, flex with x button) auto-dismisses after 5 seconds via useEffect/setTimeout cleanup
- Submit button shows faSpinner animate-spin + "Envoi..." and is disabled during in-flight fetch

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire validate(), handleSubmit(), toast auto-dismiss, success screen** - `5058a9f` (feat)
2. **Task 2: Human verify** - approved by user (no code commit)

## Files Created/Modified

- `annuaire-zb-react/src/pages/InscriptionPage.jsx` - Added validate(), full handleSubmit(), toast useEffect, success screen early return, toast JSX fragment — 720 lines total

## Decisions Made

- no-cors opaque response: never reading response.ok or response.json() after the fetch — any resolve sets submitted=true, any reject shows toast. This is the only safe pattern for no-cors mode.
- validate() defined as a plain nested function closing over fields and photoBase64, called synchronously at the top of handleSubmit — no useCallback needed since it's invoked once per submit.
- Toast state is a plain string (null = no toast), which is the simplest model for a single concurrent notification.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required. The `REACT_APP_SHEET_API_URL` environment variable must be set in `.env` before the form can POST to Google Apps Script, but this is already documented in Phase 1 setup.

## Next Phase Readiness

- InscriptionPage is fully functional end-to-end: photo upload, all 15 fields, validation, loading state, success screen, error toast
- Human verification completed and approved — form visually confirmed across desktop and mobile layouts
- Phase 6 (deploy) can proceed — React app is production-ready

---
*Phase: 05-registration-form*
*Completed: 2026-03-14*
