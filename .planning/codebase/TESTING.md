# TESTING.md — Test Structure & Practices

## Status: No Automated Testing

This project has **no testing framework, no test files, and no automated tests** of any kind.

## What Exists

### Client-Side Validation (Manual)
- `inscription.html` contains inline JavaScript form validation
- Validates required fields, email format, and other constraints before submission
- Feedback via `alert()` dialogs or DOM manipulation

### Manual Testing Only
- All testing is done manually in the browser
- No unit tests, integration tests, or end-to-end tests

## Gaps

| Area | Status |
|------|--------|
| Unit tests | None |
| Integration tests | None |
| E2E tests | None |
| CI/CD pipeline | None |
| Test runner | None |
| Coverage reporting | None |

## Recommendations (if testing is added)

Given the vanilla HTML/JS stack, suitable options would be:
- **Jest** for unit testing JS logic extracted into modules
- **Playwright** or **Cypress** for E2E browser testing
- **Manual QA checklist** as minimum viable testing for current structure
