import { Test, TestingModule } from '@nestjs/testing';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('CalendarController', () => {
  let controller: CalendarController;
  let calendarService: jest.Mocked<CalendarService>;

  const mockEvent = {
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

  const mockUser = { id: 'user-1', email: 'test@example.com' };

  beforeEach(async () => {
    const mockCalendarService = {
      create: jest.fn().mockResolvedValue(mockEvent),
      findAllByUser: jest.fn().mockResolvedValue([mockEvent]),
      findAllByWorkspace: jest.fn().mockResolvedValue([mockEvent]),
      findById: jest.fn().mockResolvedValue(mockEvent),
      update: jest.fn().mockResolvedValue({ ...mockEvent, title: 'Updated Event' }),
      remove: jest.fn().mockResolvedValue({ message: 'Événement supprimé' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [
        { provide: CalendarService, useValue: mockCalendarService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CalendarController>(CalendarController);
    calendarService = module.get(CalendarService);
  });

  describe('create', () => {
    it('should create a calendar event', async () => {
      const dto = {
        title: 'New Event',
        start: new Date('2026-09-15T10:00:00Z'),
        end: new Date('2026-09-15T11:00:00Z'),
        workspaceId: 'ws-1',
      };

      const result = await controller.create(mockUser as any, dto);

      expect(result).toEqual(mockEvent);
      expect(calendarService.create).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('findAll', () => {
    it('should return user events', async () => {
      const result = await controller.findAll(mockUser as any, undefined, undefined);

      expect(result).toEqual([mockEvent]);
      expect(calendarService.findAllByUser).toHaveBeenCalledWith('user-1', undefined, undefined);
    });

    it('should return events with date range', async () => {
      const start = '2026-09-01';
      const end = '2026-09-30';

      const result = await controller.findAll(mockUser as any, start, end);

      expect(result).toEqual([mockEvent]);
      expect(calendarService.findAllByUser).toHaveBeenCalledWith(
        'user-1',
        new Date(start),
        new Date(end),
      );
    });
  });

  describe('findAllByWorkspace', () => {
    it('should return workspace events', async () => {
      const result = await controller.findAllByWorkspace('ws-1', mockUser as any, undefined, undefined);

      expect(result).toEqual([mockEvent]);
      expect(calendarService.findAllByWorkspace).toHaveBeenCalledWith('ws-1', 'user-1', undefined, undefined);
    });
  });

  describe('findOne', () => {
    it('should return an event by id', async () => {
      const result = await controller.findOne('event-1', mockUser as any);

      expect(result).toEqual(mockEvent);
      expect(calendarService.findById).toHaveBeenCalledWith('event-1', 'user-1');
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const dto = { title: 'Updated Event' };

      const result = await controller.update('event-1', mockUser as any, dto);

      expect(result).toEqual({ ...mockEvent, title: 'Updated Event' });
      expect(calendarService.update).toHaveBeenCalledWith('event-1', 'user-1', dto);
    });
  });

  describe('remove', () => {
    it('should delete an event', async () => {
      const result = await controller.remove('event-1', mockUser as any);

      expect(result).toEqual({ message: 'Événement supprimé' });
      expect(calendarService.remove).toHaveBeenCalledWith('event-1', 'user-1');
    });
  });
});
