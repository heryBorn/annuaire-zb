# Phase 4: Directory Filters and Modal - Research

**Researched:** 2026-03-14
**Domain:** React 18 / CRA — controlled filters, reactive state, accessible modal with animations
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Modal Layout: Centered portrait**
Photo is centered at the top of the modal as a square/round avatar. Name and title are centered below the photo. Content sections (bio, skills, contact, availability) are stacked below in a single column.

```
┌────────────────────────────────────┐
│  [×]                               │
│         ┌──────┐                   │
│         │photo │                   │
│         └──────┘                   │
│        Jean Dupont                 │
│      Développeur web               │
│       Acme Corp                    │
│      ● Disponible                  │
├────────────────────────────────────┤
│  Bio (full, untruncated)           │
│  Compétences: tag tag tag          │
│  Localisation: Ville, Région       │
│  Liens: LinkedIn / Site web        │
│  [ Email ]   [ Appeler ]           │
└────────────────────────────────────┘
```

**Modal Animation: Fade + scale up**
- Overlay: `opacity 0 → 1`, ~200ms ease-out
- Modal card: `scale(0.95) → scale(1)` + `opacity 0 → 1`, ~200ms ease-out
- Exit: reverse (scale down + fade out)
- Use CSS transition classes (Tailwind `transition`, `duration-200`, `ease-out`) — no animation library needed

**Modal Size: Medium centered**
- `max-w-xl` (576px) on desktop
- Centered horizontally and vertically with dark semi-transparent overlay (`bg-black/50`)
- Modal body is scrollable (`overflow-y-auto`) if content overflows viewport height
- On mobile: full-width with horizontal padding, vertically centered

**Modal Close Behavior: All three close triggers**
1. Click dark overlay (outside modal card)
2. Press `Escape` key (`useEffect` + `keydown` listener, cleaned up on unmount)
3. `×` close button in top-right corner of modal

When modal is open, body scroll is locked (`overflow-hidden` on `document.body`).

**Modal Fields (Full Profile vs Card)**
Card shows: photo, name, title, company, domaine badge, ville + region, bio (line-clamp-2), email + phone footer.

Modal additionally shows:
- **Full bio** — same `bio` field, no line-clamp, full text
- **Disponibilité** — availability badge (removed from card but shown in full profile)
- **Réseaux sociaux / liens** — `linkedin`, `site_web` fields if present; render as icon links
- **Compétences / skills** — `competences` or `skills` field if present; render as pill tags

Fields that may be absent on some members are hidden gracefully (no empty sections).

**Bug to Fix in This Phase**
- **Search clear bug**: Clicking "Rechercher" multiple times doesn't always clear previous results before new ones arrive. `flushSync` was attempted but not resolving. Fix must happen in Phase 4 as part of the filter work. Consider replacing the async `runSearch` pattern with a `useReducer` or explicit `searchKey` trigger approach.

### Claude's Discretion

No explicit discretion areas noted in CONTEXT.md. The planner has discretion over:
- How to split the work into plans/tasks
- Exact approach for fixing the search-clear bug (useReducer vs refactor)
- Whether to use `ReactDOM.createPortal` for modal rendering
- Filter interaction UX resolution (see Open Questions below)

### Deferred Ideas (OUT OF SCOPE)
- URL-based filter state (shareable filtered links) — noted for Phase 6 polish
- Keyboard navigation between modal and card grid — noted for Phase 6 polish
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DIR-05 | Text search filtering members by name, job title, company, skills, bio | `applyFilters()` already exists in DirectoryPage; needs to be wired to live input change instead of button click |
| DIR-06 | Four dropdown filters: city, domain, availability, service type | All four dropdowns already exist; fix: decouple filter from fetch — apply locally against cached `members` state |
| DIR-07 | Empty state message shown when search/filter returns no results | `NoResults` component already exists; ensure it renders when `results.length === 0` after initial load |
| DIR-08 | Member detail modal opens on card click with full profile (photo, contact links, bio, skills, availability) | New `MemberModal.jsx` component; `MemberCard` needs `onClick` prop wired; `DirectoryPage` needs `selectedMember` state |
| DIR-09 | Modal closeable via close button, clicking overlay, or Escape key | `useEffect` keydown listener + overlay `onClick` + × button; body scroll lock via `document.body.style.overflow` |
</phase_requirements>

---

## Summary

Phase 4 builds on a DirectoryPage that already has the visual scaffold — text input, four dropdowns, filter constants, `applyFilters()` function, and `NoResults`/`EmptyPrompt` components. The core work is an architectural refactor of the data flow plus a new modal component. The current implementation fetches data fresh on every button click (`runSearch()` triggers a network call), which makes dropdowns second-class citizens — they can't filter without a network round-trip. The fix is to decouple data loading from filter application: load all members once on page load (or on first "Rechercher"), cache them in state, then apply filters reactively against the in-memory cache.

The search-clear bug stems directly from this architecture: `flushSync` was attempted to force synchronous state clearing before the async fetch, but cannot guarantee the DOM clears before the new results arrive in a single React 18 render batch. The correct fix is to separate `allMembers` (the loaded dataset, never cleared) from `activeFilters` (the current filter values), and derive `filteredResults` via `useMemo`. This eliminates race conditions entirely because filtering is synchronous and derived, not async.

The modal is a new component (`MemberModal.jsx`) requiring: centered fixed-position overlay, Escape key listener via `useEffect`, body scroll lock on mount/unmount, fade+scale animation via Tailwind transition classes, and graceful null-rendering for optional fields (competences, site_web, linkedin). The animation requires a controlled mount/unmount pattern — the component must be in the DOM briefly before entering visible state, which is achieved via a small `setTimeout`-free approach using CSS `transition` triggered after mount.

**Primary recommendation:** Refactor DirectoryPage to load all members once on mount (or first search), derive filtered results via `useMemo`, make dropdowns and text input immediately reactive against cached data, then build MemberModal as a portal-rendered component with proper keyboard and focus management.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 18 | 18.x (already installed) | Component rendering, hooks | Project requirement |
| TailwindCSS v3 | 3.x (already installed) | Utility-class styling including transitions | Project requirement |
| FontAwesome SVG | already installed | Icons in modal (linkedin, globe, x-mark, etc.) | Project requirement |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| ReactDOM.createPortal | built into React | Render modal outside component tree (avoids z-index/stacking-context traps) | Use for modal to guarantee it sits above all content |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS transitions via Tailwind | Framer Motion / React Spring | Project has no animation library; Tailwind transitions are sufficient for 200ms fade+scale |
| createPortal | Inline modal in DirectoryPage JSX | Without portal, fixed positioning can be trapped by a parent with `transform` or `overflow:hidden`; portal is safer |
| useMemo for filtering | useEffect + setState for filtering | useMemo is synchronous and avoids async state batching issues entirely |

**Installation:** No new packages required.

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── pages/
│   └── DirectoryPage.jsx     # Refactored: loads members once, derives filtered results via useMemo
├── components/
│   ├── MemberCard.jsx         # Add onClick prop
│   ├── MemberModal.jsx        # NEW: full profile modal
│   ├── AvailabilityBadge.jsx  # Already exists — reuse in modal
│   ├── SkeletonCard.jsx       # Unchanged
│   └── Header.jsx             # Unchanged
└── hooks/
    └── useMemberFetch.js      # Unchanged (but now actually used by DirectoryPage)
```

### Pattern 1: Decouple Load from Filter

**What:** Members are loaded once; filters are applied reactively against the cached dataset using `useMemo`.

**When to use:** Any time filtering operates on a client-side dataset — eliminates async race conditions and enables immediate filter reactivity.

**Example:**
```jsx
// DirectoryPage.jsx — simplified architecture after refactor
import { useMemberFetch } from '../hooks/useMemberFetch';

function DirectoryPage() {
  const [trigger, setTrigger] = useState(0);
  const { members, loading, error } = useMemberFetch({ trigger });

  const [query, setQuery]               = useState('');
  const [filterDomaine, setFilterDomaine] = useState('');
  const [filterVille, setFilterVille]   = useState('');
  const [filterDispo, setFilterDispo]   = useState('');
  const [filterService, setFilterService] = useState('');

  const [hasSearched, setHasSearched]   = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Derived synchronously — no async, no race condition
  const filteredResults = useMemo(() => {
    if (!hasSearched) return [];
    return applyFilters(members, {
      q: query.trim().toLowerCase(),
      domaine: filterDomaine,
      ville: filterVille,
      dispo: filterDispo,
      service: filterService,
    });
  }, [members, query, filterDomaine, filterVille, filterDispo, filterService, hasSearched]);

  function handleSearch() {
    if (!hasSearched) {
      setHasSearched(true);
      setTrigger(t => t + 1); // triggers fetch once
    }
    // After first load, filteredResults updates reactively via useMemo
  }
  // ...
}
```

**Key insight on the search-first UX conflict:** The roadmap says "narrows immediately" for dropdowns but the original design was "search-first" (show nothing until Rechercher is clicked). The resolution: keep search-first for the initial data load (first click of Rechercher fetches from API), but after that first load, dropdowns and text input filter reactively against the cached dataset without another fetch. This satisfies both requirements: initial search intent is preserved, and subsequent filter changes are immediate.

### Pattern 2: Modal with Tailwind Transition Animation

**What:** CSS-only fade+scale modal using Tailwind transition utilities. The trick is to mount the modal first with `opacity-0 scale-95`, then on the next paint apply `opacity-100 scale-100`, which triggers the CSS transition.

**When to use:** Simple enter/exit animations without animation library overhead.

**Example:**
```jsx
// MemberModal.jsx
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function MemberModal({ member, onClose }) {
  const [visible, setVisible] = useState(false);

  // Trigger enter animation after mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Body scroll lock
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, []);

  // Escape key
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return ReactDOM.createPortal(
    // Overlay
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50
        transition-opacity duration-200 ease-out
        ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      {/* Modal card — stop propagation so overlay click doesn't fire through card */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto
          transition-all duration-200 ease-out
          ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* × close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-ink transition-colors"
          aria-label="Fermer"
        >
          <FontAwesomeIcon icon={faXmark} className="text-lg" />
        </button>

        {/* Content */}
        <ModalContent member={member} onClose={onClose} />
      </div>
    </div>,
    document.body
  );
}
```

**Exit animation caveat:** Pure CSS transitions require the element to stay mounted during the exit animation before unmount. In this project, the simplest approach is to skip the exit animation (unmount immediately on close trigger) since the context notes "reverse on close" but the complexity of deferring unmount is significant without an animation library. If exit animation is required, use a boolean `isClosing` state + `onTransitionEnd` to defer `onClose()`. Given the 200ms duration and no animation library, the planner should decide whether to implement exit animation or omit it as a Phase 6 polish item.

### Pattern 3: Overlay Click Without Closing Modal Card

**What:** The overlay `div` has `onClick={onClose}`, and the modal card `div` has `onClick={e => e.stopPropagation()}`. This ensures clicking inside the card does not close the modal.

**When to use:** Always for modals.

### Anti-Patterns to Avoid

- **Fetching on every filter change:** Network round-trips for each dropdown change cause lag and race conditions. Cache members in state after first fetch; filter in memory.
- **Using `flushSync` to clear async results:** `flushSync` is for synchronous DOM updates; it cannot prevent an async fetch from resolving after the flush. The root cause is async state, not render batching.
- **Setting `overflow-hidden` on `<html>` instead of `<body>`:** `document.documentElement` (html) scroll lock can cause layout shift on scrollbar hide. Use `document.body.classList.add('overflow-hidden')` instead.
- **Modal z-index fights:** Rendering modal inside a component with `transform` creates a new stacking context and traps `position: fixed`. Use `ReactDOM.createPortal(…, document.body)` to escape.
- **Unmounting modal before transition ends:** If the modal is unmounted immediately on close, the exit transition never plays. Either accept no exit animation, or use `onTransitionEnd` to defer unmount.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Debounced text search | Custom debounce logic | `useMemo` with direct state (no debounce needed for client-side filtering of ~200 members) | Dataset is small; filtering is synchronous and near-instant; debounce adds complexity without benefit at this scale |
| Focus trap in modal | Custom focus-trap implementation | Omit for now (Phase 6 a11y polish) or use simple first/last focusable element approach | Full focus-trap implementation is complex; project scope does not require WCAG 2.1 AA compliance |
| Animation on exit | Custom setTimeout/state machine | Accept no exit animation in Phase 4, or use simple `onTransitionEnd` callback | Framer Motion not in stack; hand-rolling a correct unmount-after-transition state machine is error-prone |

**Key insight:** For a dataset of ~200 members, all filtering is O(n) in-memory. There is no need for memoized search indexes, debouncing, or virtualization at this scale.

---

## Common Pitfalls

### Pitfall 1: The Search-Clear Bug Root Cause

**What goes wrong:** Clicking Rechercher twice in quick succession shows old results while new fetch is in flight, or new results appear before DOM has cleared old ones.
**Why it happens:** Current `runSearch()` fetches from the network AND applies filters in the same async function. `flushSync` forces synchronous state update for the "loading" phase, but when the fetch resolves, React batches `setMembers` + `setResults` + `setPhase` in one commit — which may still show a flash of old results if rendering is interleaved.
**How to avoid:** Move to `useMemberFetch` hook (which already has `AbortController`) + derived `useMemo` filtering. Members load once; the "loading" state comes from the hook; filtered results are synchronously derived. No async state machine needed in the page component.
**Warning signs:** If you still see a `results` state array that is set imperatively (not derived), the bug is still present.

### Pitfall 2: Stacking Context Trapping Fixed Modal

**What goes wrong:** `position: fixed` modal renders inside the viewport but is visually clipped or behind other content.
**Why it happens:** Any ancestor with `transform`, `filter`, `will-change`, or `perspective` creates a new stacking context that traps `fixed` children.
**How to avoid:** Use `ReactDOM.createPortal(modalJSX, document.body)` to render outside the component tree.
**Warning signs:** Modal appears but is behind the header, or `fixed inset-0` doesn't cover full viewport.

### Pitfall 3: Overlay onClick Fires on Modal Card Clicks

**What goes wrong:** Clicking anywhere inside the modal (buttons, text, images) closes the modal.
**Why it happens:** Click events bubble from the card up to the overlay.
**How to avoid:** Add `onClick={e => e.stopPropagation()}` on the modal card container.
**Warning signs:** Modal closes when clicking the × button instead of just when clicking the dark area.

### Pitfall 4: Body Scroll Lock Cleanup Missed

**What goes wrong:** Page stays locked (can't scroll) after modal closes.
**Why it happens:** `document.body.classList.add('overflow-hidden')` added on mount but not removed on unmount (missing cleanup in `useEffect` return).
**How to avoid:** Always use the `useEffect` cleanup function to remove the class.
**Warning signs:** After closing a modal, page content is not scrollable.

### Pitfall 5: requestAnimationFrame vs useLayoutEffect for Enter Animation

**What goes wrong:** Modal appears fully visible instantly (no animation) despite CSS transition classes.
**Why it happens:** If `visible=true` is set in the same render as mount, React never paints the `opacity-0 scale-95` state, so the browser has nothing to transition from.
**How to avoid:** Use `requestAnimationFrame(() => setVisible(true))` inside `useEffect` to ensure one paint occurs with the initial class before applying the final class.
**Warning signs:** Modal "pops" in at full opacity with no fade/scale transition.

### Pitfall 6: Cities Dropdown Populates Only After First Search

**What goes wrong:** The "Toutes les villes" dropdown is empty until Rechercher is clicked, because cities are derived from `members` which starts empty.
**Why it happens:** Current architecture: members only load after the button click.
**How to avoid:** After the first data load, `members` is cached and never cleared (only filters change). The cities dropdown will populate on first search and stay populated for all subsequent filter changes.
**Note:** This is acceptable behavior for the search-first UX — the dropdown becomes useful after first load, same as `index.html`.

---

## Code Examples

### Reactive Filter with useMemo (no fetch on filter change)

```jsx
// Source: React 18 docs — useMemo for derived state
const filteredResults = useMemo(() => {
  if (!hasSearched || loading) return [];
  return members.filter(m => {
    const text = [m.nom, m.prenom, m.metier, m.bio, m.competences, m.entreprise]
      .join(' ').toLowerCase();
    if (query && !text.includes(query.trim().toLowerCase())) return false;
    if (filterDomaine && m.domaine !== filterDomaine) return false;
    if (filterVille   && m.ville   !== filterVille)   return false;
    if (filterDispo   && !(m.disponibilite || '').includes(filterDispo)) return false;
    if (filterService && m.type_service !== filterService) return false;
    return true;
  });
}, [members, query, filterDomaine, filterVille, filterDispo, filterService, hasSearched, loading]);
```

### Body Scroll Lock via useEffect

```jsx
// Source: MDN Web Docs — classList API
useEffect(() => {
  document.body.classList.add('overflow-hidden');
  return () => {
    document.body.classList.remove('overflow-hidden');
  };
}, []);
```

### Escape Key Listener

```jsx
// Source: React 18 docs — useEffect cleanup
useEffect(() => {
  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose();
  }
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [onClose]);
```

### Modal Enter Animation via requestAnimationFrame

```jsx
// Pattern: mount with invisible state, trigger transition after first paint
const [isVisible, setIsVisible] = useState(false);
useEffect(() => {
  const raf = requestAnimationFrame(() => setIsVisible(true));
  return () => cancelAnimationFrame(raf);
}, []);
// Apply classes conditionally:
// overlay:  isVisible ? 'opacity-100' : 'opacity-0'
// card:     isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
```

### Competences/Skills Pill Tags

```jsx
// Member data field: m.competences — may be a comma-separated string or absent
const pills = m.competences
  ? m.competences.split(',').map(s => s.trim()).filter(Boolean)
  : [];

{pills.length > 0 && (
  <div className="flex flex-wrap gap-1.5">
    {pills.map(skill => (
      <span key={skill} className="bg-sand text-ink font-sans text-xs px-2.5 py-0.5 rounded-full">
        {skill}
      </span>
    ))}
  </div>
)}
```

### AvailabilityBadge Reuse in Modal

```jsx
// AvailabilityBadge already exists in src/components/AvailabilityBadge.jsx
// Reuse directly in MemberModal — consistent with card grid usage
import AvailabilityBadge from './AvailabilityBadge';

{m.disponibilite && <AvailabilityBadge status={m.disponibilite} />}
```

### MemberCard onClick Wiring

```jsx
// MemberCard.jsx — add onClick prop
function MemberCard({ member: m, onClick }) {
  return (
    <div
      className="... cursor-pointer ..."
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
    >
      {/* existing content — unchanged */}
      {/* footer links need e.stopPropagation() — already present */}
    </div>
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| `runSearch()` fetches fresh on every click | Load once via `useMemberFetch`, derive results via `useMemo` | Eliminates search-clear bug; dropdowns filter immediately after first load |
| `flushSync` for race condition fix | Separate data state from filter state (no async in filter path) | Correct fix for root cause vs symptom |
| Modal as sibling div in page JSX | `ReactDOM.createPortal` to `document.body` | Avoids stacking context issues from transform ancestors |

**Deprecated/outdated patterns:**
- `flushSync` for async race conditions: `flushSync` is for synchronous DOM measurement/layout, not for ensuring async operations complete in order. Remove from the refactored code.
- Inline fetch in page component alongside filter logic: separates concerns poorly; fetch belongs in the hook.

---

## Open Questions

1. **Search-first UX resolution: when do dropdowns become "live"?**
   - What we know: Roadmap says "narrows immediately"; CONTEXT.md says search-first was a deliberate decision; current code requires Rechercher button to load data at all
   - What's unclear: Should dropdowns work immediately on page load (auto-fetch on mount), or only after first Rechercher click?
   - Recommendation: Trigger the fetch automatically on page mount (remove the button-gated data load). The Rechercher button becomes a "re-fetch" / "reset" affordance. This satisfies the roadmap "immediately" criterion and simplifies the architecture. If the user wants to preserve the manual-fetch UX strictly, dropdowns can remain inert until first click — but then they should visually indicate they're disabled.

2. **Exit animation: implement or defer?**
   - What we know: CONTEXT.md says "reverse on close"; implementing unmount-after-transition without animation library requires a state machine
   - What's unclear: Is the exit animation a must-have for Phase 4 or can it be Phase 6 polish?
   - Recommendation: Implement a simple exit animation using `isClosing` boolean + `onTransitionEnd` callback. This is ~10 lines and avoids a Phase 6 revisit of the modal component. If it proves tricky, omit and add to Phase 6 DES-04 scope.

3. **`m.competences` data shape**
   - What we know: Field name assumed to be `competences` based on context; may be comma-separated string
   - What's unclear: Actual field name and format in the Google Apps Script response — could be `skills`, `competences`, both, or neither
   - Recommendation: Code defensively — check both `m.competences` and `m.skills`, handle string (split on comma) and array both. If field is absent, hide the section gracefully.

4. **`site_web` field format**
   - What we know: Context mentions `site_web` as a field for the modal
   - What's unclear: Whether the value includes `https://` prefix or not
   - Recommendation: Normalize: if value doesn't start with `http`, prepend `https://`. Use `faGlobe` icon from FontAwesome free-solid for the link.

---

## Sources

### Primary (HIGH confidence)
- React 18 official docs (https://react.dev/reference/react/useMemo) — useMemo for derived state
- React 18 official docs (https://react.dev/reference/react-dom/createPortal) — portal rendering for modals
- React 18 official docs (https://react.dev/reference/react/useEffect) — cleanup pattern for event listeners and DOM mutations
- Direct code inspection of DirectoryPage.jsx, MemberCard.jsx, useMemberFetch.js (project files, read 2026-03-14)

### Secondary (MEDIUM confidence)
- TailwindCSS v3 docs (https://tailwindcss.com/docs/transition-property) — transition utilities for fade+scale animation
- MDN Web Docs — classList API for body scroll lock

### Tertiary (LOW confidence)
- `requestAnimationFrame` trick for CSS transition after mount: widely documented pattern, not verified against official React docs but consistent with React rendering model

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages; all tools already installed and in use
- Architecture (filter refactor): HIGH — root cause of search-clear bug identified from direct code inspection; `useMemo` derivation is idiomatic React
- Architecture (modal): HIGH — `createPortal` + `useEffect` patterns are core React; verified in React 18 docs
- Animation pattern: MEDIUM — `requestAnimationFrame` for transition trigger is a known pattern; could also use `useLayoutEffect` (both work)
- Data field names (`competences`, `site_web`): LOW — assumed from context; actual API shape not verified

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (stable stack; React 18 + Tailwind v3 are not in active churn)
