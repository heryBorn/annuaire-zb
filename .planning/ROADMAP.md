# Roadmap: Annuaire ZB

## Overview

This roadmap covers the migration of Annuaire ZB from static HTML/inline JS to a React (CRA) single-page application. The six phases follow strict architectural dependencies: the scaffold must exist before any component work begins, the shared layout shell must exist before page-specific work, the directory data layer must exist before filters and modal can be built, and design polish is last because it requires all components to be in place. The registration page is independent of the directory after Phase 2 and could run in parallel, but is sequenced after Phase 4 for simplicity. The migration preserves all existing behavior — no new features, no backend changes — while gaining component structure, JSX XSS safety, and a modern build pipeline.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Scaffold** - Bootstrap CRA with TailwindCSS, React Router, FontAwesome, env config, and Google Fonts (completed 2026-03-13)
- [x] **Phase 2: Layout Shell** - Shared sticky header, App routing, two empty page stubs navigable end-to-end (completed 2026-03-13)
- [ ] **Phase 3: Directory Data and Cards** - Fetch members, render card grid, skeleton loading, availability badge
- [ ] **Phase 4: Directory Filters and Modal** - Text search, dropdown filters, stats, animated member detail modal
- [ ] **Phase 5: Registration Form** - Full form with photo compression, validation, submit feedback, success screen
- [ ] **Phase 6: Design Polish** - Hero section, responsive layout audit, animation tuning, consistent icon usage

## Phase Details

### Phase 1: Scaffold
**Goal**: A working CRA app with all tooling correctly configured so that component work can begin without revisiting build infrastructure
**Depends on**: Nothing (first phase)
**Requirements**: SCAF-01, SCAF-02, SCAF-03, SCAF-04, SCAF-05, SCAF-06, SCAF-07
**Success Criteria** (what must be TRUE):
  1. `npm start` launches the app with no console errors and no missing stylesheet warnings
  2. A Tailwind utility class (e.g., `bg-soil`) renders the correct earthy color in the browser
  3. `process.env.REACT_APP_SHEET_API_URL` resolves to the correct value in browser JS (not `undefined`)
  4. FontAwesome icon renders visibly in a test component without a global CSS import
  5. Google Fonts (Playfair Display, DM Sans) load from `public/index.html` with no 404 in the network tab
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md — Bootstrap CRA, copy logo asset, create .env
- [ ] 01-02-PLAN.md — Install and configure TailwindCSS + Google Fonts
- [ ] 01-03-PLAN.md — React Router v6, FontAwesome SVG, route stubs, verification

### Phase 2: Layout Shell
**Goal**: A navigable app shell — sticky header with logo and CTA, two route-mounted page stubs — so page-specific work has a target to build into
**Depends on**: Phase 1
**Requirements**: LAYT-01, LAYT-02
**Success Criteria** (what must be TRUE):
  1. Visiting `/` and `/inscription` renders the correct stub page without a full page reload
  2. The "Rejoindre" button in the header navigates from `/` to `/inscription` via React Router (no browser navigation event)
  3. The ZB logo image is visible in the header on both routes with no 404
  4. The header remains visible and fixed at the top when the page is scrolled
**Plans**: 1 plan

Plans:
- [x] 02-01-PLAN.md — Create Header component and wire into App.js (remove Phase 1 banner, add pt-14 compensation)

### Phase 3: Directory Data and Cards
**Goal**: The directory page fetches members from Google Apps Script and renders them as a card grid with loading and empty states
**Depends on**: Phase 2
**Requirements**: DIR-01, DIR-02, DIR-03, DIR-04
**Success Criteria** (what must be TRUE):
  1. On page load, skeleton placeholder cards appear immediately while the fetch is in flight
  2. After the fetch completes, member cards display photo, name, title, company, and a colored availability badge
  3. Stats counters (total members, domain count, available count) show accurate numbers derived from the fetched data
  4. If the fetch returns zero members, an empty state message is displayed instead of an empty grid
**Plans**: 3 plans

Plans:
- [ ] 03-01-PLAN.md — Create useMemberFetch hook and AvailabilityBadge component (foundation)
- [ ] 03-02-PLAN.md — Create MemberCard and SkeletonCard components
- [ ] 03-03-PLAN.md — Wire DirectoryPage with fetch, stats, grid, and human verify

### Phase 4: Directory Filters and Modal
**Goal**: The directory is fully interactive — text search, four dropdown filters, reactive stats, and a member detail modal with accessible keyboard handling
**Depends on**: Phase 3
**Requirements**: DIR-05, DIR-06, DIR-07, DIR-08, DIR-09
**Success Criteria** (what must be TRUE):
  1. Typing in the search box filters visible cards by name, job title, company, skills, and bio without a page reload
  2. Selecting a value in any dropdown (city, domain, availability, service type) narrows the card grid immediately
  3. When no cards match the active search and filters, an empty state message replaces the grid
  4. Clicking a member card opens a modal with the full profile — photo, bio, skills, contact links, availability
  5. The modal closes when the user clicks the overlay, presses Escape, or clicks the close button
**Plans**: 3 plans

Plans:
- [ ] 04-01-PLAN.md — Refactor DirectoryPage: useMemberFetch + useMemo derived filtering, fix search-clear bug
- [ ] 04-02-PLAN.md — Create MemberModal component with portrait layout, animation, and three close triggers
- [ ] 04-03-PLAN.md — Wire MemberCard onClick + import MemberModal into DirectoryPage, human verify

### Phase 5: Registration Form
**Goal**: The registration page is fully functional — all form fields, photo upload with live preview, client-side validation, submit feedback, and success/error screens
**Depends on**: Phase 2
**Requirements**: REG-01, REG-02, REG-03, REG-04, REG-05, REG-06
**Success Criteria** (what must be TRUE):
  1. Selecting a photo file immediately shows a compressed thumbnail preview (max 400px, JPEG 80%) before submission
  2. Submitting the form with missing required fields or an invalid email shows inline validation errors without making an API call
  3. After clicking submit with a valid form, the button enters a loading/disabled state for the duration of the API call
  4. After the fetch resolves (regardless of no-cors response content), the form is replaced by a success confirmation screen
  5. If the fetch rejects (network error), an error message is shown and the form remains editable
**Plans**: TBD

### Phase 6: Design Polish
**Goal**: All pages and components have a production-quality visual finish — earthy palette applied consistently, responsive layout verified on mobile, hero section and animations in place
**Depends on**: Phase 5
**Requirements**: DES-01, DES-02, DES-03, DES-04
**Success Criteria** (what must be TRUE):
  1. The directory page has a hero section with a gradient background and stats counters prominently displayed
  2. On a mobile viewport, member cards stack vertically and filter controls are usable without horizontal overflow
  3. The AvailabilityBadge (colored dot + label) is visually identical in the card grid and the member detail modal
  4. The member detail modal has a smooth fade/scale entrance and exit animation when opened and closed
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Scaffold | 3/3 | Complete |  |
| 2. Layout Shell | 1/1 | Complete    | 2026-03-13 |
| 3. Directory Data and Cards | 2/3 | In Progress|  |
| 4. Directory Filters and Modal | 2/3 | In Progress|  |
| 5. Registration Form | 0/? | Not started | - |
| 6. Design Polish | 0/? | Not started | - |
