# Plan de Projet
## nexaBoard - Application de Productivité pour Équipes

**Version :** 1.0  
**Date :** 09 septembre 2026  
**Chef de Projet :** Ibrahim  
**Statut :** En cours

---

## Table des Matières

1. [Résumé Exécutif](#1-résumé-exécutif)
2. [Objectifs du Projet](#2-objectifs-du-projet)
3. [Équipe et Rôles](#3-équipe-et-rôles)
4. [Phase 1 : MVP (Mois 1-3)](#4-phase-1-mvp-mois-1-3)
5. [Phase 2 : Fonctionnalités Avancées (Mois 4-6)](#5-phase-2-fonctionnalités-avancées-mois-4-6)
6. [Phase 3 : Intelligence et Automatisation (Mois 7-9)](#6-phase-3-intelligence-et-automatisation-mois-7-9)
7. [Phase 4 : Écosystème et Lancement (Mois 10-12)](#7-phase-4-écosystème-et-lancement-mois-10-12)
8. [Planning Global](#8-planning-global)
9. [Allocation des Ressources](#9-allocation-des-ressources)
10. [Gestion des Risques](#10-gestion-des-risques)
11. [Plan de Communication](#11-plan-de-communication)
12. [Assurance Qualité](#12-assurance-qualité)
13. [Budget Prévisionnel](#13-budget-prévisionnel)
14. [Outils et Processus](#14-outils-et-processus)
15. [Indicateurs de Suivi](#15-indicateurs-de-suivi)

---

## 1. Résumé Exécutif

### 1.1 Contexte
nexaBoard est une application de productivité moderne destinée aux petites équipes (5-20 personnes). Elle vise à combiner les fonctionnalités des outils existants (Todoist, Notion, Trello, Evernote) en une solution intégrée, intuitive et performante.

### 1.2 Objectifs Stratégiques
- **Marché** : Capturer 1% du marché des outils de productivité PME en 2 ans
- **Utilisateurs** : Atteindre 10 000 utilisateurs actifs mensuels à 12 mois
- **Revenue** : Générer 50K€ de MRR à 18 mois
- **Satisfaction** : NPS > 50 à 6 mois après lancement

### 1.3 Périmètre
- Application web responsive
- Applications mobiles (iOS/Android)
- Application desktop (Electron)
- API publique pour intégrations
- Marketplace de connecteurs

### 1.4 Livrables Principaux
1. Application web complète
2. Applications mobiles
3. Application desktop
4. API publique
5. Documentation technique et utilisateur
6. Site marketing

---

## 2. Objectifs du Projet

### 2.1 Objectifs Fonctionnels

| ID | Objectif | Priorité | Mesure de Succès |
|----|----------|----------|------------------|
| OF1 | Gestion de tâches intuitive | P0 | 90% des utilisateurs créent une tâche en < 30s |
| OF2 | Collaboration en temps réel | P0 | < 500ms de latence pour les mises à jour |
| OF3 | Calendrier intelligent | P1 | 80% des utilisateurs planifient des événements |
| OF4 | Notes riches | P1 | Support Markdown et WYSIWYG |
| OF5 | Automatisation | P2 | 50% des équipes créent au moins 1 règle |

### 2.2 Objectifs Techniques

| ID | Objectif | Priorité | Mesure de Succès |
|----|----------|----------|------------------|
| OT1 | Performance | P0 | < 200ms pour 95% des requêtes |
| OT2 | Scalabilité | P0 | Support 10 000 utilisateurs simultanés |
| OT3 | Disponibilité | P0 | 99.9% d'uptime |
| OT4 | Sécurité | P0 | Zéro vulnerability critique |
| OT5 | Multiplateforme | P1 | Web, iOS, Android, Desktop |

### 2.3 Objectifs Business

| ID | Objectif | Priorité | Mesure de Succès |
|----|----------|----------|------------------|
| OB1 | Acquisition | P0 | 1 000 inscriptions/mois à M3 |
| OB2 | Rétention | P0 | 40% de rétention J30 |
| OB3 | Monétisation | P1 | 5% de conversion gratuit → payant |
| OB4 | Satisfaction | P1 | NPS > 50 |

---

## 3. Équipe et Rôles

### 3.1 Structure Organisationnelle

```
                    ┌─────────────────────┐
                    │   Ibrahim (Chef de  │
                    │      Projet)        │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Technique   │    │   Produit     │    │   Design      │
│               │    │               │    │               │
│ - Dev Senior  │    │ - PO          │    │ - UI/UX       │
│ - Dev Mid     │    │ - Analyste    │    │               │
│ - Dev Junior  │    │               │    │               │
└───────────────┘    └───────────────┘    └───────────────┘
```

### 3.2 Rôles et Responsabilités

| Rôle | Personne | Responsabilités | Charge |
|------|----------|-----------------|--------|
| **Chef de Projet** | Ibrahim | Planning, coordination, décisions stratégiques | 100% |
| **Product Owner** | À définir | Vision produit, backlog, priorités | 100% |
| **Lead Developer** | À recruter | Architecture, code review, mentorat | 100% |
| **Frontend Developer** | À recruter | UI/UX, composants React, mobile | 100% |
| **Backend Developer** | À recruter | API, base de données, auth | 100% |
| **UI/UX Designer** | Freelance | Maquettes, design system, tests utilisateurs | 50% |
| **QA Engineer** | À recruter | Tests, automatisation, qualité | 50% |
| **DevOps** | À recruter | Infrastructure, CI/CD, monitoring | 30% |

### 3.3 Compétences Requises

#### Technique
- **Frontend** : React, Next.js, TypeScript, Tailwind CSS
- **Backend** : Node.js, NestJS, PostgreSQL, Redis
- **Mobile** : React Native ou Flutter
- **DevOps** : Docker, Kubernetes, CI/CD

#### Fonctionnel
- Gestion de projet agile
- Design UX/UI
- Rédaction fonctionnelle
- Tests utilisateurs

### 3.4 Processus de Recrutement

| Phase | Durée | Actions |
|-------|-------|---------|
| Préparation | 1 semaine | Rédaction fiches de poste, choix canaux |
| Publication | 2 semaines | Diffusion sur LinkedIn, Indeed, tech communities |
| Screening | 1 semaine | Tri des CV, premiers appels |
| Entretiens | 2 semaines | Entretiens techniques et culturels |
| Offre | 1 semaine | Proposition et négociation |
| Onboarding | 2 semaines | Intégration et formation |

---

## 4. Phase 1 : MVP (Mois 1-3)

### 4.1 Objectifs de la Phase
- Livrer un produit minimum viable fonctionnel
- Valider l'hypothèse produit avec les premiers utilisateurs
- Établir les fondations techniques

### 4.2 Livrables

| Semaine | Livrable | Description |
|---------|----------|-------------|
| S1-S2 | Setup technique | Repo, CI/CD, Docker, bases de données |
| S3-S4 | Authentification | Login, register, profil utilisateur |
| S5-S6 | Gestion workspaces | Création, invitations, paramètres |
| S7-S8 | Gestion projets | CRUD projets, vues de base |
| S9-S10 | Gestion tâches | Tâches, statuts, assignation |
| S11-S12 | Tests et déploiement | Tests E2E, déploiement staging |

### 4.3 Détail des Tâches

#### Semaine 1-2 : Setup Technique
```
□ Initialiser le monorepo (Turborepo)
□ Configurer Next.js + NestJS
□ Setup PostgreSQL + Prisma
□ Configurer Redis
□ Docker Compose pour le dev local
□ CI/CD GitHub Actions (lint, test, build)
□ Monitoring de base (logs, erreurs)
```

#### Semaine 3-4 : Authentification
```
□ Schéma utilisateur (Prisma)
□ API register/login
□ JWT tokens + refresh
□ MFA optionnel
□ Pages login/register (UI)
□ Email verification
□ Password reset
```

#### Semaine 5-6 : Workspaces
```
□ CRUD workspaces
□ Système de membres (rôles)
□ Invitations par email
□ Paramètres workspace
□ Switch workspace
□ UI workspace selector
```

#### Semaine 7-8 : Projets
```
□ CRUD projets
□ Couleurs et icônes
□ Vue liste des projets
□ Archivage projets
□ Permissions par projet
□ UI projet page
```

#### Semaine 9-10 : Tâches
```
□ CRUD tâches
□ Statuts (Todo, In Progress, Done)
□ Priorités
□ Échéances
□ Assignation membres
□ Vue Kanban
□ Vue liste
```

#### Semaine 11-12 : Tests et Déploiement
```
□ Tests unitaires (> 70% coverage)
□ Tests d'intégration API
□ Tests E2E (Playwright)
□ Bug fixing
□ Déploiement staging
□ Documentation API
□ Guide utilisateur MVP
```

### 4.4 Critères de Validation

| Critère | Mesure | Objectif |
|---------|--------|----------|
| Fonctionnel | Toutes les features MVP | 100% |
| Performance | Temps de réponse | < 500ms |
| Qualité | Couverture de tests | > 70% |
| UX | Taux de completion tâches | > 80% |
| Bug | Bugs critiques | 0 |

---

## 5. Phase 2 : Fonctionnalités Avancées (Mois 4-6)

### 5.1 Objectifs de la Phase
- Enrichir l'expérience utilisateur
- Ajouter les fonctionnalités différenciantes
- Lancer la bêta privée

### 5.2 Livrables

| Semaine | Livrable | Description |
|---------|----------|-------------|
| S13-S14 | Vues avancées | Timeline, tableau, calendrier |
| S15-S16 | Notes | Éditeur riche, hiérarchie |
| S17-S18 | Collaboration | Temps réel, commentaires |
| S19-S20 | Intégrations | Google, Slack, GitHub |
| S21-S22 | Mobile | App React Native |
| S23-S24 | Bêta | Lancement bêta privée |

### 5.3 Détail des Tâches

#### Semaine 13-14 : Vues Avancées
```
□ Vue Timeline (Gantt simplifié)
□ Vue Tableau (spreadsheet)
□ Vue Calendrier intégrée
□ Filtres avancés
□ Sauvegarde vues personnalisées
□ Export CSV/JSON
```

#### Semaine 15-16 : Notes
```
□ Éditeur TipTap (WYSIWYG)
□ Support Markdown
□ Hiérarchie de pages
□ Recherche plein texte
□ Pièces jointes
□ Versionnage
```

#### Semaine 17-18 : Collaboration
```
□ WebSockets (temps réel)
□ Édition simultanée
□ Commentaires tâches/notes
□ @mentions
□ Notifications in-app
□ Journal d'activité
```

#### Semaine 19-20 : Intégrations
```
□ Google Calendar sync
□ Slack notifications
□ GitHub issues sync
□ API webhooks
□ Zapier integration (beta)
```

#### Semaine 21-22 : Application Mobile
```
□ Setup React Native
□ Authentification
□ Vue tâches
□ Notifications push
□ Mode hors ligne (basique)
□ Publication App Store/Play Store
```

#### Semaine 23-24 : Bêta
```
□ Recrutement bêta testeurs (50-100)
□ Onboarding bêta
□ Collecte feedback
□ Bug fixes
□ Optimisations performance
□ Documentation bêta
```

---

## 6. Phase 3 : Intelligence et Automatisation (Mois 7-9)

### 6.1 Objectifs de la Phase
- Intégrer l'intelligence artificielle
- Automatiser les workflows
- Préparer le lancement public

### 6.2 Livrables

| Semaine | Livrable | Description |
|---------|----------|-------------|
| S25-S26 | IA Calendrier | Planification automatique |
| S27-S28 | Automatisations | Règles si/alors |
| S29-S30 | Desktop | App Electron |
| S31-S32 | Hors ligne | Sync complète |
| S33-S34 | Performance | Optimisations finales |
| S35-S36 | Lancement | Préparation lancement |

### 6.3 Détail des Tâches

#### Semaine 25-26 : IA Calendrier
```
□ Analyse habitudes utilisateur
□ Suggestions planification
□ Détection conflits auto
□ Optimisation créneaux
□ UI suggestions IA
□ Apprentissage continu
```

#### Semaine 27-28 : Automatisations
```
□ Moteur de règles
□ Interface création règles
□ Templates d'automatisations
□ Logs d'exécution
□ Gestion erreurs
□ 10+ automatisations prédéfinies
```

#### Semaine 29-30 : Application Desktop
```
□ Setup Electron
□ Port web → desktop
□ Notifications système
□ Shortcuts globaux
□ Auto-update
□ Publication (Mac, Windows, Linux)
```

#### Semaine 31-32 : Mode Hors Ligne
```
□ Service workers
│ IndexedDB local
□ Sync bidirectionnelle
□ Résolution conflits
□ Indicateur connexion
□ Files d'attente offline
```

#### Semaine 33-34 : Optimisations
```
□ Profiling performance
□ Lazy loading avancé
□ Virtual scrolling
□ Bundle optimization
□ CDN setup
□ Load testing
```

#### Semaine 35-36 : Préparation Lancement
```
□ Landing page
□ Pricing page
□ Documentation publique
□ Support/help center
□ Plan marketing
□ PR launch
```

---

## 7. Phase 4 : Écosystème et Lancement (Mois 10-12)

### 7.1 Objectifs de la Phase
- Lancer publiquement l'application
- Développer l'écosystème
- Atteindre les premiers objectifs business

### 7.2 Livrables

| Semaine | Livrable | Description |
|---------|----------|-------------|
| S37-S38 | API publique | Documentation et SDK |
| S39-S40 | Marketplace | Connecteurs et intégrations |
| S41-S42 | Analytics | Tableaux de bord métriques |
| S43-S44 | Enterprise | Fonctionnalités pro |
| S45-S46 | International | Multi-langues |
| S47-S48 | Lancement | Go-to-market |

### 7.3 Détail des Tâches

#### Semaine 37-38 : API Publique
```
□ Documentation OpenAPI
□ SDK JavaScript/TypeScript
□ Exemples et tutoriels
□ Rate limiting
□ API keys management
□ Portail développeur
```

#### Semaine 39-40 : Marketplace
```
□ Store de connecteurs
□ Submit自己的connecteur
□ Revue et modération
□ Ratings et avis
□ 20+ connecteurs au lancement
```

#### Semaine 41-42 : Analytics
```
□ Tableaux de bord personnalisables
□ Métriques d'équipe
□ Rapports exportables
□ Insights IA
□ Goals et objectifs
□ Time tracking
```

#### Semaine 43-44 : Enterprise
```
□ SSO/SAML
□ Audit logs
□ RBAC avancé
□ SLA garanti
□ Support prioritaire
□ On-premise option
```

#### Semaine 45-46 : International
```
□ Framework i18n
□ Traductions (EN, FR, ES, AR)
□ RTL support
□ Localisation dates/nombres
□ Régionalisation contenu
```

#### Semaine 47-48 : Lancement
```
□ Product Hunt launch
□ Hacker News
□ Tech press outreach
□ Social media campaign
□ Webinar démo
□ Promo launch (30 jours gratuit)
```

---

## 8. Planning Global

### 8.1 Diagramme de Gantt

```
Mois    1    2    3    4    5    6    7    8    9    10   11   12
        │    │    │    │    │    │    │    │    │    │    │    │
Phase 1 ████████████████
MVP     ████ Setup
        ████ Auth
        ████ Workspaces
        ████ Projects
        ████ Tasks
        ████ Tests

Phase 2            ████████████████
Advanced           ████ Vues
                   ████ Notes
                   ████ Collaboration
                   ████ Intégrations
                   ████ Mobile
                   ████ Bêta

Phase 3                         ████████████████
AI & Auto                       ████ IA Calendar
                                ████ Automations
                                ████ Desktop
                                ████ Offline
                                ████ Performance
                                ████ Pre-launch

Phase 4                                        ████████████████
Ecosystem                                      ████ API
                                               ████ Marketplace
                                               ████ Analytics
                                               ████ Enterprise
                                               ████ i18n
                                               ████ Launch
```

### 8.2 Jalons Majeurs

| Jalon | Date | Livrable | Critère de Validation |
|-------|------|----------|----------------------|
| J1 | Mois 1 S2 | Setup technique | Dev local fonctionnel |
| J2 | Mois 2 S4 | Auth complète | Login/Register ok |
| J3 | Mois 3 S4 | MVP fonctionnel | 10 users testent |
| J4 | Mois 4 S4 | Bêta technique | 50 bêta testeurs |
| J5 | Mois 6 S4 | Bêta publique | 200 utilisateurs |
| J6 | Mois 7 S4 | IA intégrée | 30% utilisation IA |
| J7 | Mois 9 S4 | Feature complete | Toutes features live |
| J8 | Mois 10 S4 | Lancement | 1000 inscriptions |
| J9 | Mois 12 S4 | 10K MAU | Objectif atteint |

### 8.3 Critical Path

```
Setup → Auth → Workspaces → Projects → Tasks → (Vues | Notes) → Collaboration → IA → Launch
  │       │         │            │          │         │                │           │       │
  └───────┴─────────┴────────────┴──────────┴─────────┴────────────────┴───────────┴───────┘
                                    Critical Path (48 semaines)
```

---

## 9. Allocation des Ressources

### 9.1 Ressources Humaines

| Rôle | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Total |
|------|---------|---------|---------|---------|-------|
| Chef de projet | 1 | 1 | 1 | 1 | 12 mois |
| Product Owner | 1 | 1 | 1 | 1 | 12 mois |
| Lead Dev | 1 | 1 | 1 | 1 | 12 mois |
| Frontend Dev | 1 | 1 | 1 | 1 | 12 mois |
| Backend Dev | 1 | 1 | 1 | 1 | 12 mois |
| UI/UX | 0.5 | 0.5 | 0.25 | 0.25 | 6 mois |
| QA | 0.5 | 0.5 | 0.5 | 0.5 | 6 mois |
| DevOps | 0.3 | 0.3 | 0.3 | 0.3 | 3.6 mois |

### 9.2 Ressources Techniques

| Ressource | Usage | Coût mensuel |
|-----------|-------|--------------|
| GitHub Pro | Repo, CI/CD | 4€ |
| Vercel Pro | Hosting web | 20€ |
| AWS/GCP | Backend, DB | 100€ |
| Sentry | Error tracking | 26€ |
| Linear | Project mgmt | 8€/user |
| Figma | Design | 12€ |
| Slack | Communication | Gratuit |
| Notion | Documentation | Gratuit |

### 9.3 Budget Humain (Estimation)

| Rôle | Taux/Jour | Jours/Mois | Coût/Mois |
|------|-----------|------------|-----------|
| Lead Dev | 500€ | 22 | 11 000€ |
| Frontend Dev | 400€ | 22 | 8 800€ |
| Backend Dev | 400€ | 22 | 8 800€ |
| UI/UX (Freelance) | 450€ | 11 | 4 950€ |
| QA (Freelance) | 350€ | 11 | 3 850€ |
| **Total** | | | **37 400€** |

---

## 10. Gestion des Risques

### 10.1 Matrice des Risques

| Risque | Probabilité | Impact | Score | Mitigation |
|--------|-------------|--------|-------|------------|
| R1: Départ développeur clé | Moyenne | Élevé | 🔴 | Documentation, knowledge sharing |
| R2: Retard développement | Élevée | Moyen | 🔴 | Buffer 20%, scope management |
| R3: Bugs critiques production | Moyenne | Élevé | 🔴 | Tests, monitoring, rollback |
| R4: Faille sécurité | Faible | Très élevé | 🟡 | Audit sécurité, pentest |
| R5: Coût infrastructure élevé | Moyenne | Moyen | 🟡 | Monitoring costs, serverless |
| R6: Faible adoption | Moyenne | Élevé | 🔴 | Validation continue, pivot |
| R7: Concurrence accrue | Élevée | Moyen | 🔴 | Différenciation, niche |
| R8: Épuisement équipe | Moyenne | Moyen | 🟡 | Work-life balance, rituels |

### 10.2 Plan de Mitigation

#### R1 : Départ développeur clé
- **Prévention** : Documentation exhaustive, pair programming
- **Détection** : 1-on-1 réguliers, satisfaction team
- **Action** : Knowledge transfer, recrutement backup

#### R2 : Retard développement
- **Prévention** : Planning réaliste, estimation précise
- **Détection** : Daily standup, sprint review
- **Action** : Déscope features non critiques, ajouter ressources

#### R3 : Bugs critiques production
- **Prévention** : Tests automatisés, code review
- **Détection** : Monitoring, alertes
- **Action** : Rollback, hotfix, post-mortem

#### R4 : Faille sécurité
- **Prévention** : Audit trimestriel, OWASP
- **Détection** : Bug bounty, scanning
- **Action** : Patch urgent, communication transparente

---

## 11. Plan de Communication

### 11.1 Canaux de Communication

| Canal | Usage | Fréquence |
|-------|-------|-----------|
| Slack | Communication jour | Continue |
| GitHub | Code et issues | Continue |
| Notion | Documentation | Continue |
| Zoom | Réunions | Selon besoin |
| Loom | Démonstrations | Hebdo |

### 11.2 Réunions Régulières

| Réunion | Participants | Fréquence | Durée | Objectif |
|---------|--------------|-----------|-------|----------|
| Daily Standup | Équipe tech | Quotidien | 15 min | Sync quotidien |
| Sprint Planning | Équipe complète | Bi-hebdo | 2h | Planifier sprint |
| Sprint Review | Équipe + stakeholders | Bi-hebdo | 1h | Démontrer travail |
| Sprint Retro | Équipe | Bi-hebdo | 1h | Amélioration continue |
| Product Review | PO + stakeholders | Hebdo | 1h | Avancement produit |
| Tech Review | Équipe tech | Hebdo | 1h | Décisions techniques |
| All Hands | Tous | Mensuel | 1h | Vision et morale |

### 11.3 Reporting

| Rapport | Destinataires | Fréquence | Contenu |
|---------|---------------|-----------|---------|
| Status Report | Stakeholders | Hebdo | Avancement, blocages, risques |
| Sprint Report | Équipe | Fin sprint | Velocity, burndown |
| Monthly Report | Direction | Mensuel | KPIs, budget, roadmap |
| Post-Mortem | Équipe | Après incident | Analyse, actions correctives |

### 11.4 Communication Externe

| Audience | Canal | Fréquence | Contenu |
|----------|-------|-----------|---------|
| Utilisateurs | Newsletter | Mensuel | Updates, tips |
| Communauté | Twitter/LinkedIn | 3x/semaine | Tips, behind the scenes |
| Presse | PR | Lancement | Press release |
| Développeurs | Blog technique | Bi-mensuel | Articles tech |

---

## 12. Assurance Qualité

### 12.1 Stratégie Qualité

```
                    ┌─────────────────────────────┐
                    │      QUALITÉ TOTALE         │
                    └─────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  PRÉVENTION   │    │  DÉTECTION    │  │  CORRECTION   │
│               │    │               │    │               │
│ - Standards   │    │ - Tests auto  │    │ - Bug fixing  │
│ - Formation   │    │ - Code review │    │ - Hotfix      │
│ - Reviews     │    │ - Monitoring  │    │ - Post-mortem │
└───────────────┘    └───────────────┘    └───────────────┘
```

### 12.2 Types de Tests

| Type | Outil | Couverture | Fréquence |
|------|-------|------------|-----------|
| Unitaires | Jest | > 80% | À chaque commit |
| Intégration | Jest + Supertest | > 70% | À chaque PR |
| E2E | Playwright | Scénarios critiques | Hebdo |
| Performance | k6 | SLA | Mensuel |
| Sécurité | OWASP ZAP | OWASP Top 10 | Trimestriel |
| Accessibilité | Axe | WCAG 2.1 AA | À chaque release |
| UX | UserTesting | Qualitatif | Bimestriel |

### 12.3 Processus Qualité

#### Code Review
```yaml
rules:
  - Tous les PR doivent avoir 1 approval
  - CI doit passer (lint, test, build)
  - Pas de merge sans resolution des discussions
  - Review dans les 24h
  - Focus: sécurité, performance, maintenabilité
```

#### Definition of Done
```
□ Code écrit
□ Tests unitaires (> 80% coverage)
□ Tests d'intégration passent
□ Code review approuvé
□ Documentation mise à jour
□ Feature flag configuré
□ Monitoring en place
□ Pas de regression
□ UX validée
□ Performance acceptable (< 200ms)
```

### 12.4 Bug Management

| Sévérité | Description | Délai de résolution |
|----------|-------------|---------------------|
| P0 - Critique | Production down, data loss | < 4h |
| P1 - Haute | Fonctionnalité majeure cassée | < 24h |
| P2 - Moyenne | Bug visible, workaround existant | < 1 semaine |
| P3 - Basse | Bug mineur, cosmetique | Backlog |

---

## 13. Budget Prévisionnel

### 13.1 Coûts de Développement (12 mois)

| Catégorie | Mois 1-3 | Mois 4-6 | Mois 7-9 | Mois 10-12 | Total |
|-----------|----------|----------|----------|------------|-------|
| Salaires équipe | 37 400€ | 37 400€ | 37 400€ | 37 400€ | 448 800€ |
| Freelance (UI/UX, QA) | 8 800€ | 8 800€ | 4 400€ | 4 400€ | 26 400€ |
| **Sous-total RH** | **46 200€** | **46 200€** | **41 800€** | **41 800€** | **176 000€** |

### 13.2 Coûts d'Infrastructure

| Service | Mois 1-3 | Mois 4-6 | Mois 7-9 | Mois 10-12 | Total |
|---------|----------|----------|----------|------------|-------|
| Cloud (AWS/GCP) | 100€ | 300€ | 800€ | 1 500€ | 2 700€ |
| Outils SaaS | 100€ | 150€ | 200€ | 250€ | 700€ |
| Domaine + SSL | 20€ | 20€ | 20€ | 20€ | 80€ |
| **Sous-total Infra** | **220€** | **470€** | **1 020€** | **1 770€** | **3 480€** |

### 13.3 Autres Coûts

| Catégorie | Montant |
|-----------|---------|
| Legal ( création SARL) | 2 000€ |
| Comptabilité | 3 600€ |
| Marketing (lancement) | 10 000€ |
| Événements | 5 000€ |
| Formation | 2 000€ |
| Divers (10%) | 20 000€ |
| **Sous-total Autres** | **42 600€** |

### 13.4 Budget Total

| Période | Montant |
|---------|---------|
| Phase 1 (Mois 1-3) | 48 420€ |
| Phase 2 (Mois 4-6) | 48 670€ |
| Phase 3 (Mois 7-9) | 44 820€ |
| Phase 4 (Mois 10-12) | 79 170€ |
| **TOTAL 12 MOIS** | **221 080€** |

### 13.5 Sources de Financement

| Source | Montant | Statut |
|--------|---------|--------|
| Épargne personnelle | 50 000€ | ✅ Disponible |
| Prêt bancaire | 100 000€ | 🔵 À négocier |
| Aide BPI | 50 000€ | 🔵 Candidature |
| Angel investor | 50 000€ | 🔵 En discussion |
| **Total** | **250 000€** | |

---

## 14. Outils et Processus

### 14.1 Stack d'Outils

| Catégorie | Outil | Usage |
|-----------|-------|-------|
| **Code** | VS Code / Cursor | IDE |
| **Git** | GitHub | Versioning |
| **CI/CD** | GitHub Actions | Automatisation |
| **Project Mgmt** | Linear | Gestion projet |
| **Design** | Figma | UI/UX |
| **Communication** | Slack | Messagerie |
| **Documentation** | Notion | Wiki interne |
| **Monitoring** | Sentry + Grafana | Erreurs + métriques |
| **Analytics** | PostHog | Analytics produit |
| **Support** | Crisp | Support utilisateurs |

### 14.2 Processus Dev

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT WORKFLOW                      │
└─────────────────────────────────────────────────────────────┘

1. PICK TASK
   └─ Linear → Choisir task → Créer branche

2. DEVELOP
   └─ Code → Tests → Lint → Commit (conventional)

3. PR
   └─ Push → Créer PR → Description auto

4. REVIEW
   └─ CI passe → Review assignée → Approve

5. MERGE
   └─ Squash merge → Delete branche → Auto deploy

6. VERIFY
   └─ Vérifier en staging → Monitorer prod
```

### 14.3 Git Workflow

```yaml
branches:
  main: Production
  develop: Intégration
  feature/*: Nouvelles features
  fix/*: Bug fixes
  hotfix/*: Corrections urgentes

commits:
  format: type(scope): description
  types:
    - feat: Nouvelle feature
    - fix: Bug fix
    - docs: Documentation
    - style: Formatage
    - refactor: Refactoring
    - test: Tests
    - chore: Maintenance

pull_requests:
  title: "feat(scope): description"
  template: |
    ## Description
    ## Type de changement
    ## Checklist
    ## Screenshots
```

### 14.4 Environnements

| Environnement | URL | Usage | Déploiement |
|---------------|-----|-------|-------------|
| Local | localhost:3000 | Dev | Manuel |
| Staging | staging.nexaboard.io | Tests | Auto (develop) |
| Production | app.nexaboard.io | Live | Auto (main) |

---

## 15. Indicateurs de Suivi

### 15.1 KPIs Techniques

| KPI | Objectif | Mesure | Fréquence |
|-----|----------|--------|-----------|
| Velocity | 40-50 pts/sprint | Linear | Sprint |
| Lead Time | < 3 jours | Linear | Hebdo |
| Cycle Time | < 2 jours | Linear | Hebdo |
| Bug Escape Rate | < 5% | Sentry | Hebdo |
| Test Coverage | > 80% | Jest | Continu |
| Build Time | < 10 min | GitHub Actions | Continu |
| Deploy Frequency | > 1/jour | GitHub | Continu |

### 15.2 KPIs Produit

| KPI | Objectif | Mesure | Fréquence |
|-----|----------|--------|-----------|
| DAU/MAU | > 40% | PostHog | Hebdo |
| Session Duration | > 15 min | PostHog | Hebdo |
| Feature Adoption | > 60% | PostHog | Mensuel |
| NPS | > 50 | Enquête | Mensuel |
| Churn Rate | < 5% | Analytics | Mensuel |
| Activation Rate | > 70% | Analytics | Hebdo |

### 15.3 KPIs Business

| KPI | Objectif | Mesure | Fréquence |
|-----|----------|--------|-----------|
| MRR | 50K€ à M18 | Stripe | Mensuel |
| CAC | < 100€ | Marketing | Mensuel |
| LTV | > 1000€ | Analytics | Trimestriel |
| Conversion Rate | > 5% | Stripe | Mensuel |
| Growth Rate | > 20% M/M | Analytics | Mensuel |

### 15.4 Tableau de Bord

```
┌─────────────────────────────────────────────────────────────┐
│                    NEXABOARD DASHBOARD                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  VELOCITY           BURNDOWN            RELEASE             │
│  ┌─────────┐       ┌─────────┐        ┌─────────┐         │
│  │   45    │       │ ██████  │        │ v1.2.0  │         │
│  │  pts    │       │ ████████│        │  98%    │         │
│  │  ▲ +5   │       │ ██████████        │  ▲      │         │
│  └─────────┘       └─────────┘        └─────────┘         │
│                                                             │
│  USERS              REVENUE             HEALTH              │
│  ┌─────────┐       ┌─────────┐        ┌─────────┐         │
│  │  8,432  │       │  32K€   │        │   99.9% │         │
│  │  MAU    │       │  MRR    │        │  Uptime │         │
│  │  ▲ +12% │       │  ▲ +8%  │        │  ✓      │         │
│  └─────────┘       └─────────┘        └─────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Annexes

### A. Références

- [Guide Sprint Planning](https://www.atlassian.com/agile/sprint-planning)
- [Best Practices Code Review](https://github.com/blog/2144-code-review-best-practices)
- [DORA Metrics](https://dora.dev/)
- [Tech Startup Financial Model](https://www.saastr.com/how-to-build-a-financial-model-for-a-saas-startup/)

### B. Glossaire

| Terme | Définition |
|-------|------------|
| **MVP** | Minimum Viable Product |
| **MAU** | Monthly Active Users |
| **DAU** | Daily Active Users |
| **MRR** | Monthly Recurring Revenue |
| **CAC** | Customer Acquisition Cost |
| **LTV** | Lifetime Value |
| **NPS** | Net Promoter Score |
| **RRP** | Recovery Point Objective |
| **RTO** | Recovery Time Objective |

### C. Contacts Utiles

| Rôle | Nom | Email | Disponibilité |
|------|-----|-------|---------------|
| Chef de Projet | Ibrahim | ibrahim@nexaboard.io | Lun-Ven 9h-18h |
| Lead Dev | TBD | dev@nexaboard.io | Lun-Ven 9h-18h |
| Support | - | support@nexaboard.io | 24/7 |

---

**Document approuvé par :**

_________________________  
Nom : Ibrahim  
Rôle : Chef de Projet  
Date : 09 septembre 2026

_________________________  
Nom : ___________________  
Rôle : ___________________  
Date : ___________________
