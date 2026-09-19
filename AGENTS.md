# AGENTS.md — nexaBoard

Productivity app for small teams (5-20). Phase 1 MVP scope: auth, workspaces, kanban/list tasks, basic notes, basic calendar.

## Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Backend**: NestJS 10, Prisma 5, PostgreSQL 16, Redis 7, Passport.js + JWT
- **Frontend**: Next.js 14 (App Router), TypeScript strict, Tailwind CSS, Zustand, React Hook Form + Zod
- **Landing**: Next.js 14 on port 3001 (separate app)
- **Dev**: Docker Compose (db + redis + api + web), Node 20+

## Commands

```bash
pnpm install                    # install all deps
pnpm dev                        # run api + web in parallel (via turbo)
pnpm dev:api                    # backend only (port 4000)
pnpm dev:web                    # frontend only (port 3000)
pnpm build                      # build all packages
pnpm lint                       # lint all
pnpm format                     # prettier write
pnpm db:generate                # prisma generate (in apps/api)
pnpm db:migrate                 # prisma migrate dev (in apps/api)
pnpm db:seed                    # seed database
pnpm db:studio                  # prisma studio UI

# Single package
pnpm --filter @nexaboard/api <cmd>
pnpm --filter @nexaboard/web <cmd>
```

### Testing

```bash
# API unit tests (Jest, .spec.ts files in src/)
pnpm --filter @nexaboard/api test
pnpm --filter @nexaboard/api test:cov          # with coverage (80% threshold)

# API E2E tests (Jest, needs running DB)
pnpm --filter @nexaboard/api exec jest --config ./test/jest-e2e.json --runInBand

# Web E2E tests (Playwright, needs API + web running)
pnpm --filter @nexaboard/web exec playwright test
```

### Docker

```bash
docker compose up -d db redis   # start infra only
docker compose up -d            # full stack (db + redis + api + web)
```

## Structure

```
apps/
  api/          NestJS backend (port 4000)
    src/
      modules/      One NestJS module per domain (auth, users, tasks, notes, calendar, projects, workspaces, leads, health)
      common/prisma Global PrismaModule + PrismaService
      config/       Configuration (env-based)
      main.ts       Bootstrap (helmet, CORS, ValidationPipe, Swagger at /api/docs)
    prisma/
      schema.prisma  Full schema (User, Session, Workspace, Task, Note, CalendarEvent, etc.)
      migrations/    Never edit — create new ones with schema changes
  web/          Next.js frontend (port 3000)
    src/
      app/          App Router pages (/, /auth/*, /dashboard)
      lib/api.ts    ApiClient with auto-refresh on 401
      lib/utils.ts  cn() Tailwind helper
      stores/       Zustand stores (auth, workspace)
      hooks/        Custom React hooks
      components/   UI components (ui/ for base, forms/ for domain-specific)
      middleware.ts  Next.js middleware (auth, redirects)
    e2e/            Playwright E2E tests
  landing/      Next.js landing page (port 3001)
libs/
  shared/       Shared types (User, Workspace, Task, etc.)
```

## Key quirks

- **API prefix**: All backend routes are under `/api/v1/`. Swagger at `/api/docs`.
- **Auth flow**: Register/login return `{ user, accessToken, refreshToken }`. Refresh token stored in localStorage, auto-refreshed by `api.ts` on 401. Profile via `GET /api/v1/auth/profile`.
- **Prisma**: The `apps/api/.env` has `DATABASE_URL` pointing to localhost. For Docker, override via `DATABASE_URL=postgresql://nexaboard:nexaboard_secret@db:5432/nexaboard?schema=public`.
- **DTOs**: class-validator with `whitelist: true` and `forbidNonWhitelisted: true`. Use `!` (non-null assertion) on DTO properties since they're initialized by class-validator.
- **Rate limiting**: ThrottlerModule configured (short: 3/s, medium: 20/10s, long: 100/60s). Auth endpoints stricter (register: 1/s, login: 3/s).
- **Config files**: `next.config.mjs` and `tailwind.config.js` — both use `.js`/`.mjs`, not `.ts`.
- **Path aliases**: `@/*` maps to `src/*` in both api and web tsconfigs.
- **CORS**: Default allows `http://localhost:3000`; configurable via `ALLOWED_ORIGINS` env var.

## Environment

**API** (`apps/api/.env`):
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection (default: `redis://localhost:6379`)
- `JWT_SECRET`, `JWT_EXPIRATION` (15m), `JWT_REFRESH_EXPIRATION` (7d)
- `ALLOWED_ORIGINS` — comma-separated CORS origins
- `SENTRY_DSN` — optional error tracking

**Web** (`apps/web/.env.local`):
- `NEXT_PUBLIC_API_URL` — backend API base URL (defaults to relative `/api/v1`)

## CI

GitHub Actions on push to main/develop and PRs to main:
1. **lint** — `pnpm lint`
2. **test-api** — starts real PostgreSQL 16 + Redis 7, runs `db:generate` → `prisma migrate deploy` → `test:cov` → E2E tests
3. **build** — `pnpm build`

Test database: `nexaboard_test` (separate from dev).

## Scope rules

- Phase 1 MVP only. Do not add: timeline view, rich editor, real-time collab, automations, mobile/desktop apps.
- TypeScript strict everywhere. No `any`.
- Backend pattern: Controller → Service → Prisma. DTOs for all inputs.
- Frontend: Server Components by default, Client Components only when needed.
- Conventional Commits. Branches: `feat/`, `fix/`, `chore/`, `refactor/`.
- Never edit Prisma migrations. Create new ones with schema changes.

## Deeper reference

See `.github/copilot-instructions.md` for detailed patterns, debugging tips, and when-to-use-what guidance.
