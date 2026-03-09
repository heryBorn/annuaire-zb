# STRUCTURE.md — Directory Layout & Organization

## Root Layout

```
annuaire-zb/
├── index.html          # Directory page — member search, filter, cards, modal
├── inscription.html    # Registration page — member application form
├── assets/
│   ├── css/
│   │   ├── main.css          # Styles for index.html (directory)
│   │   └── inscription.css   # Styles for inscription.html (registration)
│   └── images/
│       └── logo_zb_trans.png # Association logo (transparent PNG)
├── .env                # Environment variables (API URLs, secrets — not committed)
├── .planning/          # GSD planning directory
│   └── codebase/       # This codebase map
└── .git/
```

## Key File Locations

| Purpose | File |
|---------|------|
| Member directory UI | `index.html` |
| Registration form | `inscription.html` |
| Directory styles | `assets/css/main.css` |
| Registration styles | `assets/css/inscription.css` |
| Logo asset | `assets/images/logo_zb_trans.png` |
| Environment config | `.env` |

## JavaScript Location

All JavaScript is **inline** inside `<script>` blocks at the bottom of each HTML file:

- `index.html` lines ~134–351: Data fetching, search/filter logic, card rendering, modal
- `inscription.html` lines ~243–379: Photo compression, form validation, submission

No external `.js` files exist.

## CSS Architecture

- Two separate CSS files, one per page
- CSS custom properties (design tokens) defined at `:root` level
- Naming: `assets/css/{page}.css` pattern
- No CSS preprocessor (plain CSS)

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| CSS files | kebab-case | `main.css`, `inscription.css` |
| CSS classes | kebab-case | `.form-group`, `.btn-primary` |
| HTML IDs | kebab-case | `#cards-grid`, `#modal-overlay` |
| JS functions | camelCase | `loadMembers()`, `openModal()` |
| JS variables | camelCase / UPPER_SNAKE_CASE | `allMembers`, `SHEET_API_URL` |
| Data fields | snake_case | `nom`, `type_service`, `photo_url` |

## Configuration

- API endpoint stored in `.env` (not committed to git)
- `.env` is referenced but loading mechanism not yet wired (manual copy into HTML script block as constant)

## Notable Absence

- No `package.json` / Node.js tooling
- No build system (Webpack, Vite, etc.)
- No test directory
- No CI/CD configuration
- No server-side code (pure static + external Google Apps Script)
