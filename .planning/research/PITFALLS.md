# PITFALLS.md — HTML-to-React Migration

**Research date:** 2026-03-09
**Context:** Static HTML + inline JS → React CRA + TailwindCSS + React Router v6

---

## 1. CRA + TailwindCSS Configuration Conflict

**Pitfall:** CRA uses its own PostCSS config internally. Adding `postcss.config.js` at the root can conflict with CRA's internal setup in older CRA versions and break the build.

**Warning signs:** Build errors mentioning PostCSS, Tailwind classes not applying, `craco` mentioned in troubleshooting threads.

**Prevention:**
- Use `@craco/craco` OR the official TailwindCSS CRA guide which uses `postcss.config.js` with CRA 5+ (compatible)
- Recommended: Follow the official [Tailwind + CRA guide](https://tailwindcss.com/docs/guides/create-react-app) — it works without craco in CRA 5
- Install: `tailwindcss postcss autoprefixer` as devDependencies
- Run: `npx tailwindcss init -p` (generates both `tailwind.config.js` and `postcss.config.js`)

**Phase:** Phase 1 (scaffold)

---

## 2. Google Fonts Not Loading in React

**Pitfall:** Current app loads Google Fonts via CDN `<link>` in HTML `<head>`. In CRA, you need to add this to `public/index.html`, not `src/index.css`.

**Warning signs:** Playfair Display / DM Sans falling back to system fonts after migration.

**Prevention:**
- Copy the `<link>` tags for Google Fonts into `public/index.html` `<head>`
- OR use the `@import` in `src/index.css` (slightly slower but works)
- Tailwind fontFamily config must reference the exact font name string

**Phase:** Phase 1 (scaffold)

---

## 3. REACT_APP_ Prefix Omitted

**Pitfall:** CRA only exposes env variables prefixed with `REACT_APP_` to browser code. The existing `.env` uses `SHEET_API_URL` (no prefix) — this will be `undefined` at runtime.

**Warning signs:** `process.env.REACT_APP_SHEET_API_URL` returns `undefined`, API calls go to `undefined?action=getMembers`.

**Prevention:**
- Rename `.env` variable: `REACT_APP_SHEET_API_URL=...`
- Restart dev server after `.env` changes (CRA does not hot-reload `.env`)
- Never use `VITE_` prefix (that's Vite, not CRA)

**Phase:** Phase 1 (scaffold)

---

## 4. innerHTML Migration to JSX — XSS vs Over-Engineering

**Pitfall:** The current app uses `innerHTML` with template literals (XSS risk). When migrating to JSX, the natural fix is to use JSX expressions `{member.nom}` which React escapes automatically. But developers sometimes reach for `dangerouslySetInnerHTML` "to preserve formatting" — this brings back the XSS risk.

**Warning signs:** Any use of `dangerouslySetInnerHTML` in member-data rendering.

**Prevention:**
- Use JSX expressions `{member.field}` for all member data — React escapes HTML entities automatically
- Only use `dangerouslySetInnerHTML` for known-safe, admin-controlled content (not member data)

**Phase:** Phase 3 (directory cards)

---

## 5. no-cors POST — Don't "Fix" What Works

**Pitfall:** The registration form uses `fetch` with `mode: 'no-cors'` (Google Apps Script requirement). Developers sometimes try to "fix" this by adding CORS headers, changing the mode, or reading the response — none of this works with Google Apps Script without modifying the script itself.

**Warning signs:** `fetch` response body attempts, trying to read response status, CORS errors after mode change.

**Prevention:**
- Keep `mode: 'no-cors'` exactly as-is
- Accept that `response.ok` and `response.json()` will throw/fail — success is always assumed
- Show success screen after the fetch resolves (not rejects), regardless of actual server outcome
- This is a Google Apps Script limitation, not a bug to fix in React

**Phase:** Phase 5 (registration)

---

## 6. React Router v6 Breaking Changes from v5

**Pitfall:** React Router v6 has major API changes from v5. Many tutorials and Stack Overflow answers show v5 syntax which will cause errors.

**Warning signs:** `<Switch>` used instead of `<Routes>`, `component={...}` instead of `element={...}`, `useHistory` instead of `useNavigate`.

**Prevention:**
- Always use v6 API: `<Routes>` + `<Route element={<Page />} />`
- Navigation: `useNavigate()` hook, not `useHistory()`
- No `exact` prop needed in v6 (matching is exact by default)
- Install: `react-router-dom@6` specifically

**Phase:** Phase 2 (routing shell)

---

## 7. Tailwind Purge / Content Config Missing

**Pitfall:** TailwindCSS v3 purges unused classes in production build. If `content` array in `tailwind.config.js` doesn't include all JS/JSX files, classes used only in JS will be stripped from the production CSS.

**Warning signs:** Styles work in dev but disappear in `npm run build` output.

**Prevention:**
```js
// tailwind.config.js
content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html']
```

**Phase:** Phase 1 (scaffold)

---

## 8. Logo Asset Path in CRA

**Pitfall:** CRA serves static assets from `public/`. The logo currently lives at `assets/images/logo_zb_trans.png`. In React components, importing from `public/` uses root-relative paths (`/images/logo_zb_trans.png`), while importing from `src/` uses webpack bundling (`import logo from './images/logo.png'`).

**Warning signs:** Logo shows 404, broken image in header.

**Prevention:**
- Copy `logo_zb_trans.png` to `public/images/logo_zb_trans.png`
- Reference as `<img src="/images/logo_zb_trans.png" />` (public path, no import needed)
- OR import directly: `import logo from '../images/logo_zb_trans.png'` if placed in `src/`

**Phase:** Phase 2 (layout)

---

## 9. Canvas API for Image Compression in React

**Pitfall:** The existing `compressImage()` function uses `document.createElement('canvas')`. This works in React, but needs to be wrapped as a Promise (it's currently callback-based) and called correctly from an `onChange` handler.

**Warning signs:** Photo compression completes but state isn't updated, form submits without photo.

**Prevention:**
- Extract `compressImage` to `src/utils/compressImage.js` as a Promise-returning function
- In `PhotoUpload` component, call `compressImage(file).then(({ base64, mimeType }) => onPhotoChange(...))`
- Store `base64` + `mimeType` in `InscriptionPage` state

**Phase:** Phase 5 (registration)

---

## 10. Font Awesome — Correct React Package

**Pitfall:** There are multiple FontAwesome npm packages. Using the wrong one (e.g., `font-awesome` CSS-only package) won't work properly with React and Tailwind.

**Warning signs:** Icons don't render, build warnings about missing packages.

**Prevention — use the React component approach:**
```
npm install @fortawesome/fontawesome-svg-core
npm install @fortawesome/free-solid-svg-icons
npm install @fortawesome/free-brands-svg-icons
npm install @fortawesome/react-fontawesome
```

Usage: `<FontAwesomeIcon icon={faUser} />`

This avoids global CSS injection conflicts with Tailwind.

**Phase:** Phase 1 (scaffold)

---

*Pitfalls research: 2026-03-09*
