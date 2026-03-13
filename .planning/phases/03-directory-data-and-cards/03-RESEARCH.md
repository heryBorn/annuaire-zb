# Phase 3: Directory Data and Cards - Research

**Researched:** 2026-03-13
**Domain:** React data fetching, card grid UI, skeleton loading, Tailwind CSS
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Card grid layout: **4 columns on desktop**
- Responsive breakpoints: Claude's discretion (expected 1 col mobile → 2 col tablet → 4 col desktop)
- Square photo fills the card width at the top (portrait/landscape cropped)
- Info stacked below photo: Name → Title → Company → Availability badge
- All 5 fields visible without clicking (photo, name, title, company, availability badge)
- No expand/detail interaction in this phase
- Card hover: shadow increases + slight scale zoom (`scale(1.02)`) via CSS transition — no JS

### Claude's Discretion
- Skeleton loading card design (full card shape shimmer recommended)
- Empty state design (text + optional subtle illustration)
- Stats counters placement and exact styling
- Availability badge colors and shape (dot + label vs pill badge)
- Card border-radius, internal padding, typography scale
- Exact responsive breakpoints

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DIR-01 | Member list fetched from Google Apps Script on page load (`?action=getMembers`) | GAS GET fetch pattern confirmed from existing index.html; `data.members` array shape documented below |
| DIR-02 | Skeleton card grid displayed while data is loading | Tailwind `animate-pulse` pattern; show N placeholder cards matching real card shape |
| DIR-03 | Member cards rendered in a responsive grid (photo, name, title, company, availability badge) | Tailwind grid cols + card layout; availability badge logic from existing app |
| DIR-04 | Stats counters displayed (total members, number of domains, available count) | Stats derivation logic confirmed from existing index.html; derived from `allMembers` array |
</phase_requirements>

---

## Summary

This phase builds the core directory feature: fetch member data from Google Apps Script and render it as a card grid. The existing `index.html` already implements this in vanilla JS and is the authoritative reference for data shape, API call pattern, and business logic. The React migration re-implements the same behavior with hooks and components.

The GAS endpoint returns `{ members: [...] }` via a plain GET fetch — no special CORS mode needed. The existing HTML app confirms this pattern works. Stats counters (total, domain count, available count) are derived client-side from the fetched array using the same logic already proven in the current app.

Skeleton loading uses Tailwind's built-in `animate-pulse` utility — no external library needed. The skeleton cards must match the shape of real cards (square image block + text rows below) so the layout does not shift on load. An empty-state message replaces the grid when the fetch returns zero members.

**Primary recommendation:** Lift all member state into `DirectoryPage`, implement a `useMemberFetch` custom hook for the GAS call, create a `MemberCard` and `SkeletonCard` component pair, and derive stats with `useMemo` from the members array.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React (useState + useEffect) | 19.x (already installed) | Local loading/data/error state | Native — no extra deps |
| Tailwind CSS | 3.4.x (already installed) | Card grid, skeleton, badge, hover effects | Already configured with project tokens |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| browser Fetch API | native | GET request to GAS endpoint | Already used in existing index.html for same endpoint |
| AbortController | native | Cleanup on component unmount | Prevents state-update-on-unmounted-component React warning |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| native fetch + useEffect | TanStack Query | TQ adds caching/retry/devtools but is overkill for a single fetch-on-mount call |
| Tailwind animate-pulse | react-loading-skeleton (npm) | External lib adds bundle weight; Tailwind solution is sufficient for this shape |
| useMemo for stats | Separate state | Separate state risks stale stats; useMemo keeps derived values always in sync |

**Installation:** No new packages needed. All dependencies are already installed.

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── Header.jsx          # existing — untouched
│   ├── MemberCard.jsx      # new — real card
│   ├── SkeletonCard.jsx    # new — pulse placeholder
│   └── AvailabilityBadge.jsx  # new — reusable badge (used in Phase 4+ too)
├── hooks/
│   └── useMemberFetch.js   # new — GAS fetch + loading/error state
└── pages/
    └── DirectoryPage.jsx   # extended — orchestrates fetch, grid, stats, empty state
```

### Pattern 1: Data Fetch Hook with AbortController
**What:** Custom hook encapsulates the GAS fetch, exposes `{ members, loading, error }`.
**When to use:** Any page-level data load that fires once on mount.
**Example:**
```jsx
// useMemberFetch.js
import { useState, useEffect } from 'react';

export function useMemberFetch() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const url = process.env.REACT_APP_SHEET_API_URL + '?action=getMembers';

    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        setMembers(data.members || []);
        setLoading(false);
      })
      .catch(err => {
        if (err.name === 'AbortError') return; // unmount cleanup — not a real error
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { members, loading, error };
}
```

### Pattern 2: Skeleton Grid — Same Shape as Real Card
**What:** Render N placeholder cards while `loading === true`. Each skeleton matches the real card's DOM shape so the grid doesn't shift when data arrives.
**When to use:** Any time data-driven cards are shown.
**Example:**
```jsx
// SkeletonCard.jsx
function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden shadow bg-white animate-pulse">
      {/* photo placeholder */}
      <div className="w-full aspect-square bg-sand" />
      {/* text rows */}
      <div className="p-4 space-y-2">
        <div className="h-4 bg-sand rounded w-3/4" />
        <div className="h-3 bg-sand rounded w-1/2" />
        <div className="h-3 bg-sand rounded w-2/3" />
        <div className="h-5 bg-sand rounded w-1/3 mt-3" />
      </div>
    </div>
  );
}
```
Show 8 skeleton cards while loading (fills two rows at 4-col desktop).

### Pattern 3: Stats Derived with useMemo
**What:** Compute total, domain count, and available count from the `members` array. Never store these as separate state.
**When to use:** Any computed values derived from a single source of truth.
**Example:**
```jsx
// Inside DirectoryPage
import { useMemo } from 'react';

const stats = useMemo(() => {
  const total   = members.length;
  const domains = new Set(members.map(m => m.domaine).filter(Boolean)).size;
  const avail   = members.filter(m =>
    m.disponibilite && m.disponibilite.includes('Disponible')
  ).length;
  return { total, domains, avail };
}, [members]);
```

### Pattern 4: Availability Badge Logic
**What:** Map `disponibilite` field to a color and label. Matches the existing app's `availClass()` function.
**Reference from existing index.html:**
```js
// availClass(d) — proven logic from index.html
if (!d) return 'grey';
if (d.includes('Disponible') && !d.includes('Partiel')) return 'green';  // sage
if (d.includes('Partiel') || d.includes('Recherche')) return 'orange';   // wheat
return 'grey';  // muted
```
**In React component — map to Tailwind color tokens:**
```jsx
// AvailabilityBadge.jsx
const badgeConfig = {
  green:  { bg: 'bg-sage',      dot: 'bg-sage',      label: 'Disponible'   },
  orange: { bg: 'bg-wheat/40',  dot: 'bg-wheat',     label: 'Partiellement'},
  grey:   { bg: 'bg-muted/20',  dot: 'bg-muted',     label: 'Non disponible'},
};
```

### Pattern 5: Card Hover — CSS Transitions Only
**What:** The "lift" effect is pure CSS. No JS event handlers.
**Example:**
```jsx
<div className="
  rounded-xl overflow-hidden shadow-md bg-white cursor-pointer
  transition-all duration-200 ease-out
  hover:shadow-xl hover:scale-[1.02]
">
```
Note: `hover:scale-[1.02]` uses Tailwind's arbitrary value syntax (available in Tailwind v3).

### Pattern 6: Responsive Grid
**What:** Tailwind responsive column classes on the grid container.
**Example:**
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* cards here */}
</div>
```
Breakpoints: 1 col default → 2 col at `sm` (640px) → 4 col at `lg` (1024px).

### Anti-Patterns to Avoid
- **Storing stats as separate useState:** Stats must be derived from `members` to stay in sync. Separate state will become stale.
- **Using `mode: 'no-cors'` for the GAS GET call:** The existing app proves a plain fetch works. `no-cors` produces an opaque response — `res.json()` will throw.
- **Photo layout without `aspect-square`:** Without a fixed aspect ratio, cards will vary in height based on image dimensions. Use `aspect-square` + `object-cover` on the image.
- **Conditional className strings with ternary chains:** Use a `badgeConfig` lookup object instead; it's readable and avoids className bugs.
- **Reading `.env` variable without `REACT_APP_` prefix:** CRA strips any env var that doesn't start with `REACT_APP_`. The current `.env` file uses `SHEET_API_URL` (wrong). The React code must use `process.env.REACT_APP_SHEET_API_URL`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Pulse skeleton animation | Custom CSS keyframe shimmer | `animate-pulse` (Tailwind) | Already available, consistent, one class |
| Derived stats recalculation | Manual recalculation on every render | `useMemo` (React built-in) | Memoizes and only recalculates when `members` changes |
| Fetch abort on unmount | Ignore or use stale `isMounted` flag | `AbortController` + `signal` | Web standard; prevents React "state update on unmounted component" warning |
| Availability color mapping | Inline ternaries in JSX | `badgeConfig` lookup object | Centralizes logic; reused by card, modal, future filter badge |

**Key insight:** All complex logic (stats, availability color, fetch lifecycle) already exists in `index.html`. Translate, don't invent.

---

## Common Pitfalls

### Pitfall 1: .env Variable Prefix Mismatch
**What goes wrong:** `process.env.REACT_APP_SHEET_API_URL` is `undefined` at runtime; fetch throws or sends to `undefined?action=getMembers`.
**Why it happens:** The current `.env` file has `SHEET_API_URL=...` (no `REACT_APP_` prefix). CRA only exposes variables with `REACT_APP_` prefix to client code.
**How to avoid:** Rename the variable in `.env` to `REACT_APP_SHEET_API_URL=...`. Restart the dev server after changing `.env`.
**Warning signs:** `fetch('undefined?action=getMembers')` error in browser console; `process.env.REACT_APP_SHEET_API_URL` logs as `undefined`.

### Pitfall 2: Photo Aspect Ratio Causing Layout Shift
**What goes wrong:** Cards have different heights because member photos are portrait, landscape, or missing — the grid looks ragged.
**Why it happens:** Without a constrained aspect ratio, `<img>` height depends on the image file.
**How to avoid:** Use `<div className="w-full aspect-square overflow-hidden">` wrapping `<img className="w-full h-full object-cover" />`. The skeleton card must also use `aspect-square` on the placeholder block.
**Warning signs:** Grid rows with uneven card heights visible after data loads.

### Pitfall 3: Skeleton Count Too Low or Too High
**What goes wrong:** Skeleton → real card transition is jarring (grid suddenly expands or collapses).
**Why it happens:** Showing fewer skeletons than expected real cards causes visible layout jump.
**How to avoid:** Show 8 skeleton cards (fills 2 full rows at 4-col desktop). This is a reasonable default for this directory size.
**Warning signs:** Visible grid height change on data load.

### Pitfall 4: GAS Response Shape Unvalidated
**What goes wrong:** `data.members` is `undefined`; `members.map()` throws.
**Why it happens:** GAS script might return `{ data: [...] }` or a different shape. The STATE.md flags this explicitly: "Google Apps Script response shape (`data.members`) assumed but not validated against live script — must verify in Phase 3."
**How to avoid:** Always use `data.members || []` as the fallback (matches existing index.html). Add a quick manual test: open the GAS URL directly in a browser and inspect the JSON response before wiring the fetch.
**Warning signs:** `Cannot read properties of undefined (reading 'map')` error; empty member list when live data should exist.

### Pitfall 5: `animate-pulse` Not Visible
**What goes wrong:** Skeleton cards show but do not animate.
**Why it happens:** `animate-pulse` only works when Tailwind's `animation` utilities are not disabled. In some minimal Tailwind configs the `animation` core plugin can be disabled.
**How to avoid:** No changes needed — the project's `tailwind.config.js` uses the default config with `plugins: []` and does not disable core plugins.
**Warning signs:** Skeleton renders as a static grey block with no pulsing.

---

## Code Examples

Verified patterns from official sources and existing project code:

### GAS Data Shape (from existing index.html — HIGH confidence)
```js
// Confirmed from existing index.html line 147
const data = await res.json();
allMembers = data.members || [];

// Member object fields confirmed from renderCards / cardHTML:
// m.nom, m.prenom, m.metier, m.entreprise (company)
// m.domaine, m.ville, m.region, m.disponibilite, m.type_service
// m.photo_url, m.email, m.telephone, m.bio, m.competences
```

### Stats Derivation (from existing index.html — HIGH confidence)
```js
// Confirmed from buildStats() in index.html lines 156-162
const total   = allMembers.length;
const domains = new Set(allMembers.map(m => m.domaine).filter(Boolean)).size;
const avail   = allMembers.filter(m =>
  m.disponibilite && m.disponibilite.includes('Disponible')
).length;
// Note: 'Disponible' includes both 'Disponible' and 'Partiellement disponible'
// The existing app counts both as "available" for the stat counter
```

### Tailwind animate-pulse (verified via Tailwind docs)
```jsx
// Full card shimmer — square image block + text rows
<div className="animate-pulse">
  <div className="w-full aspect-square bg-sand rounded-t-xl" />
  <div className="p-4 space-y-2">
    <div className="h-4 bg-sand rounded w-3/4" />
    <div className="h-3 bg-sand rounded w-1/2" />
    <div className="h-3 bg-sand rounded w-2/3" />
    <div className="h-5 bg-sand rounded-full w-1/3 mt-3" />
  </div>
</div>
```

### DirectoryPage Composition
```jsx
function DirectoryPage() {
  const { members, loading, error } = useMemberFetch();
  const stats = useMemo(() => deriveStats(members), [members]);

  return (
    <main className="px-6 py-8 max-w-7xl mx-auto">
      <StatsBar stats={stats} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : members.length === 0
            ? <EmptyState />
            : members.map(m => <MemberCard key={m.email || m.nom} member={m} />)
        }
      </div>
    </main>
  );
}
```

### Card Photo with Fallback Initials
```jsx
// Mirrors existing index.html initials() pattern for missing photos
function MemberCard({ member: m }) {
  const initials = ((m.prenom || '?')[0] + (m.nom || '?')[0]).toUpperCase();
  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white
                    transition-all duration-200 ease-out
                    hover:shadow-xl hover:scale-[1.02]">
      <div className="w-full aspect-square overflow-hidden bg-sand flex items-center justify-center">
        {m.photo_url
          ? <img src={m.photo_url} alt={m.prenom} className="w-full h-full object-cover" />
          : <span className="font-serif text-3xl text-muted">{initials}</span>
        }
      </div>
      <div className="p-4">
        <p className="font-serif font-semibold text-ink">{m.prenom} {m.nom}</p>
        <p className="font-sans text-sm text-muted mt-0.5">{m.metier || '—'}</p>
        <p className="font-sans text-sm text-muted">{m.entreprise || ''}</p>
        <AvailabilityBadge disponibilite={m.disponibilite} />
      </div>
    </div>
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `isMounted` flag anti-pattern | AbortController + signal | ~2020 (browsers) | Cleaner cleanup, no React warning |
| Spinner/loading bar | Skeleton placeholder cards | ~2018 (Facebook, LinkedIn) | Reduces perceived load time, avoids layout shift |
| Storing derived values in state | `useMemo` for derived data | React Hooks era (2019+) | Eliminates sync bugs between source and derived state |

**Deprecated/outdated:**
- `isMounted` flag in useEffect cleanup: replaced by AbortController; React 18+ StrictMode double-invokes effects, making isMounted pattern fragile.
- Separate `domains` / `availableCount` state vars: use `useMemo` derived from `members`.

---

## Open Questions

1. **GAS response field name for company**
   - What we know: `index.html` references `m.entreprise` in `cardHTML()` and the search text join (`[m.nom, m.prenom, m.metier, m.bio, m.competences, m.entreprise]`)
   - What's unclear: REQUIREMENTS.md says "company" field in card — need to confirm the GAS JSON key is exactly `entreprise` (not `company` or `societe`)
   - Recommendation: Before implementing MemberCard, open `REACT_APP_SHEET_API_URL?action=getMembers` in a browser tab and inspect one member object to confirm all field names. Use `m.entreprise` per existing evidence.

2. **`.env` variable name mismatch**
   - What we know: `.env` has `SHEET_API_URL=...`; SCAF-06 says `REACT_APP_SHEET_API_URL`; existing React source has no `process.env` reference yet
   - What's unclear: Which is the authoritative name?
   - Recommendation: Wave 0 task must rename `.env` variable to `REACT_APP_SHEET_API_URL` and verify `process.env.REACT_APP_SHEET_API_URL` is non-undefined in the browser. Dev server restart required.

---

## Sources

### Primary (HIGH confidence)
- Existing `index.html` (project source) — GAS API URL, data fetch pattern, `data.members` shape, all member field names, stats derivation logic, availability color logic
- Tailwind CSS v3 official docs — `animate-pulse`, `aspect-square`, `object-cover`, `hover:scale-[x]`, responsive grid cols
- React 19 official docs — `useState`, `useEffect`, `useMemo`, AbortController cleanup pattern

### Secondary (MEDIUM confidence)
- WebSearch: React custom hook with AbortController — multiple 2024-2025 sources confirm the pattern; aligns with React docs
- WebSearch: Tailwind skeleton with animate-pulse — confirmed by Tailwind official docs and Flowbite docs

### Tertiary (LOW confidence)
- WebSearch: GAS CORS GET behavior — multiple sources confirm plain GET fetch works when GAS sets CORS headers, but the live script behavior is unconfirmed until Phase 3 dev testing

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libs already installed, versions known
- Architecture: HIGH — patterns derived from existing working app code
- Data shape: HIGH — confirmed from existing index.html field references
- GAS CORS behavior: MEDIUM — existing app proves GET fetch works; live script not re-tested in React context
- Pitfalls: HIGH — .env naming issue confirmed from file inspection; others from React docs

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (stable domain — Tailwind v3, React 19, GAS API unchanged)
