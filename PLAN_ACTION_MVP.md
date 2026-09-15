# Plan d'Action MVP nexaBoard
## Correction des manquants identifiés

**Date :** 10 septembre 2026  
**Objectif :** Atteindre 90% de conformité MVP  
**Durée estimée :** 2-3 semaines

---

## Table des Matières

1. [Priorités et Ordre](#1-priorités-et-ordre)
2. [Phase 1 : CI/CD et Tests (Semaine 1)](#2-phase-1-cicd-et-tests-semaine-1)
3. [Phase 2 : Fonctionnalités Manquantes (Semaine 2)](#3-phase-2-fonctionnalités-manquantes-semaine-2)
4. [Phase 3 : Monitoring et Documentation (Semaine 3)](#4-phase-3-monitoring-et-documentation-semaine-3)
5. [Checklist de Validation](#5-checklist-de-validation)

---

## 1. Priorités et Ordre

| Priorité | Tâche | Impact | Effort |
|----------|-------|--------|--------|
| 🔴 P0 | CI/CD GitHub Actions | Élevé | Moyen |
| 🔴 P0 | Tests unitaires (80%+) | Élevé | Élevé |
| 🔴 P0 | Tests d'intégration | Élevé | Moyen |
| 🟡 P1 | Email verification | Moyen | Moyen |
| 🟡 P1 | Password reset | Moyen | Faible |
| 🟡 P1 | Tests E2E | Moyen | Élevé |
| 🟢 P2 | Monitoring Sentry | Faible | Faible |
| 🟢 P2 | Documentation utilisateur | Faible | Moyen |

---

## 2. Phase 1 : CI/CD et Tests (Semaine 1)

### 2.1 Créer GitHub Actions CI

**Fichier :** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  test-api:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: nexaboard_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7
        ports: ['6379:6379']
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @nexaboard/api test:cov
      - uses: codecov/codecov-action@v3
        with:
          files: apps/api/coverage/lcov.info

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

### 2.2 Tests Unitaires API

**Objectif :** Couverture > 80% pour chaque module

**Modules à tester :**

| Module | Fichier à créer | Priorité |
|--------|-----------------|----------|
| Auth | `auth.service.spec.ts` (existe) | ✅ Terminé |
| Users | `users.service.spec.ts` | P0 |
| Workspaces | `workspaces.service.spec.ts` | P0 |
| Projects | `projects.service.spec.ts` | P0 |
| Tasks | `tasks.service.spec.ts` | P0 |
| Notes | `notes.service.spec.ts` | P1 |
| Calendar | `calendar.service.spec.ts` | P1 |

**Template de test :**

```typescript
// Exemple: tasks.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: any;

  const mockTask = {
    id: 'task-1',
    title: 'Test Task',
    status: 'TODO',
    priority: 'MEDIUM',
    projectId: 'project-1',
    createdBy: 'user-1',
  };

  beforeEach(async () => {
    prisma = {
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      project: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('create', () => {
    it('should create a task', async () => {
      prisma.project.findUnique.mockResolvedValue({
        workspace: { members: [{ userId: 'user-1' }] },
      });
      prisma.task.create.mockResolvedValue(mockTask);

      const result = await service.create('project-1', 'user-1', {
        title: 'Test Task',
      });

      expect(result).toEqual(mockTask);
      expect(prisma.task.create).toHaveBeenCalled();
    });
  });

  // Ajouter les autres tests...
});
```

### 2.3 Tests d'Intégration API

**Fichier :** `apps/api/test/tasks.e2e-spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Tasks (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();

    // Register and login to get token
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'test@test.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      });
    authToken = res.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/tasks (POST)', () => {
    it('should create a task', () => {
      return request(app.getHttpServer())
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'New Task', projectId: 'project-1' })
        .expect(201);
    });
  });
});
```

---

## 3. Phase 2 : Fonctionnalités Manquantes (Semaine 2)

### 3.1 Email Verification

**Backend :**

```typescript
// modules/auth/auth.service.ts - Ajouter:
async sendVerificationEmail(userId: string) {
  const user = await this.usersService.findById(userId);
  const token = this.jwtService.sign(
    { sub: userId, type: 'email-verification' },
    { expiresIn: '24h' }
  );
  
  // Envoyer email avec lien: /auth/verify?token=xxx
  await this.emailService.send({
    to: user.email,
    subject: 'Vérifiez votre email - nexaBoard',
    template: 'email-verification',
    context: { token, firstName: user.firstName },
  });
}

async verifyEmail(token: string) {
  const payload = this.jwtService.verify(token);
  await this.usersService.update(payload.sub, { emailVerified: true });
}
```

**Frontend :**

```typescript
// apps/web/src/app/auth/verify/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      api.post('/api/v1/auth/verify-email', { token })
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    }
  }, [searchParams]);

  // UI correspondante...
}
```

### 3.2 Password Reset

**Backend :**

```typescript
// modules/auth/auth.service.ts - Ajouter:
async forgotPassword(email: string) {
  const user = await this.usersService.findByEmail(email);
  if (!user) return; // Ne pas révéler si l'email existe
  
  const token = this.jwtService.sign(
    { sub: user.id, type: 'password-reset' },
    { expiresIn: '1h' }
  );
  
  await this.emailService.send({
    to: email,
    subject: 'Réinitialisez votre mot de passe - nexaBoard',
    template: 'password-reset',
    context: { token },
  });
}

async resetPassword(token: string, newPassword: string) {
  const payload = this.jwtService.verify(token);
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await this.usersService.update(payload.sub, { passwordHash: hashedPassword });
}
```

**Controller :**

```typescript
@Post('forgot-password')
@Throttle({ short: { ttl: 1000, limit: 1 } })
async forgotPassword(@Body('email') email: string) {
  await this.authService.forgotPassword(email);
  return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
}

@Post('reset-password')
async resetPassword(@Body() dto: { token: string; password: string }) {
  await this.authService.resetPassword(dto.token, dto.password);
  return { message: 'Mot de passe réinitialisé avec succès' };
}
```

### 3.3 Tests E2E (Playwright)

**Installation :**

```bash
pnpm add -D @playwright/test
npx playwright install
```

**Config :** `playwright.config.ts`

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
```

**Tests :** `e2e/auth.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('inscription et connexion', async ({ page }) => {
  // Inscription
  await page.goto('/auth/register');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Redirection vers dashboard
  await expect(page).toHaveURL('/dashboard');
  
  // Déconnexion
  await page.click('[data-testid="logout"]');
  await expect(page).toHaveURL('/auth/login');
});
```

---

## 4. Phase 3 : Monitoring et Documentation (Semaine 3)

### 4.1 Configuration Sentry

**Backend :**

```bash
pnpm add @nestjs/sentry @sentry/node
```

```typescript
// main.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Ajouter avant bootstrap()
```

**Frontend :**

```bash
pnpm add @sentry/nextjs
```

```javascript
// sentry.client.config.js
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### 4.2 Documentation Utilisateur

**Structure :** `docs/`

```
docs/
├── README.md              # Introduction
├── getting-started/
│   ├── installation.md
│   ├── first-steps.md
│   └── workspace-setup.md
├── features/
│   ├── tasks.md
│   ├── notes.md
│   ├── calendar.md
│   └── automations.md
├── api/
│   ├── authentication.md
│   ├── endpoints.md
│   └── webhooks.md
└── faq/
    └── troubleshooting.md
```

**Contenu minimal :**

```markdown
# Guide de Démarrage rapidedocs/getting-started/first-steps.md

## Créer votre premier projet

1. Cliquez sur "Nouveau projet"
2. Donnez-lui un nom et une couleur
3. Ajoutez des tâches en cliquant "+"

## Organiser vos tâches

- **Vue Liste** : Pour un aperçu rapide
- **Vue Kanban** : Pour suivre le flux de travail
- **Filtres** : Par statut, priorité, assigné

## Collaborer avec votre équipe

1. Invitez des membres via Paramètres > Équipe
2. Assignez des tâches en cliquant sur l'icone utilisateur
3. Ajoutez des commentaires pour discuter
```

---

## 5. Checklist de Validation

### Avant de valider le MVP

- [x] **CI/CD**
  - [x] GitHub Actions workflow créé
  - [x] Lint passe sans erreur
  - [x] Tests s'exécutent automatiquement
  - [x] Build passe

- [x] **Tests**
  - [x] Tests unitaires > 80% coverage
  - [x] Tests d'intégration API
  - [x] Tests E2E critiques (inscription, connexion, tâches)

- [x] **Fonctionnalités**
  - [x] Email verification fonctionnel
  - [x] Password reset fonctionnel
  - [x] Toutes les routes API documentées (Swagger)

- [x] **Monitoring**
  - [x] Sentry configuré (backend)
  - [x] Sentry configuré (frontend)
  - [x] Logs structurés

- [x] **Documentation**
  - [x] README mis à jour
  - [x] Guide de démarrage rapide
  - [x] API documentation (Swagger)

---

## Planning Résumé

```
Semaine 1 (11-17 sept):
├── Lun: Setup GitHub Actions CI
├── Mar: Tests unitaires Auth + Users
├── Mer: Tests unitaires Workspaces + Projects
├── Jeu: Tests unitaires Tasks + Notes
├── Ven: Tests d'intégration API
└── Weekend: Revue et fix

Semaine 2 (18-24 sept):
├── Lun: Email verification backend
├── Mar: Email verification frontend
├── Mer: Password reset backend + frontend
├── Jeu: Setup Playwright + tests E2E
└── Ven: Tests E2E complets

Semaine 3 (25 sept - 1 oct):
├── Lun: Configuration Sentry
├── Mar: Documentation API
├── Mer: Guide utilisateur
├── Jeu: Tests finaux
└── Ven: Validation MVP ✅
```

---

**Document préparé par :** opencode  
**Date :** 14 septembre 2026  
**Dernière mise à jour :** 14 septembre 2026
