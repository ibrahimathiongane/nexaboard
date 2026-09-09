# Architecture Technique
## nexaBoard - Application de Productivité pour Équipes

**Version :** 1.0  
**Date :** 09 septembre 2026  
**Auteur :** Équipe Technique nexaBoard

---

## Table des Matières

1. [Vue d'Ensemble](#1-vue-densemble)
2. [Stack Technologique](#2-stack-technologique)
3. [Architecture Système](#3-architecture-système)
4. [Modèle de Données](#4-modèle-de-données)
5. [API et Communication](#5-api-et-communication)
6. [Architecture Frontend](#6-architecture-frontend)
7. [Architecture Backend](#7-architecture-backend)
8. [Sécurité](#8-sécurité)
9. [Infrastructure et Déploiement](#9-infrastructure-et-déploiement)
10. [Monitoring et Observabilité](#10-monitoring-et-observabilité)
11. [Performance et Scalabilité](#11-performance-et-scalabilité)
12. [Plan de Reprise d'Activité](#12-plan-de-reprise-dactivité)

---

## 1. Vue d'Ensemble

### 1.1 Objectifs Architecture
- **Scalabilité** : Supporter la croissance de 10 à 10 000+ utilisateurs
- **Performance** : Temps de réponse < 200ms pour 95% des requêtes
- **Disponibilité** : 99.9% de temps d'activité
- **Sécurité** : Protection des données utilisateur
- **Maintenabilité** : Code modulaire et bien documenté

### 1.2 Principes Architecturaux
1. **Séparation des préoccupations** : Frontend, Backend, Base de données distincts
2. **API-First** : Interface API définie avant l'implémentation
3. **Microservices modulaires** : Modules indépendants communiquant via API
4. **Event-Driven** : Communication asynchrone pour les événements
5. **Infrastructure as Code** : Tout le code d'infrastructure versionné

### 1.3 Diagramme High-Level

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                  │
├─────────────────────────────────────────────────────────────────┤
│  Web (React/Next.js)  │  Mobile (React Native)  │  Desktop     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LOAD BALANCER                               │
│                    (NGINX / Cloudflare)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY                                 │
│              (Rate Limiting, Auth, Routing)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   AUTH SERVICE  │ │  TASK SERVICE   │ │  NOTE SERVICE   │
│   (NestJS)      │ │  (NestJS)       │ │  (NestJS)       │
└─────────────────┘ └─────────────────┘ └─────────────────┘
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MESSAGE BROKER                              │
│                    (Redis Pub/Sub)                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL (OLTP)  │  Redis (Cache)  │  Elasticsearch (Search) │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     STORAGE LAYER                               │
│              (S3-compatible: MinIO/AWS S3)                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Stack Technologique

### 2.1 Frontend

| Composant | Technologie | Version | Justification |
|-----------|-------------|---------|---------------|
| **Framework** | React | 18.2+ | Écosystème riche, performance |
| **Meta-framework** | Next.js | 14+ | SSR/SSG, routing, optimisations |
| **State Management** | Zustand | 4+ | Léger, simple, performant |
| **Styling** | Tailwind CSS | 3+ | Utility-first, responsive |
| **Éditeur** | TipTap | 2+ | Basé sur ProseMirror, extensible |
| **Calendrier** | react-big-calendar | 1+ | Flexible, personnalisable |
| **Forms** | React Hook Form | 7+ | Performance, validation |
| **Tests** | Jest + RTL | 29+ / 14+ | Standard industrie |

### 2.2 Backend

| Composant | Technologie | Version | Justification |
|-----------|-------------|---------|---------------|
| **Runtime** | Node.js | 20 LTS | Performance, écosystème npm |
| **Framework** | NestJS | 10+ | Architecture modulaire, TypeScript |
| **ORM** | Prisma | 5+ | Type-safe, migrations auto |
| **Validation** | class-validator | 0.14+ | Décorateurs, intégration NestJS |
| **Auth** | Passport.js | 0.6+ | Multi-stratégies, flexible |
| **JWT** | @nestjs/jwt | 10+ | Tokens sécurisés |
| **Cache** | Cache Manager | 2+ | Abstraction multi-store |

### 2.3 Base de Données

| Composant | Technologie | Version | Justification |
|-----------|-------------|---------|---------------|
| **OLTP** | PostgreSQL | 16+ | ACID, JSON, performances |
| **Cache** | Redis | 7+ | Sessions, cache, pub/sub |
| **Recherche** | Elasticsearch | 8+ | Recherche full-text avancée |
| **Fichiers** | MinIO | Latest | S3-compatible, self-hosted |

### 2.4 Infrastructure

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| **Conteneurs** | Docker + Compose | Dev local, standardisation |
| **Orchestration** | Kubernetes | Production, auto-scaling |
| **CI/CD** | GitHub Actions | Intégration native, gratuit |
| **Monitoring** | Prometheus + Grafana | Métriques, alertes |
| **Logs** | Loki + Promtail | Logs centralisés |
| **Tracing** | OpenTelemetry | Traces distribuées |

### 2.5 Outils de Développement

| Catégorie | Outil | Usage |
|-----------|-------|-------|
| **IDE** | VS Code / Cursor | Développement |
| **Linter** | ESLint + Prettier | Code quality |
| **Git** | Git + Conventional Commits | Versioning |
| **Package Manager** | pnpm | Dépendances |
| **API Testing** | Insomnia / Postman | Tests API |

---

## 3. Architecture Système

### 3.1 Architecture Microservices Modulaire

```
nexaboard/
├── apps/
│   ├── web/                    # Frontend Next.js
│   ├── api/                    # Backend NestJS (monolith modulaire)
│   └── worker/                 # Workers asynchrones
├── libs/
│   ├── shared/                 # Code partagé
│   ├── database/               # Schéma Prisma
│   ├── ui/                     # Composants UI partagés
│   └── config/                 # Configuration
├── tools/
│   ├── scripts/                # Scripts utilitaires
│   └── generators/             # Générateurs de code
├── docs/                       # Documentation
├── docker/                     # Configurations Docker
├── k8s/                        # Manifests Kubernetes
└── .github/                    # GitHub Actions
```

### 3.2 Modules Backend

```
src/
├── modules/
│   ├── auth/                   # Authentication & Authorization
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── strategies/         # JWT, Local, OAuth
│   │   └── guards/             # Auth guards
│   │
│   ├── users/                  # Gestion des utilisateurs
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── entities/
│   │
│   ├── workspaces/             # Espaces de travail
│   │   ├── workspaces.controller.ts
│   │   ├── workspaces.service.ts
│   │   └── entities/
│   │
│   ├── projects/               # Projets
│   │   ├── projects.controller.ts
│   │   ├── projects.service.ts
│   │   └── entities/
│   │
│   ├── tasks/                  # Tâches
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   ├── tasks.module.ts
│   │   └── entities/
│   │
│   ├── notes/                  # Notes et documents
│   │   ├── notes.controller.ts
│   │   ├── notes.service.ts
│   │   └── entities/
│   │
│   ├── calendar/               # Calendrier
│   │   ├── calendar.controller.ts
│   │   ├── calendar.service.ts
│   │   └── entities/
│   │
│   ├── automation/             # Automatisations
│   │   ├── automation.controller.ts
│   │   ├── automation.service.ts
│   │   └── entities/
│   │
│   └── notifications/          # Notifications
│       ├── notifications.controller.ts
│       ├── notifications.service.ts
│       └── entities/
│
├── common/                     # Commun
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
│
├── config/                     # Configuration
│   ├── database.config.ts
│   ├── redis.config.ts
│   └── app.config.ts
│
└── main.ts                     # Point d'entrée
```

### 3.3 Communication Inter-Services

#### Synchrone (HTTP/gRPC)
- Requêtes API directes
- Actions en temps réel
- Validations immédiates

#### Asynchrone (Message Broker)
- Événements de notification
- Tâches en arrière-plan
- Synchronisation cross-service

```typescript
// Exemple d'événement
interface TaskCompletedEvent {
  type: 'task.completed';
  payload: {
    taskId: string;
    projectId: string;
    completedBy: string;
    completedAt: Date;
  };
}
```

---

## 4. Modèle de Données

### 4.1 Schéma Prisma

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== UTILISATEURS ====================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String?
  firstName     String
  lastName      String
  avatar        String?
  timezone      String    @default("Europe/Paris")
  language      String    @default("fr")
  
  // Auth
  provider      String    @default("local")
  providerId    String?
  emailVerified Boolean   @default(false)
  mfaEnabled    Boolean   @default(false)
  mfaSecret     String?
  
  // Relations
  workspaces    WorkspaceMember[]
  ownedWorkspaces Workspace[]
  tasks         Task[]
  assignedTasks Task[]       @relation("TaskAssignees")
  notes         Note[]
  comments      Comment[]
  activities    Activity[]
  automations   Automation[]
  notifications Notification[]
  sessions      Session[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([email])
  @@map("users")
}

model Session {
  id            String    @id @default(cuid())
  userId        String
  token         String    @unique
  userAgent     String?
  ipAddress     String?
  expiresAt     DateTime
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime  @default(now())
  
  @@index([token])
  @@index([userId])
  @@map("sessions")
}

// ==================== ESPACES DE TRAVAIL ====================

model Workspace {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  description   String?
  avatar        String?
  plan          Plan      @default(FREE)
  
  // Relations
  ownerId       String
  owner         User      @relation(fields: [ownerId], references: [id])
  members       WorkspaceMember[]
  projects      Project[]
  settings      WorkspaceSettings?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([slug])
  @@map("workspaces")
}

model WorkspaceMember {
  id            String    @id @default(cuid())
  role          MemberRole @default(MEMBER)
  
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  workspaceId   String
  workspace     Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  
  joinedAt      DateTime  @default(now())
  
  @@unique([userId, workspaceId])
  @@map("workspace_members")
}

model WorkspaceSettings {
  id            String    @id @default(cuid())
  workspaceId   String    @unique
  
  workspace     Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  
  // Paramètres
  defaultView   View      @default(LIST)
  weekStart     Int       @default(1) // 0=Dimanche, 1=Lundi
  timeFormat    TimeFormat @default(H24)
  dateFormat    String    @default("DD/MM/YYYY")
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@map("workspace_settings")
}

// ==================== PROJETS ====================

model Project {
  id            String    @id @default(cuid())
  name          String
  description   String?
  color         String    @default("#3B82F6")
  icon          String?
  archived      Boolean   @default(false)
  
  workspaceId   String
  workspace     Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  
  // Relations
  tasks         Task[]
  notes         Note[]
  automations   Automation[]
  views         ProjectView[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([workspaceId])
  @@map("projects")
}

model ProjectView {
  id            String    @id @default(cuid())
  name          String
  type          View
  config        Json      @default("{}")
  
  projectId     String
  project       Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@map("project_views")
}

// ==================== TÂCHES ====================

model Task {
  id            String    @id @default(cuid())
  title         String
  description   String?
  status        TaskStatus @default(TODO)
  priority      Priority  @default(MEDIUM)
  
  // Dates
  startDate     DateTime?
  dueDate       DateTime?
  completedAt   DateTime?
  
  // Estimation
  estimatedHours Float?
  actualHours    Float?
  points        Int?
  
  // Hiérarchie
  projectId     String
  project       Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  parentId      String?
  parent        Task?     @relation("TaskHierarchy", fields: [parentId], references: [id])
  children      Task[]    @relation("TaskHierarchy")
  
  // Ordre
  order         Int       @default(0)
  
  // Relations
  assignees     TaskAssignee[]
  labels        TaskLabel[]
  dependencies  TaskDependency[] @relation("DependsOn")
  dependents    TaskDependency[] @relation("Blocks")
  comments      Comment[]
  attachments   Attachment[]
  subtasks      Subtask[]
  timeEntries   TimeEntry[]
  
  createdBy     String
  creator       User      @relation(fields: [createdBy], references: [id])
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([projectId])
  @@index([status])
  @@index([dueDate])
  @@index([createdBy])
  @@map("tasks")
}

model TaskAssignee {
  id            String    @id @default(cuid())
  taskId        String
  task          Task      @relation(fields: [taskId], references: [id], onDelete: Cascade)
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  assignedAt    DateTime  @default(now())
  
  @@unique([taskId, userId])
  @@map("task_assignees")
}

model TaskLabel {
  id            String    @id @default(cuid())
  taskId        String
  task          Task      @relation(fields: [taskId], references: [id], onDelete: Cascade)
  labelId       String
  label         Label     @relation(fields: [labelId], references: [id], onDelete: Cascade)
  
  @@unique([taskId, labelId])
  @@map("task_labels")
}

model TaskDependency {
  id            String    @id @default(cuid())
  taskId        String    // Tâche qui dépend
  task          Task      @relation("DependsOn", fields: [taskId], references: [id], onDelete: Cascade)
  dependsOnId   String    // Tâche qui bloque
  dependsOn     Task      @relation("Blocks", fields: [dependsOnId], references: [id], onDelete: Cascade)
  
  type          DependencyType @default(FINISH_TO_START)
  
  @@unique([taskId, dependsOnId])
  @@map("task_dependencies")
}

model Subtask {
  id            String    @id @default(cuid())
  title         String
  completed     Boolean   @default(false)
  
  taskId        String
  task          Task      @relation(fields: [taskId], references: [id], onDelete: Cascade)
  
  order         Int       @default(0)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([taskId])
  @@map("subtasks")
}

model Label {
  id            String    @id @default(cuid())
  name          String
  color         String    @default("#6B7280")
  
  workspaceId   String
  tasks         TaskLabel[]
  
  createdAt     DateTime  @default(now())
  
  @@unique([name, workspaceId])
  @@map("labels")
}

// ==================== NOTES ====================

model Note {
  id            String    @id @default(cuid())
  title         String
  content       Json      @default("{}") // ProseMirror/TipTap JSON
  contentMd     String?   // Markdown pour export
  icon          String?
  cover         String?
  
  // Hiérarchie
  projectId     String?
  project       Project?  @relation(fields: [projectId], references: [id], onDelete: SetNull)
  
  parentId      String?
  parent        Note?     @relation("NoteHierarchy", fields: [parentId], references: [id])
  children      Note[]    @relation("NoteHierarchy")
  
  // Métadonnées
  published     Boolean   @default(false)
  archived      Boolean   @default(false)
  
  // Relations
  comments      Comment[]
  attachments   Attachment[]
  blocks        NoteBlock[]
  
  createdBy     String
  creator       User      @relation(fields: [createdBy], references: [id])
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([projectId])
  @@index([createdBy])
  @@map("notes")
}

model NoteBlock {
  id            String    @id @default(cuid())
  type          BlockType
  content       Json
  order         Int
  
  noteId        String
  note          Note      @relation(fields: [noteId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([noteId])
  @@map("note_blocks")
}

// ==================== CALENDRIER ====================

model CalendarEvent {
  id            String    @id @default(cuid())
  title         String
  description   String?
  location      String?
  
  // Dates
  start         DateTime
  end           DateTime
  allDay        Boolean   @default(false)
  
  // Récurrence
  recurrence    Json?     // RRULE format
  
  // Couleur
  color         String    @default("#3B82F6")
  
  // Liens
  taskId        String?
  task          Task?     @relation(fields: [taskId], references: [id], onDelete: SetNull)
  
  // Intégration externe
  externalId    String?
  provider      String?   // google, outlook, apple
  
  workspaceId   String
  userId        String
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([userId, start])
  @@index([workspaceId])
  @@map("calendar_events")
}

// ==================== AUTOMATISATIONS ====================

model Automation {
  id            String    @id @default(cuid())
  name          String
  description   String?
  enabled       Boolean   @default(true)
  
  // Déclencheur
  trigger       Json      // { type: 'task.created', conditions: [...] }
  
  // Actions
  actions       Json      // [{ type: 'task.update', params: {...} }]
  
  // Stats
  runCount      Int       @default(0)
  lastRunAt     DateTime?
  lastError     String?
  
  projectId     String?
  project       Project?  @relation(fields: [projectId], references: [id], onDelete: SetNull)
  
  createdBy     String
  creator       User      @relation(fields: [createdBy], references: [id])
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([projectId])
  @@map("automations")
}

// ==================== COMMENTAIRES ====================

model Comment {
  id            String    @id @default(cuid())
  content       String
  
  // Polymorphique
  taskId        String?
  task          Task?     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  noteId        String?
  note          Note?     @relation(fields: [noteId], references: [id], onDelete: Cascade)
  
  parentId      String?
  parent        Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies       Comment[] @relation("CommentReplies")
  
  createdBy     String
  creator       User      @relation(fields: [createdBy], references: [id])
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([taskId])
  @@index([noteId])
  @@map("comments")
}

// ==================== FICHIERS ====================

model Attachment {
  id            String    @id @default(cuid())
  filename      String
  originalName  String
  mimeType      String
  size          Int
  url           String
  
  // Polymorphique
  taskId        String?
  task          Task?     @relation(fields: [taskId], references: [id], onDelete: SetNull)
  noteId        String?
  note          Note?     @relation(fields: [noteId], references: [id], onDelete: SetNull)
  
  uploadedBy    String
  
  createdAt     DateTime  @default(now())
  
  @@map("attachments")
}

// ==================== SUIVI DU TEMPS ====================

model TimeEntry {
  id            String    @id @default(cuid())
  description   String?
  start         DateTime
  end           DateTime?
  duration      Int       // en secondes
  
  taskId        String
  task          Task      @relation(fields: [taskId], references: [id], onDelete: Cascade)
  
  userId        String
  
  createdAt     DateTime  @default(now())
  
  @@index([taskId])
  @@index([userId])
  @@map("time_entries")
}

// ==================== ACTIVITÉS ====================

model Activity {
  id            String    @id @default(cuid())
  action        String    // 'created', 'updated', 'deleted', etc.
  entity        String    // 'task', 'note', 'project', etc.
  entityId      String
  changes       Json?     // { field: { old: x, new: y } }
  
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  
  workspaceId   String
  
  createdAt     DateTime  @default(now())
  
  @@index([entity, entityId])
  @@index([userId])
  @@index([createdAt])
  @@map("activities")
}

// ==================== NOTIFICATIONS ====================

model Notification {
  id            String    @id @default(cuid())
  type          String    // 'mention', 'assignment', 'due_date', etc.
  title         String
  message       String
  read          Boolean   @default(false)
  
  // Lien vers l'entité
  entityType    String
  entityId      String
  
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime  @default(now())
  
  @@index([userId, read])
  @@map("notifications")
}

// ==================== ÉNUMÉRATIONS ====================

enum Plan {
  FREE
  PRO
  ENTERPRISE
}

enum MemberRole {
  ADMIN
  MEMBER
  VIEWER
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  IN_REVIEW
  DONE
  CANCELLED
}

enum Priority {
  URGENT
  HIGH
  MEDIUM
  LOW
}

enum View {
  LIST
  KANBAN
  TIMELINE
  CALENDAR
  TABLE
}

enum TimeFormat {
  H12
  H24
}

enum DependencyType {
  FINISH_TO_START
  START_TO_START
  FINISH_TO_FINISH
  START_TO_FINISH
}

enum BlockType {
  PARAGRAPH
  HEADING
  LIST
  CODE
  IMAGE
  TABLE
  QUOTE
  DIVIDER
  CALLOUT
  EMBED
}
```

### 4.2 Index et Performances

```sql
-- Index composites pour les requêtes fréquentes
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_tasks_assignee_status ON task_assignees(user_id) INCLUDE (task_id);
CREATE INDEX idx_notes_project_creator ON notes(project_id, created_by);
CREATE INDEX idx_activities_entity ON activities(entity, entity_id, created_at DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id, read, created_at DESC);

-- Index pour la recherche
CREATE INDEX idx_tasks_title_gin ON tasks USING gin(to_tsvector('french', title));
CREATE INDEX idx_notes_title_gin ON notes USING gin(to_tsvector('french', title));

-- Partitionnement pour les grandes tables
CREATE TABLE activities_partitioned (
    LIKE activities INCLUDING ALL
) PARTITION BY RANGE (created_at);
```

---

## 5. API et Communication

### 5.1 REST API Design

#### Conventions URL
```
GET    /api/v1/workspaces                    # Lister les workspaces
POST   /api/v1/workspaces                    # Créer un workspace
GET    /api/v1/workspaces/:id                # Détails d'un workspace
PATCH  /api/v1/workspaces/:id                # Modifier un workspace
DELETE /api/v1/workspaces/:id                # Supprimer un workspace

GET    /api/v1/workspaces/:id/projects       # Lister les projets
POST   /api/v1/workspaces/:id/projects       # Créer un projet

GET    /api/v1/projects/:id/tasks            # Lister les tâches
POST   /api/v1/projects/:id/tasks            # Créer une tâche
GET    /api/v1/tasks/:id                      # Détails d'une tâche
PATCH  /api/v1/tasks/:id                      # Modifier une tâche
DELETE /api/v1/tasks/:id                      # Supprimer une tâche

POST   /api/v1/tasks/:id/assign              # Assigner une tâche
POST   /api/v1/tasks/:id/labels              # Ajouter un label
POST   /api/v1/tasks/:id/dependencies        # Ajouter une dépendance
```

#### Format de Réponse
```typescript
// Succès
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "title": "Tâche exemple",
    "status": "TODO",
    "createdAt": "2026-09-09T10:00:00.000Z"
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-09-09T10:00:00.000Z"
  }
}

// Liste avec pagination
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}

// Erreur
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Le titre est requis",
    "details": [
      {
        "field": "title",
        "message": "ne peut pas être vide"
      }
    ]
  }
}
```

### 5.2 GraphQL (Optionnel)

```graphql
type Query {
  workspace(id: ID!): Workspace
  myWorkspaces: [Workspace!]!
  
  project(id: ID!): Project
  projects(workspaceId: ID!): [Project!]!
  
  tasks(projectId: ID!, filter: TaskFilter): TaskConnection!
  task(id: ID!): Task
  
  note(id: ID!): Note
  notes(projectId: ID): [Note!]!
}

type Mutation {
  createTask(input: CreateTaskInput!): Task!
  updateTask(id: ID!, input: UpdateTaskInput!): Task!
  deleteTask(id: ID!): Boolean!
  
  assignTask(taskId: ID!, userId: ID!): TaskAssignee!
  unassignTask(taskId: ID!, userId: ID!): Boolean!
}

type Subscription {
  taskUpdated(projectId: ID!): Task!
  commentAdded(taskId: ID!): Comment!
  notificationReceived: Notification!
}
```

### 5.3 WebSockets (Temps Réel)

```typescript
// Events WebSocket
interface WebSocketEvents {
  // Client -> Server
  'join:workspace': { workspaceId: string };
  'join:project': { projectId: string };
  'leave:project': { projectId: string };
  'cursor:move': { position: { x: number; y: number } };
  
  // Server -> Client
  'task:created': Task;
  'task:updated': Task;
  'task:deleted': { taskId: string };
  'comment:added': Comment;
  'notification:new': Notification;
  'user:joined': { userId: string; projectId: string };
  'user:left': { userId: string; projectId: string };
}
```

---

## 6. Architecture Frontend

### 6.1 Structure des Composants

```
src/
├── app/                        # App Router (Next.js 14+)
│   ├── (auth)/                 # Routes d'authentification
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (dashboard)/            # Routes du dashboard
│   │   ├── workspaces/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── notes/
│   │   ├── calendar/
│   │   └── layout.tsx
│   ├── api/                    # API Routes Next.js
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/                     # Composants UI de base
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Dropdown/
│   │   └── ...
│   │
│   ├── features/               # Composants métier
│   │   ├── tasks/
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskBoard.tsx
│   │   │   ├── TaskTimeline.tsx
│   │   │   └── TaskForm.tsx
│   │   ├── notes/
│   │   │   ├── NoteEditor.tsx
│   │   │   ├── NoteList.tsx
│   │   │   └── NoteTree.tsx
│   │   ├── calendar/
│   │   │   ├── CalendarView.tsx
│   │   │   └── EventForm.tsx
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       └── CommandPalette.tsx
│   │
│   └── shared/                 # Composants partagés
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       └── EmptyState.tsx
│
├── hooks/                      # Hooks personnalisés
│   ├── useTask.ts
│   ├── useNote.ts
│   ├── useCalendar.ts
│   ├── useWebSocket.ts
│   └── useKeyboardShortcuts.ts
│
├── lib/                        # Utilitaires
│   ├── api.ts                  # Client API
│   ├── auth.ts                 # Auth helpers
│   ├── utils.ts                # Fonctions utilitaires
│   └── constants.ts            # Constantes
│
├── stores/                     # État global (Zustand)
│   ├── authStore.ts
│   ├── workspaceStore.ts
│   ├── taskStore.ts
│   └── uiStore.ts
│
├── styles/                     # Styles globaux
│   ├── globals.css
│   └── themes.css
│
└── types/                      # Types TypeScript
    ├── api.ts
    ├── models.ts
    └── events.ts
```

### 6.2 State Management

```typescript
// stores/taskStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface TaskState {
  tasks: Map<string, Task>;
  selectedTaskId: string | null;
  filters: TaskFilters;
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  selectTask: (id: string | null) => void;
  setFilters: (filters: TaskFilters) => void;
}

export const useTaskStore = create<TaskState>()(
  devtools(
    persist(
      (set, get) => ({
        tasks: new Map(),
        selectedTaskId: null,
        filters: {},
        
        setTasks: (tasks) => set({
          tasks: new Map(tasks.map(t => [t.id, t]))
        }),
        
        addTask: (task) => set((state) => ({
          tasks: new Map(state.tasks).set(task.id, task)
        })),
        
        updateTask: (id, updates) => set((state) => {
          const task = state.tasks.get(id);
          if (!task) return state;
          
          const updated = { ...task, ...updates };
          return {
            tasks: new Map(state.tasks).set(id, updated)
          };
        }),
        
        deleteTask: (id) => set((state) => {
          const tasks = new Map(state.tasks);
          tasks.delete(id);
          return { tasks };
        }),
        
        selectTask: (id) => set({ selectedTaskId: id }),
        
        setFilters: (filters) => set({ filters }),
      }),
      {
        name: 'task-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    )
  )
);
```

### 6.3 Hooks Personnalisés

```typescript
// hooks/useTask.ts
import { useCallback } from 'react';
import { useTaskStore } from '@/stores/taskStore';
import { tasksApi } from '@/lib/api';

export function useTask(projectId: string) {
  const { tasks, addTask, updateTask, deleteTask } = useTaskStore();
  
  const projectTasks = Array.from(tasks.values())
    .filter(t => t.projectId === projectId);
  
  const createTask = useCallback(async (data: CreateTaskInput) => {
    const task = await tasksApi.create(projectId, data);
    addTask(task);
    return task;
  }, [projectId, addTask]);
  
  const toggleStatus = useCallback(async (taskId: string) => {
    const task = tasks.get(taskId);
    if (!task) return;
    
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    const updated = await tasksApi.update(taskId, { status: newStatus });
    updateTask(taskId, updated);
  }, [tasks, updateTask]);
  
  return {
    tasks: projectTasks,
    createTask,
    updateTask: (id: string, data: UpdateTaskInput) =>
      tasksApi.update(id, data).then(t => updateTask(id, t)),
    deleteTask: (id: string) =>
      tasksApi.delete(id).then(() => deleteTask(id)),
    toggleStatus,
  };
}
```

---

## 7. Architecture Backend

### 7.1 Module Exemple : Tasks

```typescript
// modules/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { EventsModule } from '@/events/events.module';

@Module({
  imports: [PrismaModule, EventsModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
```

```typescript
// modules/tasks/tasks.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { EventsService } from '@/events/events.service';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private events: EventsService,
  ) {}

  async findAll(projectId: string, userId: string, filters?: TaskFilterDto) {
    const where: Prisma.TaskWhereInput = {
      projectId,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.priority && { priority: filters.priority }),
      ...(filters?.assigneeId && {
        assignees: {
          some: { userId: filters.assigneeId },
        },
      }),
    };

    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        assignees: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
        labels: { include: { label: true } },
        subtasks: true,
        _count: {
          select: { comments: true, subtasks: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    return tasks;
  }

  async create(userId: string, projectId: string, dto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || 'TODO',
        priority: dto.priority || 'MEDIUM',
        dueDate: dto.dueDate,
        estimatedHours: dto.estimatedHours,
        projectId,
        createdBy: userId,
        assignees: dto.assigneeIds
          ? {
              create: dto.assigneeIds.map((userId) => ({ userId })),
            }
          : undefined,
      },
      include: {
        assignees: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
      },
    });

    this.events.emit('task.created', { task, projectId });
    return task;
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Tâche non trouvée');

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        completedAt: dto.status === 'DONE' ? new Date() : null,
      },
      include: {
        assignees: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
      },
    });

    this.events.emit('task.updated', { task, changes: dto });
    return task;
  }

  async delete(id: string, userId: string) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Tâche non trouvée');

    await this.prisma.task.delete({ where: { id } });
    this.events.emit('task.deleted', { taskId: id });
  }
}
```

### 7.2 Guards et Interceptors

```typescript
// common/guards/workspace-member.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const workspaceId = request.params.workspaceId || request.body.workspaceId;

    if (!workspaceId) return true;

    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId,
        },
      },
    });

    return !!membership;
  }
}
```

```typescript
// common/interceptors/transform.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        meta: {
          requestId: request.id,
          timestamp: new Date().toISOString(),
        },
      })),
    );
  }
}
```

### 7.3 Validation

```typescript
// modules/tasks/dto/create-task.dto.ts
import { IsString, IsOptional, IsEnum, IsDate, IsNumber, IsArray, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @MaxLength(500)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED'])
  status?: string;

  @IsOptional()
  @IsEnum(['URGENT', 'HIGH', 'MEDIUM', 'LOW'])
  priority?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedHours?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assigneeIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labelIds?: string[];
}
```

---

## 8. Sécurité

### 8.1 Authentification

```typescript
// modules/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.usersService.findById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
```

### 8.2 Rate Limiting

```typescript
// common/guards/throttler.guard.ts
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    return Promise.resolve(req.ip);
  }
}

// Configuration
// app.module.ts
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,    // 1 seconde
        limit: 3,     // 3 requêtes
      },
      {
        name: 'medium',
        ttl: 10000,   // 10 secondes
        limit: 20,    // 20 requêtes
      },
      {
        name: 'long',
        ttl: 60000,   // 1 minute
        limit: 100,   // 100 requêtes
      },
    ]),
  ],
})
```

### 8.3 Chiffrement

```typescript
// lib/encryption.ts
import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

export class Encryption {
  private key: Buffer;

  constructor(secret: string) {
    this.key = crypto.scryptSync(secret, 'salt', 32);
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
  }

  decrypt(encryptedText: string): string {
    const [ivHex, tagHex, encrypted] = encryptedText.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv);
    
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

### 8.4 Headers de Sécurité

```typescript
// main.ts - Configuration NestJS
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Helmet pour les headers de sécurité
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'wss:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // CSRF Protection
  app.use(csurf({ cookie: true }));

  await app.listen(3000);
}
```

---

## 9. Infrastructure et Déploiement

### 9.1 Docker

```dockerfile
# Dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Application
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/nexaboard
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
      - redis
    restart: unless-stopped

  # Base de données
  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=nexaboard
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    ports:
      - "5432:5432"
    restart: unless-stopped

  # Cache
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped

  # Recherche (optionnel)
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.10.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    volumes:
      - es_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
    profiles:
      - search

  # Monitoring
  prometheus:
    image: prom/prometheus
    volumes:
      - ./docker/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
    profiles:
      - monitoring

  grafana:
    image: grafana/grafana
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3001:3000"
    profiles:
      - monitoring

volumes:
  postgres_data:
  redis_data:
  es_data:
  grafana_data:
```

### 9.2 Kubernetes

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nexaboard-web
  labels:
    app: nexaboard
    component: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nexaboard
      component: web
  template:
    metadata:
      labels:
        app: nexaboard
        component: web
    spec:
      containers:
        - name: web
          image: nexaboard/web:latest
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: nexaboard-secrets
                  key: database-url
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: nexaboard-secrets
                  key: jwt-secret
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /api/ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: nexaboard-web
spec:
  selector:
    app: nexaboard
    component: web
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nexaboard-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
    - hosts:
        - app.nexaboard.io
      secretName: nexaboard-tls
  rules:
    - host: app.nexaboard.io
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: nexaboard-web
                port:
                  number: 80
```

### 9.3 CI/CD

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Tests
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: nexaboard_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run linter
        run: pnpm lint

      - name: Run type check
        run: pnpm typecheck

      - name: Run tests
        run: pnpm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/nexaboard_test
          REDIS_URL: redis://localhost:6379

  # Build & Push Docker
  build:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKERHUB_USERNAME }}/nexaboard:latest
            ${{ secrets.DOCKERHUB_USERNAME }}/nexaboard:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # Deploy
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/nexaboard
            docker compose pull
            docker compose up -d
            docker compose exec web pnpm prisma migrate deploy
```

---

## 10. Monitoring et Observabilité

### 10.1 Métriques

```typescript
// monitoring/metrics.ts
import { Counter, Histogram, Gauge, register } from 'prom-client';

// Métriques HTTP
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total des requêtes HTTP',
  labelNames: ['method', 'route', 'status'],
});

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durée des requêtes HTTP',
  labelNames: ['method', 'route'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 5],
});

// Métriques métier
export const tasksCreated = new Counter({
  name: 'tasks_created_total',
  help: 'Total des tâches créées',
  labelNames: ['project_id', 'status'],
});

export const activeUsers = new Gauge({
  name: 'active_users',
  help: 'Nombre d\'utilisateurs actifs',
});

// Métriques base de données
export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Durée des requêtes base de données',
  labelNames: ['operation', 'table'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5],
});
```

### 10.2 Health Checks

```typescript
// health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, PrismaHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '@/prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
    private memory: MemoryHealthIndicator,
    private prismaService: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prisma.pingCheck('database', this.pismaService),
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
```

### 10.3 Logging

```typescript
// common/filters/all-exceptions.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : 500;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    this.logger.error({
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      status,
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
      requestId: request.id,
    });

    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        message: typeof message === 'string' ? message : (message as any).message,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
```

---

## 11. Performance et Scalabilité

### 11.1 Stratégies de Cache

```typescript
// lib/cache.ts
import { Cache } from 'cache-manager';

export class CacheService {
  constructor(private cache: Cache) {}

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number = 3600,
  ): Promise<T> {
    const cached = await this.cache.get<T>(key);
    if (cached) return cached;

    const value = await factory();
    await this.cache.set(key, value, ttl);
    return value;
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.cache.store.keys?.(pattern);
    if (keys) {
      await Promise.all(keys.map((key) => this.cache.del(key)));
    }
  }
}
```

### 11.2 Pagination

```typescript
// lib/pagination.ts
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function paginate<T>(
  model: any,
  params: PaginationParams,
  where: any = {},
  include: any = {},
): Promise<PaginatedResult<T>> {
  const page = params.page || 1;
  const limit = Math.min(params.limit || 20, 100);

  const [data, total] = await Promise.all([
    model.findMany({
      where,
      include,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    model.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}
```

### 11.3 Optimisations Frontend

```typescript
// lib/optimizations.tsx
import dynamic from 'next/dynamic';
import { memo, useMemo } from 'react';

// Lazy loading des composants lourds
export const HeavyEditor = dynamic(
  () => import('@/components/features/notes/NoteEditor'),
  {
    loading: () => <EditorSkeleton />,
    ssr: false,
  }
);

// Memoization
export const MemoizedTaskCard = memo(TaskCard, (prev, next) => {
  return (
    prev.task.id === next.task.id &&
    prev.task.status === next.task.status &&
    prev.task.updatedAt === next.task.updatedAt
  );
});

// Virtual scrolling pour les grandes listes
export function VirtualList({ items, renderItem, itemHeight = 60 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerHeight = 600;

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      style: {
        position: 'absolute' as const,
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
      },
    }));
  }, [items, scrollTop, itemHeight]);

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ position: 'relative', height: items.length * itemHeight }}>
        {visibleItems.map(({ item, style }) => (
          <div key={item.id} style={style}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 12. Plan de Reprise d'Activité

### 12.1 Stratégie de Backup

```yaml
# backups/backup-strategy.yaml
backups:
  database:
    frequency: daily
    retention:
      daily: 7
      weekly: 4
      monthly: 12
    storage:
      - local: /backups/postgres
      - s3: s3://nexaboard-backups/database
    
  redis:
    frequency: hourly
    retention: 24h
    type: RDB + AOF
    
  files:
    frequency: daily
    storage: s3://nexaboard-backups/files
    
  configs:
    frequency: on-change
    storage: git (versioned)
```

### 12.2 Procédures de Récupération

```bash
#!/bin/bash
# scripts/restore.sh

# 1. Restaurer la base de données
pg_restore -h localhost -U postgres -d nexaboard /backups/latest.dump

# 2. Restaurer Redis
redis-cli --rdb /backups/redis/dump.rdb

# 3. Vérifier l'intégrité
npm run prisma:validate
npm run health:check

# 4. Redémarrer les services
docker compose restart

echo "Restauration terminée avec succès"
```

### 12.3 SLA et Métriques

| Métrique | Objectif | Mesure |
|----------|----------|--------|
| Disponibilité | 99.9% | Uptime monitoring |
| Temps de réponse | < 200ms (P95) | APM |
| RPO (Recovery Point) | < 1 heure | Fréquence backup |
| RTO (Recovery Time) | < 4 heures | Temps de restauration |
| Taux d'erreur | < 0.1% | Logs & métriques |

---

## Annexes

### A. Glossaire Technique

| Terme | Définition |
|-------|------------|
| **OLTP** | Online Transaction Processing |
| **ACID** | Atomicité, Consistance, Isolation, Durabilité |
| **RBAC** | Role-Based Access Control |
| **SSR** | Server-Side Rendering |
| **SSG** | Static Site Generation |
| **CDN** | Content Delivery Network |

### B. Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation NestJS](https://docs.nestjs.com)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)

### C. Historique des Versions

| Version | Date | Changements |
|---------|------|-------------|
| 1.0 | 09/09/2026 | Version initiale |

---

**Document validé par :**

_________________________  
Nom : ___________________  
Rôle : ___________________  
Date : ___________________
