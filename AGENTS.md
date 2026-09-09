# AGENTS.md — nexaBoard

## Vision du projet

nexaBoard est une application de productivité moderne destinée aux petites équipes (5-20 personnes).  
Elle combine gestion de tâches, notes, calendrier et collaboration dans un seul outil simple, performant et abordable.

Objectif principal : remplacer la fragmentation d’outils (Todoist + Notion + Trello + Slack + etc.) par une solution intégrée et intuitive.

---

## Stack Technique (à respecter strictement)

### Frontend
- **Framework** : Next.js 14+ (App Router)
- **Language** : TypeScript strict
- **UI** : Tailwind CSS + composants shadcn/ui (ou équivalent)
- **State** : Zustand
- **Éditeur de notes** : TipTap (ProseMirror)
- **Calendrier** : react-big-calendar ou solution custom légère
- **Forms** : React Hook Form + Zod
- **Tests** : Vitest + React Testing Library + Playwright

### Backend
- **Runtime** : Node.js 20+ LTS
- **Framework** : NestJS (TypeScript)
- **ORM** : Prisma
- **Base de données** : PostgreSQL 16+
- **Cache / Queues / Pub-Sub** : Redis 7+
- **Authentification** : Passport.js + JWT (access + refresh tokens) + OAuth2
- **Validation** : class-validator + Zod côté frontend
- **API** : REST (versionnée `/api/v1/`) — GraphQL optionnel plus tard

### Infrastructure
- Docker + Docker Compose (développement)
- GitHub Actions (CI/CD)
- Kubernetes en production (plus tard)
- Monitoring : Prometheus + Grafana (phase ultérieure)

### Principes techniques non négociables
- TypeScript strict partout (`strict: true`, pas de `any`)
- Architecture propre et modulaire
- Séparation claire des domaines (Tasks, Notes, Calendar, Workspace, Auth…)
- API versionnée
- Tests unitaires + d’intégration pour le backend
- Accessibilité WCAG 2.1 AA
- Mobile-first et responsive
- Performance : pages principales < 2s, interactions < 100ms

---

## Architecture Logicielle

### Backend (NestJS)
- Architecture modulaire (un module par domaine)
- Pattern : Controller → Service → Repository (via Prisma)
- DTOs avec validation stricte
- Guards pour l’authentification et l’autorisation (RBAC)
- Interceptors pour logging et transformation

### Frontend (Next.js)
- Feature-based architecture (`features/tasks`, `features/notes`, `features/calendar`…)
- App Router
- Server Components par défaut, Client Components seulement quand nécessaire
- Design System centralisé

### Modèle de données principal
- User
- Workspace (espaces de travail)
- Project
- Task (avec sous-tâches, dépendances, labels, assignees…)
- Note (contenu TipTap / Markdown)
- Event (calendrier)
- Automation (plus tard)

---

## Phases de développement (à respecter)

### Phase 1 — MVP (Priorité absolue)
Fonctionnalités à livrer :
- Authentification (email/password + OAuth Google/GitHub)
- Workspaces + rôles (Admin, Editor, Viewer)
- Gestion de tâches : Vue Kanban + Vue Liste uniquement
- Notes simples (Markdown / TipTap basique)
- Calendrier basique
- Interface web responsive propre
- Permissions de base

**Ne pas implémenter en Phase 1** :
- Vue Timeline / Tableau
- Éditeur riche avancé
- Collaboration temps réel
- Automatisations
- Applications mobiles / desktop
- Intégrations avancées

### Phase 2 et suivantes
Uniquement après validation du MVP.

---

## Conventions de code

### Général
- Nommage clair et explicite (préférer la lisibilité à la brièveté)
- Fonctions et composants petits et focalisés
- Commentaires uniquement quand le « pourquoi » n’est pas évident
- Pas de code mort
- Gestion d’erreurs propre et explicite

### Backend
- Un module NestJS = un domaine métier
- DTOs pour toutes les entrées/sorties
- Services sans logique HTTP
- Utiliser Prisma pour toutes les requêtes DB
- Transactions pour les opérations multi-tables

### Frontend
- Composants UI réutilisables dans `components/ui`
- Features isolées
- Hooks personnalisés pour la logique métier
- Pas de logique métier dans les composants de présentation
- Utiliser Zod pour la validation des formulaires

### Git
- Conventional Commits
- Branches : `feat/`, `fix/`, `chore/`, `refactor/`
- PRs petites et focalisées

---

## Sécurité (obligatoire)

- JWT avec access + refresh tokens
- RBAC dès le début
- Validation stricte de toutes les entrées
- Rate limiting
- Protection CSRF / XSS / injection
- Chiffrement en transit (HTTPS) et au repos
- Jamais de secrets en clair dans le code
- Conformité RGPD (droit à l’effacement, etc.)

---

## Qualité & Tests

- Backend : tests unitaires + tests d’intégration (Jest/Supertest)
- Frontend : tests de composants + tests E2E critiques (Playwright)
- Couverture minimale attendue sur les parties critiques (Auth, Tasks, Permissions)
- Toujours tester les edge cases et les permissions

---

## Design & UX

- Design minimaliste, épuré et cohérent
- Support Dark / Light mode
- Accessibilité WCAG 2.1 AA
- Navigation claire (sidebar collapsible)
- Raccourci global de recherche (Cmd/Ctrl + K)
- Feedback utilisateur clair (loading, erreurs, succès)

---

## Instructions pour les agents

- Toujours respecter la Phase en cours (actuellement **Phase 1 - MVP**)
- Avant de coder une feature, vérifier qu’elle appartient bien au MVP
- Préférer les solutions simples et maintenables
- Poser des questions de clarification si le besoin est ambigu
- Documenter les décisions techniques importantes
- Ne jamais introduire de dette technique majeure sans justification

---

## Objectif de qualité

Le code doit être :
- Lisible
- Testé
- Sécurisé
- Performant
- Facile à faire évoluer

On construit un produit professionnel, pas un prototype jetable.
