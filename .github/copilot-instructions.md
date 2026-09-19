# nexaBoard Copilot Instructions

This document contains critical context for AI assistants working in this repository. See `AGENTS.md` for extended architecture and project scope.

## Commands Quick Reference

### Core Monorepo Tasks

```bash
pnpm install                      # Install all dependencies
pnpm dev                          # Run API + Web in parallel
pnpm dev:api                      # Backend only (NestJS, port 4000)
pnpm dev:web                      # Frontend only (Next.js, port 3000)
pnpm build                        # Build all packages
pnpm lint                         # Lint all packages
pnpm format                       # Format code with Prettier
```

### Database & Prisma

```bash
pnpm db:generate                  # Generate Prisma client
pnpm db:migrate                   # Run Prisma migrations (creates new or applies pending)
pnpm db:seed                      # Seed database with initial data
pnpm db:studio                    # Open Prisma Studio (GUI at http://localhost:5555)
```

### Testing

```bash
# Backend (API)
pnpm --filter @nexaboard/api test              # Run all unit tests
pnpm --filter @nexaboard/api test:watch        # Watch mode
pnpm --filter @nexaboard/api test:cov          # With coverage report
pnpm --filter @nexaboard/api exec jest --config ./test/jest-e2e.json --runInBand  # E2E tests

# Frontend
pnpm --filter @nexaboard/web test              # Run Playwright tests (if added)
```

### Single Package Tasks

```bash
pnpm --filter @nexaboard/api <cmd>             # Run any npm script in API
pnpm --filter @nexaboard/web <cmd>             # Run any npm script in Web
```

### Docker

```bash
docker compose up -d db redis                  # Start database + cache only
docker compose up -d                           # Full stack (db + redis + api + web)
docker compose down                            # Stop all services
```

## Architecture Overview

### Monorepo Structure

- **Turborepo + pnpm workspaces** for task orchestration and dependency management
- **Build outputs**: `dist/` (API) and `.next/` (Web)
- **Shared types**: `libs/shared` (typescript-only, no runtime code)

### Backend (NestJS 10 at `/apps/api`)

**Pattern**: One NestJS module per business domain.

```
src/
  modules/
    auth/              # JWT + Passport strategies
      auth.controller.ts
      auth.service.ts
      dto/             # DTOs for input validation
      guards/          # Auth guards (JwtAuthGuard, etc.)
      strategies/      # Passport strategies (jwt, local)
    users/             # User management
    workspaces/        # Workspace CRUD + member roles
    projects/          # Projects (workspace-scoped)
    tasks/             # Tasks with status, priority, assignees
    notes/             # Rich-content notes
    calendar/          # Calendar events
    health/            # Health checks for readiness probes
  common/prisma        # Global PrismaModule + PrismaService
  config/              # Configuration (env-based)
  main.ts              # Bootstrap (see key configuration below)
```

**API Routes**: All endpoints prefixed with `/api/v1/` (set in `main.ts`).  
**Swagger UI**: Available at `/api/docs` (auto-generated from decorators).

### Frontend (Next.js 14 App Router at `/apps/web`)

```
src/
  app/                 # App Router pages (file-based routing)
    page.tsx           # Home
    /auth/*            # Auth pages (login, register, verify, reset)
    /dashboard         # Main dashboard (protected route)
  lib/
    api.ts             # Centralized API client with auto-refresh on 401
    utils.ts           # Tailwind cn() helper and shared utilities
  stores/              # Zustand stores (auth, workspace, etc.)
  components/          # Reusable UI components
    ui/                # Base UI (Button, Card, Input, Modal, etc.)
    forms/             # Domain-specific forms (TaskForm, NoteForm, etc.)
  hooks/               # Custom React hooks
  middleware.ts        # Next.js middleware (auth, redirects)
```

**Auth Flow**: 
- Login/register returns `{ user, accessToken, refreshToken }`
- Tokens stored in localStorage
- Refresh token auto-sent on 401 responses via `api.ts` client
- Server Components by default; Client Components only when needed

## Key Conventions

### TypeScript

- **Strict mode** everywhere (`strict: true` in both `tsconfigs`)
- **No `any`** — use proper types or generics
- **Path aliases**: `@/*` maps to `src/*` in both API and Web
- **DTOs**: Class-validator with decorators (`class-validator`)

### NestJS Patterns

1. **Controller → Service → Prisma**: Each layer has a single responsibility
2. **DTOs for all inputs**: Use `class-validator` decorators for validation
   ```typescript
   export class CreateTaskDto {
     @IsString()
     @IsNotEmpty()
     title!: string;  // Use `!` since class-validator initializes
   }
   ```
3. **GlobalPipes in main.ts**:
   - `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true`
   - Automatic transformation enabled
4. **Rate Limiting**: ThrottlerModule configured with different limits:
   - General: 3/s, 20/10s, 100/60s
   - Auth endpoints stricter: register (1/s), login (3/s)
5. **Modules**: Each domain exports `module.ts` with all providers and imports
6. **Testing**: Use `Test.createTestingModule()` with mock Prisma and services
7. **Swagger**: Use `@ApiOperation()`, `@ApiBearerAuth()`, `@ApiResponse()` decorators

### Prisma

- Schema file: `apps/api/prisma/schema.prisma`
- Migrations: `apps/api/prisma/migrations/`
- **On schema change**: Always run `pnpm db:generate` to regenerate Prisma client
- **Before deployment**: Run `pnpm --filter @nexaboard/api exec prisma migrate deploy`
- Enum values: `TaskStatus` (TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED), `Priority`, `MemberRole` (OWNER, ADMIN, MEMBER, VIEWER)

### Frontend Patterns

1. **Server Components by default**: Use async/await, fetch directly from database-backed APIs
2. **Client Components**: Only when needed for interactivity, form state, or hooks
3. **Forms**: React Hook Form + Zod for validation
4. **UI Components**: Radix UI primitives + Tailwind CSS with shadcn/ui CSS variables
5. **State Management**: Zustand for global state (auth, workspace selection)
6. **API Client**: Use `api.ts` (automatically handles token refresh on 401)
7. **Styling**: Tailwind CSS with `cn()` utility from `lib/utils.ts` for conditional classes

### Configuration Files

- **Prettier**: `.prettierrc` (semi, trailing commas, single quotes, printWidth 100)
- **ESLint**: Root minimal config; Web extends `next/core-web-vitals`; API uses `@typescript-eslint/parser`
- **Next.js config**: `next.config.mjs` (NOT `.ts` — Next.js 14.2 doesn't support `.ts`)
- **Tailwind config**: `tailwind.config.js` (NOT `.ts`)
- **TypeScript**: `tsconfig.base.json` in root; extends in each app

### Testing Patterns

**Unit Tests** (`.spec.ts` files):
- Use Jest with `ts-jest` transform
- Mock Prisma and services
- Coverage threshold: 80% (branches, functions, lines, statements)
- Example: `apps/api/src/modules/auth/auth.service.spec.ts`

**E2E Tests** (Playwright):
- Configuration: `apps/web/e2e/` (if Playwright is configured)
- Run with: `pnpm --filter @nexaboard/api exec jest --config ./test/jest-e2e.json --runInBand`

### Git Workflow

- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `refactor:` prefixes
- **Branches**: `feat/feature-name`, `fix/bug-name`, `chore/task`
- **CI**: Lint, test (with DB), and build on push to main/develop and PRs to main

## Important Quirks & Details

### API & Auth

- **Base URL in frontend**: Configured via environment variables
- **CORS**: Default allows `http://localhost:3000`; configurable via `ALLOWED_ORIGINS` env var
- **Health endpoints**: `/api/v1/health` and `/api/v1/health/ready` (no auth required)
- **Rate limiting**: Apply `@Throttle()` decorator to override defaults on specific endpoints
- **JWT secrets**: Configured via `JWT_SECRET`, `JWT_EXPIRATION`, `JWT_REFRESH_EXPIRATION` env vars

### Database

- **Connection**: `DATABASE_URL` env var (format: `postgresql://user:pass@host:port/db?schema=public`)
- **For Docker**: Override with `DATABASE_URL=postgresql://nexaboard:nexaboard_secret@db:5432/nexaboard?schema=public`
- **Relations**: Check `schema.prisma` for Workspace → Project → Task hierarchy
- **Migrations**: Never modify migrations; create new ones with schema changes

### Redis

- **Default**: `redis://localhost:6379`
- **Configurable**: Via `REDIS_URL` env var
- **Max memory**: 256MB with LRU eviction policy (see docker-compose.yml)

### Environment Variables

**API** (`apps/api/.env`):
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection
- `JWT_SECRET`, `JWT_EXPIRATION`, `JWT_REFRESH_EXPIRATION`: Token config
- `SENTRY_DSN`: Error tracking (optional)
- `NODE_ENV`: development/production
- `ALLOWED_ORIGINS`: Comma-separated CORS origins

**Web** (`apps/web/.env.local`):
- `NEXT_PUBLIC_API_URL`: Backend API base URL (or defaults to relative `/api/v1`)
- `SENTRY_DSN`: Error tracking (optional)

### Sentry Integration

- **Backend**: Initialized in `main.ts` if `SENTRY_DSN` set
- **Frontend**: Configured via `@sentry/nextjs` in `next.config.mjs`
- **Traces**: Sample rate set to 1.0 (capture all); tune for production

## When to Use What

### Use Server Components in Next.js

- Fetching data directly from Prisma
- Protecting routes with server-side auth checks
- Large data-heavy components

### Use Client Components

- Form inputs (managed with React Hook Form)
- Interactive features (modals, tooltips, dropdowns)
- Managing local UI state with Zustand

### When to Add a New NestJS Module

1. Create `apps/api/src/modules/domain-name/`
2. Add `domain-name.module.ts`, `domain-name.service.ts`, `domain-name.controller.ts`
3. Add DTOs in `dto/` subdirectory
4. Add guards/strategies in subdirectories if needed
5. Register module in `app.module.ts`
6. Add test files (`*.spec.ts`)

### When to Add a New API Route

1. Add method to service (business logic)
2. Add endpoint to controller with `@ApiOperation()` and `@ApiResponse()` decorators
3. Add matching DTO if input required
4. Add test in controller spec file
5. Route will be automatically prefixed with `/api/v1` and method path

## Dependency Hints

- **Backend runtime**: @nestjs/*, @prisma/client, passport-jwt, helmet
- **Frontend runtime**: next, react, zustand, react-hook-form, @radix-ui/*, tailwindcss
- **DevDependencies**: jest, ts-jest, @nestjs/testing, prettier, @typescript-eslint/parser, playwright (optional)
- **Managed deps in docker-compose**: PostgreSQL 16, Redis 7

## Debugging & Troubleshooting

### "Cannot find module '@/...'"

- Run `pnpm db:generate` (regenerates Prisma client which might be missing)
- Check path aliases in `tsconfig.json` match your setup

### Auth tests failing

- Check `JWT_SECRET` and `JWT_EXPIRATION` are set (CI uses specific values; see `.github/workflows/ci.yml`)
- Ensure Redis and database are running for E2E tests

### Prisma migration conflicts

- Never edit migrations; create new ones
- If schema.prisma and migrations drift: delete local migrations, run `pnpm db:migrate` to regenerate
- In CI: Always run `pnpm --filter @nexaboard/api exec prisma migrate deploy` before testing

### Port conflicts

- API: 4000 (change with `PORT` env var)
- Web: 3000 (change in `pnpm dev:web --port <port>`)
- Prisma Studio: 5555 (auto-assigned)
- PostgreSQL: 5432
- Redis: 6379

## CI/CD Workflow

- **On PR/push to main/develop**: Runs lint → test (with real DB) → build
- **Test database**: `nexaboard_test` (separate from dev database)
- **Deployments**: Check `docs/deployment.md` for procedure
- **Secrets**: Never commit `.env` files; use GitHub Secrets for CI variables
