# Cahier des Charges - Landing Page & Formulaire Bêta nexaBoard

**Version :** 1.1  
**Date :** 10 septembre 2026  
**Auteur :** Ibrahim  
**Statut :** Prêt pour développement

---

## Table des Matières

1. [Résumé Exécutif](#1-résumé-exécutif)
2. [Architecture](#2-architecture)
3. [Landing Page](#3-landing-page)
4. [Formulaire Bêta](#4-formulaire-bêta)
5. [Backend & API](#5-backend--api)
6. [Emails Transactionnels](#6-emails-transactionnels)
7. [Design System](#7-design-system)
8. [Analytics](#8-analytics)
9. [Déploiement](#9-déploiement)
10. [Planning](#10-planning)

---

## 1. Résumé Exécutif

### 1.1 Objectif

Créer une landing page et un système d'inscription bêta pour recruter 50-100 premiers utilisateurs testeurs.

### 1.2 KPIs

| KPI | Cible | Mesure |
|-----|-------|--------|
| Taux de conversion | > 5% | Inscriptions / Visiteurs |
| Temps moyen sur page | > 2 min | PostHog |
| Clics "Essai gratuit" | > 10% | Analytics |
| Inscriptions bêta | 50-100 | Base de données |

### 1.3 Public Cible

- PME 5-20 personnes
- Utilisateurs actuels de Trello, Notion, Asana
- Cherchant une alternative simple et intégrée

---

## 2. Architecture

### 2.1 Décision : Monorepo

**Choix :** Intégrer la landing page dans le monorepo existant.

**Justification :**
- Stack technique commune (Next.js + Tailwind)
- Composants UI réutilisables
- Un seul déploiement
- Maintenance simplifiée

### 2.2 Structure

```
nexaboard/
├── apps/
│   ├── api/              # Backend NestJS
│   ├── web/              # Dashboard (existant)
│   └── landing/          # ← NOUVEAU : Landing page
├── libs/
│   └── shared/           # Composants partagés
├── docker/
├── docs/
└── package.json
```

### 2.3 Dépendances

```json
{
  "name": "@nexaboard/landing",
  "version": "0.1.0",
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "tailwindcss": "3.x",
    "framer-motion": "11.x",
    "react-hook-form": "7.x",
    "zod": "3.x",
    "@hookform/resolvers": "3.x"
  }
}
```

---

## 3. Landing Page

### 3.1 Pages

| Route | Description | Priorité |
|-------|-------------|----------|
| `/` | Landing page principale | P0 |
| `/merci` | Page de remerciement | P0 |
| `/privacy` | Politique de confidentialité | P1 |
| `/terms` | Conditions d'utilisation | P2 |

### 3.2 Structure de la Page d'Accueil

#### Section 1 : Header

```html
<nav>
  <Logo />
  <Links>
    <a href="#features">Features</a>
    <a href="#pricing">Prix</a>
    <a href="#faq">FAQ</a>
  </Links>
  <Actions>
    <a href="https://app.nexaboard.io/auth/login">Connexion</a>
    <a href="#beta" class="btn-primary">Essai gratuit</a>
  </Actions>
</nav>
```

#### Section 2 : Hero

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  La productivité enfin simple pour les petites équipes     │
│                                                             │
│  nexaBoard combine tâches, notes et calendrier             │
│  dans un seul outil intuitif. Pas de multiplication        │
│  d'outils, pas d'abonnements coûteux.                      │
│                                                             │
│  ✅ Disponible maintenant  🚀 Fonctionnalités avancées bientôt │
│                                                             │
│  ┌─────────────────────────────┐ ┌───────────────┐         │
│  │ vore@email.com              │ │ Rejoindre →   │         │
│  └─────────────────────────────┘ └───────────────┘         │
│                                                             │
│  ✓ Gratuit  ✓ Sans carte bancaire  ✓ Setup 30 secondes    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Section 3 : Social Proof Bar

```
┌─────────────────────────────────────────────────────────────┐
│  🔢 50+ bêta testeurs  │  ⭐ 4.8/5 satisfaction  │  🚀 3 min setup │
└─────────────────────────────────────────────────────────────┘
```

#### Section 4 : Features

| Catégorie | ✅ Disponible Maintenant | 🚀 Bientôt Disponible |
|-----------|------------------------|----------------------|
| **📋 Tâches** | Kanban, Liste, Sous-tâches, Priorités, Échéances, Assignation | Timeline (Gantt), Dépendances |
| **📝 Notes** | Éditeur simple, Hiérarchie, Partage | WYSIWYG avancé, Collaboration temps réel |
| **📅 Calendrier** | Vue jour/semaine/mois, Événements, Rappels | Sync Google Calendar, Auto-planning IA |
| **👥 Équipe** | Workspaces, Rôles, Commentaires | Notifications avancées |
| **🔌 Intégrations** | API REST | Zapier, Slack, GitHub |
| **📱 Mobile** | Application web responsive | App iOS & Android |
| **⚡ Performance** | Temps de réponse < 200ms | Mode hors ligne |

**Légende :**
```
✅ = Disponible dès aujourd'hui
🚀 = Dans le roadmap (Phase 2-3, 3-6 mois)
```

#### Section 5 : How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Comment ça marche                        │
├─────────────────┬─────────────────┬─────────────────────────┤
│       1️⃣        │       2️⃣        │          3️⃣             │
│  Créez votre    │  Invitez votre  │   Organisez votre       │
│  compte         │  équipe         │   travail               │
│                 │                 │                         │
│  30 secondes    │  Par email      │   Kanban, Liste ou      │
│  chrono         │  en un clic     │   Calendrier            │
│                 │                 │                         │
└─────────────────┴─────────────────┴─────────────────────────┘

💡 Note : Pas de formation complexe requise.
   Interface intuitive, prise en main immédiate.
```

#### Section 6 : Comparaison

```
┌─────────────────────────────────────────────────────────────┐
│              Pourquoi choisir nexaBoard ?                   │
├────────────────┬──────────┬──────────┬──────────┬──────────┤
│                │nexaBoard │ Notion   │ Trello   │ Asana    │
├────────────────┼──────────┼──────────┼──────────┼──────────┤
│ Prix           │    ✓     │    ✓     │    ✓     │    ✓     │
│ Simplicité     │    ✓     │    ✗     │    ✓     │    ✗     │
│ Tout-en-1      │    ✓     │    ✓     │    ✗     │    ✗     │
│ Temps réel     │    ✓     │    ✓     │    ✓     │    ✓     │
│ 🚀 Offline     │   bientôt│    ✗     │    ✗     │    ✗     │
│ Open API       │    ✓     │    ✓     │    ✓     │    ✓     │
├────────────────┼──────────┼──────────┼──────────┼──────────┤
│ Prix/mois      │  0-12€   │   10€    │   6€     │   11€    │
└────────────────┴──────────┴──────────┴──────────┴──────────┘

🚀 = Fonctionnalité en développement (disponible bientôt)
```

#### Section 7 : Testimonials

```
┌─────────────────────────────────────────────────────────────┐
│                    Ce que disent nos bêta testeurs          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  "nexaBoard a transformé notre façon de travailler.        │
│   On a enfin un seul outil pour tout !"                    │
│                                                             │
│   👤 Sarah, CEO de StartupX                                │
│   ⭐⭐⭐⭐⭐                                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Section 8 : Pricing

```
┌─────────────────────────────────────────────────────────────┐
│                      Pricing simple                         │
├─────────────────────────────┬───────────────────────────────┤
│         GRATUIT             │           PRO                 │
│                             │        12€/mois               │
│  ✓ 3 projets               │  ✓ Projets illimités          │
│  ✓ 5 membres               │  ✓ Membres illimités          │
│  ✓ 1 Go de stockage        │  ✓ 25 Go de stockage          │
│  ✓ Support community       │  ✓ Support prioritaire        │
│  ✓ Toutes les features*    │  ✓ Toutes les features*       │
│                             │                               │
│      [Commencer gratuit]    │      [Commencer Pro]          │
└─────────────────────────────┴───────────────────────────────┘

* Toutes les features actuelles + celles à venir (Timeline,
  WYSIWYG, Sync Google, Offline) seront incluses gratuitement.
```

#### Section 9 : FAQ

```
┌─────────────────────────────────────────────────────────────┐
│                    Questions fréquentes                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ▶ nexaBoard est-il vraiment gratuit ?                      │
│  ▶ Puis-je importer mes données depuis Trello/Notion ?      │
│  ▶ Comment fonctionne le support ?                          │
│  ▶ Mes données sont-elles sécurisées ?                      │
│  ▶ Quelles fonctionnalités sont prévues ?                   │
│  ▶ Puis-je annuler mon abonnement à tout moment ?           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Réponses FAQ :**

**Q: nexaBoard est-il vraiment gratuit ?**
R: Oui ! Le plan gratuit inclut toutes les fonctionnalités actuelles. Pas de limite de temps, pas de carte bancaire requise.

**Q: Puis-je importer mes données depuis Trello/Notion ?**
R: L'import depuis Trello, Notion et Asana est prévu dans notre roadmap (Phase 2). Vous pourrez迁移 vos données facilement.

**Q: Comment fonctionne le support ?**
R: Le plan gratuit bénéficie du support community (Slack, email). Le plan Pro inclut un support prioritaire avec réponse sous 24h.

**Q: Mes données sont-elles sécurisées ?**
R: Oui. Nous utilisons un chiffrement AES-256 pour les données au repos et TLS 1.3 pour les données en transit. Hébergé en France (Paris).

**Q: Quelles fonctionnalités sont prévues dans le roadmap ?**
R: Nous avons un roadmap ambitieux :
- **Phase 2 (3-6 mois) :** Vue Timeline, éditeur riche WYSIWYG, synchronisation Google Calendar, application mobile
- **Phase 3 (6-9 mois) :** Mode hors ligne, automatisations, intégrations avancées (Zapier, Slack, GitHub)

Toutes ces fonctionnalités seront incluses dans le plan gratuit lors de leur lancement.

**Q: Puis-je annuler mon abonnement à tout moment ?**
R: Oui, sans engagement. Vous pouvez annuler à tout moment depuis les paramètres de votre compte.

#### Section 10 : CTA Final

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     Rejoignez 50+ équipes qui testent déjà nexaBoard       │
│                                                             │
│     ┌─────────────────────────────┐ ┌───────────────┐      │
│     │ vore@email.com              │ │ Rejoindre →   │      │
│     └─────────────────────────────┘ └───────────────┘      │
│                                                             │
│     ✓ Gratuit  ✓ Sans engagement  ✓ 30 secondes            │
│     ✓ Accès anticipé aux nouvelles features                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Section 11 : Footer

```html
<footer>
  <Logo />
  <Links>
    <Column>
      <h4>Product</h4>
      <a href="#features">Features</a>
      <a href="#pricing">Prix</a>
      <a href="#changelog">Changelog</a>
    </Column>
    <Column>
      <h4>Company</h4>
      <a href="/about">À propos</a>
      <a href="/blog">Blog</a>
      <a href="/careers">Carrières</a>
    </Column>
    <Column>
      <h4>Support</h4>
      <a href="/docs">Documentation</a>
      <a href="/contact">Contact</a>
      <a href="/status">Status</a>
    </Column>
    <Column>
      <h4>Legal</h4>
      <a href="/privacy">Confidentialité</a>
      <a href="/terms">CGU</a>
    </Column>
  </Links>
  <Social>
    <a href="https://twitter.com/nexaboard">Twitter</a>
    <a href="https://github.com/nexaboard">GitHub</a>
  </Social>
  <Copyright>© 2026 nexaBoard. Tous droits réservés.</Copyright>
</footer>
```

---

## 4. Formulaire Bêta

### 4.1 Emplacement

Le formulaire est intégré dans la Section 2 (Hero) et Section 10 (CTA Final).

### 4.2 Champs

| Champ | Type | Obligatoire | Options |
|-------|------|-------------|---------|
| Email | email | ✅ | - |
| Taille équipe | select | ✅ | "1-5", "6-10", "11-20", "20+" |
| Outil actuel | select | ✅ | "Trello", "Notion", "Asana", "ClickUp", "Autre", "Aucun" |
| Intérêt principal | select | ❌ | "Gestion de tâches", "Notes", "Calendrier", "Collaboration" |

**Note :** Le champ "Intérêt principal" est optionnel et aide à prioriser le développement.

### 4.3 Validation

```typescript
const betaSchema = z.object({
  email: z.string().email("Email invalide"),
  teamSize: z.enum(["1-5", "6-10", "11-20", "20+"], {
    required_error: "Sélectionnez la taille de votre équipe",
  }),
  currentTool: z.enum(["trello", "notion", "asana", "clickup", "other", "none"], {
    required_error: "Sélectionnez votre outil actuel",
  }),
  interest: z.enum(["tasks", "notes", "calendar", "collaboration"]).optional(),
});
```

### 4.4 Étapes du Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Formulaire │ ──► │  Validation  │ ──► │  API Call    │
│              │     │  côté client │     │  POST /beta  │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Email      │ ◄── │   Resend     │ ◄── │  Page Merci  │
│ confirmation │     │   API        │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
```

### 4.5 États du Formulaire

| État | Description |
|------|-------------|
| `idle` | Formulaire prêt |
| `submitting` | En cours de soumission |
| `success` | Inscription réussie |
| `error` | Erreur lors de l'inscription |

### 4.6 UX

- **Placeholder** : "Entrez votre email"
- **Bouton** : "Rejoindre la bêta →"
- **Loading** : Spinner sur le bouton
- **Succès** : Message + redirection vers `/merci`
- **Erreur** : Message inline sous le formulaire

---

## 5. Backend & API

### 5.1 Nouvel Endpoint

```
POST /api/v1/beta/subscribe
```

### 5.2 Request

```typescript
{
  email: string;           // "user@example.com"
  teamSize: string;        // "1-5" | "6-10" | "11-20" | "20+"
  currentTool: string;     // "trello" | "notion" | "asana" | "clickup" | "other" | "none"
  interest?: string;       // "tasks" | "notes" | "calendar" | "collaboration" (optionnel)
}
```

### 5.3 Response

**Succès (201) :**
```typescript
{
  success: true,
  message: "Inscription réussie !",
  data: {
    id: "uuid",
    email: "user@example.com",
    position: 42
  }
}
```

**Erreur (400) :**
```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Email invalide"
  }
}
```

**Doublon (409) :**
```typescript
{
  success: false,
  error: {
    code: "ALREADY_SUBSCRIBED",
    message: "Cet email est déjà inscrit"
  }
}
```

### 5.4 Table de Base de Données

```sql
CREATE TABLE beta_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Données utilisateur
  email VARCHAR(255) UNIQUE NOT NULL,
  team_size VARCHAR(10) NOT NULL CHECK (team_size IN ('1-5', '6-10', '11-20', '20+')),
  current_tool VARCHAR(50) NOT NULL CHECK (current_tool IN ('trello', 'notion', 'asana', 'clickup', 'other', 'none')),
  interest VARCHAR(100),  -- Feature d'intérêt principal
  
  -- Statut
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'active', 'churned')),
  position SERIAL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_at TIMESTAMP WITH TIME ZONE,
  activated_at TIMESTAMP WITH TIME ZONE,
  
  -- Métadonnées
  referral_source VARCHAR(100),
  utm_campaign VARCHAR(100),
  user_agent TEXT,
  ip_address INET
);

-- Index
CREATE INDEX idx_beta_subscribers_email ON beta_subscribers(email);
CREATE INDEX idx_beta_subscribers_status ON beta_subscribers(status);
CREATE INDEX idx_beta_subscribers_created_at ON beta_subscribers(created_at);
```

### 5.5 Prisma Schema

```prisma
model BetaSubscriber {
  id            String    @id @default(cuid())
  email         String    @unique
  teamSize      String    @map("team_size")
  currentTool   String    @map("current_tool")
  interest      String?
  
  status        String    @default("pending")
  position      Int       @default(0)
  
  referralSource String?  @map("referral_source")
  utmCampaign    String?  @map("utm_campaign")
  
  createdAt     DateTime  @default(now()) @map("created_at")
  invitedAt     DateTime? @map("invited_at")
  activatedAt   DateTime? @map("activated_at")
  
  @@map("beta_subscribers")
}
```

---

## 6. Emails Transactionnels

### 6.1 Service

**Resend** (gratuit jusqu'à 3 000 emails/mois)

### 6.2 Emails à Configurer

| Email | Trigger | Template |
|-------|---------|----------|
| Bienvenue | Inscription bêta | `beta-welcome` |
| Invitation | Admin invite | `beta-invitation` |
| Activation | Compte activé | `beta-activated` |

### 6.3 Template Email : Bienvenue

**Objet :** 🎉 Bienvenue dans la bêta nexaBoard !

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 500px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #3B82F6; }
    .content { line-height: 1.6; color: #374151; }
    .button { 
      display: inline-block; 
      background: #3B82F6; 
      color: white; 
      padding: 12px 24px; 
      border-radius: 6px; 
      text-decoration: none; 
      margin: 20px 0;
    }
    .footer { margin-top: 40px; font-size: 12px; color: #9CA3AF; }
    .feature-list { margin: 20px 0; }
    .feature-list li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">nexaBoard</div>
    </div>
    
    <div class="content">
      <h1>Bienvenue dans la bêta ! 🎉</h1>
      
      <p>Bonjour,</p>
      
      <p>Merci de votre inscription à la bêta nexaBoard !</p>
      
      <p>Vous êtes inscrit avec succès. Voici ce qui va se passer :</p>
      
      <ol>
        <li>Nous préparons votre compte</li>
        <li>Vous recevrez un email d'invitation sous peu</li>
        <li>Vous pourrez commencer à utiliser nexaBoard !</li>
      </ol>
      
      <p><strong>Fonctionnalités disponibles dès maintenant :</strong></p>
      <ul class="feature-list">
        <li>✅ Gestion de tâches (Kanban + Liste)</li>
        <li>✅ Notes collaborative</li>
        <li>✅ Calendrier</li>
        <li>✅ Espaces de travail</li>
      </ul>
      
      <p><strong>Bientôt disponibles :</strong></p>
      <ul class="feature-list">
        <li>🚀 Vue Timeline (Gantt)</li>
        <li>🚀 Éditeur riche WYSIWYG</li>
        <li>🚀 Synchronisation Google Calendar</li>
        <li>🚀 Mode hors ligne</li>
      </ul>
      
      <p>En attendant, suivez-nous pour les dernières nouvelles :</p>
      
      <a href="https://twitter.com/nexaboard" class="button">Suivre @nexaboard</a>
      
      <p>À bientôt,<br>L'équipe nexaBoard</p>
    </div>
    
    <div class="footer">
      <p>Vous recevez cet email car vous vous êtes inscrit à la bêta nexaBoard.</p>
      <p>© 2026 nexaBoard. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>
```

---

## 7. Design System

### 7.1 Couleurs

```css
:root {
  /* Primary */
  --color-primary: #3B82F6;
  --color-primary-hover: #2563EB;
  --color-primary-light: #DBEAFE;
  
  /* Secondary */
  --color-secondary: #10B981;
  --color-secondary-hover: #059669;
  
  /* Neutral */
  --color-dark: #1F2937;
  --color-gray-900: #111827;
  --color-gray-700: #374151;
  --color-gray-500: #6B7280;
  --color-gray-300: #D1D5DB;
  --color-gray-100: #F3F4F6;
  --color-white: #FFFFFF;
  
  /* Status */
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
}
```

### 7.2 Typographie

```css
/* Fonts */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### 7.3 Composants

#### Bouton Primaire

```html
<button class="btn-primary">
  Rejoindre la bêta →
</button>

<style>
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}
</style>
```

#### Bouton Secondaire

```html
<button class="btn-secondary">
  En savoir plus
</button>

<style>
.btn-secondary {
  background: white;
  color: var(--color-dark);
  padding: 12px 24px;
  border-radius: 8px;
  border: 1px solid var(--color-gray-300);
  font-weight: 500;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: var(--color-gray-100);
}
</style>
```

#### Input

```html
<input 
  type="email" 
  class="input" 
  placeholder="votre@email.com"
/>

<style>
.input {
  padding: 12px 16px;
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  font-size: var(--text-base);
  width: 100%;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}
</style>
```

### 7.4 Responsive

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Colonne unique |
| Tablette | 640px - 1024px | 2 colonnes |
| Desktop | > 1024px | Layout complet |

---

## 8. Analytics

### 8.1 Outil

**PostHog** (gratuit jusqu'à 1M events/mois)

### 8.2 Événements à Tracker

| Événement | Propriétés | Quand |
|-----------|------------|-------|
| `page_viewed` | `page`, `referrer` | Chaque page |
| `cta_clicked` | `location`, `section` | Clic sur CTA |
| `beta_form_submitted` | `email`, `teamSize`, `currentTool`, `interest` | Soumission formulaire |
| `beta_form_error` | `error`, `field` | Erreur validation |
| `faq_toggled` | `question` | Ouverture FAQ |
| `feature_roadmap_viewed` | - | Scroll jusqu'à section roadmap |
| `link_clicked` | `url`, `text` | Clic lien externe |

### 8.3 Installation

```typescript
// app/layout.tsx
import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
  })
}
```

---

## 9. Déploiement

### 9.1 Railway

La landing page sera déployée sur Railway avec l'app principale.

**Configuration :**

```yaml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "pnpm --filter @nexaboard/landing start"
healthcheckPath = "/"
healthcheckTimeout = 100
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

### 9.2 Variables d'Environnement

```env
# Landing
NEXT_PUBLIC_API_URL=https://resplendent-hope-production-7e28.up.railway.app
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Resend
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=hello@nexaboard.io

# Database
DATABASE_URL=postgresql://xxxxx
```

### 9.3 Domaine

**Option 1 :** `nexaboard.io` (recommandé)
**Option 2 :** `nexaboard.app`
**Option 3 :** `landing.nexaboard.io` (sous-domaine)

---

## 10. Planning

### 10.1 Semaine 1

| Jour | Tâche | Durée |
|------|-------|-------|
| Lun | Setup app landing dans monorepo | 2h |
| Lun | Configuration Tailwind + fonts | 1h |
| Mar | Header + Hero section | 3h |
| Mar | Formulaire bêta (frontend) | 2h |
| Mer | Features section | 2h |
| Mer | How it works section | 1h |
| Jeu | Pricing section | 2h |
| Jeu | FAQ section | 1h |
| Ven | Footer + Social proof | 2h |
| Ven | API backend `/beta/subscribe` | 3h |
| Sam | Email template (Resend) | 2h |
| Sam | Tests responsive | 2h |
| Dim | Déploiement + QA | 2h |

**Total estimé : ~24 heures**

### 10.2 Checklist de Livraison

- [ ] Landing page responsive
- [ ] Formulaire fonctionne
- [ ] Validation côté client
- [ ] API backend opérationnelle
- [ ] Email de confirmation envoyé
- [ ] Page `/merci` affichée
- [ ] Analytics configurés
- [ ] SEO basics (title, meta, OG)
- [ ] Temps de chargement < 3s
- [ ] Lien "Connexion" fonctionne
- [ ] Section Features clairement distinguée (✅ vs 🚀)
- [ ] FAQ mise à jour avec section roadmap
- [ ] Pricing clarify "toutes les features incluses"
- [ ] Email template mis à jour avec roadmap

---

## Annexe

### A. Références

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Resend](https://resend.com/docs)
- [PostHog](https://posthog.com/docs)

### B. Contacts

| Rôle | Nom | Email |
|------|-----|-------|
| Développeur | Ibrahim | ibrahim@nexaboard.io |
| Support | - | support@nexaboard.io |

---

**Document validé par :**

_________________________  
Nom : Ibrahim  
Rôle : Founder  
Date : 10 septembre 2026
```