# IMPLEMENTATION_STATUS.md

## ReCon Spatial Command Center — Phase 1

Visual direction: **"ReCon Spatial Bubble System"** — floating white glass surfaces,
rounded modular cards, capsules, action orbs, soft shadows, subtle blur, spring motion,
ReCon orange `#E85C0D`, cyan `#00B8D9` for live/AI states. Light mode is the polished
default; dark mode is preserved.

This phase is **UI/UX only**. No Supabase tables, RLS policies, auth flows, storage,
environment variables, or edge functions were changed. All persisted behavior (jobs,
claims, supplements, payments, drying logs, photos, activity, subcontractors, profiles)
still flows through the existing hooks and Supabase client, and all role/permission
gating is preserved.

---

## Completed work

### 1. Reusable bubble design system + tokens
- Added Spatial Bubble tokens to `src/index.css` for both dark (`:root/.dark`) and light
  (`.light`) themes: glass surface, blur, radii, layered soft shadows, focus ring, cyan
  live/AI color, spring (`--spring`) and soft (`--ease-soft`) easings.
- Added shared utility classes: `.recon-bubble`, `.recon-orb`, `.recon-capsule`,
  `.recon-live-dot` (cyan pulse), `.recon-focusable` (visible focus ring),
  `.recon-floating-nav`, `.recon-bottom-nav`, plus a global
  `@media (prefers-reduced-motion: reduce)` block that disables animation/transitions.
- Extended the shared `T` token object (`src/lib/recon-data.ts`) with `cyan*` and
  `bubble*` CSS-variable references so inline styles stay theme-reactive.
- New reusable components in `src/components/recon/bubbles.tsx`: `Bubble` (glass surface),
  `Capsule`, `ActionOrb`, `LiveDot`, `BubbleTabs` (responsive, ARIA `tablist`), and
  `StatChip`. These replace repeated inline-styled surfaces across the new layout.

### 2. Theme system + light default
- `src/hooks/useTheme.tsx` now defaults to **light** (dark preserved and remembered via
  `localStorage` key `recon-theme`).
- `index.html` sets the saved/default theme class before render to avoid a flash.

### 3. ReconLayout + Index redesign
- `src/components/recon/ReconLayout.tsx` rebuilt with the bubble system:
  - **Floating collapsible desktop nav** (glass `aside`, collapse toggle → icon-only rail,
    `aria-current`, keyboard-focusable buttons, tooltips when collapsed).
  - **Capsule top bar** with breadcrumbs, inline global search, a command-palette trigger
    (⌘K), **sync state** pill (reflects live Supabase fetch state), **notifications** bell,
    **theme control** orb, role-aware **New Job** quick action, and a **user menu**
    (Settings / Sign out).
  - **Mobile bottom nav** (`MobileBottomNav`) with the role's primary destinations + search.
- `src/components/recon/CommandPalette.tsx` (new): Ctrl/Cmd+K palette with fuzzy navigation,
  live job lookup, and role-aware quick actions; full keyboard support (arrows/enter/esc),
  accessible `dialog` + `listbox` semantics.
- `src/hooks/useReconNotifications.ts` + `src/components/recon/NotificationsPanel.tsx`
  (new): notifications **derived from existing live job data** (moisture alerts, urgent
  jobs, carrier-approval waits). No new tables and no persistence.
- `src/pages/Index.tsx` wires the palette (global ⌘K listener), collapse state, mobile
  bottom nav, and passes the current user + job-select handlers to the top bar.
- `src/components/recon/GlobalSearch.tsx` keeps the inline search but yields the ⌘K
  shortcut to the command palette (no double-binding).

### 4. JobDetailPage → unified "Job File"
- `src/components/recon/JobDetailPage.tsx` rebuilt with a **bubble command header** showing
  job ID, customer, address, loss type, carrier, claim number, PM, priority, stage,
  financial summary (contract / mitigation / reconstruction, gated by `canViewInvoices`),
  alert count, next appointment placeholder, and quick actions (archive, stage tracker).
- Responsive **bubble tabs** (`BubbleTabs`) replace the old underline tab row.
- Role visibility for tabs and Supabase-backed tab content is unchanged.

### 5. GitHub Codespaces support (new requirement)
- Added `.devcontainer/devcontainer.json`: Node 20 image, installs dependencies on create
  (`npm install --legacy-peer-deps`), forwards **port 5173**, auto-opens the app preview
  (`onAutoForward: openPreview`), and starts the Vite dev server on attach.

---

## Changed / added files
- `package.json` — added missing direct dependency `@dnd-kit/core` (see Pre-existing errors).
- `index.html` — pre-render theme bootstrap.
- `src/index.css` — bubble tokens, utility classes, reduced-motion, bottom-nav responsive.
- `src/hooks/useTheme.tsx` — light default.
- `src/lib/recon-data.ts` — cyan + bubble tokens on `T`.
- `src/components/recon/bubbles.tsx` — **new** reusable bubble component library.
- `src/components/recon/CommandPalette.tsx` — **new**.
- `src/components/recon/NotificationsPanel.tsx` — **new**.
- `src/hooks/useReconNotifications.ts` — **new**.
- `src/components/recon/ReconLayout.tsx` — rebuilt.
- `src/pages/Index.tsx` — wiring.
- `src/components/recon/GlobalSearch.tsx` — release ⌘K.
- `src/components/recon/JobDetailPage.tsx` — rebuilt "Job File".
- `.devcontainer/devcontainer.json` — **new**.
- `IMPLEMENTATION_STATUS.md` — **new**.

## Migrations
- **None.** Phase 1 introduces no schema changes. Any future migration will be additive,
  reversible, indexed, company-scoped, and RLS-protected.

---

## Codespaces secrets (do not commit credentials)
The app reads Vite env vars at build/run time. For a secure Codespaces setup, define these
as **Codespaces secrets** (Settings → Codespaces → Secrets) or repository/organization
Codespaces secrets, rather than committing them:

| Secret | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key — safe for the browser, protected by RLS |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project identifier |

Notes:
- Only the **publishable/anon** key belongs in the frontend. Never place the service-role
  key in Codespaces frontend secrets or in the repository.
- The devcontainer does **not** contain any credentials.

---

## Tooling results

Dependencies must be installed with legacy peer deps (see Pre-existing errors):
`npm install --legacy-peer-deps`

| Command | Before this phase | After this phase |
| --- | --- | --- |
| `npm install` | Fails without `--legacy-peer-deps` (react-leaflet@5 peer wants react@19) | Same; documented |
| `npm run build` | **FAILED** — `@dnd-kit/core` unresolved | **Passes** |
| `npm run lint` | 155 problems (143 errors, 12 warnings) | 154 problems (142 errors, 12 warnings) — **no new problems introduced**; net −1 error |
| `npm test` | 1 passed | 1 passed |
| `npm run dev` | n/a | Verified: serves `HTTP 200` on port 5173 |

The remaining lint problems are all **pre-existing** (`@typescript-eslint/no-explicit-any`
in older pages/hooks, one `require()` import in `tailwind.config.ts`, and a couple of
react-refresh/react-hooks warnings). New Phase 1 files add **zero** new lint errors or
warnings.

### Dev server verification
`npm run dev -- --host 0.0.0.0 --port 5173` starts Vite successfully; `GET /` returns
`HTTP 200`, `/src/main.tsx` is transformed and served, and the injected theme bootstrap
applies the light class before render.

---

## Pre-existing errors (recorded, mostly out of scope)
1. **Install peer conflict**: `react-leaflet@5` requires `react@^19` while the project uses
   `react@18`. Install requires `--legacy-peer-deps`. Left as-is (dependency upgrade is out
   of scope for a UI phase).
2. **Build break**: `@dnd-kit/core` was imported by `DashboardPage.tsx` but not listed as a
   direct dependency (only `@dnd-kit/sortable`). **Fixed** by adding `@dnd-kit/core@^6.3.0`
   (already present transitively; no vulnerabilities per advisory DB) so the app builds.
3. **Lint**: 143 pre-existing `no-explicit-any` / `require()` errors and 12 warnings across
   legacy files. Not addressed (unrelated to this phase).

---

## Limitations
- **Notifications** are derived read-only signals from existing job fields; there is no
  notifications table or read/unread persistence (intentionally, to avoid new tables).
- **"Next appointment"** in the Job File header is a placeholder until the persistent
  scheduling work in a later phase.
- Playwright browser automation was unavailable in the build sandbox, so runtime
  verification was done via the dev server (HTTP + module transform) rather than a rendered
  screenshot.
- Pre-existing lint debt (`any` usage, etc.) remains and is out of scope for Phase 1.

---

## Remaining work (later phases)
- Job overview / tasks / docs deep-dive.
- Visual Vault (photo/document management).
- Drying Lab / equipment tracking.
- Claims / supplements workflows.
- Persistent dispatch / Gantt / calendar / routes scheduling.
- ReCon Copilot (AI) surfaces.
- Dashboard, mobile, accessibility, and performance cleanup (incl. bundle code-splitting).
