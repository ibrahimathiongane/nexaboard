import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let response: { setHeader: jest.Mock };

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
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  const mockTokens = {
    accessToken: 'access-token-mock',
    refreshToken: 'refresh-token-mock',
  };

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn().mockResolvedValue({ user: mockUser, ...mockTokens }),
      login: jest.fn().mockResolvedValue({ user: mockUser, ...mockTokens }),
      refreshTokens: jest.fn().mockResolvedValue(mockTokens),
      logout: jest.fn().mockResolvedValue(undefined),
      getProfile: jest.fn().mockResolvedValue(mockUser),
      sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
      verifyEmail: jest.fn().mockResolvedValue({ message: 'Email vérifié' }),
      forgotPassword: jest.fn().mockResolvedValue({ message: 'Email envoyé' }),
      resetPassword: jest.fn().mockResolvedValue({ message: 'Mot de passe réinitialisé' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    response = { setHeader: jest.fn() };
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };
      const req = { headers: { 'user-agent': 'test-agent' }, ip: '127.0.0.1' } as any;

      const result = await controller.register(dto, req, response as any);

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect('refreshToken' in result).toBe(false);
      expect(response.setHeader).toHaveBeenCalledWith('Set-Cookie', expect.stringContaining('nexaboard_refresh=refresh-token-mock'));
      expect(authService.register).toHaveBeenCalledWith(dto, 'test-agent', '127.0.0.1');
    });
  });

  describe('login', () => {
    it('should login an existing user', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      const req = { headers: { 'user-agent': 'test-agent' }, ip: '127.0.0.1' } as any;

      const result = await controller.login(dto, req, response as any);

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect('refreshToken' in result).toBe(false);
      expect(authService.login).toHaveBeenCalledWith(dto, 'test-agent', '127.0.0.1');
    });
  });

  describe('refresh', () => {
    it('should refresh tokens', async () => {
      const req = { headers: { cookie: 'nexaboard_refresh=refresh-token-mock' } } as any;

      const result = await controller.refresh(req, response as any);

      expect(result).toEqual({ accessToken: mockTokens.accessToken });
      expect(authService.refreshTokens).toHaveBeenCalledWith('refresh-token-mock');
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      const req = { headers: { cookie: 'nexaboard_refresh=refresh-token-mock' } } as any;

      const result = await controller.logout(req, response as any);

      expect(result).toEqual({ message: 'Déconnexion réussie' });
      expect(authService.logout).toHaveBeenCalledWith('refresh-token-mock');
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const user = { id: 'user-1' } as any;

      const result = await controller.getProfile(user);

      expect(result).toEqual(mockUser);
      expect(authService.getProfile).toHaveBeenCalledWith('user-1');
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email', async () => {
      const user = { id: 'user-1' } as any;

      const result = await controller.sendVerificationEmail(user);

      expect(result).toEqual({ message: 'Email de vérification envoyé' });
      expect(authService.sendVerificationEmail).toHaveBeenCalledWith('user-1');
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with token', async () => {
      const dto = { token: 'verification-token' };

      const result = await controller.verifyEmail(dto);

      expect(result).toEqual({ message: 'Email vérifié' });
      expect(authService.verifyEmail).toHaveBeenCalledWith('verification-token');
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email', async () => {
      const dto = { email: 'test@example.com' };

      const result = await controller.forgotPassword(dto);

      expect(result).toEqual({ message: 'Email envoyé' });
      expect(authService.forgotPassword).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('resetPassword', () => {
    it('should reset password with token', async () => {
      const dto = { token: 'reset-token', password: 'NewPassword123!' };

      const result = await controller.resetPassword(dto);

      expect(result).toEqual({ message: 'Mot de passe réinitialisé' });
      expect(authService.resetPassword).toHaveBeenCalledWith('reset-token', 'NewPassword123!');
    });
  });
});
