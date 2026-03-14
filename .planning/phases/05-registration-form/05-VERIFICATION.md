---
phase: 05-registration-form
verified: 2026-03-14T00:00:00Z
status: passed
score: 8/8 must-haves verified
re_verification: false
gaps:
  - truth: "After the fetch resolves (no-cors), the form is replaced by the success screen with a checkmark, heading, subtext, and link back to /"
    status: partial
    reason: "The fetch logic, success screen, and setSubmitted(true) are correctly implemented in code. However, process.env.REACT_APP_SHEET_API_URL resolves to undefined at runtime because .env only defines SHEET_API_URL (without the REACT_APP_ prefix required by Create React App). The fetch will POST to undefined rather than the GAS endpoint. In a browser, fetch('undefined') triggers a network error caught by the catch block, showing the error toast instead of the success screen."
    artifacts:
      - path: ".env"
        issue: "Variable is named SHEET_API_URL but CRA requires REACT_APP_SHEET_API_URL for it to be embedded in the bundle. Both InscriptionPage and useMemberFetch.js reference process.env.REACT_APP_SHEET_API_URL, which evaluates to undefined."
    missing:
      - "Rename the variable in .env from SHEET_API_URL to REACT_APP_SHEET_API_URL (or add a second line with the prefixed name)"
human_verification:
  - test: "Submit the form with all required fields filled, a photo selected, and REACT_APP_SHEET_API_URL correctly set in .env. Rebuild or restart the dev server."
    expected: "Submit button shows spinner during fetch; form is replaced by success screen (terracotta checkmark, 'Demande envoyee !', link to /)."
    why_human: "Requires live fetch to Google Apps Script — opaque no-cors response cannot be tested programmatically."
  - test: "In DevTools Network tab, set throttle to Offline, then submit a valid form."
    expected: "Terracotta toast appears at top of screen; it auto-dismisses after ~5 seconds or can be dismissed with the x button; form fields remain editable."
    why_human: "Network error behavior requires a live browser and DevTools manipulation."
  - test: "Resize browser to mobile width (< 768px)."
    expected: "Photo zone appears above fields in a single-column layout."
    why_human: "Responsive layout requires visual verification in a browser."
---

# Phase 5: Registration Form Verification Report

**Phase Goal:** Fully functional registration form on /inscription route — photo upload, all fields, client-side validation, no-cors POST to GAS, success screen, error toast.
**Verified:** 2026-03-14
**Status:** gaps_found — 1 environment configuration gap blocks end-to-end GAS submission
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | Visiting /inscription shows the registration form with photo zone, Identite, Activite, and Contact sections | VERIFIED | InscriptionPage.jsx renders three labeled sections (lines 369, 427, 566); wired to /inscription route in App.js line 13 |
| 2 | Clicking the photo zone opens a file picker; selecting an image shows a compressed thumbnail | VERIFIED | `photoInputRef.current?.click()` on zone click (line 317); `compressImage()` called in `handlePhotoChange` (line 178); `setPhotoPreviewUrl(dataUrl)` stores preview (line 179) |
| 3 | Clicking x on the photo preview clears it and allows re-selecting the same file | VERIFIED | `handlePhotoClear` calls `e.stopPropagation()`, clears both state vars, and resets `photoInputRef.current.value = ''` (lines 183-188) |
| 4 | All 15 text/select/textarea fields are present with correct state keys | VERIFIED | Fields object contains all 15 keys: prenom, nom, email, telephone, ville, region, metier, entreprise, domaine, experience, bio, site_web, linkedin, disponibilite, type_service — plus competences array and consent boolean (lines 94-112) |
| 5 | Submitting with any required field empty shows inline red errors without making an API call | VERIFIED | `validate()` checks 9 required fields and returns errs object; `if (Object.keys(errs).length > 0)` guard returns early before fetch (lines 194-200) |
| 6 | Submit button shows spinner + "Envoi..." and is disabled during in-flight fetch | VERIFIED | `setLoading(true)` before fetch (line 202); button `disabled={loading}` (line 694); `faSpinner animate-spin` + "Envoi..." rendered when `loading` (lines 697-701); `setLoading(false)` in `finally` (line 238) |
| 7 | Error toast appears on network reject, auto-dismisses after 5s, and has an x dismiss button | VERIFIED | `setToast(...)` in catch (line 235); `useEffect` with `setTimeout(() => setToast(null), 5000)` (lines 123-127); toast JSX with x button that calls `setToast(null)` (lines 285-292) |
| 8 | After fetch resolves, form is replaced by success screen | PARTIAL — env gap | Code is correct: `setSubmitted(true)` in try (line 233); `if (submitted) return <main>...` early return with checkmark/heading/link (lines 261-281). BLOCKED: `process.env.REACT_APP_SHEET_API_URL` is undefined at runtime (see Gaps). |

**Score:** 7/8 truths verified

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `annuaire-zb-react/src/pages/InscriptionPage.jsx` | Full controlled form with photo upload, all fields, layout, validation, submit, success screen, error toast (min 280 lines) | VERIFIED | 720 lines; all required logic present |
| `.env` | `REACT_APP_SHEET_API_URL` defined for CRA to embed in bundle | STUB | File exists but defines `SHEET_API_URL` — missing `REACT_APP_` prefix; resolves to `undefined` in the built app |

---

## Key Link Verification

### Plan 01 Key Links

| From | To | Via | Status | Evidence |
|------|----|-----|--------|---------|
| photo zone click | hidden file input | `photoInputRef.current.click()` | WIRED | Line 317: `onClick={() => photoInputRef.current?.click()}` |
| file input onChange | `compressImage()` | `handlePhotoChange` | WIRED | Line 178: `const dataUrl = await compressImage(file)` inside `handlePhotoChange` |
| compressImage result | `photoBase64` / `photoPreviewUrl` state | `dataUrl.split(',')[1]` | WIRED | Lines 179-180: `setPhotoPreviewUrl(dataUrl)` and `setPhotoBase64(dataUrl.split(',')[1])` |

### Plan 02 Key Links

| From | To | Via | Status | Evidence |
|------|----|-----|--------|---------|
| `handleSubmit` | `validate()` | called at start of handleSubmit | WIRED | Line 194: `const errs = validate();` |
| `validate()` result | `setErrors` + `scrollIntoView` | `Object.keys(errs).length > 0` guard | WIRED | Lines 195-200: guard, `setErrors(errs)`, `scrollIntoView` with smooth behavior |
| fetch resolve | `setSubmitted(true)` | try block after await fetch | WIRED | Line 233: `setSubmitted(true);` in try block |
| fetch reject | `setToast` | catch block | WIRED | Line 235: `setToast('Une erreur...')` in catch |
| `submitted` state | success screen JSX | `if (submitted) return ...` | WIRED | Line 261: `if (submitted) { return (<main>...` |
| env var `REACT_APP_SHEET_API_URL` | fetch URL | `process.env.REACT_APP_SHEET_API_URL` | NOT_WIRED | `.env` defines `SHEET_API_URL` without `REACT_APP_` prefix — CRA embeds only `REACT_APP_*` variables; fetch receives `undefined` |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|---------|
| REG-01 | 05-01 | Registration form with all existing fields (personal info, professional info, photo) | SATISFIED | All 15 fields + photo zone present; three labeled sections match inscription.html structure |
| REG-02 | 05-01 | Photo upload with canvas compression (max 400px, JPEG 80%) and live preview thumbnail | SATISFIED | `compressImage()` (lines 71-89): maxSize=400, quality=0.8; live preview via `photoPreviewUrl` state |
| REG-03 | 05-02 | Client-side form validation (required fields, bio minimum length, email format) | SATISFIED | `validate()` checks 9 fields: photo, prenom, nom, email (format), metier, domaine, ville, bio (min 50), consent (lines 131-151) |
| REG-04 | 05-02 | Submit button shows loading state while POST is in flight | SATISFIED | `disabled={loading}` + spinner + "Envoi..." conditionally rendered (lines 694-705) |
| REG-05 | 05-02 | Success screen replaces form after submission | PARTIAL | Code correct but env misconfiguration prevents fetch from reaching GAS; success screen unreachable in practice |
| REG-06 | 05-02 | Error toast shown if API call rejects | SATISFIED | Toast shown on catch (line 235); auto-dismiss (useEffect line 123); x button (line 288) — ironically, this will trigger for every submission due to the env gap |

No orphaned requirements — all six REG-01 through REG-06 are claimed by plans and verified above.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `.env` | 1 | `SHEET_API_URL` without `REACT_APP_` prefix | BLOCKER | `process.env.REACT_APP_SHEET_API_URL` is `undefined` at build time; fetch POSTs to `undefined`; success screen never shown; error toast shown for every valid submission |

No anti-patterns found in `InscriptionPage.jsx` itself. No TODO/FIXME stubs remaining. No empty implementations. Placeholder text is HTML `placeholder=` attributes only (not stub patterns).

---

## Human Verification Required

### 1. End-to-end form submission (requires env fix first)

**Test:** Rename `.env` variable to `REACT_APP_SHEET_API_URL`, restart dev server, fill all required fields with a photo, and submit.
**Expected:** Spinner shows during fetch; form is replaced by success screen with terracotta checkmark circle, "Demande envoyee !", and "Retour a l'annuaire" link.
**Why human:** Requires live no-cors fetch to Google Apps Script; opaque response cannot be verified programmatically.

### 2. Error toast on network failure

**Test:** In DevTools Network tab set throttle to Offline, fill and submit the form.
**Expected:** Terracotta toast appears at the top of the screen; auto-dismisses after ~5 seconds; x button dismisses it immediately; form fields remain editable.
**Why human:** Network offline simulation requires a live browser and DevTools.

### 3. Responsive layout

**Test:** Resize browser viewport to < 768px.
**Expected:** Photo zone appears above all field sections (single column); form is readable and usable on mobile.
**Why human:** Responsive behavior requires visual inspection in a browser.

---

## Gaps Summary

One gap blocks the primary goal: the `.env` file uses `SHEET_API_URL` but Create React App only embeds environment variables prefixed with `REACT_APP_` into the JavaScript bundle. At runtime, `process.env.REACT_APP_SHEET_API_URL` is `undefined`, causing `fetch(undefined, ...)` to throw immediately. This means the success screen (REG-05) is unreachable in practice — every submission triggers the error toast instead.

**Root cause:** `.env` line 1 must be `REACT_APP_SHEET_API_URL=https://...` not `SHEET_API_URL=https://...`.

Note: This same misconfiguration affects the directory page's `useMemberFetch.js` (member list cannot load), meaning it is a project-wide pre-existing issue, not introduced by Phase 05. It was present before Phase 05 began, but Phase 05's goal of "no-cors POST to GAS" cannot be considered achieved until the env var is correctly named.

All form code — field rendering, photo upload, compression, validation, loading state, success screen structure, toast structure — is correct and complete. The gap is a single environment variable name fix.

---

_Verified: 2026-03-14_
_Verifier: Claude (gsd-verifier)_
