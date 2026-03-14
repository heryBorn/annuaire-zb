# Phase 5: Registration Form - Research

**Researched:** 2026-03-14
**Domain:** React form with canvas image compression, client-side validation, no-cors API submission
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Form Layout
- Two columns on desktop, single column on mobile (responsive grid)
- Photo upload as left sidebar — the photo zone occupies a fixed-width left column; all text fields are in the right column
- Sections use labeled headings within the right column, not a multi-step wizard
- Section names: Identité / Activité / Contact

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

#### Field Set
Required fields (inline error if missing/invalid on submit): Photo, Nom, Prénom, Email (validate format), Titre / Métier, Domaine (dropdown), Ville, Bio

Optional fields (shown with an "optionnel" label): Compétences (text, comma-separated tags), LinkedIn URL, Site web URL, Région, Téléphone, Disponibilité (dropdown), Type de service (dropdown)

Field names: Must match existing `inscription.html` `name` attributes exactly — do not rename.

#### Photo Upload Experience
- Before selection: Square dashed-border zone with camera icon (FontAwesome) + text "Cliquez ou glissez une photo"
- After selection: Preview image fills the square zone; small "×" button overlays the corner to remove/change
- No cropping — resize client-side to max 400px (longest side) and compress to JPEG quality 80% using `canvas.toDataURL('image/jpeg', 0.8)`
- Compressed image sent as base64 string in the form payload

#### Validation
- Trigger: On submit only — no live validation, no blur validation
- Error display: Inline red error message beneath each invalid field
- Email format: Basic format check (`/@/` and `.` after `@`) before submit
- If any required field is empty/invalid: scroll to first error, do not call the API

#### Submit Flow + States
- Submit button shows loading spinner + disabled state while fetch is in-flight
- API call uses `fetch` with `mode: 'no-cors'` (existing GAS endpoint pattern)
- On fetch resolve (regardless of no-cors response): replace form with success screen
- On fetch reject (network error): show error toast, form remains editable

#### Success Screen
- Full-page replacement (form unmounts, success screen mounts)
- Content: large checkmark icon, heading "Demande envoyée !", subtext "Votre candidature a été reçue. Vous recevrez une confirmation par email.", link "← Retour à l'annuaire" pointing to `/`
- Uses brand colors: terracotta icon/heading, ink body text, cream background

#### Error State
- Network error: Toast notification at top of screen (not a banner above button)
- Toast style: terracotta/red background, white text, auto-dismiss after 5 seconds, also has an × dismiss button
- Form remains fully editable after error — user can retry

### Claude's Discretion

None specified — all decisions are locked.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| REG-01 | Registration form with all existing fields (personal info, professional info, photo) | Canonical field names extracted from inscription.html; all 16 payload keys documented below |
| REG-02 | Photo upload with canvas compression (max 400px, JPEG 80%) and live preview thumbnail | Canvas API confirmed available in CRA (browser native); compression algorithm extracted from inscription.html |
| REG-03 | Client-side form validation (required fields, bio minimum length, email format) | Validation triggers and rules documented; bio min 50 chars from inscription.html source |
| REG-04 | Submit button shows loading state while POST is in flight | React state pattern documented; no external lib needed |
| REG-05 | Success screen replaces form after submission (same behavior as current app) | Conditional render pattern — `submitted` state boolean, form unmounts when true |
| REG-06 | Error toast/message shown if API call rejects (new — current app has no error feedback) | Toast auto-dismiss via useEffect setTimeout; terracotta style defined |
</phase_requirements>

---

## Summary

Phase 5 replaces the `InscriptionPage.jsx` stub (currently a 10-line placeholder) with a fully functional registration form. All the source patterns already exist in the codebase: the photo upload and canvas compression algorithm is already proven in `inscription.html` (JavaScript, lines 253–295), the no-cors fetch pattern is established in `useMemberFetch.js`, and the two-column portrait layout is visible in `MemberModal.jsx`. The planner can draw directly from these existing patterns.

The critical technical facts are: (1) The `.env` file lives at `annuaire-zb-react/.env` (not the repo root), already has `REACT_APP_SHEET_API_URL` set correctly. (2) The canonical payload field names come from `inscription.html`'s submit handler, extracted verbatim below — 16 keys total plus `statut` and `date_inscription` which the client sets automatically. (3) The `skills` checkbox group in `inscription.html` becomes a `competences` key in the payload (joined as comma-separated string). (4) There is no form library in the project; plain React `useState` per field is correct.

The main complexity zones are the photo upload UX (toggle between placeholder and preview, remove button, base64 storage), the validation scroll-to-first-error behavior, and the toast auto-dismiss cleanup. Everything else is straightforward controlled-input React.

**Primary recommendation:** Implement as a single `InscriptionPage.jsx` file using plain React state (no form library). Extract photo compression and form submission into two focused helper functions to keep the JSX clean. Use conditional rendering (`submitted` boolean) for the success screen swap.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18 (already installed) | Controlled form state, conditional rendering | Project stack |
| TailwindCSS | 3 (already installed) | Layout, input styling, color tokens | Project stack |
| FontAwesome react-fontawesome | already installed | Camera icon, checkmark, spinner, × icons | Project stack |
| Canvas API | Browser native | Image resize + JPEG compression | No package needed |
| fetch | Browser native | no-cors POST to GAS endpoint | Project pattern |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| process.env.REACT_APP_SHEET_API_URL | CRA env | GAS endpoint URL | Used in fetch call |
| useRef | React built-in | Reference the hidden file input for programmatic click | Photo zone click handler |
| useEffect + setTimeout | React built-in | Toast auto-dismiss after 5 seconds | Error toast |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain useState per field | react-hook-form | react-hook-form not installed; plain state is correct for this form size |
| Canvas API directly | browser-image-compression npm | Not installed; canvas approach already proven in inscription.html |

**Installation:** No new packages required. All dependencies are already installed.

---

## Canonical Field Names

Extracted verbatim from `inscription.html` submit handler (lines 333–355). These are the ONLY valid names — do not deviate.

### HTML `name` attributes (input/select/textarea):
| Field | HTML `name` | Type | Required |
|-------|------------|------|---------|
| Prénom | `prenom` | text input | YES |
| Nom | `nom` | text input | YES |
| Email | `email` | email input | YES |
| Téléphone | `telephone` | tel input | no |
| Ville / Village | `ville` | text input | YES |
| Département / Région | `region` | text input | no |
| Intitulé poste / Métier | `metier` | text input | YES |
| Entreprise / Statut | `entreprise` | text input | no |
| Domaine d'expertise | `domaine` | select | YES |
| Années d'expérience | `experience` | select | no |
| Bio / Présentation | `bio` | textarea | YES (min 50 chars) |
| Site web / Portfolio | `site_web` | url input | no |
| LinkedIn | `linkedin` | url input | no |
| Disponibilité | `disponibilite` | select | no |
| Je propose mes services pour | `type_service` | select | no |
| Compétences clés | `skills` (checkboxes) | checkbox group | no |
| Consentement | `consent` | checkbox | YES (must be checked) |

### Payload keys sent to GAS:

```javascript
// Source: inscription.html lines 333–355 (canonical)
{
  prenom:          string,
  nom:             string,
  email:           string,
  telephone:       string,
  ville:           string,
  region:          string,
  metier:          string,
  entreprise:      string,
  domaine:         string,
  experience:      string,
  competences:     string,   // skills checkboxes joined with ', '
  bio:             string,
  site_web:        string,
  linkedin:        string,
  disponibilite:   string,
  type_service:    string,
  statut:          "EN ATTENTE",         // set by client
  date_inscription: new Date().toLocaleDateString('fr-FR'),  // set by client
  photo_base64:    string,   // base64 without prefix, or ""
  photo_mime:      string,   // "image/jpeg" or ""
}
```

**Key notes:**
- `skills` HTML checkboxes become `competences` in the payload (the join step)
- `consent` checkbox is validated client-side but NOT sent in payload
- `photo_base64` is the pure base64 without the `data:image/jpeg;base64,` prefix
- `statut` and `date_inscription` are auto-set by the client

### Dropdown option values (exact strings):

**domaine** — 15 options:
`Agriculture & Agroalimentaire`, `Artisanat & Métiers d'art`, `Bâtiment & Travaux publics`, `Commerce & Distribution`, `Communication & Marketing`, `Droit & Notariat`, `Éducation & Formation`, `Finance & Comptabilité`, `Informatique & Tech`, `Médical & Paramédical`, `Restauration & Hôtellerie`, `Services à la personne`, `Sport & Bien-être`, `Transport & Logistique`, `Autre`

These match `DOMAINES` array already defined in `DirectoryPage.jsx` — reuse it or import a shared constant.

**experience** — 5 options:
`Moins de 2 ans`, `2 – 5 ans`, `5 – 10 ans`, `10 – 20 ans`, `Plus de 20 ans`

**disponibilite** — 4 options:
`Disponible (actif)`, `Partiellement disponible`, `Non disponible (en poste)`, `À la recherche d'opportunités`

Note: these are full strings; `DirectoryPage.jsx` uses shortened `DISPOS` values for filtering. Use the full strings here as they match the inscription.html values.

**type_service** — 5 options:
`Emploi / Recrutement`, `Mission freelance`, `Bénévolat / Entraide`, `Vente de produits / services`, `Partenariat`

**skills** checkboxes (12 options):
`Gestion de projet`, `Design graphique`, `Développement web`, `Comptabilité`, `Droit`, `Agriculture bio`, `Menuiserie`, `Électricité`, `Plomberie`, `Cuisine`, `Couture`, `Médecine`

---

## Architecture Patterns

### Recommended File Structure

```
src/
├── pages/
│   └── InscriptionPage.jsx   # Full replacement — single file, ~300–350 lines
└── (no new components needed unless planner chooses to extract)
```

The entire form fits in one file. The photo compression is a standalone `async function compressImage(file)` and the submit handler is a standalone `async function handleSubmit(e)`. This matches the inscription.html structure which was already well-organized.

### Pattern 1: Controlled Form State

**What:** Each field is a separate `useState` value; errors tracked in a single `errors` object.
**When to use:** Plain React, no form library, fewer than ~20 fields.

```jsx
// Plain React controlled form pattern
const [fields, setFields] = useState({
  prenom: '', nom: '', email: '', telephone: '',
  ville: '', region: '', metier: '', entreprise: '',
  domaine: '', experience: '', bio: '',
  site_web: '', linkedin: '', disponibilite: '', type_service: '',
  competences: [],   // array of checked skill strings
  consent: false,
});
const [errors, setErrors] = useState({});
const [photoBase64, setPhotoBase64] = useState('');
const [photoPreviewUrl, setPhotoPreviewUrl] = useState('');
const [submitted, setSubmitted] = useState(false);
const [loading, setLoading] = useState(false);
const [toast, setToast] = useState(null); // string | null
```

### Pattern 2: Canvas Image Compression

**What:** Resize image to max 400px on longest side, output JPEG at 80% quality.
**Source:** Extracted verbatim from inscription.html lines 253–270 — proven working.

```javascript
// Source: inscription.html compressImage() — proven pattern
function compressImage(file, maxSize = 400, quality = 0.8) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > h && w > maxSize) { h = Math.round(h * maxSize / w); w = maxSize; }
        else if (h > maxSize)     { w = Math.round(w * maxSize / h); h = maxSize; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}
```

Call it in the file input `onChange` handler:
```javascript
const dataUrl = await compressImage(file);
setPhotoPreviewUrl(dataUrl);
setPhotoBase64(dataUrl.split(',')[1]); // strip "data:image/jpeg;base64," prefix
```

### Pattern 3: No-cors POST Submission

**What:** POST JSON payload to GAS endpoint with `mode: 'no-cors'`. On resolve = success. On reject = network error.
**Source:** Pattern confirmed in `useMemberFetch.js` and `inscription.html`.

```javascript
// Source: inscription.html lines 357–378 — established pattern
const url = process.env.REACT_APP_SHEET_API_URL;
setLoading(true);
try {
  await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  // no-cors always resolves (opaque response) — treat resolve as success
  setSubmitted(true);
} catch (err) {
  // Only network errors reach here
  setToast('Une erreur est survenue. Veuillez réessayer.');
} finally {
  setLoading(false);
}
```

**CRITICAL:** Never read `response.ok` or `response.json()` — no-cors returns an opaque response. The existing project decision is: "show success screen on fetch resolve, never read response.ok or response.json()".

### Pattern 4: Inline Error Display

**What:** `errors` object keys match field names; render error text below each input.
**When to use:** On submit only — clear `errors` at start of validate function, accumulate new errors, set once.

```jsx
// Error display below each field
<div>
  <input
    value={fields.ville}
    onChange={e => setFields(f => ({ ...f, ville: e.target.value }))}
    className={`border rounded-lg ... ${errors.ville ? 'border-terracotta' : 'border-sand'}`}
  />
  {errors.ville && (
    <p className="font-sans text-xs text-terracotta mt-1">{errors.ville}</p>
  )}
</div>
```

Scroll to first error after setting errors state:
```javascript
// After setErrors(newErrors)
const firstErrorKey = Object.keys(newErrors)[0];
document.getElementById(firstErrorKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
```

### Pattern 5: Toast Auto-Dismiss

**What:** Toast string in state; useEffect clears it after 5 seconds.

```jsx
// Toast auto-dismiss — useEffect with cleanup
useEffect(() => {
  if (!toast) return;
  const timer = setTimeout(() => setToast(null), 5000);
  return () => clearTimeout(timer); // cleanup on early dismiss or re-render
}, [toast]);

// Toast render — fixed position, top of screen
{toast && (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-terracotta text-cream font-sans text-sm px-4 py-3 rounded-lg shadow-lg max-w-sm">
    <span>{toast}</span>
    <button onClick={() => setToast(null)} className="shrink-0 hover:opacity-70">
      <FontAwesomeIcon icon={faXmark} />
    </button>
  </div>
)}
```

### Pattern 6: Photo Zone Toggle

**What:** Before selection shows dashed zone with camera icon; after selection shows preview image with × remove button.

```jsx
// Hidden file input triggered by zone click
const photoInputRef = useRef(null);

// Photo zone — two states in one element
<div
  className="relative w-40 h-40 border-2 border-dashed border-sand rounded-xl bg-cream flex items-center justify-center cursor-pointer overflow-hidden"
  onClick={() => photoInputRef.current?.click()}
>
  {photoPreviewUrl ? (
    <>
      <img src={photoPreviewUrl} alt="Aperçu" className="w-full h-full object-cover" />
      <button
        type="button"
        className="absolute top-1 right-1 bg-white/80 rounded-full w-6 h-6 flex items-center justify-center hover:bg-white"
        onClick={e => { e.stopPropagation(); setPhotoPreviewUrl(''); setPhotoBase64(''); }}
      >
        <FontAwesomeIcon icon={faXmark} className="text-xs text-ink" />
      </button>
    </>
  ) : (
    <div className="flex flex-col items-center gap-2 text-muted text-center px-2">
      <FontAwesomeIcon icon={faCamera} className="text-2xl" />
      <span className="font-sans text-xs">Cliquez ou glissez une photo</span>
    </div>
  )}
</div>
<input
  ref={photoInputRef}
  type="file"
  accept="image/*"
  className="hidden"
  onChange={handlePhotoChange}
/>
```

### Pattern 7: Success Screen Conditional Render

**What:** `submitted` boolean swaps form for success screen at the InscriptionPage level.

```jsx
if (submitted) {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-terracotta flex items-center justify-center mx-auto mb-6">
          <FontAwesomeIcon icon={faCheck} className="text-cream text-3xl" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-terracotta mb-3">Demande envoyée !</h2>
        <p className="font-sans text-sm text-ink leading-relaxed mb-6">
          Votre candidature a été reçue. Vous recevrez une confirmation par email.
        </p>
        <Link to="/" className="inline-block bg-soil text-cream font-sans text-sm font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
          ← Retour à l'annuaire
        </Link>
      </div>
    </main>
  );
}
```

### Pattern 8: Two-Column Layout with Photo Sidebar

**What:** CSS Grid with photo sidebar on the left (fixed width), fields on the right.
**Reference:** MemberModal.jsx uses portrait layout (`flex flex-col items-center`) — the form sidebar takes the same visual space as the modal avatar area.

```jsx
<div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
  {/* Left: photo zone, sticky */}
  <div className="md:pt-8">
    {/* photo upload zone */}
  </div>
  {/* Right: all sections */}
  <div className="flex flex-col gap-8">
    {/* Identité section */}
    {/* Activité section */}
    {/* Contact section */}
    {/* Submit zone */}
  </div>
</div>
```

On mobile (`grid-cols-1`), photo zone stacks above the fields.

### Tailwind Input Styling Convention

The project uses this pattern in `DirectoryPage.jsx` for select elements (line 42):
```javascript
const SELECT_CLS = 'border border-sand rounded-lg font-sans text-sm text-ink px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terracotta/40 bg-white';
```

Use the same token set for form inputs:
```javascript
const INPUT_CLS = 'w-full border border-sand rounded-lg font-sans text-sm text-ink px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terracotta/40 bg-white';
const INPUT_ERR_CLS = 'w-full border border-terracotta rounded-lg font-sans text-sm text-ink px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terracotta/40 bg-white';
```

### Anti-Patterns to Avoid

- **Reading `response.ok` after no-cors fetch:** Returns opaque response, `response.ok` is always false. Treat resolve as success.
- **Live/blur validation:** Locked decision is submit-only validation. Do not add `onChange` validation.
- **Using `form.elements` or uncontrolled refs for field values:** Use controlled React state — consistent with project pattern.
- **Renaming payload keys:** Must match inscription.html exactly. Do not use `firstName`/`lastName` etc.
- **Using `<form action="">` native submit:** Use `onSubmit={e => { e.preventDefault(); ... }}` — same as inscription.html.
- **Sending `consent` in payload:** Consent is validated client-side but not sent to GAS.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image resize + compression | Custom resize algorithm | `HTMLCanvasElement.toDataURL('image/jpeg', 0.8)` | Browser native, already proven in inscription.html |
| Auto-dismiss toast | Custom timer manager | `useEffect` + `setTimeout` + cleanup | React built-in, 5-line solution |
| Form library | Custom validation orchestrator | Plain `useState` + validate function | No library needed for 15 fields; react-hook-form not installed |
| Loading spinner | Custom CSS animation | FontAwesome `faSpinner` with `fa-spin` class | Already in project's FA setup |

**Key insight:** This form has no novel complexity beyond canvas compression and the no-cors pattern — both are already solved and documented in the existing codebase. Avoid over-engineering.

---

## Common Pitfalls

### Pitfall 1: photo_base64 Prefix Inclusion
**What goes wrong:** Sending the full `data:image/jpeg;base64,...` string instead of just the base64 part — GAS cannot decode it and silently stores garbage.
**Why it happens:** `canvas.toDataURL()` returns the full data URL including the mime prefix.
**How to avoid:** Always strip the prefix: `dataUrl.split(',')[1]`.
**Warning signs:** GAS stores a string starting with `data:image` — check the sheet after test submission.

### Pitfall 2: Treating no-cors Resolve as Reliable Success
**What goes wrong:** Adding logic that reads `response.status` or `response.json()` after no-cors fetch.
**Why it happens:** Developer assumes fetch behaves normally — it does not with no-cors. Response is opaque.
**How to avoid:** On resolve: show success screen. On reject (catch): show error. Never read the response object.
**Warning signs:** `response.ok === false` always — do not interpret as failure.

### Pitfall 3: Skills as Array vs String
**What goes wrong:** Sending `competences` as an array `["Droit", "Cuisine"]` instead of `"Droit, Cuisine"`.
**Why it happens:** The checkboxes naturally collect into an array in React state.
**How to avoid:** Join before payload: `competences: fields.competences.join(', ')`.
**Warning signs:** GAS sheet shows `[object Object]` or `Droit,Cuisine` with no space.

### Pitfall 4: Validation Errors Not Cleared on Retry
**What goes wrong:** Errors from a previous failed submission persist after the user fixes them and resubmits.
**Why it happens:** Errors only set on submit but never cleared at the start of a new submit.
**How to avoid:** `setErrors({})` at the very start of `handleSubmit` before building the new error map.
**Warning signs:** Red error borders remain even after filling in the field.

### Pitfall 5: Photo Input Not Resettable
**What goes wrong:** Clicking the × to remove the photo doesn't allow re-selecting the same file.
**Why it happens:** Browser caches the file input value — selecting the same file again fires no `change` event.
**How to avoid:** When clearing the photo, also reset the input value: `photoInputRef.current.value = ''`.
**Warning signs:** User selects a photo, removes it, tries to re-select the same photo — nothing happens.

### Pitfall 6: Missing `pt-16` Compensation
**What goes wrong:** Form content appears behind the fixed header.
**Why it happens:** App.js wraps all routes in `<div className="pt-16">` — InscriptionPage renders inside that div, so it should work. But if InscriptionPage uses `min-h-screen` on its own `<main>`, the padding from App.js handles it.
**How to avoid:** Do not add extra top padding to InscriptionPage — App.js already provides `pt-16` (confirmed in App.js line 10).
**Warning signs:** First form section partially hidden behind header.

### Pitfall 7: disponibilite Option Values Mismatch
**What goes wrong:** Using shortened DISPOS values from DirectoryPage (`Disponible`, `Partiellement`) in the registration form.
**Why it happens:** DirectoryPage uses abbreviated filter keys while inscription.html uses full strings.
**How to avoid:** Use full strings from inscription.html: `Disponible (actif)`, `Partiellement disponible`, `Non disponible (en poste)`, `À la recherche d'opportunités`.
**Warning signs:** GAS sheet stores abbreviated values that don't match the filter logic in DirectoryPage.

---

## Code Examples

### Validate Function

```javascript
// Validate on submit — returns errors object (empty = valid)
function validate() {
  const errs = {};
  if (!photoBase64) errs.photo = 'Une photo est requise.';
  if (!fields.prenom.trim()) errs.prenom = 'Prénom requis.';
  if (!fields.nom.trim()) errs.nom = 'Nom requis.';
  if (!fields.email.trim()) {
    errs.email = 'Email requis.';
  } else if (!/\S+@\S+\.\S+/.test(fields.email)) {
    errs.email = 'Format email invalide.';
  }
  if (!fields.metier.trim()) errs.metier = 'Métier requis.';
  if (!fields.domaine) errs.domaine = 'Domaine requis.';
  if (!fields.ville.trim()) errs.ville = 'Ville requise.';
  if (!fields.bio.trim()) {
    errs.bio = 'Bio requise.';
  } else if (fields.bio.trim().length < 50) {
    errs.bio = 'Minimum 50 caractères.';
  }
  if (!fields.consent) errs.consent = 'Consentement requis.';
  return errs;
}
```

### Submit Handler

```javascript
// Source: inscription.html pattern adapted to React
async function handleSubmit(e) {
  e.preventDefault();
  setErrors({});  // clear previous errors first

  const errs = validate();
  if (Object.keys(errs).length > 0) {
    setErrors(errs);
    // scroll to first error
    const firstKey = Object.keys(errs)[0];
    document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  setLoading(true);
  const payload = {
    prenom: fields.prenom.trim(),
    nom: fields.nom.trim(),
    email: fields.email.trim(),
    telephone: fields.telephone.trim(),
    ville: fields.ville.trim(),
    region: fields.region.trim(),
    metier: fields.metier.trim(),
    entreprise: fields.entreprise.trim(),
    domaine: fields.domaine,
    experience: fields.experience,
    competences: fields.competences.join(', '),
    bio: fields.bio.trim(),
    site_web: fields.site_web.trim(),
    linkedin: fields.linkedin.trim(),
    disponibilite: fields.disponibilite,
    type_service: fields.type_service,
    statut: 'EN ATTENTE',
    date_inscription: new Date().toLocaleDateString('fr-FR'),
    photo_base64: photoBase64,
    photo_mime: photoBase64 ? 'image/jpeg' : '',
  };

  try {
    await fetch(process.env.REACT_APP_SHEET_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSubmitted(true);
  } catch {
    setToast('Une erreur est survenue. Veuillez réessayer ou contacter le webmaster.');
  } finally {
    setLoading(false);
  }
}
```

### FontAwesome Icons to Import

```javascript
import {
  faCamera,    // photo zone placeholder
  faCheck,     // success screen checkmark
  faXmark,     // remove photo button, toast dismiss
  faSpinner,   // submit loading state
} from '@fortawesome/free-solid-svg-icons';
```

Note: `faSpinner` with Tailwind `animate-spin` replaces the `.spinner` CSS class from inscription.html.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `inscription.html` DOM manipulation | React controlled state + JSX | Phase 5 | XSS safety, component reuse |
| Alert popups for validation errors | Inline field errors | Phase 5 decision | UX improvement |
| Alert popup for network error | Auto-dismiss toast | Phase 5 decision | UX improvement |
| Hardcoded APPS_SCRIPT_URL in JS | `process.env.REACT_APP_SHEET_API_URL` | Established in Phase 1 | Env-configurable |

**Deprecated/outdated:**
- `inscription.html`: The static file is preserved untouched per project architecture ("CRA subdirectory pattern: annuaire-zb-react/ lives inside existing static site repo — existing HTML pages untouched"). The React form on `/inscription` route replaces it functionally within the SPA.

---

## Open Questions

1. **Drag-and-drop photo upload**
   - What we know: CONTEXT.md says "Cliquez ou glissez une photo" (the text includes "glissez")
   - What's unclear: Whether drag-and-drop needs to actually work or is just label text
   - Recommendation: Implement click-to-open only (the file input handles this). The "glissez" text is aspirational label text from inscription.html which also only implemented click. Skip drag-and-drop — not in locked decisions.

2. **DOMAINES constant: shared vs duplicated**
   - What we know: `DirectoryPage.jsx` already defines `const DOMAINES` (15 values, lines 9–25)
   - What's unclear: Whether to extract to a shared constant or duplicate in InscriptionPage
   - Recommendation: Duplicate in InscriptionPage.jsx for now — no shared constants file exists yet; extraction is a Phase 6 refactor concern.

3. **File size limit**
   - What we know: inscription.html checks `file.size > 5 * 1024 * 1024` (5MB) before compression
   - What's unclear: Whether to keep this check in the React version
   - Recommendation: Keep the 5MB check — add as a validation step in `handlePhotoChange`, set `errors.photo` if exceeded.

---

## Sources

### Primary (HIGH confidence)
- `inscription.html` — canonical field names, payload structure, canvas compression algorithm, GAS URL
- `annuaire-zb-react/src/hooks/useMemberFetch.js` — confirmed `process.env.REACT_APP_SHEET_API_URL` usage pattern
- `annuaire-zb-react/src/components/MemberModal.jsx` — two-column portrait layout, Tailwind token conventions
- `annuaire-zb-react/src/pages/DirectoryPage.jsx` — input/select CSS classes, DOMAINES array, FontAwesome usage
- `annuaire-zb-react/src/App.js` — confirmed `pt-16` wrapper (no extra top padding needed in InscriptionPage)
- `annuaire-zb-react/.env` — confirmed `REACT_APP_SHEET_API_URL` is set correctly

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` — confirmed "no-cors POST — show success screen on fetch resolve, never read response.ok or response.json()"
- `.planning/phases/05-registration-form/05-CONTEXT.md` — all locked decisions

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed and in use, no new dependencies
- Architecture: HIGH — patterns extracted directly from existing source files
- Pitfalls: HIGH — derived from reading the actual inscription.html code and established project decisions
- Field names: HIGH — extracted verbatim from inscription.html payload construction

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (stable — no external dependency changes, all source is local)
