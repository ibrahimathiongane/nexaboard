import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { EmailService } from '../src/common/email/email.service';

describe('Modules Integration Tests (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let workspaceId: string;
  let projectId: string;
  let taskId: string;
  let noteId: string;
  let calendarEventId: string;

  let prismaMock: any;
  let emailServiceMock: any;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    avatar: null,
    timezone: 'Europe/Paris',
    language: 'fr',
    provider: 'local',
    providerId: null,
    emailVerified: true,
    mfaEnabled: false,
    passwordHash: '$2a$12$hashedpassword',
    mfaSecret: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  const mockWorkspace = {
    id: 'ws-1',
    name: 'Test Workspace',
    slug: 'test-workspace',
    description: 'A test workspace',
    plan: 'FREE',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  const mockProject = {
    id: 'project-1',
    name: 'Test Project',
    description: 'A test project',
    color: '#3B82F6',
    icon: 'folder',
    workspaceId: 'ws-1',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  const mockTask = {
    id: 'task-1',
    title: 'Test Task',
    description: 'A test task',
    status: 'TODO',
    priority: 'MEDIUM',
    order: 0,
    startDate: null,
    dueDate: null,
    completedAt: null,
    estimatedHours: null,
    points: null,
    projectId: 'project-1',
    parentId: null,
    createdBy: 'user-1',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  const mockNote = {
    id: 'note-1',
    title: 'Test Note',
    content: '{}',
    contentMd: 'Test content',
    icon: '📝',
    cover: null,
    projectId: 'project-1',
    parentId: null,
    createdBy: 'user-1',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  const mockCalendarEvent = {
    id: 'event-1',
    title: 'Test Event',
    description: 'A test event',
    location: 'Room A',
    start: new Date('2026-09-15T10:00:00Z'),
    end: new Date('2026-09-15T11:00:00Z'),
    allDay: false,
    recurrence: null,
    color: '#3B82F6',
    taskId: null,
    workspaceId: 'ws-1',
    createdBy: 'user-1',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  function createPrismaMock() {
    return {
      user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
      session: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), deleteMany: jest.fn() },
      workspace: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn() },
      workspaceMember: { findUnique: jest.fn(), create: jest.fn(), delete: jest.fn(), findMany: jest.fn() },
      workspaceSettings: { create: jest.fn() },
      project: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn() },
      task: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn() },
      taskAssignee: { create: jest.fn(), deleteMany: jest.fn(), findMany: jest.fn() },
      taskLabel: { create: jest.fn(), deleteMany: jest.fn() },
      note: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn() },
      calendarEvent: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn() },
    };
  }

  beforeAll(async () => {
    prismaMock = createPrismaMock();
    emailServiceMock = {
      send: jest.fn().mockResolvedValue(undefined),
      getVerificationUrl: jest.fn().mockReturnValue('http://localhost:3000/auth/verify?token=mock'),
      getResetPasswordUrl: jest.fn().mockReturnValue('http://localhost:3000/auth/reset-password?token=mock'),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .overrideProvider(EmailService)
      .useValue(emailServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();

    // Register and login to get token
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.hash('password123', 12);

    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ ...mockUser, passwordHash: hash });
    prismaMock.session.create.mockResolvedValue({});

    const registerRes = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      });

    authToken = registerRes.body.accessToken;
    userId = registerRes.body.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Workspaces ──────────────────────────────────────
  describe('Workspaces', () => {
    it('POST /api/v1/workspaces — should create a workspace', async () => {
      prismaMock.workspace.create.mockResolvedValue(mockWorkspace);
      prismaMock.workspaceMember.create.mockResolvedValue({});
      prismaMock.workspaceSettings.create.mockResolvedValue({});

      const res = await request(app.getHttpServer())
        .post('/api/v1/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Workspace', description: 'A test workspace' })
        .expect(201);

      expect(res.body).toBeDefined();
      expect(res.body.name).toBe('Test Workspace');
      workspaceId = res.body.id;
    });

    it('GET /api/v1/workspaces — should list user workspaces', async () => {
      prismaMock.workspaceMember.findMany.mockResolvedValue([
        { workspace: mockWorkspace },
      ]);

      const res = await request(app.getHttpServer())
        .get('/api/v1/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it('GET /api/v1/workspaces/:id — should get workspace by id', async () => {
      prismaMock.workspace.findUnique.mockResolvedValue({
        ...mockWorkspace,
        members: [{ userId, role: 'OWNER', user: mockUser }],
      });

      const res = await request(app.getHttpServer())
        .get(`/api/v1/workspaces/${workspaceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it('PATCH /api/v1/workspaces/:id — should update workspace', async () => {
      prismaMock.workspace.findUnique.mockResolvedValue({
        ...mockWorkspace,
        members: [{ userId, role: 'OWNER' }],
      });
      prismaMock.workspace.update.mockResolvedValue({
        ...mockWorkspace,
        name: 'Updated Workspace',
      });

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/workspaces/${workspaceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Workspace' })
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it('POST /api/v1/workspaces/:id/members — should add member', async () => {
      prismaMock.workspace.findUnique.mockResolvedValue({
        ...mockWorkspace,
        members: [{ userId, role: 'OWNER' }],
      });
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        id: 'user-2',
        email: 'member@example.com',
      });
      prismaMock.workspaceMember.findUnique.mockResolvedValue(null);
      prismaMock.workspaceMember.create.mockResolvedValue({});

      const res = await request(app.getHttpServer())
        .post(`/api/v1/workspaces/${workspaceId}/members`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: 'member@example.com', role: 'MEMBER' })
        .expect(201);

      expect(res.body).toBeDefined();
    });
  });

  // ─── Projects ────────────────────────────────────────
  describe('Projects', () => {
    it('POST /api/v1/workspaces/:workspaceId/projects — should create a project', async () => {
      prismaMock.workspace.findUnique.mockResolvedValue({
        ...mockWorkspace,
        members: [{ userId }],
      });
      prismaMock.project.create.mockResolvedValue(mockProject);

      const res = await request(app.getHttpServer())
        .post(`/api/v1/workspaces/${workspaceId}/projects`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Project', description: 'A test project' })
        .expect(201);

      expect(res.body).toBeDefined();
      expect(res.body.name).toBe('Test Project');
      projectId = res.body.id;
    });

    it('GET /api/v1/workspaces/:workspaceId/projects — should list projects', async () => {
      prismaMock.workspace.findUnique.mockResolvedValue({
        ...mockWorkspace,
        members: [{ userId }],
      });
      prismaMock.project.findMany.mockResolvedValue([mockProject]);

      const res = await request(app.getHttpServer())
        .get(`/api/v1/workspaces/${workspaceId}/projects`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it('GET /api/v1/projects/:id — should get project by id', async () => {
      prismaMock.project.findUnique.mockResolvedValue({
        ...mockProject,
        workspace: {
          members: [{ userId }],
        },
      });

      const res = await request(app.getHttpServer())
        .get(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it('PATCH /api/v1/projects/:id — should update project', async () => {
      prismaMock.project.findUnique.mockResolvedValue({
        ...mockProject,
        workspace: {
          members: [{ userId }],
        },
      });
      prismaMock.project.update.mockResolvedValue({
        ...mockProject,
        name: 'Updated Project',
      });

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Project' })
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it('DELETE /api/v1/projects/:id — should delete project', async () => {
      prismaMock.project.findUnique.mockResolvedValue({
        ...mockProject,
        workspace: {
          members: [{ userId }],
        },
      });
      prismaMock.project.delete.mockResolvedValue(mockProject);

      const res = await request(app.getHttpServer())
        .delete(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
    });
  });

  // ─── Tasks ───────────────────────────────────────────
  describe('Tasks', () => {
    it('POST /api/v1/projects/:projectId/tasks — should create a task', async () => {
      prismaMock.project.findUnique.mockResolvedValue({
        ...mockProject,
        workspace: {
          members: [{ userId }],
        },
      });
      prismaMock.task.create.mockResolvedValue({
        ...mockTask,
        assignees: [],
        labels: [],
        subtasks: [],
        _count: { comments: 0, subtasks: 0 },
      });

      const res = await request(app.getHttpServer())
        .post(`/api/v1/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Task', description: 'A test task' })
        .expect(201);

      expect(res.body).toBeDefined();
      expect(res.body.title).toBe('Test Task');
      taskId = res.body.id;
    });

    it('GET /api/v1/projects/:projectId/tasks — should list tasks', async () => {
      prismaMock.project.findUnique.mockResolvedValue({
        ...mockProject,
        workspace: {
          members: [{ userId }],
        },
      });
      prismaMock.task.findMany.mockResolvedValue([
        {
          ...mockTask,
          assignees: [],
          labels: [],
          subtasks: [],
          _count: { comments: 0, subtasks: 0 },
        },
      ]);

      const res = await request(app.getHttpServer())
        .get(`/api/v1/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it('GET /api/v1/tasks/:id — should get task by id', async () => {
      prismaMock.task.findUnique.mockResolvedValue({
        ...mockTask,
        project: mockProject,
        assignees: [],
        labels: [],
        subtasks: [],
        comments: [],
        _count: { comments: 0, subtasks: 0 },
      });

      const res = await request(app.getHttpServer())
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it('PATCH /api/v1/tasks/:id — should update task', async () => {
      prismaMock.task.findUnique.mockResolvedValue({
        ...mockTask,
        project: mockProject,
        assignees: [],
        labels: [],
        subtasks: [],
        comments: [],
        _count: { comments: 0, subtasks: 0 },
      });
      prismaMock.task.update.mockResolvedValue({
        ...mockTask,
        title: 'Updated Task',
        assignees: [],
        labels: [],
        _count: { comments: 0, subtasks: 0 },
      });

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Task' })
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it('DELETE /api/v1/tasks/:id — should delete task', async () => {
      prismaMock.task.findUnique.mockResolvedValue({
        ...mockTask,
        project: mockProject,
        assignees: [],
        labels: [],
        subtasks: [],
        comments: [],
        _count: { comments: 0, subtasks: 0 },
      });
      prismaMock.task.delete.mockResolvedValue(mockTask);

      const res = await request(app.getHttpServer())
        .delete(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it('POST /api/v1/tasks/:id/assign — should assign user to task', async () => {
      prismaMock.task.findUnique.mockResolvedValue({
        ...mockTask,
        project: mockProject,
        assignees: [],
        labels: [],
        subtasks: [],
        comments: [],
        _count: { comments: 0, subtasks: 0 },
      });
      prismaMock.taskAssignee.create.mockResolvedValue({
        taskId,
        userId: 'user-2',
        user: { id: 'user-2', email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith', avatar: null },
      });

      const res = await request(app.getHttpServer())
        .post(`/api/v1/tasks/${taskId}/assign`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ userId: 'user-2' })
        .expect(201);

      expect(res.body).toBeDefined();
    });

    it('DELETE /api/v1/tasks/:id/assign/:assigneeId — should unassign user', async () => {
      prismaMock.task.findUnique.mockResolvedValue({
        ...mockTask,
        project: mockProject,
        assignees: [],
        labels: [],
        subtasks: [],
        comments: [],
        _count: { comments: 0, subtasks: 0 },
      });
      prismaMock.taskAssignee.deleteMany.mockResolvedValue({ count: 1 });

      const res = await request(app.getHttpServer())
        .delete(`/api/v1/tasks/${taskId}/assign/user-2`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
    });
  });

  // ─── Notes ───────────────────────────────────────────
  describe('Notes', () => {
    it('POST /api/v1/notes — should create a note', async () => {
      prismaMock.note.create.mockResolvedValue(mockNote);

      const res = await request(app.getHttpServer())
        .post('/api/v1/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Note', contentMd: 'Test content' })
        .expect(201);

      expect(res.body).toBeDefined();
      expect(res.body.title).toBe('Test Note');
      noteId = res.body.id;
    });

    it('GET /api/v1/notes — should list user notes', async () => {
      prismaMock.note.findMany.mockResolvedValue([mockNote]);

      const res = await request(app.getHttpServer())
        .get('/api/v1/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it('GET /api/v1/notes/:id — should get note by id', async () => {
      prismaMock.note.findUnique.mockResolvedValue({
        ...mockNote,
        project: {
          ...mockProject,
          workspace: {
            members: [{ userId }],
          },
        },
      });

      const res = await request(app.getHttpServer())
        .get(`/api/v1/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it('PATCH /api/v1/notes/:id — should update note', async () => {
      prismaMock.note.findUnique.mockResolvedValue({
        ...mockNote,
        project: {
          ...mockProject,
          workspace: {
            members: [{ userId }],
          },
        },
      });
      prismaMock.note.update.mockResolvedValue({
        ...mockNote,
        title: 'Updated Note',
      });

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Note' })
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it('DELETE /api/v1/notes/:id — should delete note', async () => {
      prismaMock.note.findUnique.mockResolvedValue({
        ...mockNote,
        project: {
          ...mockProject,
          workspace: {
            members: [{ userId }],
          },
        },
      });
      prismaMock.note.delete.mockResolvedValue(mockNote);

      const res = await request(app.getHttpServer())
        .delete(`/api/v1/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
    });
  });

  // ─── Calendar ────────────────────────────────────────
  describe('Calendar', () => {
    it('POST /api/v1/calendar — should create a calendar event', async () => {
      prismaMock.calendarEvent.create.mockResolvedValue(mockCalendarEvent);

      const res = await request(app.getHttpServer())
        .post('/api/v1/calendar')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Event',
          start: '2026-09-15T10:00:00Z',
          end: '2026-09-15T11:00:00Z',
          workspaceId: workspaceId,
        })
        .expect(201);

      expect(res.body).toBeDefined();
      expect(res.body.title).toBe('Test Event');
      calendarEventId = res.body.id;
    });

    it('GET /api/v1/calendar — should list user events', async () => {
      prismaMock.calendarEvent.findMany.mockResolvedValue([mockCalendarEvent]);

      const res = await request(app.getHttpServer())
        .get('/api/v1/calendar')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it('GET /api/v1/calendar/:id — should get event by id', async () => {
      prismaMock.calendarEvent.findUnique.mockResolvedValue({
        ...mockCalendarEvent,
        workspace: {
          members: [{ userId }],
        },
      });

      const res = await request(app.getHttpServer())
        .get(`/api/v1/calendar/${calendarEventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it('PATCH /api/v1/calendar/:id — should update event', async () => {
      prismaMock.calendarEvent.findUnique.mockResolvedValue({
        ...mockCalendarEvent,
        workspace: {
          members: [{ userId }],
        },
      });
      prismaMock.calendarEvent.update.mockResolvedValue({
        ...mockCalendarEvent,
        title: 'Updated Event',
      });

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/calendar/${calendarEventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Event' })
        .expect(200);

      expect(res.body).toBeDefined();
    });

    it('DELETE /api/v1/calendar/:id — should delete event', async () => {
      prismaMock.calendarEvent.findUnique.mockResolvedValue({
        ...mockCalendarEvent,
        workspace: {
          members: [{ userId }],
        },
      });
      prismaMock.calendarEvent.delete.mockResolvedValue(mockCalendarEvent);

      const res = await request(app.getHttpServer())
        .delete(`/api/v1/calendar/${calendarEventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
    });
  });

  // ─── Auth — Additional Tests ─────────────────────────
  describe('Auth — Send Verification Email', () => {
    it('should send verification email', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/send-verification-email')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.message).toBeDefined();
      expect(emailServiceMock.send).toHaveBeenCalled();
    });
  });

  // ─── Validation Tests ────────────────────────────────
  describe('Validation', () => {
    it('should reject request without auth token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/workspaces')
        .expect(401);
    });

    it('should reject request with invalid token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/workspaces')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should reject workspace creation with missing name', () => {
      return request(app.getHttpServer())
        .post('/api/v1/workspaces')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'No name' })
        .expect(400);
    });

    it('should reject task creation with missing title', () => {
      prismaMock.project.findUnique.mockResolvedValue({
        ...mockProject,
        workspace: {
          members: [{ userId }],
        },
      });

      return request(app.getHttpServer())
        .post(`/api/v1/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'No title' })
        .expect(400);
    });

    it('should reject note creation with missing title', () => {
      return request(app.getHttpServer())
        .post('/api/v1/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ contentMd: 'No title' })
        .expect(400);
    });

    it('should reject calendar event with missing fields', () => {
      return request(app.getHttpServer())
        .post('/api/v1/calendar')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Missing dates' })
        .expect(400);
    });
  });
});
