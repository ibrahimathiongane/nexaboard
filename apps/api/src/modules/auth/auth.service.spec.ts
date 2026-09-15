import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../../common/email/email.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { session: { findUnique: jest.Mock; create: jest.Mock; update: jest.Mock; deleteMany: jest.Mock }; user: { update: jest.Mock } };
  let usersService: { findByEmail: jest.Mock; create: jest.Mock; verifyPassword: jest.Mock; findById: jest.Mock; findByIdOrThrow: jest.Mock };
  let jwtService: { signAsync: jest.Mock; sign: jest.Mock; verify: jest.Mock };
  let configService: { get: jest.Mock };
  let emailService: { send: jest.Mock; getVerificationUrl: jest.Mock; getResetPasswordUrl: jest.Mock };

  const mockUser = {
    id: 'user-1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    avatar: null,
    timezone: 'Europe/Paris',
    language: 'fr',
    provider: 'local',
    providerId: null,
    emailVerified: false,
    mfaEnabled: false,
    passwordHash: '$2a$12$hashedpassword',
    mfaSecret: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      session: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        deleteMany: jest.fn(),
      },
      user: {
        update: jest.fn(),
      },
    };

    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      verifyPassword: jest.fn(),
      findById: jest.fn(),
      findByIdOrThrow: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mock-token'),
      sign: jest.fn().mockReturnValue('mock-token'),
      verify: jest.fn(),
    };

    configService = {
      get: jest.fn((key: string, defaultValue?: string) => {
        const config: Record<string, string> = {
          JWT_SECRET: 'test-secret',
          JWT_EXPIRATION: '15m',
          JWT_REFRESH_EXPIRATION: '7d',
        };
        return config[key] ?? defaultValue;
      }),
    };

    emailService = {
      send: jest.fn().mockResolvedValue(undefined),
      getVerificationUrl: jest.fn().mockReturnValue('http://localhost:3000/auth/verify?token=mock-token'),
      getResetPasswordUrl: jest.fn().mockReturnValue('http://localhost:3000/auth/reset-password?token=mock-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: EmailService, useValue: emailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create a user and return tokens', async () => {
      usersService.create.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'john@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(usersService.create).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('john@example.com');
      expect(Object.keys(result.user)).not.toContain('passwordHash');
      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-token');
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
    });

    it('should strip passwordHash from returned user', async () => {
      usersService.create.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'john@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      const userKeys = Object.keys(result.user);
      expect(userKeys).not.toContain('passwordHash');
      expect(userKeys).not.toContain('mfaSecret');
    });
  });

  describe('login', () => {
    it('should return tokens when credentials are valid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      usersService.verifyPassword.mockResolvedValue(true);
      prisma.session.create.mockResolvedValue({});

      const result = await service.login(
        { email: 'john@example.com', password: 'password123' },
        'Mozilla/5.0',
        '127.0.0.1',
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(usersService.verifyPassword).toHaveBeenCalledWith(mockUser, 'password123');
      expect(prisma.session.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          token: 'mock-token',
          userAgent: 'Mozilla/5.0',
          ipAddress: '127.0.0.1',
          expiresAt: expect.any(Date),
        },
      });
      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-token');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'unknown@example.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      usersService.verifyPassword.mockResolvedValue(false);

      await expect(
        service.login({ email: 'john@example.com', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens when refresh token is valid', async () => {
      const session = {
        id: 'session-1',
        token: 'old-refresh-token',
        expiresAt: new Date(Date.now() + 86400000),
      };
      jwtService.verify.mockReturnValue({ sub: 'user-1', email: 'john@example.com' });
      prisma.session.findUnique.mockResolvedValue(session);
      usersService.findById.mockResolvedValue(mockUser);
      prisma.session.update.mockResolvedValue({});

      const result = await service.refreshTokens('old-refresh-token');

      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-token');
      expect(prisma.session.update).toHaveBeenCalledWith({
        where: { id: 'session-1' },
        data: { token: 'mock-token', expiresAt: expect.any(Date) },
      });
    });

    it('should throw UnauthorizedException when session not found', async () => {
      jwtService.verify.mockReturnValue({ sub: 'user-1', email: 'john@example.com' });
      prisma.session.findUnique.mockResolvedValue(null);

      await expect(service.refreshTokens('invalid-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when session is expired', async () => {
      const expiredSession = {
        id: 'session-1',
        token: 'expired-token',
        expiresAt: new Date(Date.now() - 1000),
      };
      jwtService.verify.mockReturnValue({ sub: 'user-1', email: 'john@example.com' });
      prisma.session.findUnique.mockResolvedValue(expiredSession);

      await expect(service.refreshTokens('expired-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when JWT is invalid', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('jwt invalid');
      });

      await expect(service.refreshTokens('bad-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should delete session by token', async () => {
      prisma.session.deleteMany.mockResolvedValue({ count: 1 });

      await service.logout('refresh-token');

      expect(prisma.session.deleteMany).toHaveBeenCalledWith({
        where: { token: 'refresh-token' },
      });
    });
  });

  describe('getProfile', () => {
    it('should return sanitized user profile', async () => {
      usersService.findByIdOrThrow.mockResolvedValue(mockUser);

      const result = await service.getProfile('user-1');

      expect(result).toEqual({
        id: 'user-1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        avatar: null,
        timezone: 'Europe/Paris',
        language: 'fr',
        provider: 'local',
        providerId: null,
        emailVerified: false,
        mfaEnabled: false,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      const userKeys = Object.keys(result);
      expect(userKeys).not.toContain('passwordHash');
      expect(userKeys).not.toContain('mfaSecret');
    });

    it('should throw NotFoundException when user not found', async () => {
      usersService.findByIdOrThrow.mockRejectedValue(
        new Error('Utilisateur non trouvé'),
      );

      await expect(service.getProfile('nonexistent')).rejects.toThrow();
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email', async () => {
      usersService.findByIdOrThrow.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('verification-token');

      await service.sendVerificationEmail('user-1');

      expect(usersService.findByIdOrThrow).toHaveBeenCalledWith('user-1');
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: 'user-1', type: 'email-verification' },
        { expiresIn: '24h' },
      );
      expect(emailService.getVerificationUrl).toHaveBeenCalledWith('verification-token');
      expect(emailService.send).toHaveBeenCalledWith({
        to: 'john@example.com',
        subject: 'Vérifiez votre email - nexaBoard',
        html: expect.stringContaining('Bonjour John'),
      });
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with valid token', async () => {
      jwtService.verify.mockReturnValue({ sub: 'user-1', type: 'email-verification' });
      usersService.findById.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue({ ...mockUser, emailVerified: true });

      const result = await service.verifyEmail('valid-token');

      expect(result).toEqual({ message: 'Email vérifié avec succès' });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { emailVerified: true },
      });
    });

    it('should throw UnauthorizedException with invalid token', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('jwt invalid');
      });

      await expect(service.verifyEmail('invalid-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException with wrong token type', async () => {
      jwtService.verify.mockReturnValue({ sub: 'user-1', type: 'password-reset' });

      await expect(service.verifyEmail('wrong-type-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    it('should send reset email when user exists', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('reset-token');

      const result = await service.forgotPassword('john@example.com');

      expect(result).toEqual({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé' });
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: 'user-1', type: 'password-reset' },
        { expiresIn: '1h' },
      );
      expect(emailService.send).toHaveBeenCalled();
    });

    it('should return same message when user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.forgotPassword('unknown@example.com');

      expect(result).toEqual({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé' });
      expect(emailService.send).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      jwtService.verify.mockReturnValue({ sub: 'user-1', type: 'password-reset' });
      usersService.findById.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue({});
      prisma.session.deleteMany.mockResolvedValue({ count: 2 });

      const result = await service.resetPassword('valid-token', 'NewPassword123!');

      expect(result).toEqual({ message: 'Mot de passe réinitialisé avec succès' });
      expect(prisma.user.update).toHaveBeenCalled();
      expect(prisma.session.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
    });

    it('should throw UnauthorizedException with invalid token', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('jwt invalid');
      });

      await expect(service.resetPassword('invalid-token', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException with wrong token type', async () => {
      jwtService.verify.mockReturnValue({ sub: 'user-1', type: 'email-verification' });

      await expect(service.resetPassword('wrong-type-token', 'password')).rejects.toThrow(UnauthorizedException);
    });
  });
});
