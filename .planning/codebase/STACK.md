# Technology Stack

**Analysis Date:** 2026-03-09

## Languages

**Primary:**
- HTML5 - Page structure for `index.html` and `inscription.html`
- CSS3 - Styling via `assets/css/main.css` and `assets/css/inscription.css`
- JavaScript (ES2017+, vanilla) - All interactivity inline within HTML files; uses async/await, Fetch API, FileReader API, Canvas API

**Secondary:**
- None detected

## Runtime

**Environment:**
- Browser (client-side only — no server-side runtime)
- No Node.js, PHP, or other server runtime present despite being hosted in a PHP directory

**Package Manager:**
- None — no package.json, requirements.txt, Cargo.toml, or any dependency manifest detected
- Lockfile: Not applicable

## Frameworks

**Core:**
- None — pure vanilla HTML/CSS/JavaScript, no JavaScript framework or library

**Testing:**
- None detected

**Build/Dev:**
- None detected — no build tooling (Webpack, Vite, Rollup, etc.)
- No transpilation; files are served as-is

## Key Dependencies

**Critical:**
- Google Fonts CDN (`fonts.googleapis.com`) — loads `Playfair Display` (serif headings) and `DM Sans` (body text) at runtime; no local font fallback if offline
- Google Apps Script Web App — acts as the sole backend/API for both reading member data and submitting registration forms

**Infrastructure:**
- No npm packages, no CDN libraries (no jQuery, no framework runtimes)

## Configuration

**Environment:**
- `.env` file present in project root — contents not read
- No runtime environment variable injection (static HTML cannot read `.env` natively; likely used for a deployment tool or future backend)

**Build:**
- No build config files detected

## Platform Requirements

**Development:**
- Any static file server or direct browser file access
- No compilation or installation steps required

**Production:**
- Any static web host (no server-side execution required)
- External dependency on Google Apps Script availability for all data operations
- Requires internet access for Google Fonts and Apps Script API calls

---

*Stack analysis: 2026-03-09*
