---
phase: 03-directory-data-and-cards
plan: "01"
subsystem: data-layer
tags: [react, hooks, fetch, components, availability]
dependency_graph:
  requires: []
  provides:
    - useMemberFetch hook (data contract for all card/page consumers)
    - AvailabilityBadge component (reusable badge for Phase 3 cards and Phase 4 modal)
  affects:
    - annuaire-zb-react/src/hooks/useMemberFetch.js
    - annuaire-zb-react/src/components/AvailabilityBadge.jsx
tech_stack:
  added: []
  patterns:
    - AbortController cleanup pattern for React 18 StrictMode safe fetch
    - badgeConfig lookup object for availability state → style mapping
key_files:
  created:
    - annuaire-zb-react/src/hooks/useMemberFetch.js
    - annuaire-zb-react/src/components/AvailabilityBadge.jsx
  modified: []
decisions:
  - "Named export for useMemberFetch (not default) — hook convention; consumers use { useMemberFetch }"
  - "data.members || [] fallback — GAS response shape not validated against live script until Phase 3 integration"
  - "getAvailStyle mirrors index.html availClass() exactly — canonical business rule reference"
metrics:
  duration: "2 min"
  completed: "2026-03-13"
  tasks_completed: 2
  files_created: 2
  files_modified: 0
---

# Phase 3 Plan 01: Data Hook and Availability Badge Summary

**One-liner:** Custom React fetch hook with AbortController cleanup + presentational availability badge using project Tailwind tokens mapped from existing index.html business logic.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Create useMemberFetch hook | eda9cbf | annuaire-zb-react/src/hooks/useMemberFetch.js |
| 2 | Create AvailabilityBadge component | f34a88e | annuaire-zb-react/src/components/AvailabilityBadge.jsx |

## What Was Built

### useMemberFetch.js

Hook returning `{ members, loading, error }` with:
- Initial state: `loading=true`, `members=[]`, `error=null`
- Fetches from `process.env.REACT_APP_SHEET_API_URL + '?action=getMembers'`
- AbortController prevents state updates after unmount (React 18 StrictMode safe)
- `data.members || []` fallback for unvalidated GAS response

### AvailabilityBadge.jsx

Purely presentational component accepting `disponibilite` string prop:
- `getAvailStyle()` function mirrors `availClass()` from `index.html` exactly
- `badgeConfig` lookup maps `green/orange/grey` keys to Tailwind tokens: `bg-sage`, `bg-wheat`, `bg-muted`
- Default export; renders colored dot + label in rounded pill

## Verification

CRA build (`npx react-scripts build`) passed with zero errors and zero warnings.

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] `annuaire-zb-react/src/hooks/useMemberFetch.js` exists
- [x] `annuaire-zb-react/src/components/AvailabilityBadge.jsx` exists
- [x] Commit `eda9cbf` exists
- [x] Commit `f34a88e` exists
- [x] CRA build passes
