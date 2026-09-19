# Cahier des Charges de Référence — Landing Page & Moteur d'Acquisition Bêta nexaBoard

**Produit :** nexaBoard (SaaS de productivité tout-en-un pour petites équipes)  
**Version :** 2.0 (SaaS Grade & Conversion Architecture)  
**Date :** 19 septembre 2026  
**Auteur :** Équipe Produit & Growth nexaBoard  
**Statut :** Validé pour Implémentation  

---

## Sommaire Exécutif

1. [Vision Produit, Positionnement & Psychologie Marketing](#1-vision-produit-positionnement--psychologie-marketing)
2. [Architecture Cognitive & Parcours de Conversion](#2-architecture-cognitive--parcours-de-conversion)
3. [Spécifications Détaillées Section par Section](#3-spécifications-détaillées-section-par-section)
4. [Le Moteur de Conversion : Formulaire & Progressive Profiling](#4-le-moteur-de-conversion--formulaire--progressive-profiling)
5. [Parcours Post-Conversion & Viralité (Page `/merci`)](#5-parcours-post-conversion--viralité-page-merci)
6. [Design System, UI/UX & Micro-Interactions](#6-design-system-uiux--micro-interactions)
7. [Architecture Technique & Performance Web](#7-architecture-technique--performance-web)
8. [Backend, API & Modélisation des Données](#8-backend-api--modélisation-des-données)
9. [Stratégie d'Emails Transactionnels & Nurturing](#9-stratégie-demails-transactionnels--nurturing)
10. [Plan de Mesure, Taxonomie Analytics & Conformité RGPD](#10-plan-de-mesure-taxonomie-analytics--conformité-rgpd)
11. [Matrice de Recette & Critères d'Acceptation](#11-matrice-de-recette--critères-dacceptation)

---

## 1. Vision Produit, Positionnement & Psychologie Marketing

### 1.1 Le Diagnostic de Marché (Jobs-to-be-Done)
Les petites équipes de 5 à 20 collaborateurs (startups, agences créatives, équipes produit, cabinets de conseil) font face à ce que l'industrie appelle le **« SaaS Sprawl »** (la prolifération anarchique des logiciels) :
* Elles utilisent en moyenne 4 à 6 outils déconnectés : Trello pour le Kanban, Notion pour les wikis, Google Calendar pour les réunions, Todoist pour les tâches personnelles, Slack pour échanger.
* **Conséquences directes** : Perte de 2,5 heures par semaine et par employé à switcher de contexte, informations silotées, doublons, et coûts d'abonnements cumulés exorbitants (entre 40 € et 90 € par utilisateur/mois).
* **Les alternatives existantes échouent auprès de cette cible** :
  * *Notion* : Trop malléable, devient rapidement un labyrinthe sans gouvernance stricte, courbe d'apprentissage rebutante.
  * *Asana / Monday / ClickUp* : Usines à gaz sur-paramétrées créées pour les grands comptes de 200+ personnes, trop chères et trop rigides.
  * *Trello* : Trop limité, impose l'achat de multiples *power-ups* pour avoir des fonctionnalités basiques (calendrier, sous-tâches, champs personnalisés).

### 1.2 La Proposition Unique de Valeur (UVP)
> **« Le premier espace de travail unifié qui rassemble vos tâches, vos notes et votre calendrier dans une interface sans friction, opérationnelle en 3 minutes et sans formation. »**

### 1.3 Les 6 Leviers Psychologiques et Biais Cognitifs appliqués à la Landing Page
1. **L'Aversion à la Perte & l'Effet d'Urgence Éthique (Scarcity & Early Adopter Cohort)** :
   * Au lieu d'une banale "liste d'attente", mise en place d'un programme fermé : **« La Promotion Pionnière (Cohorte des 100 premières équipes) »**.
   * Incitation majeure : *Accès gratuit et illimité à vie au Plan Pro* ou *1 an de Plan Pro offert* pour les équipes qui participent activement aux retours d'expérience.
   * Compteur dynamique transparent de places restantes (ex. *"Plus que 34 places disponibles dans la cohorte Bêta"*).
2. **La Réduction du Coût Cognitif (Cognitive Ease)** :
   * Zéro jargon technique complexe.
   * Démonstration visuelle immédiate du produit dès le premier écran (Hero) : l'utilisateur comprend en moins de 5 secondes comment fonctionne l'outil sans avoir à lire un seul paragraphe de documentation.
3. **Le Principe de Réciprocité & Transparence Radicale** :
   * Distinction honnête entre ce qui est disponible immédiatement (MVP opérationnel) et ce qui est sur la feuille de route (Timeline, intégrations avancées, mode hors-ligne).
   * Cette sincérité neutralise le scepticisme habituel des acheteurs B2B envers les faux arguments marketing.
4. **L'Effet de Contraste et d'Ancrage (Contrast Effect)** :
   * Mise en scène du tableau comparatif chiffré : comparaison du coût total mensuel (Notion + Trello + Asana = ~45 €/utilisateur/mois) vs nexaBoard (0 € en bêta puis 12 €/mois par équipe).
5. **L'Engagement Progressif (Micro-commitments & Foot-in-the-Door)** :
   * Ne jamais forcer un utilisateur à remplir 5 champs contraignants dès le premier coup d'œil.
   * Capture de l'email en 1 clic dans le Hero, puis qualification ergonomique par micro-choix (chips cliquables) en étape 2.
6. **L'Inversion Complète du Risque (Risk Reversal)** :
   * Mentions visibles en permanence : *« 100% Gratuit pendant la bêta • Aucune carte bancaire requise • Export de vos données en 1 clic (JSON/Markdown) • Données hébergées en France / RGPD strict »*.

---

## 2. Architecture Cognitive & Parcours de Conversion

La landing page suit un arc narratif éprouvé en marketing SaaS : **Problème → Agitation → Solution → Preuve Visuelle → Comparaison → Offre Irrésistible → Réassurance**.

```
[ HEADER ] : Navigation fluide + Indicateur de statut Bêta + CTA Connexion & Inscription
     │
[ SECTION 1 : HERO ] : Promesse forte + Formulaire Ultra-light + Showcase Visuel Interactif
     │
[ SECTION 2 : TRUST & SOUVERAINETÉ ] : Logos/Tech Stack + Hébergement FR/UE + Chiffres vérifiables
     │
[ SECTION 3 : PAIN VS GAIN ] : La fin du chaos des 5 outils ouverts en permanence
     │
[ SECTION 4 : BENTO SHOWCASE ] : Les 4 piliers fonctionnels (Tâches, Notes, Calendrier, Équipe)
     │
[ SECTION 5 : CALCULATEUR ROI ] : Économies financières et gain d'heures calculés en direct
     │
[ SECTION 6 : TABLEAU COMPARATIF ] : nexaBoard face à Notion, Trello et Asana
     │
[ SECTION 7 : OFFRE PIONNIÈRE & PRIX ] : Clarté totale, avantage Early Adopter garanti
     │
[ SECTION 8 : ROADMAP TRANSPARENTE ] : Ce qui tourne aujourd'hui vs Ce qui arrive demain
     │
[ SECTION 9 : FAQ ANTI-OBJECTIONS ] : Sécurité, migration, pérennité, engagement
     │
[ SECTION 10 : FINAL CALL-TO-ACTION ] : Dernière opportunité d'embarquer dans la cohorte
     │
[ FOOTER ] : Mentions légales, conformité RGPD, liens produit et statut système
```

---

## 3. Spécifications Détaillées Section par Section

### 3.1 Header Sticky (Navigation & Quick Conversion)
* **Composants :**
  * **Logo nexaBoard** : Icône vectorielle moderne + Logotype avec badge discret `BETA v0.1`.
  * **Ancres de navigation** : `Fonctionnalités`, `Comparatif`, `Tarifs`, `Roadmap`, `FAQ`.
  * **Zone d'actions** :
    * Bouton secondaire discret : *« Se connecter »* (Lien externe direct vers `https://app.nexaboard.io/auth/login` ou portail web).
    * Bouton primaire : *« Rejoindre la Bêta »* (Scroll doux animé vers le formulaire ou ouverture de la modale d'inscription).
* **Comportement UX :**
  * Fond translucide avec flou d'arrière-plan (`backdrop-blur-md bg-white/80 dark:bg-gray-950/80`).
  * Réduction légère du padding au scroll pour maximiser l'espace de lecture.

---

### 3.2 Section 1 : Le Hero (Above The Fold)
L'espace au-dessus de la ligne de flottaison doit capter l'attention en moins de 3 secondes.

* **Tagline de contexte (Eyebrow Badge) :**
  * Composant pilule animée : `✨ Promotion Bêta Ouverte • Plus que 34 places pour les équipes pionnières`.
* **Titre Principal (H1) :**
  * Formule : *« La productivité enfin simple pour les petites équipes. »*
  * Sous-accroche visuelle en dégradé de texte : *« Moins de bruit, plus d'impact. »*
* **Sous-titre explicatif (P) :**
  * *« nexaBoard réunit vos tableaux de tâches, vos notes d'équipe et votre calendrier dans une plateforme ultra-rapide. Fini les allers-retours entre 5 abonnements payants. »*
* **Formulaire d'action Hero (Étape 1) :**
  * Champ unique : Input Email avec icône courrier + bouton intégré `Obtenir mon accès Bêta →`.
  * Micro-copie de réassurance sous le champ :
    * `✓ 100% Gratuit` • `✓ Zéro carte bancaire` • `✓ Configuration en 3 min` • `✓ Données en France 🇫🇷`.
* **Le Product Showcase (Aperçu Produit Haute Définition) :**
  * Écran réaliste (fausse fenêtre d'application avec boutons mac macOS rouge/jaune/vert et barre latérale élégante).
  * Affichage d'un tableau Kanban actif nexaBoard avec colonnes (`À faire`, `En cours`, `Terminé`), cartes avec étiquettes de couleur, avatars des membres, et volet droit affichant une note Markdown connectée à la tâche en cours.
  * Effet visuel : Perspective 3D subtile (`transform-gpu perspective-1000 rotate-x-2`), halo lumineux dégradé (gradient glow bleu/violet) en arrière-plan.

---

### 3.3 Section 2 : Barre de Confiance & Souveraineté
Remplacement des faux témoignages par des gages de crédibilité tangibles :
* **Piliers de réassurance :**
  * 🔒 **Hébergement Souverain** : Serveurs basés en France (Paris) / Chiffrement AES-256 au repos & TLS 1.3.
  * ⚡ **Performance Native** : Architecture Next.js 14 + NestJS, temps de chargement inférieur à 100 ms.
  * 📦 **Zéro Lock-in** : Export total de vos espaces, tâches et notes en formats standards (CSV, Markdown, JSON).
  * 👥 **Conçu pour 5-20 personnes** : Pensé spécifiquement pour la collaboration humaine sans hiérarchie lourde.

---

### 3.4 Section 3 : Le Contraste « Avant / Après » (Pain vs Gain)
Mise en miroir visuelle des frustrations quotidiennes face à la sérénité apportée par nexaBoard.

| Le quotidien éclaté (Avant nexaBoard) | La simplicité fluide (Avec nexaBoard) |
| :--- | :--- |
| ❌ 5 onglets ouverts en permanence (Trello, Notion, GCal, Todoist, Slack). | ✅ Un onglet unique et rapide pour piloter toute la semaine de l'équipe. |
| ❌ Des tâches orphelines sans documentation associée ni contexte clair. | ✅ Chaque tâche est directement liée à sa note de cadrage et son échéance calendrier. |
| ❌ 45 € à 80 € par utilisateur chaque mois pour des fonctions sous-utilisées. | ✅ Une solution pensée à coût juste, sans frais cachés par utilisateur. |
| ❌ Nouveaux employés perdus pendant 2 semaines face à des wikis labyrinthiques. | ✅ Prise en main en 3 minutes chrono sans aucun besoin de tutoriel ou formation. |

---

### 3.5 Section 4 : Le Bento Grid des Fonctionnalités (Showcase Interactif)
Organisation moderne en grille de type "Bento Box" mettant en valeur les piliers du produit :

1. **Bloc 1 (Grand Format) : Gestion des Tâches Agile (Kanban & Listes)**
   * Colonnes personnalisables, sous-tâches, assignations multiples, niveaux d'urgence, filtres instantanés.
   * Visualisation interactive : aperçu du drag-and-drop de cartes.
2. **Bloc 2 (Format Carré) : Notes & Base de Connaissances**
   * Éditeur structuré avec prise en charge intégrale du Markdown, hiérarchie claire par projet, partage en équipe en lecture/écriture.
3. **Bloc 3 (Format Carré) : Calendrier d'Équipe Synchronisé**
   * Visualisation claire des échéances de sprints, des jalons de projets et des livrables sans encombrement.
4. **Bloc 4 (Format Large) : Espaces de Travail Multi-Projets & Rôles**
   * Permissions adaptées (`Propriétaire`, `Admin`, `Membre`, `Observateur`), tableaux de bord statistiques avec suivi de l'avancement global en temps réel.

---

### 3.6 Section 5 : Calculateur d'Économies « Anti-SaaS Sprawl »
Un composant interactif dynamique permettant au visiteur d'évaluer concrètement ses gains :
* **Curseur interactif (Slider)** : Taille de l'équipe (de 5 à 25 personnes).
* **Cases à cocher des outils actuels** : Notion (10 €/u), Trello Pro (6 €/u), Asana Starter (11 €/u), Todoist Business (8 €/u).
* **Calcul en temps réel :**
  * Montant économisé par an (ex. : *« Votre équipe de 10 personnes économise jusqu'à 3 240 € / an »*).
  * Heures de distraction évitées (estimées à 120 heures par an et par collaborateur).
* **CTA dédié** : `Réserver notre place bêta et stopper les frais →`.

---

### 3.7 Section 6 : Tableau Comparatif Sans Concession
Tableau clair démontrant le positionnement précis de nexaBoard :

| Critères d'évaluation | nexaBoard | Notion | Trello | Asana |
| :--- | :---: | :---: | :---: | :---: |
| **Prise en main immédiate (< 5 min)** | **✅ OUI** | ❌ Complexe | ✅ OUI | ❌ Lourd |
| **Tâches + Notes + Calendrier unifiés** | **✅ OUI** | ⚠️ Bricolé | ❌ Tâches seules | ⚠️ Limité |
| **Simplicité sans formation requise** | **✅ OUI** | ❌ Formation requise | ✅ OUI | ❌ Formation requise |
| **Vitesse d'affichage (< 150 ms)** | **✅ Ultra-rapide** | ❌ Lenteurs | ⚠️ Moyen | ⚠️ Moyen |
| **Hébergement souverain européen** | **✅ France (Paris)** | ❌ US | ❌ US | ❌ US |
| **Tarif indicatif par mois (équipe de 10)** | **12 € total (ou 0 € en Bêta)** | ~100 € / mois | ~60 € / mois | ~110 € / mois |

---

### 3.8 Section 7 : L'Offre Pionnière & Transparence Tarifaire
La tarification doit être lisible, honnête et sans ambiguïté.

* **Bannière d'accès Bêta :**
  * *« Durant toute la phase bêta, l'accès est 100% gratuit avec l'ensemble des fonctionnalités débloquées. »*
* **L'Avantage Fondateur (Early Adopter Guarantee) :**
  * *« En tant que membre de la première cohorte bêta, vous bénéficierez de 1 an de Plan Pro offert lors de la bascule commerciale, ainsi que d'un statut "Membre Fondateur" garantissant un tarif préférentiel à vie. »*
* **Grille des plans futurs :**
  * **Plan Découverte (0 € / mois)** : Idéal pour démarrer (jusqu'à 3 projets, 5 membres d'équipe, 1 Go de documents, support communautaire).
  * **Plan Équipe Pro (12 € / mois par équipe — et non par utilisateur)** : Projets illimités, membres illimités (jusqu'à 20), 25 Go de stockage, support prioritaire, accès anticipé aux nouvelles fonctionnalités.

---

### 3.9 Section 8 : Roadmap Publique et Transparente
Démontrer la dynamique produit tout en restant rigoureusement exact sur les engagements :

* **✅ Déjà opérationnel dans votre espace de travail :**
  * Authentification sécurisée (JWT, tokens de rafraîchissement, vérification e-mail).
  * Tableaux Kanban et listes avec filtres et statuts.
  * Prise de notes structurée en Markdown.
  * Calendrier d'agenda connecté.
  * Gestion des rôles d'équipe et espaces de travail isolés.
* **🚀 Prochaines étapes de la Feuille de Route (Phase 2 & 3) :**
  * Vue chronologique Timeline / Gantt interactive.
  * Synchronisation bi-directionnelle avec Google Calendar & Outlook.
  * Mode hors-ligne avec réconciliation locale automatique.
  * Application mobile progressive (PWA).

---

### 3.10 Section 9 : FAQ Anti-Objections
Questions formulées exactement telles que les prospects se les posent :

1. **« Qu'est-ce que cela implique de participer à la bêta privée ? »**
   * *Réponse :* Vous bénéficiez d'un accès immédiat à un outil fonctionnel pour votre équipe. En échange, nous attendons vos avis honnêtes sur ce qui vous plaît et ce qu'il faut améliorer.
2. **« Mes données sont-elles en sécurité et puis-je les récupérer si je pars ? »**
   * *Réponse :* Vos données sont chiffrées (AES-256) et hébergées en France sur une infrastructure souveraine. Vous pouvez exporter l'intégralité de vos notes (Markdown), tâches (CSV/JSON) en 1 clic à tout moment. Zéro enfermement.
3. **« Est-ce vraiment gratuit ? Y aura-t-il une mauvaise surprise ? »**
   * *Réponse :* C'est entièrement gratuit pendant toute la période de test. Nous ne demandons aucune carte bancaire à l'inscription. Vous serez prévenus plusieurs semaines avant le lancement officiel et disposerez d'une offre privilégiée.
4. **« Combien de temps prend la migration depuis Trello ou Notion ? »**
   * *Réponse :* Notre structure est immédiatement familière. Vous créez vos projets et invitez vos collaborateurs en moins de 3 minutes. Un module d'import automatique est en cours de finalisation.

---

### 3.11 Section 10 : Final Call-to-Action
* **Visuel épuré centré sur l'action :**
  * Titre : *« Prêt à désencombrer le quotidien de votre équipe ? »*
  * Répétition du formulaire instantané avec rappel des places de la cohorte.
  * Bouton à fort contraste : `Rejoindre la Bêta Privée →`.

---

### 3.12 Footer
* Liens légaux : Politique de confidentialité (`/privacy`), Conditions Générales d'Utilisation (`/terms`), Mentions légales.
* Liens communauté & support : Contact fondateur (`contact@nexaboard.io`), GitHub, Twitter/X.
* Indicateur vert en direct : `● Tous les systèmes opérationnels (API & Dashboard)`.
* Mention copyright : *« © 2026 nexaBoard. Conçu avec rigueur en France. »*

---

## 4. Le Moteur de Conversion : Formulaire & Progressive Profiling

### 4.1 La Stratégie du Profilage Progressif en 2 Temps
Pour éliminer la perte de conversion causée par les formulaires trop longs :

```
[ ÉCRAN HERO ] 
  Saisie de l'Email uniquement
  Ex : [ alex@startup.fr ] ──► [ Clic : Obtenir mon accès Bêta ]
                                            │
                                            ▼
[ MODALE DE QUALIFICATION INSTANTANÉE (Temps 2 : 10 secondes) ]
  « Bravo ! Votre place est pré-réservée. 
    Deux questions rapides pour personnaliser votre espace : »
  
  1. Taille de votre équipe :
     [ (1-5) ]  [ (6-10) ]  [ (11-20) ]  [ (20+) ]   (Chips cliquables en 1 clic)
  
  2. Votre outil principal actuel :
     [ Trello ]  [ Notion ]  [ Asana ]  [ ClickUp ]  [ Autre / Rien ]
  
  3. (Optionnel) Votre priorité absolue :
     [ Gagner du temps sur les tâches ]  [ Avoir des notes claires ]  [ Économiser sur les SaaS ]
  
  ──► [ Finaliser mon inscription et accéder à la Bêta ]
```

### 4.2 Schéma de Validation Zod & Types

```typescript
import { z } from 'zod';

export const betaLeadSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Veuillez saisir une adresse e-mail professionnelle valide' }),
  teamSize: z.enum(['1-5', '6-10', '11-20', '20+'], {
    errorMap: () => ({ message: 'Veuillez indiquer la taille de votre équipe' }),
  }),
  currentTool: z.enum(['trello', 'notion', 'asana', 'clickup', 'other', 'none'], {
    errorMap: () => ({ message: 'Veuillez sélectionner votre outil actuel' }),
  }),
  interest: z
    .enum(['tasks', 'notes', 'calendar', 'cost_savings', 'all_in_one'])
    .optional(),
  referralCode: z.string().optional(),
});

export type BetaLeadInput = z.infer<typeof betaLeadSchema>;
```

---

## 5. Parcours Post-Conversion & Viralité (Page `/merci`)

Une page de remerciement ne doit jamais être un cul-de-sac. Elle doit transformer le nouvel inscrit en ambassadeur actif de nexaBoard grâce à une boucle virale éthique.

### 5.1 Architecture de la Page `/merci`
1. **Accusé de réception valorisant :**
   * Animation de succès (checkmark animée Framer Motion).
   * Titre : *« Vous êtes dans la liste des pionniers nexaBoard ! »*
   * Carte d'adhésion virtuelle avec :
     * Le rang attribué : ex. **Position #42 sur la liste d'attente**.
     * Badge : **Early Adopter Cohort**.
2. **La Boucle Virale (Move up in line / Referral Mechanism) :**
   * *« Envie d'accéder à votre espace sans attendre ? »*
   * Mécanisme : Invitez 2 collègues ou confrères chefs de projet. Chaque inscription via votre lien personnalisé vous fait gagner **10 places dans la file**.
   * Champ avec bouton `Copier mon lien de parrainage unique` (ex. `https://nexaboard.io?ref=BETA-42A9F`).
   * Boutons de partage en 1 clic : Partager sur LinkedIn, Twitter/X, WhatsApp, Email.
3. **Accès au Cercle Privé (Discord / Slack Communautaire) :**
   * Lien pour rejoindre le canal privé des testeurs et échanger en direct avec l'équipe fondatrice.

---

## 6. Design System, UI/UX & Micro-Interactions

### 6.1 Tokens de Design & Couleurs
L'identité visuelle combine professionnalisme SaaS B2B et fraîcheur moderne (proche de Linear ou Raycast).

```css
:root {
  /* Nuances Principales */
  --primary-50: #EEF2FF;
  --primary-100: #E0E7FF;
  --primary-500: #6366F1; /* Indigo moderne */
  --primary-600: #4F46E5; /* Couleur d'action principale */
  --primary-700: #4338CA;
  
  /* Accents de Conversion & Succès */
  --accent-emerald: #10B981; /* Vert réassurance / disponible */
  --accent-amber: #F59E0B;   /* Alerte / places limitées */
  --accent-purple: #8B5CF6;  /* Roadmap & innovation */
  
  /* Neutres & Surfaces */
  --surface-canvas: #FFFFFF;
  --surface-card: #F8FAFC;
  --surface-border: #E2E8F0;
  --text-headline: #0F172A;
  --text-body: #334155;
  --text-muted: #64748B;
}
```

### 6.2 Micro-Interactions (Framer Motion)
* **Smooth Entrance (Staggered)** : Les éléments du Hero apparaissent en fondu enchaîné ascendant (`y: [20, 0]`, `opacity: [0, 1]`, transition de 0.4s).
* **Hover Lift sur les Cartes** : Élévation légère des cartes de fonctionnalités avec renforcement de l'ombre portée (`translateY(-4px)` et `box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08)`).
* **Bouton d'Action Pulsant** : Lueur d'accent douce et subtile autour du bouton principal pour guider le regard sans être agressif.
* **Accordéon FAQ fluide** : Dépliage animé avec gestion native de l'accessibilité (`aria-expanded`).

---

## 7. Architecture Technique & Performance Web

### 7.1 Stack Technique Frontend (`apps/landing`)
* **Framework** : Next.js 14 avec **App Router**.
* **Styling** : Tailwind CSS avec classes utilitaires optimisées via PurgeCSS.
* **Composants d'Animation** : `framer-motion` version 11.
* **Gestion du Formulaire** : `react-hook-form` avec `@hookform/resolvers/zod`.
* **Icons** : `lucide-react` (icônes vectorielles légères et cohérentes).

### 7.2 Objectifs Core Web Vitals (Performance Maximale)
* **LCP (Largest Contentful Paint)** : < 1,2 seconde (optimisation des polices via `next/font`, pas d'images lourdes non optimisées).
* **INP (Interaction to Next Paint)** : < 80 millisecondes (formulaire réactif sans blocage du thread JS).
* **CLS (Cumulative Layout Shift)** : 0.00 (réservation d'espace fixe pour les éléments dynamiques).
* **Taille du Bundle JS initial** : < 85 Ko gzip.

### 7.3 Référencement Naturel (SEO) & Partage Social
* **Balises Meta Principales** :
  * Title : `nexaBoard — L'espace de travail unifié pour les équipes de 5 à 20 personnes`
  * Description : `Fini la jonglerie entre Trello, Notion et Google Calendar. Centralisez vos tâches, vos notes et vos plannings en 3 minutes avec nexaBoard.`
* **Open Graph & Twitter Cards** :
  * Image dédiée haute résolution (`1200x630px`) hébergée sur `/og-image.png` présentant l'interface épurée et le slogan.
* **Données Structurées JSON-LD (`schema.org`)** :
  * Typage `SoftwareApplication`, `OperatingSystem: Web Browser`, `ApplicationCategory: BusinessApplication`, `Offers: { price: 0, priceCurrency: EUR }`.

---

## 8. Backend, API & Modélisation des Données

### 8.1 Spécification de l'Endpoint Backend
* **Route :** `POST /api/v1/beta/subscribe`
* **Contrôleur :** `LeadsController` dans `apps/api/src/modules/leads/`
* **Limitation de Débit (Throttling) :** Protection contre le spam (max 3 requêtes / 60 secondes par IP).

#### Payload de la Requête (JSON)
```json
{
  "email": "sarah.martin@startup-agile.fr",
  "teamSize": "6-10",
  "currentTool": "notion",
  "interest": "all_in_one",
  "referralCode": "BETA-018X"
}
```

#### Réponse HTTP 201 (Création réussie)
```json
{
  "success": true,
  "message": "Inscription réussie à la cohorte Bêta !",
  "data": {
    "id": "cly78a01z000008l0g8f1bc42",
    "email": "sarah.martin@startup-agile.fr",
    "position": 43,
    "referralCode": "BETA-43F9A",
    "referralLink": "https://nexaboard.io?ref=BETA-43F9A"
  }
}
```

#### Réponse HTTP 409 (Email déjà inscrit)
```json
{
  "success": false,
  "error": {
    "code": "ALREADY_SUBSCRIBED",
    "message": "Cette adresse e-mail est déjà inscrite dans la cohorte bêta.",
    "position": 14
  }
}
```

### 8.2 Modèle de Données Prisma (`BetaSubscriber`)
Le modèle existant dans `apps/api/prisma/schema.prisma` prend en charge :
* `id` : Identifiant unique cuid.
* `email` : Email unique et normalisé en minuscules.
* `teamSize` : Taille de l'équipe (`1-5`, `6-10`, `11-20`, `20+`).
* `currentTool` : Outil de provenance (`trello`, `notion`, `asana`, `clickup`, `other`, `none`).
* `interest` : Champ d'intérêt prioritaire.
* `status` : Cycle de vie (`pending`, `invited`, `activated`, `churned`).
* `position` : Rang chronologique dans la file d'attente.
* `referralSource`, `utmCampaign`, `userAgent`, `ipAddress` : Métadonnées d'acquisition.
* `createdAt`, `invitedAt`, `activatedAt` : Horodatages de traçabilité.

---

## 9. Stratégie d'Emails Transactionnels & Nurturing

L'inscription ne s'arrête pas au navigateur. Un onboarding e-mail haut de gamme renforce la crédibilité du SaaS.

### 9.1 Séquence d'Onboarding Bêta (Drip)
* **Email J+0 (Instantané) : Confirmation & Numéro de Dossier Pionnier**
  * Objet : `🎉 Confirmation de votre place Bêta nexaBoard (#{{position}})`
  * Contenu : Remerciement personnalisé du fondateur, récapitulatif de la position, lien de parrainage pour remonter la file, invitation au Discord/Slack.
* **Email J+3 : Coulisses & Présentation Interactive**
  * Objet : `Comment nous avons conçu nexaBoard pour vous faire gagner 2h par semaine`
  * Contenu : Visite guidée en 2 minutes en vidéo ou GIF interactif de l'interface Kanban et Notes.
* **Email J+7 : Activation de l'Espace de Travail**
  * Objet : `🚀 Vos identifiants pour démarrer sur nexaBoard Bêta`
  * Contenu : Lien direct d'activation et création de l'espace de travail avec l'équipe.

### 9.2 Gabarit HTML de l'Email de Bienvenue (Resend)
Le template utilise un style sobre, lisible sur mobile et compatible avec tous les clients mail (Gmail, Apple Mail, Outlook) :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue dans la Bêta nexaBoard</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 32px 16px; color: #1e293b;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <tr>
      <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #f1f5f9;">
        <span style="font-size: 24px; font-weight: 800; color: #4f46e5; letter-spacing: -0.5px;">nexaBoard</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <h1 style="font-size: 20px; font-weight: 700; margin: 0 0 16px; color: #0f172a;">Bienvenue dans la cohorte pionnière ! 🎉</h1>
        <p style="font-size: 15px; line-height: 24px; margin: 0 0 20px; color: #334155;">
          Bonjour,<br><br>
          Merci d'avoir rejoint nexaBoard. Votre inscription pour votre équipe a bien été enregistrée.
        </p>
        
        <div style="background-color: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 16px 20px; text-align: center; margin: 24px 0;">
          <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; color: #4338ca; margin: 0 0 4px;">Votre position dans la file d'attente</p>
          <p style="font-size: 32px; font-weight: 800; color: #312e81; margin: 0;">#{{position}}</p>
        </div>

        <p style="font-size: 15px; line-height: 24px; margin: 0 0 20px; color: #334155;">
          <strong>Ce que vous avez débloqué :</strong>
        </p>
        <ul style="font-size: 14px; line-height: 22px; margin: 0 0 24px; padding-left: 20px; color: #475569;">
          <li>Accès prioritaire à la plateforme tout-en-un.</li>
          <li>1 an de Plan Pro offert lors du lancement officiel.</li>
          <li>Accès direct à l'équipe de développement pour co-construire les fonctionnalités.</li>
        </ul>

        <div style="text-align: center; margin: 32px 0 16px;">
          <a href="{{referralLink}}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">Remonter dans la file (Partager à un pair) →</a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8;">
        nexaBoard — Données hébergées en France. Vos données vous appartiennent.<br>
        Vous recevez cet email suite à votre demande sur nexaboard.io.
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 10. Plan de Mesure, Taxonomie Analytics & Conformité RGPD

### 10.1 Taxonomie des Événements PostHog (Tracking Précis)

| Nom de l'événement | Propriétés envoyées | Moment du déclenchement |
| :--- | :--- | :--- |
| `landing_viewed` | `referrer`, `utm_source`, `utm_campaign`, `device` | Arrivée sur la page d'accueil |
| `hero_email_submitted` | `email_domain` | Clic sur le 1er CTA du Hero |
| `modal_profiling_opened` | `source_step` | Affichage de la modale de qualification |
| `beta_lead_completed` | `team_size`, `current_tool`, `interest`, `position` | Succès création en base (201) |
| `beta_lead_error` | `error_code`, `field` | Erreur de validation ou 409 doublon |
| `pricing_calculator_used` | `team_size_input`, `calculated_savings` | Interaction avec le slider d'économies |
| `faq_item_toggled` | `question_title`, `open_state` | Ouverture d'une question de la FAQ |
| `referral_link_copied` | `user_position`, `referral_code` | Clic sur "Copier mon lien" sur `/merci` |

### 10.2 Conformité RGPD & Vie Privée
* Absence de traceurs invasifs ou cookies tiers sans consentement préalable.
* Option d'analytics respectueuse de la vie privée (PostHog configuré en modecookieless / anonymisé si nécessaire).
* Case à cocher ou mention claire sous les boutons d'envoi :  
  *« Vos données sont utilisées exclusivement pour vous transmettre vos accès à la bêta. Désinscription en 1 clic. »*

---

## 11. Matrice de Recette & Critères d'Acceptation

Pour valider le déploiement en production de la landing page révisée, l'ensemble des critères suivants doit être vérifié :

- [ ] **Ergonomie Mobile & Desktop** : Affichage fluide et impeccable sur iPhone (Safari), Android (Chrome) et résolutions desktop (1280px à 1920px).
- [ ] **Cycle de Soumission Sans Accroc** :
  - La saisie d'un email valide déclenche la modale de qualification.
  - La sélection des choix enregistre le lead dans PostgreSQL (`beta_subscribers`).
  - L'utilisateur est redirigé vers `/merci` avec son rang réel affiché.
- [ ] **Gestion des Doublons** : Un email déjà existant affiche un message bienveillant rappelant que sa place est déjà réservée.
- [ ] **Délivrance de l'Email** : L'email de confirmation HTML avec la position est envoyé via `EmailService` / Resend en moins de 10 secondes.
- [ ] **Performance Web** : Score Google Lighthouse supérieur à **95/100** sur Performance, Accessibilité, Bonnes Pratiques et SEO.
- [ ] **Navigation & Liens** : Le lien de connexion mène bien vers l'interface de login du produit, les ancres de la page défilent avec fluidité.

---
*Ce document sert de spécification contractuelle absolue pour l'implémentation de la landing page de nexaBoard.*