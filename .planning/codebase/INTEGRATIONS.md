# External Integrations

**Analysis Date:** 2026-03-09

## APIs & External Services

**Backend / Data Layer:**
- Google Apps Script Web App — serves as the sole backend for both reading and writing member data
  - Endpoint: `https://script.google.com/macros/s/AKfycbztDy9LxShVHeRJpdvsEUa84eVh1kiqaDra6V_k0XbxoiiV3Pcm3XIMx2hbsZE4f_BX/exec`
  - Defined in: `index.html` (line 136, constant `SHEET_API_URL`) and `inscription.html` (line 244, constant `APPS_SCRIPT_URL`) — same URL in both files
  - Read operation: `GET ?action=getMembers` called on page load in `index.html`; returns `{ members: [...] }` JSON
  - Write operation: `POST` with JSON body from `inscription.html` form submission; uses `mode: 'no-cors'` so response is opaque (success is assumed)
  - Auth: None on client side — the Apps Script endpoint is publicly accessible
  - Photo upload: profile photos are compressed client-side (max 400px, 80% JPEG quality via Canvas API), base64-encoded, and sent in the POST payload as `photo_base64` and `photo_mime` fields

**Typography CDN:**
- Google Fonts — loads `Playfair Display` and `DM Sans` font families
  - `index.html` line 7: `https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap`
  - `inscription.html` line 7: `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap`
  - Auth: None (public CDN)

## Data Storage

**Databases:**
- Google Sheets (via Apps Script) — all member data is stored in a Google Sheet managed by the Apps Script deployment
  - Connection: handled server-side within the Apps Script; no direct client credentials
  - Client: native Fetch API in browser

**File Storage:**
- Google Drive (via Apps Script) — profile photos submitted as base64 are likely stored/processed by the Apps Script, which stores them in Google Drive and returns a `photo_url` per member record
- Local filesystem: `assets/images/logo_zb_trans.png` — static logo image served locally

**Caching:**
- None — member data is fetched fresh on every page load

## Authentication & Identity

**Auth Provider:**
- None — no user authentication system exists
- The Apps Script endpoint is public; no login or session management on the client
- Editorial moderation is manual: new registrations are submitted with `statut: "EN ATTENTE"` and require president approval before appearing in results

## Monitoring & Observability

**Error Tracking:**
- None — errors are caught with try/catch and surfaced via `console.error` (`index.html` line 149) or `alert()` (`inscription.html` line 376)

**Logs:**
- Browser console only

## CI/CD & Deployment

**Hosting:**
- Static file host (no server required); project is in a local PHP web server directory (`/www/annuaire-zb`) suggesting local development via XAMPP/WAMP/similar
- No deployment pipeline detected

**CI Pipeline:**
- None detected

## Environment Configuration

**Required env vars:**
- `.env` file present — contents not read; likely stores the Apps Script URL or deployment-related values

**Secrets location:**
- `.env` in project root (listed in `.gitignore` via `??` status in git)

## Webhooks & Callbacks

**Incoming:**
- None on client side (static HTML cannot receive webhooks)

**Outgoing:**
- POST to Google Apps Script on form submission (`inscription.html` line 358)
- Email notification to registrant is described in UI copy but is handled entirely within the Apps Script (not implemented client-side)

---

*Integration audit: 2026-03-09*
