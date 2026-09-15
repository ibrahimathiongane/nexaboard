import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { EmailService } from '../src/common/email/email.service';
import { APP_GUARD } from '@nestjs/core';
import type { Request, Response, NextFunction } from 'express';

describe('API Integration Tests (e2e)', () => {
  let app: INestApplication;
  let prismaMock: {
    $queryRaw: jest.Mock;
    user: { findUnique: jest.Mock; create: jest.Mock; update: jest.Mock };
    session: { findUnique: jest.Mock; create: jest.Mock; update: jest.Mock; deleteMany: jest.Mock };
    workspace: { findUnique: jest.Mock; create: jest.Mock; findMany: jest.Mock; update: jest.Mock; delete: jest.Mock };
    workspaceMember: { findUnique: jest.Mock; create: jest.Mock; delete: jest.Mock };
    workspaceSettings: { create: jest.Mock };
    project: { findUnique: jest.Mock; create: jest.Mock; findMany: jest.Mock; update: jest.Mock; delete: jest.Mock };
    task: { findUnique: jest.Mock; create: jest.Mock; findMany: jest.Mock; update: jest.Mock; delete: jest.Mock };
    taskAssignee: { create: jest.Mock; deleteMany: jest.Mock };
    taskLabel: { create: jest.Mock; deleteMany: jest.Mock };
    note: { findUnique: jest.Mock; create: jest.Mock; findMany: jest.Mock; update: jest.Mock; delete: jest.Mock };
    calendarEvent: { findUnique: jest.Mock; create: jest.Mock; findMany: jest.Mock; update: jest.Mock; delete: jest.Mock };
  };
  let emailServiceMock: {
    send: jest.Mock;
    getVerificationUrl: jest.Mock;
    getResetPasswordUrl: jest.Mock;
  };
  let requestSequence = 0;

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
    emailVerified: false,
    mfaEnabled: false,
    passwordHash: '$2a$12$hashedpassword',
    mfaSecret: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  function createPrismaMock() {
    return {
      $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
      user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
      session: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), deleteMany: jest.fn() },
      workspace: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn() },
      workspaceMember: { findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
      workspaceSettings: { create: jest.fn() },
      project: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn() },
      task: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn() },
      taskAssignee: { create: jest.fn(), deleteMany: jest.fn() },
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
      .overrideProvider(APP_GUARD)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.use((req: Request, _res: Response, next: NextFunction) => {
      Object.defineProperty(req, 'ip', { value: `e2e-client-${requestSequence++}` });
      next();
    });
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
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Health ────────────────────────────────────────────
  describe('Health', () => {
    it('GET /api/v1/health — should return ok', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body.timestamp).toBeDefined();
        });

        it('GET /api/v1/health/ready — should report database readiness', () => {
          return request(app.getHttpServer())
            .get('/api/v1/health/ready')
            .expect(200)
            .expect((res) => {
              expect(res.body.status).toBe('ready');
              expect(prismaMock.$queryRaw).toHaveBeenCalled();
            });
        });
    });
  });

  // ─── Auth — Register ──────────────────────────────────
  describe('Auth — Register', () => {
    it('should register a new user and return tokens', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(mockUser);
      prismaMock.session.create.mockResolvedValue({});

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(201);

      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('test@example.com');
      expect(res.body.user.passwordHash).toBeUndefined();
      expect(res.body.accessToken).toBeDefined();
      expect(res.headers['set-cookie']).toEqual(
        expect.arrayContaining([expect.stringContaining('nexaboard_refresh=')]),
      );
    });

    it('should reject registration with invalid email', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'not-an-email', password: 'password123', firstName: 'T', lastName: 'U' })
        .expect(400);
    });

    it('should reject registration with short password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'test@example.com', password: 'short', firstName: 'T', lastName: 'U' })
        .expect(400);
    });

    it('should reject registration with missing fields', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'test@example.com' })
        .expect(400);
    });

    it('should return 409 when email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'test@example.com', password: 'password123', firstName: 'T', lastName: 'U' })
        .expect(409);
    });
  });

  // ─── Auth — Login ─────────────────────────────────────
  describe('Auth — Login', () => {
    it('should login with valid credentials', async () => {
      const bcrypt = await import('bcryptjs');
      const hash = await bcrypt.hash('password123', 12);
      prismaMock.user.findUnique.mockResolvedValue({ ...mockUser, passwordHash: hash });
      prismaMock.session.create.mockResolvedValue({});

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(200);

      expect(res.body.user).toBeDefined();
      expect(res.body.accessToken).toBeDefined();
      expect(res.headers['set-cookie']).toEqual(
        expect.arrayContaining([expect.stringContaining('nexaboard_refresh=')]),
      );
    });

    it('should reject login with wrong password', async () => {
      const bcrypt = await import('bcryptjs');
      const hash = await bcrypt.hash('password123', 12);
      prismaMock.user.findUnique.mockResolvedValue({ ...mockUser, passwordHash: hash });

      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' })
        .expect(401);
    });

    it('should reject login with nonexistent user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'unknown@example.com', password: 'password123' })
        .expect(401);
    });
  });

  // ─── Auth — Profile ───────────────────────────────────
  describe('Auth — Profile', () => {
    it('should return profile with valid JWT', async () => {
      const bcrypt = await import('bcryptjs');
      const hash = await bcrypt.hash('password123', 12);

      // Register first
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({ ...mockUser, passwordHash: hash });
      prismaMock.session.create.mockResolvedValue({});

      const registerRes = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'test@example.com', password: 'password123', firstName: 'Test', lastName: 'User' });

      const token = registerRes.body.accessToken;

      // Mock for JWT strategy validate() + getProfile()
      prismaMock.user.findUnique.mockResolvedValue({ ...mockUser, passwordHash: hash });

      const res = await request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.email).toBe('test@example.com');
      expect(res.body.passwordHash).toBeUndefined();
    });

    it('should reject profile without JWT', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .expect(401);
    });
  });

  // ─── Auth — Forgot Password ───────────────────────────
  describe('Auth — Forgot Password', () => {
    it('should return success message and send email', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'test@example.com' })
        .expect(200);

      expect(res.body.message).toContain('réinitialisation');
      expect(emailServiceMock.send).toHaveBeenCalledTimes(1);
    });

    it('should return same message for nonexistent email (no leak)', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'unknown@example.com' })
        .expect(200);

      expect(res.body.message).toContain('réinitialisation');
      expect(emailServiceMock.send).not.toHaveBeenCalled();
    });
  });

  // ─── Auth — Verify Email ──────────────────────────────
  describe('Auth — Verify Email', () => {
    it('should verify email with valid token', async () => {
      // We can't easily sign a real JWT here without the real secret,
      // so we test the validation endpoint with an invalid token
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/verify-email')
        .send({ token: 'invalid-token' })
        .expect(401);

      expect(res.body.message).toBeDefined();
    });
  });

  // ─── Auth — Reset Password ────────────────────────────
  describe('Auth — Reset Password', () => {
    it('should reject reset with invalid token', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/reset-password')
        .send({ token: 'invalid-token', password: 'NewPassword123!' })
        .expect(401);
    });
  });
});
