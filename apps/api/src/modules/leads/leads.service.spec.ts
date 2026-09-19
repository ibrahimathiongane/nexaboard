import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailService } from '../../common/email/email.service';

describe('LeadsService', () => {
  let service: LeadsService;
  let prisma: {
    betaSubscriber: {
      findUnique: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
    };
  };
  let emailService: {
    send: jest.Mock;
  };

  const mockSubscriber = {
    id: 'sub-12345678',
    email: 'test@example.com',
    teamSize: '5-10',
    currentTool: 'Notion',
    interest: 'all-in-one',
    position: 42,
    userAgent: 'Mozilla/5.0',
    ipAddress: '127.0.0.1',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      betaSubscriber: {
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
      },
    };

    emailService = {
      send: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: PrismaService, useValue: prisma },
        { provide: EmailService, useValue: emailService },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
  });

  describe('subscribe', () => {
    it('should successfully subscribe a new lead and send confirmation email', async () => {
      prisma.betaSubscriber.findUnique.mockResolvedValue(null);
      prisma.betaSubscriber.count.mockResolvedValue(41);
      prisma.betaSubscriber.create.mockResolvedValue(mockSubscriber);

      const result = await service.subscribe(
        {
          email: 'test@example.com',
          teamSize: '5-10',
          currentTool: 'Notion',
          interest: 'all-in-one',
        },
        'Mozilla/5.0',
        '127.0.0.1',
      );

      expect(prisma.betaSubscriber.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(prisma.betaSubscriber.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          teamSize: '5-10',
          currentTool: 'Notion',
          interest: 'all-in-one',
          position: 42,
          userAgent: 'Mozilla/5.0',
          ipAddress: '127.0.0.1',
        },
      });
      expect(emailService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: expect.stringContaining('#42'),
        }),
      );
      expect(result.success).toBe(true);
      expect(result.data.position).toBe(42);
      expect(result.data.referralCode).toBe('BETA-42X5678');
      expect(result.data.referralLink).toContain(
        'https://nexaboardapp.up.railway.app?ref=BETA-42X5678',
      );
    });

    it('should throw ConflictException if lead is already subscribed', async () => {
      prisma.betaSubscriber.findUnique.mockResolvedValue(mockSubscriber);

      await expect(
        service.subscribe({
          email: 'test@example.com',
          teamSize: '5-10',
          currentTool: 'Notion',
        }),
      ).rejects.toThrow(ConflictException);

      expect(prisma.betaSubscriber.create).not.toHaveBeenCalled();
      expect(emailService.send).not.toHaveBeenCalled();
    });
  });
});
