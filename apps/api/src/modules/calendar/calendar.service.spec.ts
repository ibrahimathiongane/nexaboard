import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

describe('CalendarService', () => {
  let service: CalendarService;
  let prisma: {
    calendarEvent: {
      findUnique: jest.Mock;
      create: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    workspaceMember: { findUnique: jest.Mock };
  };

  const mockEvent = {
    id: 'event-1',
    title: 'Test Event',
    description: 'A test event',
    location: 'Room 101',
    start: new Date('2026-09-15T10:00:00Z'),
    end: new Date('2026-09-15T11:00:00Z'),
    allDay: false,
    recurrence: null,
    color: '#3B82F6',
    taskId: null,
    workspaceId: 'ws-1',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMembership = {
    id: 'mem-1',
    userId: 'user-1',
    workspaceId: 'ws-1',
    role: 'OWNER' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      calendarEvent: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      workspaceMember: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CalendarService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
  });

  describe('create', () => {
    it('should create an event when user is workspace member', async () => {
      const dto: CreateCalendarEventDto = {
        title: 'New Event',
        start: new Date('2026-09-15T10:00:00Z'),
        end: new Date('2026-09-15T11:00:00Z'),
        workspaceId: 'ws-1',
      };
      prisma.workspaceMember.findUnique.mockResolvedValue(mockMembership);
      prisma.calendarEvent.create.mockResolvedValue({
        ...mockEvent,
        user: {
          id: 'user-1',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          avatar: null,
        },
        task: null,
      });

      const result = await service.create('user-1', dto);

      expect(result).toBeDefined();
      expect(prisma.calendarEvent.create).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not workspace member', async () => {
      const dto: CreateCalendarEventDto = {
        title: 'New Event',
        start: new Date('2026-09-15T10:00:00Z'),
        end: new Date('2026-09-15T11:00:00Z'),
        workspaceId: 'ws-1',
      };
      prisma.workspaceMember.findUnique.mockResolvedValue(null);

      await expect(service.create('user-1', dto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAllByUser', () => {
    it('should return all events for a user', async () => {
      prisma.calendarEvent.findMany.mockResolvedValue([mockEvent]);

      const result = await service.findAllByUser('user-1');

      expect(result).toHaveLength(1);
    });

    it('should filter events by date range', async () => {
      const start = new Date('2026-09-01');
      const end = new Date('2026-09-30');
      prisma.calendarEvent.findMany.mockResolvedValue([mockEvent]);

      await service.findAllByUser('user-1', start, end);

      const findCall = prisma.calendarEvent.findMany.mock.calls[0][0];
      expect(findCall.where.start).toEqual({ gte: start });
      expect(findCall.where.end).toEqual({ lte: end });
    });
  });

  describe('findAllByWorkspace', () => {
    it('should return workspace events when user is member', async () => {
      prisma.workspaceMember.findUnique.mockResolvedValue(mockMembership);
      prisma.calendarEvent.findMany.mockResolvedValue([mockEvent]);

      const result = await service.findAllByWorkspace('ws-1', 'user-1');

      expect(result).toHaveLength(1);
    });

    it('should throw ForbiddenException when user is not workspace member', async () => {
      prisma.workspaceMember.findUnique.mockResolvedValue(null);

      await expect(service.findAllByWorkspace('ws-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findById', () => {
    it('should return event when user is the creator', async () => {
      prisma.calendarEvent.findUnique.mockResolvedValue({
        ...mockEvent,
        user: {
          id: 'user-1',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          avatar: null,
        },
        task: null,
      });

      const result = await service.findById('event-1', 'user-1');

      expect(result).toBeDefined();
    });

    it('should return event when user is workspace member but not creator', async () => {
      prisma.calendarEvent.findUnique.mockResolvedValue({
        ...mockEvent,
        userId: 'user-2',
        user: { id: 'user-2' },
        task: null,
      });
      prisma.workspaceMember.findUnique.mockResolvedValue(mockMembership);

      const result = await service.findById('event-1', 'user-1');

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when event not found', async () => {
      prisma.calendarEvent.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user has no access', async () => {
      prisma.calendarEvent.findUnique.mockResolvedValue({
        ...mockEvent,
        userId: 'user-2',
        user: { id: 'user-2' },
        task: null,
      });
      prisma.workspaceMember.findUnique.mockResolvedValue(null);

      await expect(service.findById('event-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update event when user has access', async () => {
      const dto: UpdateCalendarEventDto = { title: 'Updated Event' };
      prisma.calendarEvent.findUnique.mockResolvedValueOnce({
        ...mockEvent,
        user: { id: 'user-1' },
        task: null,
      });
      prisma.calendarEvent.update.mockResolvedValue({
        ...mockEvent,
        title: 'Updated Event',
        user: {
          id: 'user-1',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          avatar: null,
        },
        task: null,
      });

      const result = await service.update('event-1', 'user-1', dto);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when event not found', async () => {
      const dto: UpdateCalendarEventDto = { title: 'Updated' };
      prisma.calendarEvent.findUnique.mockResolvedValue(null);

      await expect(service.update('nonexistent', 'user-1', dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete event when user has access', async () => {
      prisma.calendarEvent.findUnique.mockResolvedValueOnce({
        ...mockEvent,
        user: { id: 'user-1' },
        task: null,
      });
      prisma.calendarEvent.delete.mockResolvedValue(mockEvent);

      const result = await service.remove('event-1', 'user-1');

      expect(result).toEqual({ message: 'Événement supprimé' });
    });

    it('should throw NotFoundException when event not found', async () => {
      prisma.calendarEvent.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });
});
