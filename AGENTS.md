# AGENTS.md — nexaBoard

## Project

nexaBoard is a productivity app for small teams (5-20). Phase 1 MVP scope: auth, workspaces, kanban/list tasks, basic notes, basic calendar.

## Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Backend**: NestJS 10, Prisma 5, PostgreSQL 16, Redis 7, Passport.js + JWT
- **Frontend**: Next.js 14 (App Router), TypeScript strict, Tailwind CSS, Zustand, React Hook Form + Zod
- **Dev**: Docker Compose (db + redis + api + web), Node 20+

## Commands

```bash
pnpm install                    # install all deps
pnpm dev                        # run api + web in parallel (via turbo)
pnpm dev:api                    # backend only (port 4000)
pnpm dev:web                    # frontend only (port 3000)
pnpm build                      # build all packages
pnpm build:api                  # nest build
pnpm build:web                  # next build
pnpm lint                       # lint all
pnpm format                     # prettier write
pnpm db:generate                # prisma generate (in apps/api)
pnpm db:migrate                 # prisma migrate dev (in apps/api)

# Docker
docker compose up -d db redis   # start infra only
docker compose up -d            # full stack (db + redis + api + web)

# Single package
pnpm --filter @nexaboard/api <cmd>
pnpm --filter @nexaboard/web <cmd>
```

## Structure

```
apps/
  api/          NestJS backend (port 4000)
    src/
      modules/      One NestJS module per domain (auth, users, tasks, notes, calendar, projects, workspaces, health)
      common/prisma Global PrismaModule + PrismaService
      main.ts       Bootstrap (helmet, CORS, ValidationPipe, Swagger at /api/docs)
    prisma/
      schema.prisma  Full schema (User, Session, Workspace, Task, Note, CalendarEvent, etc.)
      migrations/
  web/          Next.js frontend (port 3000)
    src/
      app/          App Router pages (/, /auth/*, /dashboard)
      lib/api.ts    ApiClient with auto-refresh on 401
      stores/       Zustand stores
      components/   (empty — not yet built)
libs/
  shared/       Shared types (User, Workspace, Task, etc.)
```

## Key quirks

- **API prefix**: All backend routes are under `/api/v1/`. Swagger at `/api/docs`.
- **Auth flow**: Register/login return `{ user, accessToken, refreshToken }`. Refresh token stored in localStorage, auto-refreshed by `api.ts` on 401. Profile via `GET /api/v1/auth/profile` (requires Bearer token).
- **Prisma**: The `apps/api/.env` has `DATABASE_URL` pointing to localhost. For Docker, override via `DATABASE_URL=postgresql://nexaboard:nexaboard_secret@db:5432/nexaboard?schema=public`.
- **DTOs**: class-validator with `whitelist: true` and `forbidNonWhitelisted: true`. Use `!` (non-null assertion) on DTO properties since they're initialized by class-validator.
- **Rate limiting**: ThrottlerModule configured (short: 3/s, medium: 20/10s, long: 100/60s). Auth endpoints have extra-throttling (register: 1/s, login: 3/s).
- **Next.js config**: `next.config.mjs` (not .ts — Next.js 14.2 doesn't support .ts config). Output mode: standalone.
- **Tailwind config**: `tailwind.config.js` (not .ts). Uses shadcn/ui CSS variables theme. `cn()` utility in `lib/utils.ts`.
- **ESLint**: Root `.eslintrc.json` is minimal (just ignorePatterns). Web app has its own `.eslintrc.json` extending `next/core-web-vitals`. API has no eslint config yet.
- **Path aliases**: `@/*` maps to `src/*` in both api and web tsconfigs.

## What's implemented vs stub

| Module | Status |
|--------|--------|
| Auth (register, login, refresh, logout, profile) | Implemented |
| Users (findByEmail, create, verifyPassword) | Implemented |
| Health endpoint | Implemented |
| Tasks, Notes, Calendar, Projects, Workspaces | Stub modules only |
| Frontend auth pages (/auth/login, /auth/register) | Implemented |
| Frontend dashboard | Hardcoded stats |
| Frontend components/ui | Empty |

## Scope rules

- Phase 1 MVP only. Do not add: timeline view, rich editor, real-time collab, automations, mobile/desktop apps.
- TypeScript strict everywhere. No `any`.
- Backend pattern: Controller → Service → Prisma. DTOs for all inputs.
- Frontend: Server Components by default, Client Components only when needed.
- Conventional Commits. Branches: `feat/`, `fix/`, `chore/`, `refactor/`.
