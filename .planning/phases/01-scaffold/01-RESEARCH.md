# Phase 1: Scaffold - Research

**Researched:** 2026-03-09
**Domain:** CRA bootstrap, TailwindCSS, React Router v6, FontAwesome SVG, environment variables
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SCAF-01 | App bootstrapped with Create React App as a single-page application | CRA 5 + react-scripts 5 bootstrap procedure documented in STACK.md; standard `npx create-react-app` command |
| SCAF-02 | React Router v6 with two routes: `/` (directory) and `/inscription` (registration) | v6 API patterns (`<Routes>`, `<Route element={}>`) documented; `BrowserRouter` wrapping App pattern |
| SCAF-03 | TailwindCSS configured with custom earthy color tokens (soil, terracotta, sand, wheat, sage, cream, ink, muted) | Full `tailwind.config.js` with all 8 color tokens and font families documented; content purge pattern confirmed |
| SCAF-04 | Google Fonts (Playfair Display, DM Sans) loaded in public/index.html | `<link>` tag approach via `public/index.html` head; existing HTML already has correct font weights — copy and adapt |
| SCAF-05 | FontAwesome SVG React packages installed and available for use throughout the app | All 4 packages identified; usage pattern with `<FontAwesomeIcon>` documented; no global CSS needed |
| SCAF-06 | Google Apps Script URL loaded from REACT_APP_SHEET_API_URL environment variable (not hardcoded) | `.env` currently has `SHEET_API_URL` (no prefix) — must rename; CRA `REACT_APP_` prefix rule confirmed |
| SCAF-07 | Logo asset (logo_zb_trans.png) available in public/images/ | File exists at `assets/images/logo_zb_trans.png`; must be copied to `public/images/logo_zb_trans.png` |
</phase_requirements>

---

## Summary

This phase establishes the complete CRA project foundation — all tooling, routing, styling, and asset infrastructure — so that every subsequent phase can focus on component logic rather than build setup. The primary challenge is integrating TailwindCSS into CRA correctly (PostCSS config handled by `npx tailwindcss init -p`), and correctly prefixing the existing environment variable.

The project currently exists as static HTML at `D:/Workspace/Php/www/annuaire-zb/`. The React app will be bootstrapped as a subdirectory (`annuaire-zb-react/`) inside this existing directory. Key assets already exist: `assets/images/logo_zb_trans.png` is ready to copy, and the `.env` file already contains the Google Apps Script URL but uses the unprefixed key `SHEET_API_URL` which CRA will silently ignore.

No CONTEXT.md exists for this phase; all decisions are drawn from STACK.md, PITFALLS.md, STATE.md decisions log, and the project REQUIREMENTS.md.

**Primary recommendation:** Run `npx create-react-app annuaire-zb-react` inside the project root, then immediately configure Tailwind, Router, FontAwesome, fix the `.env` prefix, and verify each success criterion before considering the phase done.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `react` | 18.x | UI framework | Included by CRA; concurrent features, automatic batching |
| `react-dom` | 18.x | DOM renderer | Paired with react; included by CRA |
| `react-scripts` | 5.x | CRA build toolchain | webpack 5 + Babel + PostCSS + Jest; user-decided, do not substitute Vite |
| `react-router-dom` | 6.x | Client-side routing | v6 API — `<Routes>`, `<Route element={}>` |
| `tailwindcss` | 3.x | Utility-first CSS | JIT mode; purge via `content` config |
| `postcss` | 8.x | CSS transform pipeline | Required by Tailwind; `npx tailwindcss init -p` generates config |
| `autoprefixer` | 10.x | Vendor prefix automation | Required by Tailwind |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@fortawesome/fontawesome-svg-core` | latest | SVG icon engine | Required peer of all FA React packages |
| `@fortawesome/free-solid-svg-icons` | latest | Solid icon set | UI actions, contact icons (envelope, phone, globe) |
| `@fortawesome/free-brands-svg-icons` | latest | Brand icon set | LinkedIn icon |
| `@fortawesome/react-fontawesome` | latest | React `<FontAwesomeIcon>` component | The actual component used in JSX |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `react-scripts` (CRA) | Vite | Vite is faster but user explicitly chose CRA — do not substitute |
| `@fortawesome/react-fontawesome` SVG | `font-awesome` CSS package | CSS package injects global styles that conflict with Tailwind; SVG is tree-shakeable |
| `postcss.config.js` (generated) | `craco` | `craco` not needed for CRA 5 + Tailwind 3 — `init -p` is sufficient |
| Google Fonts CDN `<link>` | `@fontsource` npm package | CDN in `public/index.html` mirrors the existing HTML approach; simpler for this project |

**Installation:**
```bash
# From D:/Workspace/Php/www/annuaire-zb/
npx create-react-app annuaire-zb-react
cd annuaire-zb-react
npm install react-router-dom@6
npm install -D tailwindcss postcss autoprefixer
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons @fortawesome/react-fontawesome
npx tailwindcss init -p
```

---

## Architecture Patterns

### Recommended Project Structure
```
annuaire-zb-react/
├── public/
│   ├── index.html          # Google Fonts <link> goes here
│   └── images/
│       └── logo_zb_trans.png   # Copied from ../assets/images/
├── src/
│   ├── index.js            # ReactDOM.createRoot entry point
│   ├── index.css           # @tailwind base/components/utilities only
│   ├── App.js              # BrowserRouter + Routes
│   ├── pages/
│   │   ├── DirectoryPage.jsx
│   │   └── InscriptionPage.jsx
│   └── components/
│       └── (empty for Phase 1 — populated in later phases)
├── tailwind.config.js      # content + custom colors + fonts
├── postcss.config.js       # auto-generated by tailwindcss init -p
└── .env                    # REACT_APP_SHEET_API_URL=...
```

### Pattern 1: CRA + Tailwind Integration
**What:** PostCSS pipeline wired through CRA's internal webpack, activated by `@tailwind` directives in `src/index.css`.
**When to use:** Always — this is the only setup path.
**Example:**
```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        soil:      '#2C1A0E',
        terracotta:'#C1440E',
        sand:      '#F5E6C8',
        wheat:     '#E8C97A',
        sage:      '#6B8F71',
        cream:     '#FAF5EC',
        ink:       '#1A1108',
        muted:     '#8A7A6A',
      },
      fontFamily: {
        sans:  ['"DM Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
```

```css
/* src/index.css — replace entire contents */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Pattern 2: React Router v6 App Shell
**What:** `BrowserRouter` wraps everything; `Routes` + `Route element={}` at the App level.
**When to use:** Always for CRA SPA routing.
**Example:**
```jsx
// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DirectoryPage from './pages/DirectoryPage';
import InscriptionPage from './pages/InscriptionPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DirectoryPage />} />
        <Route path="/inscription" element={<InscriptionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Pattern 3: Environment Variable Access
**What:** CRA inlines `REACT_APP_*` vars at build time via webpack DefinePlugin.
**When to use:** Any reference to the API URL in JS code.
**Example:**
```js
const apiUrl = process.env.REACT_APP_SHEET_API_URL;
// Resolves to the actual URL string in browser JS
// Returns undefined if prefix is missing or dev server not restarted
```

### Pattern 4: FontAwesome SVG Usage
**What:** Import icon objects and pass to `<FontAwesomeIcon>` — no global CSS needed.
**When to use:** Any icon rendering.
**Example:**
```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

// In component:
<FontAwesomeIcon icon={faEnvelope} className="text-terracotta" />
```

### Anti-Patterns to Avoid
- **Importing `font-awesome` CSS package:** Injects global styles that conflict with Tailwind. Use SVG packages only.
- **Using `<Switch>` from React Router:** This is v5 syntax. v6 uses `<Routes>`.
- **Placing Google Fonts `@import` in `src/index.css`:** Works but is slower than `<link>` in `<head>`. Use `public/index.html`.
- **Placing Tailwind config with empty `content` array:** Classes will be purged in production build. Always include `./src/**/*.{js,jsx,ts,tsx}`.
- **Committing `.env` to git:** The Google Apps Script URL is non-secret but `.env` should still be in `.gitignore`. The existing `.env` file is already untracked.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS utility classes | Custom `main.css` utilities | TailwindCSS | JIT purging, consistent tokens, no specificity wars |
| PostCSS vendor prefixing | Manual `-webkit-` etc. | `autoprefixer` (included in Tailwind setup) | Browser target matrix is complex |
| Client-side routing | `window.location` + conditional rendering | `react-router-dom` v6 | History API, nested routes, navigation hooks |
| SVG icon rendering | Inline `<svg>` tags | `@fortawesome/react-fontawesome` | Accessibility, sizing, consistent API |
| Font loading | Self-hosted font files | Google Fonts CDN `<link>` | Mirrors existing HTML; zero infrastructure cost |

**Key insight:** CRA, Tailwind 3, and React Router v6 each handle their domain completely. The scaffold phase is configuration wiring, not custom code.

---

## Common Pitfalls

### Pitfall 1: Missing `REACT_APP_` Prefix on Env Variable
**What goes wrong:** `process.env.REACT_APP_SHEET_API_URL` returns `undefined` in the browser. API calls silently go to `undefined?action=getMembers`.
**Why it happens:** CRA's webpack DefinePlugin only exposes variables starting with `REACT_APP_`. The current `.env` uses `SHEET_API_URL` (no prefix).
**How to avoid:** Rename the variable in `.env` to `REACT_APP_SHEET_API_URL=...`. Then restart the dev server — CRA does NOT hot-reload `.env` changes.
**Warning signs:** `process.env.REACT_APP_SHEET_API_URL` logs as `undefined` in the browser console.

### Pitfall 2: Tailwind Purge Strips Production Styles
**What goes wrong:** Styles work in `npm start` (dev) but disappear after `npm run build`.
**Why it happens:** TailwindCSS v3 JIT purges all classes not found in the `content` glob. If `content` is missing `./src/**/*.{js,jsx}`, dynamically composed classes and utility classes in JSX are removed.
**How to avoid:** `content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html']` — include both `js` and `jsx` extensions explicitly.
**Warning signs:** Build output works in browser only for a few basic classes; custom colors like `bg-soil` are gone.

### Pitfall 3: PostCSS Config Conflict with CRA Internals
**What goes wrong:** Build error mentioning PostCSS or Tailwind classes not applying at all.
**Why it happens:** Manually creating a `postcss.config.js` with wrong options can conflict with CRA 5's internal PostCSS config in some environments.
**How to avoid:** Generate the PostCSS config with `npx tailwindcss init -p` — this creates a CRA-compatible `postcss.config.js`. Do not manually write it.
**Warning signs:** Console errors referencing PostCSS at startup.

### Pitfall 4: React Router v5 Syntax
**What goes wrong:** Compile error or incorrect routing behavior.
**Why it happens:** Many online resources (including Stack Overflow) show v5 syntax (`<Switch>`, `component={}`, `useHistory`). The requirement specifies v6.
**How to avoid:** Install specifically `react-router-dom@6`. Use `<Routes>`, `<Route element={<Page />}>`, and `useNavigate()` exclusively.
**Warning signs:** JSX error "Switch is not exported from react-router-dom".

### Pitfall 5: Logo 404 from Wrong Path
**What goes wrong:** Logo image returns 404 in the browser.
**Why it happens:** The logo currently lives at `assets/images/logo_zb_trans.png` (relative to the old HTML root). In CRA, static assets served from `public/` are accessed via root-relative paths.
**How to avoid:** Copy `logo_zb_trans.png` to `public/images/logo_zb_trans.png` in the new CRA app. Reference it as `<img src="/images/logo_zb_trans.png" alt="logo" />`.
**Warning signs:** Network tab shows 404 for the logo URL.

### Pitfall 6: Dev Server Not Restarted After .env Change
**What goes wrong:** `.env` changes have no effect; env var still `undefined`.
**Why it happens:** CRA reads `.env` only at server startup — there is no hot-reload for env files.
**How to avoid:** Always stop and restart `npm start` after any `.env` modification.
**Warning signs:** Editing `.env` then seeing no change in browser behavior.

---

## Code Examples

Verified patterns from project STACK.md (compiled 2026-03-09):

### Google Fonts in public/index.html
```html
<!-- public/index.html <head> section -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
```
Note: The existing `index.html` uses slightly different weights (`ital,wght@0,400;0,700;1,400` for Playfair). The new app should use the weights specified in STACK.md which align with the Tailwind fontFamily config.

### Environment Variable in .env
```
# D:/Workspace/Php/www/annuaire-zb/annuaire-zb-react/.env
REACT_APP_SHEET_API_URL=https://script.google.com/macros/s/AKfycbztDy9LxShVHeRJpdvsEUa84eVh1kiqaDra6V_k0XbxoiiV3Pcm3XIMx2hbsZE4f_BX/exec
```
(The URL already exists in the parent directory's `.env` as `SHEET_API_URL` — copy value, rename key.)

### Minimal Verification Component (for Phase success criterion 4)
```jsx
// src/App.js — temporary test, remove after verification
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';

// Inside return:
<div className="bg-soil p-4">
  <FontAwesomeIcon icon={faLeaf} className="text-wheat" />
  <span>{process.env.REACT_APP_SHEET_API_URL}</span>
</div>
```
This single block verifies: Tailwind custom color (`bg-soil`), FontAwesome icon, and env var in one render.

### CRA ReactDOM v18 Entry Point
```jsx
// src/index.js — CRA generates this; confirm it uses createRoot
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `ReactDOM.render()` | `ReactDOM.createRoot()` | React 18 (2022) | CRA 5 generates `createRoot` by default — no action needed |
| `<Switch>` (React Router v5) | `<Routes>` (React Router v6) | v6 released 2021 | Must use v6 API; many tutorials still show v5 |
| Tailwind CSS CDN `<script>` | npm install + PostCSS pipeline | Tailwind v3 | CDN does not support purging or config; npm is the only production approach |
| `exact` prop on `<Route>` | No `exact` needed | React Router v6 | v6 matches exactly by default |
| `craco` for CRA + Tailwind | `postcss.config.js` directly | Tailwind v3 + CRA 5 | `npx tailwindcss init -p` works without craco in this combination |

**Deprecated/outdated:**
- `react-scripts` eject: Unnecessary; Tailwind works with standard CRA 5 config.
- `purge` key in `tailwind.config.js`: Replaced by `content` key in Tailwind v3.
- `node-sass` / `sass`: Not needed; Tailwind replaces all custom CSS needs for this project.

---

## Open Questions

1. **React app location: subdirectory vs. project root**
   - What we know: The existing project is at `D:/Workspace/Php/www/annuaire-zb/`. The additional context says "created INSIDE this directory (or as a subdirectory)."
   - What's unclear: Whether the React app should be at the root (replacing index.html/inscription.html) or in a named subdirectory like `annuaire-zb-react/`.
   - Recommendation: Create as subdirectory `annuaire-zb-react/` to avoid disrupting the existing static files during development. The planner should make this explicit in Wave 1 task.

2. **`.env` file placement**
   - What we know: The current `.env` is at the project root `D:/Workspace/Php/www/annuaire-zb/.env`. CRA expects `.env` at the app root.
   - What's unclear: Whether to create a new `.env` inside `annuaire-zb-react/` or move the existing one.
   - Recommendation: Create a new `.env` inside `annuaire-zb-react/` with the renamed variable. Leave the parent `.env` in place (it's already gitignored).

---

## Sources

### Primary (HIGH confidence)
- `.planning/research/STACK.md` — Full stack with versions, configuration examples, install commands (compiled 2026-03-09)
- `.planning/research/PITFALLS.md` — 10 documented pitfalls with phases and prevention strategies (compiled 2026-03-09)
- `.planning/STATE.md` — Accumulated decisions log, confirmed key rules (REACT_APP_ prefix, Tailwind content config, FontAwesome SVG packages)
- `.planning/REQUIREMENTS.md` — Phase 1 requirements SCAF-01 through SCAF-07

### Secondary (MEDIUM confidence)
- `D:/Workspace/Php/www/annuaire-zb/index.html` — Confirmed existing Google Fonts link tag and asset structure
- `D:/Workspace/Php/www/annuaire-zb/.env` — Confirmed existing variable name `SHEET_API_URL` (unprefixed) and URL value
- `D:/Workspace/Php/www/annuaire-zb/assets/images/` — Confirmed `logo_zb_trans.png` exists

### Tertiary (LOW confidence)
- None — all critical claims are backed by project files or well-established CRA documentation patterns.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Versions and packages confirmed in STACK.md; decisions confirmed in STATE.md
- Architecture: HIGH — Project structure follows CRA conventions; custom color tokens are literal values in STACK.md
- Pitfalls: HIGH — All Phase 1 pitfalls are documented in PITFALLS.md with root causes and prevention

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (CRA 5 + Tailwind 3 + Router v6 are all stable; low churn expected)
