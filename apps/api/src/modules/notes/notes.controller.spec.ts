import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('NotesController', () => {
  let controller: NotesController;
  let notesService: jest.Mocked<NotesService>;

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

  const mockUser = { id: 'user-1', email: 'test@example.com' };

  beforeEach(async () => {
    const mockNotesService = {
      create: jest.fn().mockResolvedValue(mockNote),
      findAllByUser: jest.fn().mockResolvedValue([mockNote]),
      findAllByProject: jest.fn().mockResolvedValue([mockNote]),
      findById: jest.fn().mockResolvedValue(mockNote),
      update: jest.fn().mockResolvedValue({ ...mockNote, title: 'Updated Note' }),
      remove: jest.fn().mockResolvedValue({ message: 'Note supprimée' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        { provide: NotesService, useValue: mockNotesService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<NotesController>(NotesController);
    notesService = module.get(NotesService);
  });

  describe('create', () => {
    it('should create a note', async () => {
      const dto = { title: 'New Note', contentMd: 'Content' };

      const result = await controller.create(mockUser as any, dto);

      expect(result).toEqual(mockNote);
      expect(notesService.create).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('findAll', () => {
    it('should return user notes when no projectId', async () => {
      const result = await controller.findAll(mockUser as any, undefined);

      expect(result).toEqual([mockNote]);
      expect(notesService.findAllByUser).toHaveBeenCalledWith('user-1');
    });

    it('should return project notes when projectId provided', async () => {
      const result = await controller.findAll(mockUser as any, 'project-1');

      expect(result).toEqual([mockNote]);
      expect(notesService.findAllByProject).toHaveBeenCalledWith('project-1', 'user-1');
    });
  });

  describe('findOne', () => {
    it('should return a note by id', async () => {
      const result = await controller.findOne('note-1', mockUser as any);

      expect(result).toEqual(mockNote);
      expect(notesService.findById).toHaveBeenCalledWith('note-1', 'user-1');
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      const dto = { title: 'Updated Note' };

      const result = await controller.update('note-1', mockUser as any, dto);

      expect(result).toEqual({ ...mockNote, title: 'Updated Note' });
      expect(notesService.update).toHaveBeenCalledWith('note-1', 'user-1', dto);
    });
  });

  describe('remove', () => {
    it('should delete a note', async () => {
      const result = await controller.remove('note-1', mockUser as any);

      expect(result).toEqual({ message: 'Note supprimée' });
      expect(notesService.remove).toHaveBeenCalledWith('note-1', 'user-1');
    });
  });
});
