# nexaBoard

Application de productivité moderne et intuitive pour les petites equipes (5-20 personnes).

## Stack technique

- **Monorepo** : pnpm workspaces + Turborepo
- **Backend** : NestJS 10, Prisma 5, PostgreSQL 16, Redis 7, Passport.js + JWT
- **Frontend** : Next.js 14 (App Router), TypeScript strict, Tailwind CSS, Zustand, React Hook Form + Zod
- **Dev** : Docker Compose (db + redis + api + web), Node 20+

## Fonctionnalites (Phase 1 MVP)

| Module | Status |
|--------|--------|
| Auth (register, login, refresh, logout, profile) | Implemente |
| Users (findByEmail, create, verifyPassword) | Implemente |
| Health endpoint | Implemente |
| Tasks, Notes, Calendar, Projects, Workspaces | Stub modules |
| Frontend auth pages (/auth/login, /auth/register) | Implemente |
| Frontend dashboard | Stats hardcodees |
| Frontend components/ui | Pas encore construit |

## Installation

```bash
# Installer les dependances
pnpm install

# Lancer la base Redis
docker compose up -d db redis

# Generer le client Prisma
pnpm db:generate

# Appliquer les migrations
pnpm db:migrate

# Lancer le dev (API + Web)
pnpm dev
```

## Commandes

```bash
pnpm dev                        # API + Web en parallele
pnpm dev:api                    # Backend seul (port 4000)
pnpm dev:web                    # Frontend seul (port 3000)
pnpm build                      # Build tous les packages
pnpm build:api                  # nest build
pnpm build:web                  # next build
pnpm test                       # Tests unitaires
pnpm lint                       # Lint tous les packages
pnpm format                     # Prettier write
pnpm db:generate                # Prisma generate
pnpm db:migrate                 # Prisma migrate dev
pnpm db:studio                  # Prisma Studio (UI)

# Docker
docker compose up -d db redis   # Infra seulement
docker compose up -d            # Stack complete

# Package specifique
pnpm --filter @nexaboard/api <cmd>
pnpm --filter @nexaboard/web <cmd>
```

## Structure

```
nexaboard/
  apps/
    api/                Backend NestJS (port 4000)
      src/
        modules/        Un module NestJS par domaine
          auth/         Authentification JWT (register, login, refresh, logout, profile)
          users/        Gestion des utilisateurs
          tasks/        Taches (stub)
          notes/        Notes (stub)
          calendar/     Calendrier (stub)
          projects/     Projets (stub)
          workspaces/   Espaces de travail (stub)
          health/       Health check
        common/prisma   PrismaModule + PrismaService
        main.ts         Bootstrap (helmet, CORS, ValidationPipe, Swagger)
      prisma/
        schema.prisma   Schema complet
        migrations/
      test/             Tests unitaires
    web/                Frontend Next.js (port 3000)
      src/
        app/            App Router pages
        lib/api.ts      Client API avec auto-refresh sur 401
        stores/         Zustand stores
        components/     Composants UI
  libs/
    shared/             Types partages
```

## API

- Toutes les routes backend sont sous `/api/v1/`
- Swagger disponible sur `/api/docs`
- Rate limiting configure (short: 3/s, medium: 20/10s, long: 100/60s)
- Auth endpoints plus stricts (register: 1/s, login: 3/s)

### Endpoints principaux

| Methode | Route | Description |
|---------|-------|-------------|
| POST | `/api/v1/auth/register` | Creer un compte |
| POST | `/api/v1/auth/login` | Se connecter |
| POST | `/api/v1/auth/refresh` | Rafraichir les tokens |
| POST | `/api/v1/auth/logout` | Se deconnecter |
| GET | `/api/v1/auth/profile` | Obtenir le profil |
| GET | `/api/v1/health` | Health check |

## Tests

```bash
pnpm test                       # Lancer tous les tests
pnpm --filter @nexaboard/api test  # Tests API uniquement
```

## Convention de code

- TypeScript strict partout. Pas de `any`.
- Backend : Controller -> Service -> Prisma. DTOs pour toutes les inputs.
- Frontend : Server Components par defaut, Client Components uniquement quand necessaire.
- Conventional Commits. Branches : `feat/`, `fix/`, `chore/`, `refactor/`.

## Licence

Private
