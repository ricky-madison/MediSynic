# Bring `medisynic` back to Lovable

## Goal
Recreate your `medisynic` health-assessment app as a working Lovable project, based on the code in your GitHub repo `https://github.com/ricky-madison/medisynic`.

## Three realities you need to know first

1. **Lovable cannot "link to" your existing GitHub repo.** GitHub sync in Lovable always creates a *new* repo — it can't attach to an existing one. So the plan is to *rebuild the app* here, then (if you want) connect GitHub sync to publish it to a *new* repo. Your existing `medisynic` repo stays untouched as a backup/reference.

2. **The repo is an older Lovable stack; this project is the newer stack.** Your repo is **Classic** (Vite + React 18 + React Router 6 + Tailwind v3 + Supabase). The current Lovable platform is **TanStack Start** (React 19 + TanStack Router + Tailwind v4). The code can't be dropped in as-is — routing, entry points, and the styling system all differ. So I'm **porting** the app onto the current stack, page by page.

3. **The old backend is gone.** I verified the old Supabase project (`xkcsjukkzqgrlzdrzbgc`) no longer resolves — it was deleted with your old Lovable project, along with any user accounts and data. So I'll provision a **fresh Lovable Cloud** backend (auth + database) and recreate the schema the app needs.

## Defaults I chose (since you asked me to decide)
- **Scope:** Phase it. Port the **core** app first (see below), then bring the remaining features in later rounds. This gets a working preview fast and keeps each step reliable.
- **Backend:** Enable **Lovable Cloud** — needed for auth and data storage the dashboard relies on.
- **Design:** Keep your **"Royal Indigo"** look — Inter font, indigo primary (`250 87% 67%`), 1rem radius, light/dark themes — ported from Tailwind v3 (HSL) to Tailwind v4 (oklch).

## Phase 1 — what I'll build (this plan)

Foundation + core user journey:

1. **Enable Lovable Cloud** — provisions auth + database. Then create the schema the core needs:
   - `profiles` (display name, age, gender, etc.)
   - `health_assessments` (the user's assessment inputs + results)
   - RLS policies so each user only sees their own rows.
2. **Port the design system** — rewrite `src/styles.css` with your Royal Indigo tokens in oklch (light + dark), Inter font via `<link>` in `__root.tsx`.
3. **Core routes (TanStack Router):**
   - `/` — landing page (HeroSection, Header, Footer, FloatingCTA, DataConsentBanner)
   - `/auth` — sign in / sign up
   - `/dashboard` — authenticated shell: `AppSidebar` + `DashboardNavbar` layout with `<Outlet />`
   - `/dashboard/home` — dashboard home (QuickStatCards, HealthMetricsPanel, NotificationsPanel)
   - `/form` — health assessment form
   - `/recommendations` — results (VitaminRecommendations, DetailedRecommendations, HealthProgressChart)
4. **Auth wiring** — replace the old `AuthContext`/`react-router` guard with TanStack auth (session provider + route gate under `_authenticated/`), backed by Cloud.
5. **Core utilities** — port `healthCalculations`, `healthRecommendations` (framework-agnostic logic, copied mostly verbatim).
6. **Root chrome** — `Toaster`/`Sonner`, `TooltipProvider`, `QueryClientProvider` in `__root.tsx`.

Pages/components/UI shadcn primitives are copied from your repo and lightly adapted (imports stay `@/...`).

## Later phases (ask me to continue)
- AI Pharmacist + AI Symptom Checker (likely AI Gateway)
- Drug Interaction Checker (FDA API)
- Caregiver integration, Device integration, Healthcare provider portal
- Subscriptions / pricing, Enhanced dashboard, advanced data viz
- Community hub

## GitHub (after Phase 1 works)
When you're happy with the preview, you can connect GitHub sync via the editor (+ menu → GitHub → Connect project). It will create a **new** repo (e.g. `medisynic` again or a new name). I can't reuse the existing repo link. Your existing `medisynic` repo is kept as-is.

## Technical notes
- shadcn UI primitives (`src/components/ui/*`) copy over with minimal change; Radix deps are preserved.
- React 18 → 19 minor fixes (e.g. `forwardRef` still fine; lazy/Suspense kept).
- React Query `defaultOptions` (staleTime 60s, retry 1, no refetchOnWindowFocus) ported into `src/router.tsx`.
- Old `UserDataContext`/`AuthContext` refactored to TanStack session + server functions; protected pages move under `src/routes/_authenticated/`.
- Cloud tables get explicit `GRANT`s + RLS per the platform rules.

## Out of scope / not possible
- Importing/linking the existing GitHub repo directly (platform limitation).
- Recovering old user accounts or data (backend deleted).
- Restoring the exact Classic stack (this project's platform is fixed to TanStack Start).
