# Phase 2: Layout Shell - Research

**Researched:** 2026-03-13
**Domain:** React component layout, Tailwind CSS sticky/fixed positioning, React Router v6 Link navigation
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Header visual style
- Background: `bg-soil` (#2C1A0E) — dark brown, strong brand presence
- Height: `h-14` (56px) — compact, leaves maximum space for content
- Shadow: `shadow-md` always visible — floats above content, reinforces sticky feel
- No conditional scroll-based shadow (no JS state needed)

#### Scroll behavior
- Always fixed at top: `position: fixed` or `sticky top-0`
- Shadow is always present — no scroll listener required
- Content below must have top padding/margin equal to header height to avoid overlap

#### Mobile treatment
- Logo and CTA button visible on all screen sizes — no hamburger, no collapse
- Logo scales: `h-7` on mobile → `h-8` on `sm:` and above
- CTA shows full text "Rejoindre" on all breakpoints — no abbreviated version

#### Logo + CTA layout
- Layout: logo left, CTA right — flex justify-between items-center, full width with horizontal padding
- CTA style: `bg-terracotta text-cream` (filled, warm) — stands out on the dark soil header
- CTA navigates to `/inscription` via React Router `<Link>` (no browser navigation event)

### Claude's Discretion
- Exact padding values inside the header (px-4 vs px-6 vs px-8)
- Button border-radius and font-weight on the CTA
- Whether to use `sticky` or `fixed` (both satisfy the requirement — use whichever avoids layout jank in CRA)
- Inner max-width container (e.g. `max-w-7xl mx-auto`) if needed for wide screens

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LAYT-01 | Sticky header with logo (image + text) and "Rejoindre" CTA button linking to /inscription | React Router v6 `<Link to="/inscription">` enables SPA navigation; Tailwind `sticky top-0` or `fixed top-0 left-0 right-0` + `z-50` provides always-visible header; `h-14 flex items-center justify-between` implements height and layout |
| LAYT-02 | Header is shared across both routes | Header component rendered above `<Routes>` in App.js (or via nested layout route with `<Outlet>`) — both approaches work with current CRA + React Router v6 setup |
</phase_requirements>

---

## Summary

Phase 2 adds a persistent `<Header>` component rendered above both route stubs. The existing CRA project already has React Router v6 (`react-router-dom` v6.30.3), Tailwind v3 with the full custom color palette (soil, terracotta, cream), and the logo asset at `public/images/logo_zb_trans.png`. No new packages need to be installed.

The two viable placement strategies are: (1) render `<Header>` directly in `App.js` above `<Routes>` — simplest, works immediately — and (2) use a nested layout route with `<Outlet>` — more scalable for later phases. Given that Phase 1 already scaffolded `App.js` as the routing root, and later phases (3–6) will add content inside page stubs rather than new layout layers, the direct-in-App approach is sufficient and avoids unnecessary route nesting at this stage.

The sticky/fixed positioning choice is the only open discretion item of consequence. `sticky top-0` works when no ancestor has `overflow: hidden/auto` — the current App.js has no such ancestor, so sticky is safe. `fixed top-0 left-0 right-0` is more robust against future parent wrapper changes but requires compensating `pt-14` on the page root below. Either is correct; `fixed` is the more defensive pick.

**Primary recommendation:** Create `src/components/Header.jsx`, render it in `App.js` directly above `<Routes>`, use `fixed top-0 left-0 right-0 z-50 h-14 bg-soil shadow-md` on the `<header>` element, and add `pt-14` to the page wrapper below it.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-router-dom | 6.30.3 (already installed) | `<Link>` for SPA navigation without browser reload | Already in project; `<Link>` renders a real `<a>` but intercepts click to use history API |
| tailwindcss | 3.4.x (already installed) | Utility classes for fixed positioning, flex layout, color tokens | Already configured with project color tokens |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none new) | — | All needs met by existing stack | No additional installs required |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Direct placement in App.js | Nested layout route with `<Outlet>` | Outlet is more idiomatic for large apps with many routes; overkill for 2 routes; defers complexity cleanly if ever needed |
| `fixed` positioning | `sticky top-0` | Sticky can break if an ancestor has overflow set; fixed always works but needs `pt-14` compensation below |

**Installation:**
```bash
# No new packages — all dependencies already installed
```

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   └── Header.jsx       # new — sticky navigation header
├── pages/
│   ├── DirectoryPage.jsx   # existing — add pt-14 compensation if using fixed
│   └── InscriptionPage.jsx # existing — add pt-14 compensation if using fixed
├── App.js               # existing — mount <Header> above <Routes>
└── index.js             # unchanged
```

### Pattern 1: Header Above Routes (App-Level Placement)
**What:** Render `<Header>` as a sibling above `<Routes>` inside `<BrowserRouter>`. Both routes always render the header because it lives outside the route tree.
**When to use:** 2-route apps where the header is universal — no per-route header variation needed.
**Example:**
```jsx
// Source: React Router v6 official docs — components render outside Routes
// https://reactrouter.com/6.30.3/components/routes

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import DirectoryPage from './pages/DirectoryPage';
import InscriptionPage from './pages/InscriptionPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<DirectoryPage />} />
        <Route path="/inscription" element={<InscriptionPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Pattern 2: React Router v6 Link for CTA Navigation
**What:** Use `<Link to="/inscription">` instead of `<a href="/inscription">`. Link intercepts the click, pushes to history, and re-renders the React tree without a full browser navigation.
**When to use:** Any in-app navigation where SPA behavior is required.
**Example:**
```jsx
// Source: https://reactrouter.com/6.30.3/components/link
import { Link } from 'react-router-dom';

<Link to="/inscription" className="bg-terracotta text-cream ...">
  Rejoindre
</Link>
```

### Pattern 3: Fixed Header with Body Compensation
**What:** `position: fixed` removes the header from document flow — content underneath slides up and gets hidden. Compensate by adding `padding-top` equal to header height on the element immediately below.
**When to use:** When `sticky` positioning risks being overridden by ancestor overflow styles.
**Example:**
```jsx
// Header component
<header className="fixed top-0 left-0 right-0 z-50 h-14 bg-soil shadow-md flex items-center justify-between px-6">
  {/* logo + CTA */}
</header>

// In App.js, wrap Routes in a div with top padding
<div className="pt-14">
  <Routes>...</Routes>
</div>
```

### Pattern 4: Logo as `<img>` from /public
**What:** Images in CRA's `public/` folder are served at the root of the dev server. Reference them with an absolute path from root: `/images/logo_zb_trans.png`. Do NOT import them via `import` unless they are in `src/` — `public/` assets bypass webpack.
**When to use:** Logo already lives at `public/images/logo_zb_trans.png` (confirmed on disk).
**Example:**
```jsx
<img
  src="/images/logo_zb_trans.png"
  alt="ZB logo"
  className="h-7 sm:h-8"
/>
```

### Anti-Patterns to Avoid
- **Using `<a href="/inscription">` for the CTA:** Triggers a full browser navigation, losing React state and causing a flash. Use `<Link to="/inscription">` instead.
- **Importing a `public/` image via `import`:** `import logo from '../public/images/logo_zb_trans.png'` will fail because webpack only processes files under `src/`. Use the absolute URL path.
- **Sticky without z-index:** `sticky top-0` without `z-50` allows future absolutely-positioned page content to overlap the header.
- **Fixed header without pt compensation:** Content will render behind the header and the top portion will be inaccessible.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SPA navigation without reload | Custom history.pushState listener | `<Link>` from react-router-dom | Link handles all edge cases: keyboard nav, right-click, rel attributes, relative paths, replace/push |
| Sticky positioning logic | JS scroll listener + state + className toggle | CSS `position: fixed` or `sticky top-0` | Pure CSS, zero JS overhead, no React re-render on scroll |

**Key insight:** Everything needed (routing, fixed layout, color tokens, logo asset) is already installed and configured. This phase is assembly, not installation.

---

## Common Pitfalls

### Pitfall 1: `sticky` Breaks Inside Overflow Parent
**What goes wrong:** `position: sticky` stops working if any ancestor element has `overflow: hidden`, `overflow: auto`, or `overflow: scroll` set.
**Why it happens:** The sticky element can only be sticky within its scroll container. If a parent clips overflow, that parent becomes the scroll root and the element sticks relative to it — which may already be off-screen.
**How to avoid:** Either use `fixed` instead (no scroll-container dependency), or audit that no wrapper in `index.js` → `App.js` chain sets overflow.
**Warning signs:** Header scrolls away despite `sticky top-0` being applied; inspect ancestors for overflow styles.

### Pitfall 2: Header Covering Page Content (Fixed Positioning)
**What goes wrong:** With `fixed` header, the `<header>` is removed from document flow. The first child of `<body>` (the page content) starts at `top: 0` and gets obscured by the `h-14` header.
**Why it happens:** `fixed` elements don't push siblings down.
**How to avoid:** Add `pt-14` (exactly matching `h-14 = 56px`) to the element wrapping `<Routes>` in App.js.
**Warning signs:** Page `<h1>` or hero content is partly hidden behind the header on first load.

### Pitfall 3: Logo 404 from Wrong Import Strategy
**What goes wrong:** `import logo from '../../public/images/logo_zb_trans.png'` throws a webpack error or returns the wrong path. Or using a relative path like `images/logo_zb_trans.png` (without leading `/`) works in CRA dev but breaks on deep routes.
**Why it happens:** CRA's webpack only processes `src/` imports. `public/` images are static assets served at the server root.
**How to avoid:** Always reference public assets with a root-relative path: `src="/images/logo_zb_trans.png"`.
**Warning signs:** Console 404 for logo on `/inscription` route but not `/` (or vice versa depending on base path).

### Pitfall 4: Verification Banner Still Visible
**What goes wrong:** The Phase 1 verification banner (`<div className="bg-soil text-cream ...">FA + Tailwind OK</div>`) in App.js is still rendered, appearing as a second bar above or below the new header.
**Why it happens:** Phase 1 left it intentionally for human verification; no automated cleanup was done.
**How to avoid:** Remove the banner div from App.js as part of this phase's first task.
**Warning signs:** Two `bg-soil` bars visible at the top of the page.

---

## Code Examples

Verified patterns from official sources:

### Complete Header Component
```jsx
// src/components/Header.jsx
// Uses: react-router-dom Link (https://reactrouter.com/6.30.3/components/link)
// Uses: Tailwind custom tokens from tailwind.config.js (soil, terracotta, cream)

import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-soil shadow-md">
      <div className="h-full flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/images/logo_zb_trans.png"
            alt="ZB"
            className="h-7 sm:h-8"
          />
        </Link>
        <Link
          to="/inscription"
          className="bg-terracotta text-cream font-sans text-sm px-4 py-1.5 rounded-md"
        >
          Rejoindre
        </Link>
      </div>
    </header>
  );
}

export default Header;
```

### Updated App.js (remove verification banner, add Header + pt compensation)
```jsx
// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import DirectoryPage from './pages/DirectoryPage';
import InscriptionPage from './pages/InscriptionPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="pt-14">
        <Routes>
          <Route path="/" element={<DirectoryPage />} />
          <Route path="/inscription" element={<InscriptionPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| React Router v5 `<Switch>` + `component` prop | React Router v6 `<Routes>` + `element` prop | v6 (2021) | Already using v6 — no change needed |
| Navbar libraries (react-bootstrap, MUI AppBar) | Plain Tailwind utility classes | Ongoing | No extra dependency; full control over tokens |
| `<a href>` for in-app links | `<Link to>` from react-router-dom | React Router v1+ | SPA navigation without page reload |

**Deprecated/outdated:**
- `<Switch>` component: replaced by `<Routes>` in React Router v6 — project already uses v6 correctly.
- react-sticky library: external library for a problem solved natively by CSS `position: sticky` or `fixed`.

---

## Open Questions

1. **`sticky` vs `fixed` — which avoids layout jank in CRA?**
   - What we know: Both are valid per CONTEXT.md. CRA's `index.js` renders into `<div id="root">` which has no overflow set by default.
   - What's unclear: Whether any future phase wrapper might add overflow to root.
   - Recommendation: Use `fixed` now for defensive robustness, add `pt-14` wrapper. If future phases need scrollable sub-containers, fixed ensures the header is never accidentally trapped.

2. **Logo alt text — image-only or image + text?**
   - What we know: CONTEXT.md says "logo (image + text)" in the requirement description (LAYT-01), but the CONTEXT specifics say "logo file at `logo_zb_trans.png`". The image itself likely contains the "ZB" branding already.
   - What's unclear: Whether to render an additional text element next to the logo image.
   - Recommendation: Planner should look at the actual logo image. If the PNG already contains "Annuaire ZB" text, an `<img>` alone satisfies the requirement. If not, add a `<span>` with `text-cream font-serif`.

---

## Sources

### Primary (HIGH confidence)
- https://reactrouter.com/6.30.3/components/link — Link component API, props, and usage (fetched directly)
- `annuaire-zb-react/package.json` — confirmed react-router-dom 6.30.3, tailwindcss 3.4.x, react 19.x
- `annuaire-zb-react/tailwind.config.js` — confirmed color tokens (soil, terracotta, cream) and font families
- `annuaire-zb-react/src/App.js` — confirmed BrowserRouter + Routes structure and verification banner
- `annuaire-zb-react/public/images/logo_zb_trans.png` — confirmed file exists on disk

### Secondary (MEDIUM confidence)
- https://tailwindcss.com/docs/position — Tailwind `fixed`, `sticky`, `top-0` utility classes (official Tailwind docs, verified via WebSearch)
- WebSearch: "Tailwind CSS sticky fixed header position top-0 z-index CRA React 2025" — confirmed sticky/fixed patterns and overflow pitfall

### Tertiary (LOW confidence)
- None — all claims are verifiable against confirmed project files or official docs.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages confirmed in package.json, no new installs needed
- Architecture: HIGH — App.js structure confirmed, placement pattern directly verifiable
- Pitfalls: HIGH — sticky overflow pitfall verified by official Tailwind docs; fixed + pt-14 is standard CSS behavior; logo path pattern confirmed by CRA docs pattern
- Open questions: LOW risk — both are minor discretion items, not blockers

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (stable stack — React Router v6, Tailwind v3 are not fast-moving at patch versions)
