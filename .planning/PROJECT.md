# Annuaire ZB

## What This Is

A member directory web app for the ZB association, listing professionals by domain, city, and availability. Members can browse the directory, filter/search, view detailed profiles, and submit registration applications. The app is backed by Google Sheets via a Google Apps Script REST endpoint — no traditional server.

## Core Value

Association members can find and connect with each other by profession, location, and availability — and new members can apply to join.

## Requirements

### Validated

- ✓ Member directory listing fetched from Google Sheets via Apps Script — existing
- ✓ Text search + filter by city, domain, availability, service type — existing
- ✓ Member cards grid with availability status dot — existing
- ✓ Modal detail view (full profile on card click) — existing
- ✓ Stats counters (total members, domains count, available count) — existing
- ✓ Registration form with client-side validation — existing
- ✓ Photo upload with canvas compression (max 400px, JPEG 80%) — existing
- ✓ Form submission to Google Apps Script moderation queue — existing
- ✓ Sticky header with logo + CTA to registration page — existing

### Active

- [ ] Migrate entire app to React (Create React App) as a SPA
- [ ] React Router for / (directory) and /inscription (registration) routes
- [ ] TailwindCSS replacing all custom CSS
- [ ] FontAwesome for all icons (availability, contact, social, UI actions)
- [ ] Google Apps Script URL loaded from .env (REACT_APP_SHEET_API_URL)
- [ ] Modern redesign preserving earthy palette (soil/terracotta/sand/sage) with refined, professional feel
- [ ] Same logo asset (assets/images/logo_zb_trans.png) kept in public/

### Out of Scope

- Admin panel / moderation UI — managed directly in Google Sheets
- Server-side rendering — static SPA, no backend
- Authentication — public directory, no login required
- Mobile app — web only
- Real-time updates — on-demand fetch on page load is sufficient

## Context

- **Existing stack:** Static HTML + inline JS, no build step. Two pages: `index.html` (directory) and `inscription.html` (registration form).
- **Codebase map:** `.planning/codebase/` — full analysis of current architecture, concerns, and conventions.
- **Key concern:** API URL is currently hardcoded in HTML — must move to `REACT_APP_SHEET_API_URL` in `.env`.
- **Key concern:** `innerHTML` with unsanitized member data (XSS risk) — React's JSX rendering mitigates this naturally.
- **Key concern:** `no-cors` POST means success is always assumed — preserve this behavior (Google Apps Script limitation).
- **Design tokens to preserve:** `--soil: #2C1A0E`, `--terracotta: #C1440E`, `--sand: #F5E6C8`, `--wheat: #E8C97A`, `--sage: #6B8F71`, `--cream: #FAF5EC`.
- **Fonts:** Playfair Display (headings) + DM Sans (body) via Google Fonts — keep in new app.

## Constraints

- **Tech stack:** React (CRA), TailwindCSS, FontAwesome, React Router v6 — no other frameworks
- **Backend:** Google Apps Script unchanged — only the frontend changes
- **Logo:** Must remain `logo_zb_trans.png` as-is
- **Env:** CRA requires `REACT_APP_` prefix for env variables accessible in browser code

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Create React App over Vite | User preference | — Pending |
| React Router SPA | Single codebase, no page reload between directory and registration | — Pending |
| Preserve earthy palette | Brand continuity, warm professional feel matching association identity | — Pending |
| TailwindCSS config for design tokens | Map existing CSS vars to Tailwind theme colors | — Pending |
| FontAwesome free tier | Icons for social links, availability, contact, UI — replaces current absence of icon library | — Pending |

---
*Last updated: 2026-03-09 after initialization*
