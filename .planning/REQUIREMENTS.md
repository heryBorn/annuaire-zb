# Requirements: Annuaire ZB

**Defined:** 2026-03-09
**Core Value:** Association members can find and connect with each other by profession, location, and availability — and new members can apply to join.

## v1 Requirements

### Scaffold

- [x] **SCAF-01**: App bootstrapped with Create React App as a single-page application
- [x] **SCAF-02**: React Router v6 with two routes: `/` (directory) and `/inscription` (registration)
- [x] **SCAF-03**: TailwindCSS configured with custom earthy color tokens (soil, terracotta, sand, wheat, sage, cream, ink, muted)
- [x] **SCAF-04**: Google Fonts (Playfair Display, DM Sans) loaded in public/index.html
- [x] **SCAF-05**: FontAwesome SVG React packages installed and available for use throughout the app
- [x] **SCAF-06**: Google Apps Script URL loaded from REACT_APP_SHEET_API_URL environment variable (not hardcoded)
- [x] **SCAF-07**: Logo asset (logo_zb_trans.png) available in public/images/

### Layout

- [x] **LAYT-01**: Sticky header with logo (image + text) and "Rejoindre" CTA button linking to /inscription
- [x] **LAYT-02**: Header is shared across both routes

### Directory

- [x] **DIR-01**: Member list fetched from Google Apps Script on page load (`?action=getMembers`)
- [x] **DIR-02**: Skeleton card grid displayed while data is loading
- [x] **DIR-03**: Member cards rendered in a responsive grid (photo, name, title, company, availability badge)
- [x] **DIR-04**: Stats counters displayed (total members, number of domains, available count)
- [x] **DIR-05**: Text search filtering members by name, job title, company, skills, bio
- [x] **DIR-06**: Four dropdown filters: city, domain, availability, service type
- [x] **DIR-07**: Empty state message shown when search/filter returns no results
- [x] **DIR-08**: Member detail modal opens on card click with full profile (photo, contact links, bio, skills, availability)
- [x] **DIR-09**: Modal closeable via close button, clicking overlay, or Escape key

### Registration

- [ ] **REG-01**: Registration form with all existing fields (personal info, professional info, photo)
- [ ] **REG-02**: Photo upload with canvas compression (max 400px, JPEG 80%) and live preview thumbnail
- [ ] **REG-03**: Client-side form validation (required fields, bio minimum length, email format)
- [ ] **REG-04**: Submit button shows loading state while POST is in flight
- [ ] **REG-05**: Success screen replaces form after submission (same behavior as current app)
- [ ] **REG-06**: Error toast/message shown if API call rejects (new — current app has no error feedback)

### Design

- [ ] **DES-01**: Modern hero section with gradient background and animated/prominent stats
- [ ] **DES-02**: Responsive layout — cards stack on mobile, filters collapse or scroll horizontally on small screens
- [ ] **DES-03**: Reusable AvailabilityBadge component (colored dot + label) used consistently in cards and modal
- [ ] **DES-04**: Member modal has smooth fade/scale entrance and exit animation

## v2 Requirements

### Performance
- **PERF-01**: Pagination or infinite scroll when member count exceeds ~200
- **PERF-02**: Cached member data (service worker or localStorage TTL)

### UX
- **UX-01**: Debounced search input (minor optimization)
- **UX-02**: Shareable URL with filter state in query params
- **UX-03**: Copy-to-clipboard for email/phone in modal

### Admin
- **ADM-01**: Admin dashboard to review and approve pending registrations
- **ADM-02**: Email notification when new registration is submitted

## Out of Scope

| Feature | Reason |
|---------|--------|
| Server-side rendering / Next.js | CRA SPA is specified; SSR is out of scope |
| Authentication / login | Public directory, no auth needed |
| Real-time updates | On-demand fetch on page load is sufficient |
| Dark mode | Not requested, significant CSS complexity |
| i18n framework | App is French-only |
| Unit test suite | Not in scope for this migration |
| Modifying Google Apps Script | Backend is fixed; only frontend changes |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCAF-01 | Phase 1 | Complete |
| SCAF-02 | Phase 1 | Complete |
| SCAF-03 | Phase 1 | Pending |
| SCAF-04 | Phase 1 | Pending |
| SCAF-05 | Phase 1 | Complete |
| SCAF-06 | Phase 1 | Complete |
| SCAF-07 | Phase 1 | Complete |
| LAYT-01 | Phase 2 | Complete |
| LAYT-02 | Phase 2 | Complete |
| DIR-01 | Phase 3 | Complete |
| DIR-02 | Phase 3 | Complete |
| DIR-03 | Phase 3 | Complete |
| DIR-04 | Phase 3 | Complete |
| DIR-05 | Phase 4 | Complete |
| DIR-06 | Phase 4 | Complete |
| DIR-07 | Phase 4 | Complete |
| DIR-08 | Phase 4 | Complete |
| DIR-09 | Phase 4 | Complete |
| REG-01 | Phase 5 | Pending |
| REG-02 | Phase 5 | Pending |
| REG-03 | Phase 5 | Pending |
| REG-04 | Phase 5 | Pending |
| REG-05 | Phase 5 | Pending |
| REG-06 | Phase 5 | Pending |
| DES-01 | Phase 6 | Pending |
| DES-02 | Phase 6 | Pending |
| DES-03 | Phase 6 | Pending |
| DES-04 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-09*
*Last updated: 2026-03-09 after initial definition*
