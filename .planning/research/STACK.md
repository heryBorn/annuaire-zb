# STACK.md — React Migration Stack

**Research date:** 2026-03-09
**Context:** CRA + TailwindCSS + React Router v6 + FontAwesome for annuaire ZB

---

## Core Stack

| Package | Version | Role | Notes |
|---------|---------|------|-------|
| `react` | 18.x | UI framework | Concurrent features, automatic batching |
| `react-dom` | 18.x | DOM renderer | |
| `react-scripts` | 5.x | CRA build toolchain | Includes webpack, Babel, PostCSS, Jest |
| `react-router-dom` | 6.x | Client-side routing | v6 API — `<Routes>`, `<Route element={}>` |
| `tailwindcss` | 3.x | Utility-first CSS | JIT mode, purge via `content` config |
| `postcss` | 8.x | CSS transform pipeline | Required by Tailwind |
| `autoprefixer` | 10.x | Vendor prefix automation | Required by Tailwind |

---

## FontAwesome

| Package | Role |
|---------|------|
| `@fortawesome/fontawesome-svg-core` | Core SVG engine |
| `@fortawesome/free-solid-svg-icons` | Solid icon set (UI actions, contact) |
| `@fortawesome/free-brands-svg-icons` | Brand icons (LinkedIn, website) |
| `@fortawesome/react-fontawesome` | React component `<FontAwesomeIcon>` |

**Why SVG approach over CSS:** No global CSS injection, tree-shakeable (only icons used are bundled), works seamlessly with Tailwind classes on the component.

**Usage:**
```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'

<FontAwesomeIcon icon={faEnvelope} className="text-terracotta" />
```

---

## CRA + Tailwind Integration

**Official method (CRA 5 / react-scripts 5):**

```bash
npx create-react-app annuaire-zb-react
cd annuaire-zb-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

`tailwind.config.js`:
```js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
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

`src/index.css` (replace contents):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`public/index.html` — add Google Fonts in `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
```

---

## Environment Variables (CRA)

CRA requires `REACT_APP_` prefix. Variables are inlined at build time via webpack's `DefinePlugin`.

`.env` (project root):
```
REACT_APP_SHEET_API_URL=https://script.google.com/macros/s/...
```

Access in code:
```js
const apiUrl = process.env.REACT_APP_SHEET_API_URL;
```

**Rules:**
- Never commit `.env` to git (add to `.gitignore`)
- Restart dev server (`npm start`) after `.env` changes
- Variables are public — safe only for non-secret URLs (Google Apps Script URLs are already public)

---

## React Router v6 Setup

```jsx
// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
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

**v6 vs v5 key differences:**
- `<Switch>` → `<Routes>`
- `component={Page}` → `element={<Page />}`
- `useHistory()` → `useNavigate()`
- No `exact` prop (v6 is exact by default)

---

## What NOT to Use

| Package | Why not |
|---------|---------|
| `react-hook-form` | One form, overkill — useState is sufficient |
| `react-query` / `swr` | Single fetch on mount, no cache invalidation needed |
| `redux` / `zustand` | Two pages, no shared state across routes |
| `styled-components` | Conflicts with Tailwind approach |
| `@emotion/react` | Same conflict |
| `craco` | Not needed for CRA 5 + Tailwind 3 |
| `vite` | User chose CRA — don't substitute |
| Tailwind CSS CDN | Breaks purging, no config, development only |

---

## Install Command (full)

```bash
npx create-react-app annuaire-zb-react
cd annuaire-zb-react
npm install react-router-dom@6
npm install -D tailwindcss postcss autoprefixer
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons @fortawesome/react-fontawesome
npx tailwindcss init -p
```

---

*Stack research: 2026-03-09*
