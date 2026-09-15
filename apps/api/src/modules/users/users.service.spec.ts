import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: { user: { findUnique: jest.Mock; create: jest.Mock } };

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
  } satisfies User;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findByEmail', () => {
    it('should return a user when found', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail('john@example.com');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
    });

    it('should return null when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('unknown@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById('user-1');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
    });

    it('should return null when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      const dto: RegisterDto = {
        email: 'jane@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        ...mockUser,
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      });

      await service.create(dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'jane@example.com' },
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'jane@example.com',
          passwordHash: expect.any(String),
          firstName: 'Jane',
          lastName: 'Smith',
        },
      });
      // Verify password was hashed (not plaintext)
      const createCall = prisma.user.create.mock.calls[0][0];
      expect(createCall.data.passwordHash).not.toBe('password123');
      expect(createCall.data.passwordHash).toMatch(/^\$2[aby]?\$\d{1,2}\$/);
    });

    it('should throw ConflictException when email already exists', async () => {
      const dto: RegisterDto = {
        email: 'john@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('verifyPassword', () => {
    it('should return true when password matches', async () => {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const userWithHash = { ...mockUser, passwordHash: hashedPassword };

      const result = await service.verifyPassword(userWithHash as User, 'password123');

      expect(result).toBe(true);
    });

    it('should return false when password does not match', async () => {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const userWithHash = { ...mockUser, passwordHash: hashedPassword };

      const result = await service.verifyPassword(userWithHash as User, 'wrongpassword');

      expect(result).toBe(false);
    });

    it('should return false when passwordHash is null', async () => {
      const userWithoutHash = { ...mockUser, passwordHash: null };

      const result = await service.verifyPassword(userWithoutHash as User, 'password123');

      expect(result).toBe(false);
    });
  });

  describe('findByIdOrThrow', () => {
    it('should return a user when found', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByIdOrThrow('user-1');

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findByIdOrThrow('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
