# ARCHITECTURE.md — React App Structure

**Research date:** 2026-03-09
**Context:** CRA React SPA for annuaire ZB migration

---

## Recommended Folder Structure

```
annuaire-zb/
├── public/
│   ├── index.html
│   └── images/
│       └── logo_zb_trans.png       # Copied from assets/images/
├── src/
│   ├── index.js                    # CRA entry point
│   ├── index.css                   # Tailwind directives (@tailwind base/components/utilities)
│   ├── App.js                      # Router setup
│   ├── pages/
│   │   ├── DirectoryPage.js        # / route — fetches members, manages filter state
│   │   └── InscriptionPage.js      # /inscription route — form state, submission
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.js           # Sticky header, logo, CTA
│   │   ├── directory/
│   │   │   ├── HeroSection.js      # Stats + search bar
│   │   │   ├── FilterBar.js        # City/domain/availability/service dropdowns
│   │   │   ├── MemberGrid.js       # Responsive card grid
│   │   │   ├── MemberCard.js       # Individual card
│   │   │   ├── MemberModal.js      # Full profile overlay
│   │   │   ├── SkeletonCard.js     # Loading placeholder
│   │   │   └── EmptyState.js       # No results message
│   │   ├── inscription/
│   │   │   ├── PhotoUpload.js      # File input + canvas compress + preview
│   │   │   ├── FormSection.js      # Grouped fields with heading
│   │   │   └── SuccessScreen.js    # Post-submission confirmation
│   │   └── shared/
│   │       └── AvailabilityBadge.js # Colored dot + label (reused in card + modal)
│   ├── hooks/
│   │   └── useMembers.js           # Fetch + filter logic extracted to custom hook
│   └── utils/
│       ├── compressImage.js        # Canvas compression (migrated from inscription.html)
│       └── filterMembers.js        # Pure filter function (easy to test)
├── .env                            # REACT_APP_SHEET_API_URL=...
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Component Hierarchy

```
App
├── Header (rendered on all routes)
├── Routes
│   ├── / → DirectoryPage
│   │   ├── HeroSection
│   │   │   └── [stats, search input]
│   │   ├── FilterBar
│   │   ├── MemberGrid
│   │   │   ├── MemberCard × N
│   │   │   ├── SkeletonCard × N (loading state)
│   │   │   └── EmptyState (no results)
│   │   └── MemberModal (conditionally rendered, null when closed)
│   └── /inscription → InscriptionPage
│       ├── FormSection × N (personal / professional / photo)
│       │   └── [form fields]
│       ├── PhotoUpload
│       └── SuccessScreen (replaces form after submit)
```

---

## State Management

**Approach: useState + props (no external library)**

Scale is small (2 pages, one data source). No need for Redux/Zustand/Context.

| State | Where | What |
|-------|-------|------|
| `members` | `DirectoryPage` | Full member list from API |
| `loading` | `DirectoryPage` | Boolean, shows skeleton grid |
| `error` | `DirectoryPage` | Error message if fetch fails |
| `filters` | `DirectoryPage` | `{ query, ville, domaine, dispo, service }` |
| `selectedMember` | `DirectoryPage` | Member object or null (modal open/closed) |
| `formData` | `InscriptionPage` | All form field values |
| `photoData` | `InscriptionPage` | `{ base64, mimeType }` from canvas |
| `submitting` | `InscriptionPage` | Disables button during POST |
| `submitted` | `InscriptionPage` | Shows SuccessScreen |

---

## Data Fetching Pattern

**Pattern: `useEffect` + `fetch` in custom hook `useMembers`**

```js
// src/hooks/useMembers.js
export function useMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SHEET_API_URL}?action=getMembers`)
      .then(r => r.json())
      .then(data => setMembers(data.members || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { members, loading, error };
}
```

No react-query — single fetch on mount, no cache invalidation needed.

---

## Tailwind Theme Extension

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        soil: '#2C1A0E',
        terracotta: '#C1440E',
        sand: '#F5E6C8',
        wheat: '#E8C97A',
        sage: '#6B8F71',
        cream: '#FAF5EC',
        ink: '#1A1108',
        muted: '#8A7A6A',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
```

---

## Build Order (phase dependencies)

```
Phase 1: Project scaffold
  → CRA init, Tailwind setup, FontAwesome install, React Router config, .env wiring
  → Nothing depends on this being done — it unblocks everything

Phase 2: Layout + routing shell
  → App.js with Routes, Header component, basic page components
  → Depends on: Phase 1

Phase 3: Directory page — data + cards
  → useMembers hook, MemberCard, MemberGrid, SkeletonCard, EmptyState
  → Depends on: Phase 2

Phase 4: Directory page — filter + modal
  → FilterBar, HeroSection (stats), MemberModal
  → Depends on: Phase 3 (needs members data)

Phase 5: Registration page
  → InscriptionPage, PhotoUpload, FormSection, SuccessScreen, form submission
  → Depends on: Phase 2 (Header + routing only)

Phase 6: Design polish
  → Tailwind refinements, responsive layout, animations, FontAwesome icons throughout
  → Depends on: Phases 3-5 (all components exist)
```

---

## .env Usage in CRA

CRA exposes env variables with `REACT_APP_` prefix automatically at build time:

```
# .env (rename existing key)
REACT_APP_SHEET_API_URL=https://script.google.com/macros/s/...
```

Access in JS:
```js
process.env.REACT_APP_SHEET_API_URL
```

**Important:** `.env` must be in project root (same level as `package.json`). Changes to `.env` require restarting the dev server.

---

*Architecture research: 2026-03-09*
