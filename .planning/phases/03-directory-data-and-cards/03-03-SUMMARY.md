---
phase: 03-directory-data-and-cards
plan: 03
status: complete
completed: 2026-03-13
commit: 41a3675
---

# Plan 03-03 Summary — DirectoryPage

## What was built

DirectoryPage fully implemented with search-first UX matching the original `index.html` behavior.

**Search panel (card with shadow-md):**
- Text input searching nom/prenom/metier/bio/competences/entreprise
- Domaine dropdown (15 options, static list)
- Ville dropdown (dynamically built from live member data)
- Disponibilité filter (Disponible / Partiellement / Non disponible / En recherche)
- Type de service filter (5 options)
- "Effacer filtres" button — appears when any filter is active, resets all state
- Enter key triggers search

**Search-first UX:**
- Default state: empty prompt "Effectuez une recherche" — no cards shown
- After Rechercher: filtered results grid or "Aucun membre trouvé" if 0 matches
- Stats bar (membres / domaines / villes) always visible after data loads

**MemberCard redesign:**
- Photo: `h-40` (smaller than original aspect-square)
- Domaine badge (pill, bg-sand)
- Name (font-serif)
- Ville + région with terracotta map pin icon
- Bio truncated to 2 lines (line-clamp-2)
- Footer: Email / Appeler / LinkedIn links — conditionally rendered
- Removed: disponibilite / AvailabilityBadge

**SkeletonCard:** Updated to match new MemberCard layout.

## Decisions recorded

- Search-first UX: cards hidden until Rechercher clicked — mirrors index.html behavior
- Disponibilité filter kept in search panel even though badge removed from card (data field still exists on members)
- Stats bar shows "villes" count (unique `m.ville` values) replacing "disponibles"
