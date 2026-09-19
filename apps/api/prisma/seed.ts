import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean
  await prisma.timeEntry.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.taskLabel.deleteMany();
  await prisma.taskAssignee.deleteMany();
  await prisma.taskDependency.deleteMany();
  await prisma.subtask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.noteBlock.deleteMany();
  await prisma.note.deleteMany();
  await prisma.projectView.deleteMany();
  await prisma.project.deleteMany();
  await prisma.label.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.automation.deleteMany();
  await prisma.workspaceSettings.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ──────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('password123', 12);

  const alice = await prisma.user.create({
    data: {
      email: 'alice@nexaboard.io',
      passwordHash,
      firstName: 'Alice',
      lastName: 'Martin',
      timezone: 'Europe/Paris',
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@nexaboard.io',
      passwordHash,
      firstName: 'Bob',
      lastName: 'Dupont',
      timezone: 'Europe/Paris',
    },
  });

  const charlie = await prisma.user.create({
    data: {
      email: 'charlie@nexaboard.io',
      passwordHash,
      firstName: 'Charlie',
      lastName: 'Bernard',
      timezone: 'Europe/Paris',
    },
  });

  const diana = await prisma.user.create({
    data: {
      email: 'diana@nexaboard.io',
      passwordHash,
      firstName: 'Diana',
      lastName: 'Leroy',
      timezone: 'Europe/Paris',
    },
  });

  console.log('  ✅ 4 users created (alice/bob/charlie/diana@nexaboard.io, password: password123)');

  // ── Workspace ──────────────────────────────────────────
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Équipe Produit',
      slug: 'equipe-produit',
      description: "Workspace principal de l'équipe produit nexaBoard",
      plan: 'FREE',
      ownerId: alice.id,
      members: {
        create: [
          { userId: alice.id, role: 'OWNER' },
          { userId: bob.id, role: 'ADMIN' },
          { userId: charlie.id, role: 'MEMBER' },
          { userId: diana.id, role: 'MEMBER' },
        ],
      },
      settings: {
        create: { defaultView: 'KANBAN', weekStart: 1 },
      },
    },
  });

  console.log('  ✅ Workspace "Équipe Produit" with 4 members');

  // ── Labels ─────────────────────────────────────────────
  const labels = await Promise.all([
    prisma.label.create({ data: { name: 'Bug', color: '#EF4444', workspaceId: workspace.id } }),
    prisma.label.create({ data: { name: 'Feature', color: '#3B82F6', workspaceId: workspace.id } }),
    prisma.label.create({ data: { name: 'Design', color: '#8B5CF6', workspaceId: workspace.id } }),
    prisma.label.create({ data: { name: 'Backend', color: '#10B981', workspaceId: workspace.id } }),
    prisma.label.create({
      data: { name: 'Frontend', color: '#F59E0B', workspaceId: workspace.id },
    }),
    prisma.label.create({ data: { name: 'Urgent', color: '#DC2626', workspaceId: workspace.id } }),
  ]);

  console.log('  ✅ 6 labels created');

  // ── Project 1: Refonte UI ─────────────────────────────
  const projectUI = await prisma.project.create({
    data: {
      name: 'Refonte UI',
      description: "Refonte complète de l'interface utilisateur pour la v2",
      color: '#8B5CF6',
      workspaceId: workspace.id,
    },
  });

  const uiTasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Design system - Composants de base',
        description: 'Créer les composants Button, Input, Card, Badge dans Figma',
        status: 'DONE',
        priority: 'HIGH',
        projectId: projectUI.id,
        createdBy: alice.id,
        points: 5,
        order: 0,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Maquette dashboard',
        description: 'Créer la maquette du dashboard principal avec les widgets',
        status: 'DONE',
        priority: 'HIGH',
        projectId: projectUI.id,
        createdBy: alice.id,
        points: 8,
        order: 1,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implémenter la page Tasks',
        description: 'Intégrer la vue liste et kanban pour les tâches',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        projectId: projectUI.id,
        createdBy: alice.id,
        dueDate: new Date('2026-09-18'),
        points: 13,
        order: 2,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Responsive mobile - Sidebar',
        description: 'La sidebar doit être fermable sur mobile avec un menu burger',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: projectUI.id,
        createdBy: bob.id,
        dueDate: new Date('2026-09-22'),
        points: 3,
        order: 3,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Mode sombre',
        description: 'Ajouter le thème sombre avec toggle dans la sidebar',
        status: 'TODO',
        priority: 'LOW',
        projectId: projectUI.id,
        createdBy: charlie.id,
        points: 5,
        order: 4,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Bug - Le bouton submit ne fonctionne pas sur Safari',
        description: 'Sur iOS Safari, le bouton de soumission du formulaire ne répond pas',
        status: 'IN_REVIEW',
        priority: 'URGENT',
        projectId: projectUI.id,
        createdBy: diana.id,
        dueDate: new Date('2026-09-15'),
        points: 2,
        order: 5,
      },
    }),
  ]);

  // Labels sur les tâches UI
  await prisma.taskLabel.create({ data: { taskId: uiTasks[0].id, labelId: labels[1].id } }); // Feature
  await prisma.taskLabel.create({ data: { taskId: uiTasks[0].id, labelId: labels[2].id } }); // Design
  await prisma.taskLabel.create({ data: { taskId: uiTasks[2].id, labelId: labels[4].id } }); // Frontend
  await prisma.taskLabel.create({ data: { taskId: uiTasks[5].id, labelId: labels[0].id } }); // Bug
  await prisma.taskLabel.create({ data: { taskId: uiTasks[5].id, labelId: labels[5].id } }); // Urgent

  // Assignees
  await prisma.taskAssignee.create({ data: { taskId: uiTasks[0].id, userId: alice.id } });
  await prisma.taskAssignee.create({ data: { taskId: uiTasks[2].id, userId: alice.id } });
  await prisma.taskAssignee.create({ data: { taskId: uiTasks[2].id, userId: charlie.id } });
  await prisma.taskAssignee.create({ data: { taskId: uiTasks[3].id, userId: bob.id } });
  await prisma.taskAssignee.create({ data: { taskId: uiTasks[4].id, userId: charlie.id } });
  await prisma.taskAssignee.create({ data: { taskId: uiTasks[5].id, userId: diana.id } });

  console.log('  ✅ Project "Refonte UI" with 6 tasks');

  // ── Project 2: API Backend ────────────────────────────
  const projectAPI = await prisma.project.create({
    data: {
      name: 'API Backend',
      description: "Développement de l'API NestJS",
      color: '#10B981',
      workspaceId: workspace.id,
    },
  });

  const apiTasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Auth JWT + refresh tokens',
        description: 'Implémenter login, register, refresh, logout avec JWT',
        status: 'DONE',
        priority: 'HIGH',
        projectId: projectAPI.id,
        createdBy: bob.id,
        points: 8,
        order: 0,
      },
    }),
    prisma.task.create({
      data: {
        title: 'CRUD Workspaces + Members',
        description: 'API REST pour les workspaces avec gestion des membres',
        status: 'DONE',
        priority: 'HIGH',
        projectId: projectAPI.id,
        createdBy: bob.id,
        points: 5,
        order: 1,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Rate limiting global',
        description: 'Configurer throttler pour protéger les endpoints',
        status: 'DONE',
        priority: 'MEDIUM',
        projectId: projectAPI.id,
        createdBy: bob.id,
        points: 2,
        order: 2,
      },
    }),
    prisma.task.create({
      data: {
        title: 'API Notifications',
        description: 'CRUD notifications avec endpoint de lecture',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: projectAPI.id,
        createdBy: alice.id,
        dueDate: new Date('2026-09-25'),
        points: 5,
        order: 3,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Pagination & filtres avancés',
        description: 'Ajouter la pagination et les filtres sur les listes (tasks, notes)',
        status: 'TODO',
        priority: 'LOW',
        projectId: projectAPI.id,
        createdBy: bob.id,
        points: 8,
        order: 4,
      },
    }),
  ]);

  await prisma.taskLabel.create({ data: { taskId: apiTasks[0].id, labelId: labels[3].id } }); // Backend
  await prisma.taskLabel.create({ data: { taskId: apiTasks[3].id, labelId: labels[3].id } }); // Backend
  await prisma.taskLabel.create({ data: { taskId: apiTasks[3].id, labelId: labels[1].id } }); // Feature

  await prisma.taskAssignee.create({ data: { taskId: apiTasks[0].id, userId: bob.id } });
  await prisma.taskAssignee.create({ data: { taskId: apiTasks[3].id, userId: bob.id } });
  await prisma.taskAssignee.create({ data: { taskId: apiTasks[4].id, userId: charlie.id } });

  console.log('  ✅ Project "API Backend" with 5 tasks');

  // ── Project 3: Lancement ──────────────────────────────
  const projectLaunch = await prisma.project.create({
    data: {
      name: 'Lancement v1',
      description: 'Préparation du lancement de la v1',
      color: '#F59E0B',
      workspaceId: workspace.id,
    },
  });

  const launchTasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Rédiger la documentation utilisateur',
        description: 'Guide de démarrage rapide + FAQ',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        projectId: projectLaunch.id,
        createdBy: alice.id,
        dueDate: new Date('2026-09-20'),
        points: 5,
        order: 0,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Setup CI/CD production',
        description: 'GitHub Actions + déploiement automatisé',
        status: 'TODO',
        priority: 'HIGH',
        projectId: projectLaunch.id,
        createdBy: bob.id,
        dueDate: new Date('2026-09-23'),
        points: 8,
        order: 1,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Tests e2e - Scénarios critiques',
        description: 'Tests Playwright pour les flux: inscription, login, création tâche',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: projectLaunch.id,
        createdBy: diana.id,
        points: 13,
        order: 2,
      },
    }),
  ]);

  await prisma.taskAssignee.create({ data: { taskId: launchTasks[0].id, userId: alice.id } });
  await prisma.taskAssignee.create({ data: { taskId: launchTasks[1].id, userId: bob.id } });
  await prisma.taskAssignee.create({ data: { taskId: launchTasks[2].id, userId: diana.id } });

  console.log('  ✅ Project "Lancement v1" with 3 tasks');

  // ── Notes ──────────────────────────────────────────────
  await prisma.note.create({
    data: {
      title: 'Réunion kick-off produit',
      contentMd: `## Objectifs Q3
- Lancer la v1 du MVP avant fin septembre
- Atteindre 50 utilisateurs beta
- Valider le product-market fit

## Points discutés
1. Priorité sur l'auth et les workspaces
2. Le kanban est le feature le plus demandé
3. Il faut prévoir le mode hors-ligne plus tard

## Actions
- [ ] Alice: Finaliser le design system
- [ ] Bob: Déployer l'API en staging
- [ ] Charlie: Écrire les tests e2e
- [ ] Diana: Rédiger la doc utilisateur`,
      icon: '📝',
      projectId: projectUI.id,
      createdBy: alice.id,
    },
  });

  await prisma.note.create({
    data: {
      title: 'Architecture technique',
      contentMd: `## Stack
- **Frontend**: Next.js 14 + Tailwind + Zustand
- **Backend**: NestJS + Prisma + PostgreSQL
- **Infra**: Docker Compose → Kubernetes

## Principes
- TypeScript strict partout
- Server Components par défaut
- API REST versionnée (/api/v1/)
- Auth JWT avec refresh tokens`,
      icon: '🏗️',
      projectId: projectAPI.id,
      createdBy: bob.id,
    },
  });

  await prisma.note.create({
    data: {
      title: 'Idées features Phase 2',
      contentMd: `## Fonctionnalités envisagées
- Éditeur rich text pour les notes (TipTap)
- Vue timeline / Gantt
- Intégration Google Calendar
- Notifications push
- Labels avec hiérarchie
- Sous-tâches avec progression

## Priorité utilisateur
1. Éditeur de notes amélioré (70% des retours)
2. Synchronisation calendrier (45%)
3. Notifications (30%)`,
      icon: '💡',
      createdBy: charlie.id,
    },
  });

  console.log('  ✅ 3 notes created');

  // ── Calendar Events ───────────────────────────────────
  const today = new Date();
  const events = [
    {
      title: "Réunion d'équipe",
      description: 'Standup quotidien',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 9, 30),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0),
      color: '#3B82F6',
    },
    {
      title: 'Sprint Review',
      description: 'Présentation des livrables du sprint',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 14, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 15, 30),
      color: '#10B981',
    },
    {
      title: '1:1 avec Bob',
      description: 'Point individuel',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 11, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 11, 30),
      color: '#8B5CF6',
    },
    {
      title: 'Deadline - Design system',
      description: 'Les composants doivent être validés',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 0, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 23, 59),
      allDay: true,
      color: '#EF4444',
    },
    {
      title: 'Atelier découpage Phase 2',
      description: "Workshop avec toute l'équipe pour planifier la phase 2",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 10, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 12, 0),
      color: '#F59E0B',
    },
    {
      title: 'Démo client',
      description: 'Présentation du MVP à un client testeur',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 15, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 16, 0),
      color: '#EC4899',
    },
  ];

  for (const event of events) {
    await prisma.calendarEvent.create({
      data: {
        ...event,
        allDay: event.allDay ?? false,
        workspaceId: workspace.id,
        userId: alice.id,
      },
    });
  }

  console.log('  ✅ 6 calendar events created');

  // ── Subtasks ──────────────────────────────────────────
  await prisma.subtask.createMany({
    data: [
      { title: 'Créer composant Button', completed: true, taskId: uiTasks[0].id, order: 0 },
      { title: 'Créer composant Input', completed: true, taskId: uiTasks[0].id, order: 1 },
      { title: 'Créer composant Card', completed: true, taskId: uiTasks[0].id, order: 2 },
      { title: 'Créer composant Badge', completed: false, taskId: uiTasks[0].id, order: 3 },
      { title: 'Maquette liste', completed: true, taskId: uiTasks[1].id, order: 0 },
      { title: 'Maquette kanban', completed: true, taskId: uiTasks[1].id, order: 1 },
      { title: 'Maquette settings', completed: false, taskId: uiTasks[1].id, order: 2 },
    ],
  });

  console.log('  ✅ Subtasks created');

  // ── Summary ───────────────────────────────────────────
  const taskCount = await prisma.task.count();
  const noteCount = await prisma.note.count();
  const eventCount = await prisma.calendarEvent.count();
  const projectCount = await prisma.project.count();

  console.log('');
  console.log('🎉 Seed complete!');
  console.log(`   ${await prisma.user.count()} users`);
  console.log(`   ${await prisma.workspace.count()} workspace`);
  console.log(`   ${projectCount} projects`);
  console.log(`   ${taskCount} tasks`);
  console.log(`   ${noteCount} notes`);
  console.log(`   ${eventCount} calendar events`);
  console.log('');
  console.log('📧 Login: alice@nexaboard.io / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
