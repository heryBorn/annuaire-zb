# FEATURES.md — React Member Directory

**Research date:** 2026-03-09
**Context:** Migrating static HTML annuaire app to React CRA + TailwindCSS

---

## Table Stakes (must have — app feels broken without these)

### Directory Page
- **Member cards grid** — responsive, shows photo, name, job title, company, availability dot
- **Text search** — filters by name, job, company, skills, bio
- **Dropdown filters** — city, domain, availability, service type
- **Member count / stats** — total members, domains count, available count
- **Member detail modal** — full profile on card click (photo, contact links, bio, skills)
- **Loading state** — skeleton cards or spinner while fetching from API
- **Empty state** — message when search returns no results

### Registration Page
- **Multi-section form** — personal info, professional info, photo
- **Photo upload + preview** — compress before upload, show thumbnail
- **Client-side validation** — required fields, bio min length, email format
- **Submit feedback** — loading state on button, success screen after submission
- **Error feedback** — alert/toast if API call fails (not just silent failure)

### Global
- **Sticky header** with logo + "Rejoindre" CTA
- **Routing** — / (directory) and /inscription (registration) with no page reload
- **Accessible navigation** — keyboard-navigable modal, focus trapping
- **.env-driven API URL** — REACT_APP_SHEET_API_URL, not hardcoded

---

## Differentiators (UX improvements the React migration enables)

| Feature | Current behavior | React improvement |
|---------|-----------------|-------------------|
| Search | Full re-render on each filter change | Debounced input, smooth re-render |
| Modal | Replaces innerHTML directly | Animated entrance/exit, accessible focus trap |
| Photo upload | Canvas compression, no preview | Live preview thumbnail before submit |
| Availability dots | Static CSS classes | Colored badge component, consistent everywhere |
| Stats | Updated via innerHTML | Reactive counters, update smoothly |
| Form submit | Button re-enabled on error | Toast notification, button state feedback |
| Page transition | Full page reload | Instant SPA navigation via React Router |
| Empty state | No explicit handling | Designed empty state component |
| Loading | No loading indicator | Skeleton card grid (earthy shimmer) |

---

## Component Breakdown (suggested)

### Shared
- `Header` — sticky, logo, CTA link
- `Footer` (if needed)
- `AvailabilityBadge` — colored dot + label
- `Modal` — generic overlay with close button

### Directory Page (`/`)
- `DirectoryPage` — page root, data fetching
- `HeroSection` — stats, title, search bar
- `FilterBar` — city, domain, availability, service type selects
- `MemberGrid` — responsive card grid
- `MemberCard` — individual card (photo, name, title, badge, click to open modal)
- `MemberModal` — full profile detail
- `SkeletonCard` — loading placeholder
- `EmptyState` — no results message

### Registration Page (`/inscription`)
- `InscriptionPage` — page root, form state
- `PhotoUpload` — file input, canvas compression, preview
- `FormSection` — grouped form fields with heading
- `SuccessScreen` — replaces form after submission

---

## Anti-Features (do NOT add during migration)

| Feature | Reason |
|---------|--------|
| Server-side rendering / Next.js | Scope creep — CRA SPA is specified |
| Redux / Zustand | Over-engineering — useState + props is sufficient at this scale |
| React Query / SWR | Nice but unnecessary — single fetch on page load is fine |
| Infinite scroll / pagination | Not needed for current member count |
| Optimistic UI on registration | `no-cors` POST means we can't read the response anyway |
| Dark mode | Not requested, adds significant CSS complexity |
| i18n library | App is French-only |
| Unit test suite | Not in scope for this migration |

---

## Form Handling Pattern

**Recommended:** Controlled components with `useState` per field (or a single form state object).

- Do NOT introduce react-hook-form (extra dependency, overkill for one form)
- Validation: custom validation function called on submit
- Photo: separate `useRef` for canvas, `useState` for base64 + mimeType

---

## Modal Pattern

- Single `MemberModal` component, rendered in `DirectoryPage`
- State: `selectedMember` (null or member object)
- Open: set `selectedMember` to a member; close: set to null
- CSS: Tailwind `fixed inset-0` overlay with `z-50`
- Accessibility: `useEffect` to trap focus when open, `Escape` key closes

---

*Features research: 2026-03-09*
