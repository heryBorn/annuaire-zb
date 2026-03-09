# Architecture

**Analysis Date:** 2026-03-09

## Pattern Overview

**Overall:** Static multi-page application (MPA) with client-side JavaScript and a Google Apps Script backend-as-a-service.

**Key Characteristics:**
- No server-side rendering; all pages are static HTML files served directly
- Business logic (data fetching, filtering, rendering) lives entirely in inline `<script>` blocks within HTML files
- Data persistence and moderation are delegated to a Google Apps Script (Google Sheets as database)
- No build step, no bundler, no framework — plain HTML/CSS/JS

## Layers

**Presentation Layer:**
- Purpose: Markup structure and visual layout
- Location: `index.html`, `inscription.html`
- Contains: Semantic HTML, component sections (header, hero, search panel, cards grid, modal, footer)
- Depends on: CSS stylesheets in `assets/css/`
- Used by: Browser directly

**Styling Layer:**
- Purpose: Visual design and responsive layout
- Location: `assets/css/main.css` (directory page), `assets/css/inscription.css` (registration page)
- Contains: CSS custom properties (`--soil`, `--sand`, `--terracotta`, etc.), component styles, layout rules
- Depends on: Google Fonts CDN (Playfair Display, DM Sans)
- Used by: HTML pages via `<link rel="stylesheet">`

**Application Logic Layer:**
- Purpose: Data fetching, state management, search/filter, rendering, form submission
- Location: Inline `<script>` blocks at the bottom of `index.html` (lines 134–351) and `inscription.html` (lines 243–379)
- Contains: All JavaScript — no external JS files
- Depends on: Google Apps Script REST endpoint (`SHEET_API_URL` / `APPS_SCRIPT_URL`)
- Used by: N/A (entry point)

**Backend Layer (external):**
- Purpose: Data storage, retrieval, moderation queue, photo storage
- Location: Google Apps Script (external URL: `https://script.google.com/macros/s/AKfycbz...`)
- Contains: Serverless functions handling `?action=getMembers` (GET) and form submission (POST)
- Depends on: Google Sheets (member registry), Google Drive (photo storage via base64 upload)
- Used by: `index.html` (read), `inscription.html` (write)

## Data Flow

**Directory Search Flow:**

1. On page load, `loadMembers()` fetches `SHEET_API_URL + "?action=getMembers"` — returns JSON `{ members: [...] }`
2. Response is stored in the module-level variable `allMembers`
3. `buildStats()` aggregates counts (total, domains, available) and updates DOM
4. `buildCityFilter()` extracts unique cities from members and populates the `#f-ville` select
5. User triggers `runSearch()` (button click or Enter key)
6. `runSearch()` filters `allMembers` in-memory using query text + four dropdown filters
7. Filtered results stored in `currentResults`
8. `renderCards(currentResults)` sorts and maps results to HTML string via `cardHTML(m, i)`
9. Cards are injected into `#cards-grid` via `innerHTML`
10. User clicks a card → `openModal(idx)` reads `currentResults[idx]` and populates modal DOM

**Registration Submission Flow:**

1. User fills `#inscription-form` in `inscription.html`
2. On `change` of `#photo-input`, `compressImage()` resizes the image (canvas, max 400px, JPEG 80%) and stores `photoBase64` and `photoMimeType`
3. On form `submit`, required fields are validated client-side; bio minimum length (50 chars) is checked
4. Payload object is assembled from form field values plus photo base64 and `statut: "EN ATTENTE"`
5. `fetch(APPS_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) })` sends data to Google Apps Script
6. Because `no-cors` mode prevents reading the response, success is assumed; the form wrapper is replaced with a success screen
7. The Apps Script stores the submission in Google Sheets for admin moderation

**State Management:**
- Two module-level variables in `index.html`: `allMembers` (full dataset) and `currentResults` (filtered subset)
- No reactive framework; DOM is mutated directly via `getElementById` and `innerHTML`
- No local storage or session state used

## Key Abstractions

**Member Object:**
- Purpose: Represents a validated association member
- Examples: Used throughout `index.html` script
- Fields: `nom`, `prenom`, `metier`, `entreprise`, `domaine`, `experience`, `competences`, `bio`, `ville`, `region`, `disponibilite`, `type_service`, `email`, `telephone`, `site_web`, `linkedin`, `photo_url`
- Pattern: Plain JSON object from Google Sheets row

**Card HTML Template:**
- Purpose: Renders a single member as a clickable card
- Location: `cardHTML(m, i)` function in `index.html` (lines 267–290)
- Pattern: Template literal returning HTML string; injected via `innerHTML`

**Modal:**
- Purpose: Full-detail view of a member, triggered by card click
- Location: `#modal-overlay` / `#modal` in `index.html` DOM (lines 118–128), populated by `openModal(idx)` (lines 293–337)
- Pattern: Single shared modal element; populated dynamically from `currentResults[idx]`

**Availability Status:**
- Purpose: Visual dot indicator (green/orange/grey) on cards
- Location: `availClass(d)` function in `index.html` (lines 264–266)
- Pattern: Derives CSS class from `disponibilite` string value

## Entry Points

**Directory Page:**
- Location: `index.html`
- Triggers: Browser navigation / direct URL
- Responsibilities: Loads all members on DOMContentLoaded (via `loadMembers()` called at line 350), renders search UI, handles filtering and card display

**Registration Page:**
- Location: `inscription.html`
- Triggers: User clicks "+ Rejoindre" CTA in header or links from `index.html`
- Responsibilities: Presents multi-section form, handles photo compression, submits member application to Google Apps Script

## Error Handling

**Strategy:** Minimal — try/catch with console.error for data load; alert() for form validation failures.

**Patterns:**
- `loadMembers()` wraps fetch in try/catch; on error logs to console and continues (stats show 0)
- Form submission wraps fetch in try/catch; on error re-enables button and shows `alert()`
- `no-cors` POST means the response body is never inspectable — success is always assumed

## Cross-Cutting Concerns

**Logging:** `console.error()` only on data load failure; no structured logging
**Validation:** Client-side only — required field check + bio length check in `inscription.html`; no server-side validation visible to the frontend
**Authentication:** None — directory is publicly readable; registration submissions enter a manual moderation queue (admin approval via Google Sheets)

---

*Architecture analysis: 2026-03-09*
