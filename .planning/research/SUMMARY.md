# Project Research Summary

**Project:** Annuaire ZB — React Migration
**Domain:** Static HTML SPA to React CRA — member directory + registration
**Researched:** 2026-03-09
**Confidence:** HIGH

## Executive Summary

This project is a focused HTML-to-React migration of a two-page member directory app (annuaire ZB). The existing app is built with static HTML, inline JavaScript, and manual DOM manipulation. The migration target is Create React App (CRA) 5 with TailwindCSS 3, React Router v6, and FontAwesome SVG components — the stack is fully specified and well-supported with no ambiguity about technology choices. The scope is intentionally narrow: two routes, one external data source (Google Apps Script), and no backend to build.

The recommended approach is a six-phase build ordered by architectural dependency: scaffold first, then routing shell, then directory data layer, then directory interactivity (filters + modal), then the registration form, and finally design polish. This order is critical because the directory page has internal dependencies (filters require member data, modal requires card infrastructure) while the registration page is independent of the directory and can be built in parallel after the shell exists. The migration is primarily a component extraction exercise — the business logic (filter functions, image compression, no-cors POST) already exists in the HTML files and needs to be lifted into React utilities and hooks, not reimplemented.

The key risks are concentrated in Phase 1 (scaffold configuration) and are well-documented: the `REACT_APP_` env variable prefix requirement, the `content` array in `tailwind.config.js` for production purging, the correct FontAwesome SVG package set, and Google Fonts placement in `public/index.html`. All of these pitfalls have clear, deterministic prevention strategies. The Google Apps Script `no-cors` POST constraint carries through to Phase 5 and requires accepting that response content is unreadable — the success screen must fire on `fetch` resolve, not on response status. These are annoyances, not blockers.

## Key Findings

### Recommended Stack

The stack is fixed by project requirements: CRA 5 with react-scripts 5 as the build toolchain (not Vite), React 18 for the UI framework, React Router v6 for routing, TailwindCSS 3 with PostCSS and Autoprefixer for styling, and the FontAwesome SVG React package set for icons. All packages are current stable versions with no version conflicts identified.

The research explicitly rules out several tempting additions: react-hook-form (one form, overkill), react-query/SWR (single mount fetch, no cache invalidation), Redux/Zustand (two pages, no cross-route shared state), styled-components/Emotion (conflicts with Tailwind), and craco (not needed for CRA 5 + Tailwind 3). These are firm anti-patterns for this project, not deferred options.

**Core technologies:**
- React 18 + react-dom: UI framework — concurrent features and automatic batching at no cost
- react-scripts 5 (CRA): Build toolchain — webpack, Babel, PostCSS, Jest bundled, no ejection needed
- react-router-dom 6: Client-side routing — v6 API (`<Routes>`, `element={}`), exact matching by default
- tailwindcss 3 + postcss + autoprefixer: Styling — JIT mode, earthy custom color palette already defined
- @fortawesome/react-fontawesome + svg-core + icon sets: Icons — tree-shakeable, no global CSS injection

### Expected Features

The app has two distinct feature surfaces. The directory page is the primary surface and carries the most complexity: it needs data fetching with loading and error states, text search with debouncing, dropdown filters (city, domain, availability, service type), reactive stats, a click-to-open member detail modal with focus trapping, and proper empty states. The registration page is simpler but has a non-trivial photo upload: client-side canvas compression, live preview, controlled form state, and submit feedback that works around the no-cors response blindness.

**Must have (table stakes):**
- Member card grid with photo, name, title, company, availability badge
- Text search filtering by name, job, company, skills, bio
- Dropdown filters: city, domain, availability, service type
- Member count stats (total, domains, available)
- Member detail modal with full profile and contact links
- Skeleton loading state and empty state for no results
- Multi-section registration form with client-side validation
- Photo upload with canvas compression and live preview thumbnail
- Submit feedback (loading button state, success screen, error toast)
- Sticky header with logo and "Rejoindre" CTA
- SPA routing with no page reload between directory and registration

**Should have (UX improvements the migration enables):**
- Debounced search input (no full re-render per keystroke)
- Animated modal entrance/exit with accessible focus trap and Escape key close
- Reactive stat counters that update as filters change
- Consistent AvailabilityBadge component reused across card and modal
- Toast notification for API failure on registration submit

**Defer (v2+):**
- Server-side rendering / Next.js
- Pagination or infinite scroll
- Optimistic UI on registration (blocked by no-cors anyway)
- Dark mode
- i18n
- Unit test suite

### Architecture Approach

The architecture is a flat two-page SPA with a custom hook for data fetching and pure utility functions for filtering and image compression. State lives entirely in the two page components (DirectoryPage and InscriptionPage) and flows down via props — no context, no external state library. The folder structure groups components by page domain (directory/, inscription/) with a shared/ layer for cross-cutting components (AvailabilityBadge) and a layout/ layer for the Header.

**Major components:**
1. `useMembers` hook — encapsulates fetch + loading + error state, returns member array
2. `filterMembers` utility — pure function, accepts members array + filter object, returns filtered array
3. `compressImage` utility — Promise-wrapping of existing canvas compression logic
4. `DirectoryPage` — owns all directory state (members, filters, selectedMember, loading, error)
5. `InscriptionPage` — owns all form state (formData, photoData, submitting, submitted)
6. `MemberModal` — conditionally rendered overlay, receives selectedMember or null
7. `SkeletonCard` / `EmptyState` — loading and empty states for the card grid

### Critical Pitfalls

1. **REACT_APP_ prefix omitted** — Rename `.env` variable to `REACT_APP_SHEET_API_URL` before any API calls; missing prefix causes silent `undefined` at runtime. Restart dev server after any `.env` change.
2. **Tailwind content config missing** — Set `content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html']` in `tailwind.config.js` before writing any components; missing this causes styles to strip in production build while working in dev.
3. **no-cors POST — do not attempt to read response** — Keep `mode: 'no-cors'` exactly as-is on the registration fetch; show success screen on `fetch` resolve regardless of actual server outcome. Attempting to read `response.ok` or `response.json()` will throw.
4. **React Router v6 API — discard v5 knowledge** — Use `<Routes>` not `<Switch>`, `element={<Page />}` not `component={Page}`, `useNavigate` not `useHistory`. Many online resources show v5 syntax.
5. **dangerouslySetInnerHTML for member data** — Use JSX expressions `{member.field}` for all member data rendering; React escapes HTML entities automatically. Never use `dangerouslySetInnerHTML` for member-sourced content.

## Implications for Roadmap

Based on combined research, the architecture file provides a clean 6-phase build order that respects all dependency constraints. The roadmapper should follow this structure directly — it is not a suggestion, it reflects real technical dependencies.

### Phase 1: Project Scaffold
**Rationale:** Everything else depends on the build toolchain being correctly configured. All 4 Phase 1 pitfalls (Tailwind config, env prefix, Google Fonts, FontAwesome packages) must be resolved here before any component work starts — they are impossible to debug in isolation later.
**Delivers:** Working CRA app with Tailwind, React Router, FontAwesome installed, custom color palette configured, `.env` wired, Google Fonts loading.
**Addresses:** Global routing, .env-driven API URL (table stakes)
**Avoids:** PostCSS conflict (Pitfall 1), REACT_APP_ prefix omission (Pitfall 3), Tailwind purge misconfiguration (Pitfall 7), wrong FontAwesome package (Pitfall 10), Google Fonts 404 (Pitfall 2)

### Phase 2: Layout and Routing Shell
**Rationale:** App.js, Header, and page stubs must exist before any page-specific work. The logo asset path pitfall lives here — must be resolved before Header renders.
**Delivers:** Navigable app shell with sticky header, two empty page components, SPA routing working end-to-end.
**Uses:** React Router v6, TailwindCSS, FontAwesome
**Avoids:** React Router v6 API mistakes (Pitfall 6), logo asset 404 (Pitfall 8)

### Phase 3: Directory Page — Data Layer and Cards
**Rationale:** Member data must be available before filters and modal can be built. The `useMembers` hook and `MemberCard` component form the foundation of the directory page. The XSS / innerHTML pitfall is most relevant here — JSX expressions must be used from the start.
**Delivers:** Directory page that fetches members, renders card grid, shows skeleton loading, shows empty state.
**Implements:** `useMembers` hook, `filterMembers` utility, `MemberGrid`, `MemberCard`, `SkeletonCard`, `EmptyState`, `AvailabilityBadge`
**Avoids:** innerHTML / dangerouslySetInnerHTML for member data (Pitfall 4)

### Phase 4: Directory Page — Filters and Modal
**Rationale:** Depends on Phase 3 — filter state and modal both operate on the member array. These are the primary UX differentiators of the React migration (debounced search, accessible modal, reactive stats).
**Delivers:** Fully functional directory: text search, dropdown filters, reactive stats, animated member detail modal with focus trapping and Escape key close.
**Implements:** `FilterBar`, `HeroSection`, `MemberModal` with focus trap

### Phase 5: Registration Page
**Rationale:** Independent of directory phases after Phase 2. The no-cors POST constraint and canvas compression Promise-wrapping are the two technical risks specific to this phase.
**Delivers:** Complete registration form with photo upload (canvas compression + live preview), client-side validation, loading button state, success screen, error toast.
**Implements:** `InscriptionPage`, `PhotoUpload`, `FormSection`, `SuccessScreen`, `compressImage` utility
**Avoids:** no-cors response reading attempt (Pitfall 5), canvas async state bug (Pitfall 9)

### Phase 6: Design Polish
**Rationale:** Final pass only meaningful once all components exist. Tailwind refinements, responsive layout audit, animation tuning, icon placement.
**Delivers:** Production-quality visual finish across all components, consistent earthy palette application, responsive grid behavior verified.

### Phase Ordering Rationale

- Phase 1 before everything: 4 of 10 pitfalls are scaffold-time and cannot be debugged once feature code is written.
- Phase 2 before 3-5: App.js + Header are shared by all pages; stubs must exist as routing targets.
- Phase 3 before Phase 4: FilterBar and MemberModal require the member array that `useMembers` provides.
- Phase 5 independent after Phase 2: Registration has no data dependency on the directory.
- Phase 6 last: Polish requires all components to exist; doing it earlier creates rework.

### Research Flags

Phases with standard, well-documented patterns (can skip `/gsd:research-phase`):
- **Phase 1:** CRA + Tailwind official guide is definitive; all steps are deterministic.
- **Phase 2:** React Router v6 docs cover this exactly; Header + routing shell is standard.
- **Phase 3:** Custom hook + fetch pattern is idiomatic React; no novel integration.
- **Phase 6:** Pure Tailwind work; no integration risk.

Phases that may benefit from targeted research during planning:
- **Phase 4:** Modal accessibility (focus trap implementation) has several valid approaches — worth confirming the specific `useEffect`-based pattern before implementation.
- **Phase 5:** Canvas compression as Promise wrapper — the existing code needs careful extraction; worth reviewing the async timing of `FileReader` + `canvas.toDataURL`.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All packages are official, versions confirmed compatible, no ambiguity |
| Features | HIGH | Derived from existing working HTML app — feature set is observable, not speculative |
| Architecture | HIGH | Standard CRA folder conventions, component breakdown matches feature list exactly |
| Pitfalls | HIGH | Pitfalls are concrete and specific to the exact tools in use — not generic warnings |

**Overall confidence:** HIGH

### Gaps to Address

- **Google Apps Script API shape:** The exact JSON structure returned by `?action=getMembers` is not documented in the research. The `useMembers` hook assumes `data.members` — this must be validated against the live script before Phase 3 is complete. If the shape differs, `filterMembers` assumptions may also need adjustment.
- **Photo upload field name:** The Google Apps Script form handler expects specific field names in the POST payload. The registration form must use exactly the same field names as the current `inscription.html` or the script will silently ignore fields.
- **Member count at scale:** The research notes infinite scroll is not needed "for current member count" but does not specify the count. If the directory grows beyond ~200 members, virtualization may become necessary — flag for future sprints.

## Sources

### Primary (HIGH confidence)
- Official TailwindCSS + CRA guide — Tailwind/PostCSS integration, content config, `npx tailwindcss init -p`
- Official React Router v6 docs — `<Routes>`, `<Route element={}>`, `useNavigate` API
- FontAwesome React docs — SVG package set, `<FontAwesomeIcon>` usage
- CRA official docs — `REACT_APP_` prefix requirement, `public/index.html` for static assets, `.env` behavior

### Secondary (MEDIUM confidence)
- Existing `index.html` and `inscription.html` source — feature set, business logic, color palette, font choices, API URL pattern, no-cors POST pattern
- Community consensus on React state management at small scale — useState + props, no external library at 2-page scope

### Tertiary (LOW confidence)
- Google Apps Script response shape — assumed from `data.members` pattern; needs live validation
- Member count estimate — not researched; inline scroll deferral based on current observed scale

---
*Research completed: 2026-03-09*
*Ready for roadmap: yes*
