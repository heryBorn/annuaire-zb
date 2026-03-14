# Phase 5: Registration Form - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

A fully functional registration form on the `/inscription` route that replaces the existing static `inscription.html`. New members fill in their profile (photo, identity, activity, contact info), the photo is compressed client-side, and the form submits to the existing GAS endpoint. Field names (HTML `name` attributes) must match the existing Google Sheet column headers exactly.

</domain>

<decisions>
## Implementation Decisions

### Form Layout

- **Two columns on desktop**, single column on mobile (responsive grid)
- **Photo upload as left sidebar** — the photo zone occupies a fixed-width left column; all text fields are in the right column
- Sections use labeled headings within the right column, not a multi-step wizard
- **Section names:** Identité / Activité / Contact

```
┌─────────────────────────────────────────────┐
│  ┌──────────┐  --- Identité ---              │
│  │          │  Nom*        Prénom*           │
│  │  Photo   │  Bio*                          │
│  │  upload  │  --- Activité ---              │
│  │          │  Titre*   Domaine*             │
│  └──────────┘  Compétences   Disponibilité   │
│                Type service                  │
│                --- Contact ---               │
│                Ville*     Région             │
│                Email*     Téléphone          │
│                LinkedIn   Site web           │
│                [ Soumettre ]                 │
└─────────────────────────────────────────────┘
```

### Field Set

**Required fields** (inline error if missing/invalid on submit):
- Photo (file upload)
- Nom + Prénom
- Email (validate format)
- Titre / Métier
- Domaine (dropdown)
- Ville
- Bio

**Optional fields** (shown with an "optionnel" label):
- Compétences (text, comma-separated tags)
- LinkedIn URL
- Site web URL
- Région
- Téléphone
- Disponibilité (dropdown)
- Type de service (dropdown)

**Field names:** Must match existing `inscription.html` `name` attributes exactly — do not rename. Read the current `inscription.html` before building to extract the canonical name list.

### Photo Upload Experience

- **Before selection:** Square dashed-border zone with camera icon (FontAwesome) + text "Cliquez ou glissez une photo"
- **After selection:** Preview image fills the square zone; small "×" button overlays the corner to remove/change
- **No cropping** — resize client-side to max 400px (longest side) and compress to JPEG quality 80% using `canvas.toDataURL('image/jpeg', 0.8)`
- Compressed image sent as base64 string in the form payload

### Validation

- **Trigger:** On submit only — no live validation, no blur validation
- **Error display:** Inline red error message beneath each invalid field
- **Email format:** Basic format check (`/@/` and `.` after `@`) before submit
- If any required field is empty/invalid: scroll to first error, do not call the API

### Submit Flow + States

- Submit button shows loading spinner + disabled state while fetch is in-flight
- API call uses `fetch` with `mode: 'no-cors'` (existing GAS endpoint pattern)
- **On fetch resolve** (regardless of no-cors response): replace form with success screen
- **On fetch reject** (network error): show error toast, form remains editable

### Success Screen

- Full-page replacement (form unmounts, success screen mounts)
- Content: large checkmark icon, heading "Demande envoyée !", subtext "Votre candidature a été reçue. Vous recevrez une confirmation par email.", link "← Retour à l'annuaire" pointing to `/`
- Uses brand colors: terracotta icon/heading, ink body text, cream background

### Error State

- **Network error:** Toast notification at top of screen (not a banner above button)
- Toast style: terracotta/red background, white text, auto-dismiss after 5 seconds, also has an × dismiss button
- Form remains fully editable after error — user can retry

</decisions>

<specifics>
## Specific Ideas

- Photo sidebar layout mirrors the MemberModal portrait layout already built in Phase 4 — planner should reference MemberModal.jsx for visual consistency
- The `inscription.html` field names are the canonical source of truth — researcher must read that file to extract exact names
- Known architectural note from STATE.md: `no-cors POST` — show success screen on fetch resolve, never read `response.ok` or `response.json()`

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-registration-form*
*Context gathered: 2026-03-14*
