# Scénario de test utilisateur — petite équipe

Ce scénario vérifie le parcours principal d'une équipe de trois personnes dans le MVP nexaBoard.

## Équipe de test

| Personne | Compte | Rôle |
|---|---|---|
| Sarah Martin | `sarah@example.com` | Propriétaire du workspace |
| Karim Diallo | `karim@example.com` | Administrateur |
| Lina Bernard | `lina@example.com` | Membre |

Créer les trois comptes avant de commencer. L'ajout d'un membre nécessite que son compte existe déjà.

## Préparation

1. Démarrer l'API, le frontend, PostgreSQL et Redis.
2. Ouvrir le frontend dans trois profils de navigateur séparés, ou utiliser une fenêtre privée par compte.
3. Se connecter avec Sarah dans le premier profil.
4. Depuis la barre latérale du dashboard, cliquer sur **+ Nouveau workspace** et créer **Lancement produit**.
5. Depuis **Équipe**, ajouter Karim avec le rôle **Administrateur**, puis Lina avec le rôle **Membre**.
6. Vérifier que les trois membres apparaissent avec le bon rôle.

## Parcours principal

### 1. Configurer le workspace

Depuis le profil de Sarah :

1. Ouvrir **Équipe**.
2. Modifier le nom en **Lancement produit — Q4**.
3. Ajouter la description : `Préparer la sortie de notre nouvelle fonctionnalité.`
4. Enregistrer.

**Résultat attendu :** le nouveau nom et la description sont visibles après rechargement. Le workspace reste sélectionné dans la barre latérale.

### 2. Créer un projet

Depuis le profil de Sarah :

1. Ouvrir **Projets**.
2. Créer **Version bêta**.
3. Ajouter la description `Préparation de la bêta publique`.
4. Choisir une couleur.

**Résultat attendu :** le projet apparaît dans la liste avec ses compteurs de tâches et de notes à zéro.

### 3. Créer les labels

Depuis le profil de Sarah ou Karim :

1. Ouvrir **Équipe**.
2. Créer le label `Bug` en rouge.
3. Créer le label `Design` en violet.

**Résultat attendu :** les deux labels apparaissent dans la section des labels. Un membre standard ne doit pas pouvoir créer ou supprimer un label.

### 4. Créer et assigner des tâches

Depuis le profil de Sarah, dans **Tâches** :

1. Créer `Corriger le formulaire d'inscription`.
2. Sélectionner le projet **Version bêta**.
3. Choisir la priorité **Urgente**.
4. Assigner la tâche à Karim.
5. Ajouter le label `Bug`.
6. Définir une échéance à demain.
7. Créer la tâche.

Créer ensuite :

| Tâche | Assigné | Label | Priorité |
|---|---|---|---|
| Préparer les visuels de la page d'accueil | Lina | Design | Haute |
| Vérifier le parcours de connexion | Karim | Bug | Moyenne |

**Résultat attendu :** les tâches apparaissent dans la liste avec leur projet, priorité, assigné et label. La vue Kanban les place dans la colonne **À faire**.

### 5. Vérifier le travail d'un membre

Depuis le profil de Karim :

1. Recharger le dashboard.
2. Ouvrir **Tâches**.
3. Ouvrir `Corriger le formulaire d'inscription`.
4. Modifier son statut en **En cours**.
5. Retirer le label `Bug` et ajouter `Design`.
6. Enregistrer.

**Résultat attendu :** Sarah voit les mêmes changements après rechargement. Le dashboard met à jour le compteur des tâches actives.

### 6. Ajouter une note de projet

Depuis le profil de Lina :

1. Ouvrir **Notes**.
2. Créer `Checklist de la bêta`.
3. Écrire une checklist en Markdown.
4. Associer la note au projet **Version bêta**.

**Résultat attendu :** la note apparaît avec le projet associé et sa date de modification.

### 7. Ajouter un événement calendrier

Depuis le profil de Sarah :

1. Ouvrir **Calendrier**.
2. Créer `Réunion de lancement`.
3. Définir une date et une durée d'une heure.
4. Enregistrer.

**Résultat attendu :** l'événement apparaît dans le mois courant et reste visible pour les membres du workspace.

## Vérifications d'autorisation

1. Se connecter avec Lina.
2. Vérifier que Lina peut consulter les projets, tâches, notes et événements du workspace.
3. Vérifier que Lina ne peut pas modifier le workspace.
4. Vérifier que Lina ne peut pas créer ou supprimer un label.
5. Vérifier que Lina ne peut pas retirer un membre.
6. Depuis un autre workspace, vérifier qu'aucune donnée du workspace **Lancement produit — Q4** n'est visible.

## Vérifications de session

1. Se déconnecter.
2. Vérifier le retour vers `/auth/login`.
3. Se reconnecter.
4. Recharger une page protégée.
5. Vérifier que la session est conservée grâce au refresh token.
6. Se déconnecter depuis un autre profil et vérifier que les données restent isolées entre les comptes.

## Critères d'acceptation

Le MVP est acceptable pour les testeurs si :

- aucun écran principal ne renvoie une erreur `404`, `400` ou `500` lors du parcours ;
- les données affichées correspondent toujours au workspace sélectionné ;
- les créations et modifications restent visibles après rechargement ;
- les assignations et labels sont conservés ;
- les rôles empêchent les actions administratives non autorisées ;
- la déconnexion et la reconnexion fonctionnent ;
- les messages d'erreur sont compréhensibles et l'interface ne reste pas bloquée en chargement.

## Rapport de bug

Pour chaque anomalie, noter :

- le compte utilisé et son rôle ;
- la page et l'action effectuée ;
- les données saisies ;
- le résultat attendu ;
- le résultat obtenu ;
- la date et l'heure ;
- une capture d'écran ou la réponse réseau si disponible.
