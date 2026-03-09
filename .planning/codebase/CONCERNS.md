# CONCERNS.md — Technical Debt & Issues

**Analysis Date:** 2026-03-09

## Security

### HIGH: API Endpoint Hardcoded in HTML
- **Location:** `index.html` (SHEET_API_URL constant), `inscription.html` (APPS_SCRIPT_URL constant)
- **Issue:** Google Apps Script URLs are embedded directly in client-side HTML/JS — publicly visible to anyone who views source
- **Impact:** Endpoint can be abused for spam/flooding the registration queue
- **Note:** The `.env` file exists but is not wired up; values are copy-pasted into the HTML

### HIGH: No Server-Side Validation
- **Location:** `inscription.html` submission flow
- **Issue:** All validation is client-side only (required fields, bio length). The Google Apps Script accepts any POST payload with no documented server-side validation
- **Impact:** Malformed or malicious data can be submitted by bypassing the form

### MEDIUM: XSS via innerHTML
- **Location:** `index.html` — `cardHTML()` and `openModal()` inject member data via `innerHTML`
- **Issue:** Member fields (`nom`, `bio`, `competences`, etc.) are interpolated directly into HTML template literals without sanitization
- **Impact:** If a member record in Google Sheets contains `<script>` tags or event handlers, it executes in visitors' browsers
- **Mitigation needed:** `textContent` assignment or DOMPurify sanitization

### MEDIUM: no-cors POST = Blind Submission
- **Location:** `inscription.html` fetch call (`mode: 'no-cors'`)
- **Issue:** Response body is unreadable; success is always assumed regardless of actual server outcome
- **Impact:** Users receive a false success message even if the submission silently failed

### LOW: .env File Not Gitignored (check)
- **Location:** `.env` at project root
- **Issue:** `.env` appears in `git status` as untracked — verify it is in `.gitignore` before committing

## Performance

### MEDIUM: Full Dataset Loaded on Every Page Visit
- **Location:** `index.html` — `loadMembers()` fetches all members on `DOMContentLoaded`
- **Issue:** No pagination, caching, or lazy loading. As the member count grows, initial payload and render time will increase
- **Impact:** Slow first load on large datasets; no cache headers or service worker

### LOW: Photo Upload as Base64
- **Location:** `inscription.html` — `compressImage()` converts photos to base64 JPEG (max 400px, 80% quality)
- **Issue:** Base64 encoding increases payload size ~33%; large photos may still be significant
- **Impact:** Slow form submission; Google Apps Script has payload size limits

### LOW: innerHTML Batch Render (Not a Critical Issue Yet)
- **Location:** `index.html` — `renderCards()` sets `innerHTML` on `#cards-grid`
- **Issue:** Rebuilds entire card list on every filter change; no virtual DOM or incremental updates
- **Impact:** Acceptable for small datasets; will cause jank with hundreds of members

## Technical Debt

### No Build Pipeline
- Raw HTML/CSS/JS shipped directly; no minification, bundling, or cache-busting
- Asset URLs have no version hashes — browser caches may serve stale CSS/JS after updates

### Inline JavaScript (Maintainability)
- All logic in `<script>` blocks inside HTML files
- Difficult to unit test, refactor, or reuse across pages
- No separation of concerns (data fetching, rendering, and event handling all mixed)

### Duplicated Code Across Pages
- Header HTML structure is duplicated between `index.html` and `inscription.html`
- Any header change must be applied to both files manually

### No Error Feedback on Load Failure
- `loadMembers()` catches errors silently — users see an empty directory with no explanation if the API is down

### French/English Mixed Codebase
- UI text and comments are in French
- Some variable names and code patterns follow English conventions
- Inconsistent — could confuse contributors

## Fragile Areas

### Google Apps Script Dependency
- Entire backend (data storage, retrieval, moderation) depends on a single external Google Apps Script URL
- No fallback, no error page, no monitoring
- If the script is deleted, quota-exceeded, or the Google account is disabled — the entire site stops working

### Manual Moderation Queue
- New registrations sit in Google Sheets awaiting manual admin approval
- No notification system, no admin UI — relies entirely on someone checking the spreadsheet

### Photo URL Assumption
- `index.html` renders `photo_url` directly as `<img src="...">` — assumes Google Drive URLs are always publicly accessible
- Google Drive sharing permissions can change, silently breaking all member photos

---

*Concerns analysis: 2026-03-09*
