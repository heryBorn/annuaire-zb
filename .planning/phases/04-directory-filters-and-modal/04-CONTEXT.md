# Phase 4 Context: Directory Filters and Modal

## Areas Discussed

- Modal layout
- Modal animation
- Missing fields in modal

---

## Modal Layout

**Decision: Centered portrait**

Photo is centered at the top of the modal as a square/round avatar. Name and title are centered below the photo. Content sections (bio, skills, contact, availability) are stacked below in a single column.

```
┌────────────────────────────────────┐
│  [×]                               │
│         ┌──────┐                   │
│         │photo │                   │
│         └──────┘                   │
│        Jean Dupont                 │
│      Développeur web               │
│       Acme Corp                    │
│      ● Disponible                  │
├────────────────────────────────────┤
│  Bio (full, untruncated)           │
│  Compétences: tag tag tag          │
│  Localisation: Ville, Région       │
│  Liens: LinkedIn / Site web        │
│  [ Email ]   [ Appeler ]           │
└────────────────────────────────────┘
```

---

## Modal Animation

**Decision: Fade + scale up**

- Overlay: `opacity 0 → 1`, ~200ms ease-out
- Modal card: `scale(0.95) → scale(1)` + `opacity 0 → 1`, ~200ms ease-out
- Exit: reverse (scale down + fade out)
- Use CSS transition classes (Tailwind `transition`, `duration-200`, `ease-out`) — no animation library needed

---

## Modal Size

**Decision: Medium centered**

- `max-w-xl` (576px) on desktop
- Centered horizontally and vertically with dark semi-transparent overlay (`bg-black/50`)
- Modal body is scrollable (`overflow-y-auto`) if content overflows viewport height
- On mobile: full-width with horizontal padding, vertically centered

---

## Modal Close Behavior

**Decision: All three close triggers**

1. Click dark overlay (outside modal card)
2. Press `Escape` key (`useEffect` + `keydown` listener, cleaned up on unmount)
3. `×` close button in top-right corner of modal

When modal is open, body scroll is locked (`overflow-hidden` on `document.body`).

---

## Modal Fields (Full Profile vs Card)

Card shows: photo, name, title, company, domaine badge, ville + region, bio (line-clamp-2), email + phone footer.

Modal additionally shows:
- **Full bio** — same `bio` field, no line-clamp, full text
- **Disponibilité** — availability badge (removed from card but shown in full profile)
- **Réseaux sociaux / liens** — `linkedin`, `site_web` fields if present; render as icon links
- **Compétences / skills** — `competences` or `skills` field if present; render as pill tags

Fields that may be absent on some members are hidden gracefully (no empty sections).

---

## Deferred (Not in Phase 4)

- URL-based filter state (shareable filtered links) — noted for Phase 6 polish
- Keyboard navigation between modal and card grid — noted for Phase 6 polish

---

## Bug to Fix in This Phase

- **Search clear bug**: Clicking "Rechercher" multiple times doesn't always clear previous results before new ones arrive. `flushSync` was attempted but didn't resolve it. Fix must happen in Phase 4 as part of the filter work. Consider replacing the async `runSearch` pattern with a `useReducer` or explicit `searchKey` trigger approach.
