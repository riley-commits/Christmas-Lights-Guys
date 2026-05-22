# The Christmas Light Guys — Field Ops Platform

A clickable prototype of a SaaS project-management platform for a Christmas-lights installation company. Two consoles — **Admin** (office) and **Employee** (field crews on mobile) — built around Mapbox-powered daily routing, scheduling, quoting, and time tracking.

This is a deploy-ready Next.js app. Pick a role on the landing screen — no login.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** + custom shadcn-style components
- **Mapbox GL JS** for maps + the Optimization API for daily route ordering
- **date-fns** for date math, **lucide-react** for icons
- React Context + `localStorage` for state — no backend, no database

## What's in here

**Admin (`/admin`)**
- Dashboard — KPIs, this-week pipeline, weather window, crew status today
- Projects — list, filters, detail view with crew assignment + checklist
- Schedule — week-view calendar, color-coded by service type, weather flags
- Quotes — build estimates, public quote pages, accept → auto-convert to a project
- Timesheets — crew hours, payroll cost, per-shift breakdowns

**Employee (`/employee`)** (mobile-first)
- Today — Mapbox map with the day's optimized route, ordered job list, clock-in
- Calendar — month view of assigned jobs
- Time Clock — clock in/out, today + week totals, recent shifts
- Messages — static mock messages from operations
- Job detail — checklist, special instructions, last-year notes, "Mark complete"

**Public**
- `/quote/[id]` — shareable customer-facing quote with one-click accept

## Quick start

```bash
npm install
cp .env.local.example .env.local   # add your Mapbox token
npm run build                       # type-check + production build
```

Visit `/` to start. Pick **Admin** or **Employee** and explore.

> **Note on local dev**: this repo is intentionally verified via `npm run build` rather than `npm run dev`. All visual/functional verification happens on Vercel deploys.

## Mapbox setup

The app reads a public Mapbox token from `NEXT_PUBLIC_MAPBOX_TOKEN`. Without one, maps fall back to a styled placeholder card — everything else still works (the seed data has pre-geocoded coordinates).

To get a free token:
1. Sign up at [account.mapbox.com](https://account.mapbox.com/access-tokens/)
2. Copy the default public token (starts with `pk.`)
3. Add it as an environment variable in Vercel **and** locally in `.env.local`

## Deploy to Vercel

1. Push this repo to GitHub (already wired up — see git remote)
2. Go to [vercel.com/new](https://vercel.com/new) and import `riley-commits/Christmas-Lights-Guys`
3. Framework preset auto-detects as Next.js — leave defaults
4. Add environment variable: `NEXT_PUBLIC_MAPBOX_TOKEN` = your Mapbox token
5. Click Deploy

First deploy takes ~2 minutes. Subsequent pushes to `main` auto-deploy.

## Known limitations

- **No persistence across hard refresh.** State lives in React + `localStorage`. Creating a project, clocking in, completing a job — all reset on a full reload (the seeded data comes back).
- **No real auth.** The "role picker" is a UX placeholder.
- **All data is mock data.** Customers, projects, schedules, shifts, messages — everything is seeded in `lib/mock-data/`.
- **Photo uploads are visual only** — the dropzone is non-functional.
- **Quote accept** writes to in-memory state, not a real backend.

## File structure

```
app/
  page.tsx                     # role picker landing
  admin/
    page.tsx                   # admin dashboard
    projects/                  # list, new, detail
    schedule/                  # week view
    quotes/                    # quote builder + list
    timesheets/                # payroll view
  employee/
    page.tsx                   # today (map + route)
    jobs/[id]/                 # job detail + checklist
    calendar/                  # month view
    time-clock/                # clock in/out
    messages/                  # message list
  quote/[id]/                  # public quote page

components/
  ui/                          # buttons, cards, inputs, toaster, logo
  admin/AdminShell.tsx
  employee/EmployeeShell.tsx
  map/                         # MapBase, DayRoute
  shared/                      # status + service badges

lib/
  state.tsx                    # AppStateProvider + useAppState
  types.ts                     # domain types
  mapbox.ts                    # token + Optimization API + greedy fallback
  derive.ts                    # KPI computations + date helpers
  mock-data/                   # all seed data
    employees.ts
    customers.ts               # with last-year customer memory
    projects.ts                # with pre-geocoded Winnipeg coords
    quotes.ts
    messages.ts
    shifts.ts
    weather.ts                 # 14-day mock forecast
```

## What's next (if this becomes real)

- Real auth (Clerk / Auth.js)
- Persistence (Supabase / Postgres)
- Real geocoding from Mapbox on project create
- Customer-facing "On the way" page using crew GPS
- Photo upload + before/after gallery per job
- Recurring contract management (multi-season repeats)
- Stripe-powered deposits + invoicing

---

Built as a clickable demo. Iterate from here.
