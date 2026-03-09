# CONVENTIONS.md — Code Style & Patterns

## Languages
- HTML5 with inline JavaScript (no separate JS files)
- CSS (separate files: `style.css`, `inscription-style.css`)
- French language used throughout (comments, UI text, variable names)

## Naming Conventions

### CSS Classes
- **kebab-case**: `.form-group`, `.btn-primary`, `.section-header`

### JavaScript
- **camelCase** for functions: `loadAnnuaire()`, `handleFormSubmit()`
- **UPPER_SNAKE_CASE** for constants: `API_URL`, `MAX_RESULTS`
- **snake_case** for data field names (matching backend/API keys)

### HTML IDs
- **kebab-case**: `#user-form`, `#result-container`

## Code Structure

### File Organization
- Inline `<script>` blocks inside HTML files (no external JS modules)
- Module-level state variables declared at top of script blocks
- Functions defined in script block scope

### Section Comments
- French ASCII banner-style section dividers used to separate logical sections
- Example: `/* ===== FORMULAIRE ===== */`

## Error Handling
- Pattern: `try/catch` + `alert()` for user-facing errors + `console.error()` for debugging
- Client-side validation before API calls

## HTML Conventions
- Inline styles used alongside CSS classes (mixed approach)
- Standard HTML5 form elements
- Bootstrap or similar utility classes (check `style.css` for details)

## State Management
- Module-level variables in script blocks for page state
- No client-side framework; vanilla JS only
