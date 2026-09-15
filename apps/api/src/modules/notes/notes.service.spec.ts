import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { NotesService } from './notes.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

describe('NotesService', () => {
  let service: NotesService;
  let prisma: {
    note: { findUnique: jest.Mock; create: jest.Mock; findMany: jest.Mock; update: jest.Mock; delete: jest.Mock };
    project: { findUnique: jest.Mock };
  };

  const mockNote = {
    id: 'note-1',
    title: 'Test Note',
    content: { blocks: [] },
    contentMd: '# Test',
    icon: '📄',
    cover: null,
    published: false,
    archived: false,
    projectId: 'project-1',
    parentId: null,
    createdBy: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProject = {
    id: 'project-1',
    name: 'Test Project',
    workspaceId: 'ws-1',
    workspace: {
      members: [{ userId: 'user-1' }],
    },
  };

  beforeEach(async () => {
    prisma = {
      note: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      project: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  describe('create', () => {
    it('should create a note with projectId', async () => {
      const dto: CreateNoteDto = {
        title: 'New Note',
        content: '{"blocks":[]}',
        projectId: 'project-1',
      };
      prisma.project.findUnique.mockResolvedValue(mockProject);
      prisma.note.create.mockResolvedValue({
        ...mockNote,
        creator: { id: 'user-1', email: 'john@example.com', firstName: 'John', lastName: 'Doe', avatar: null },
        project: { id: 'project-1', name: 'Test Project', color: '#3B82F6' },
        _count: { comments: 0, children: 0 },
      });

      const result = await service.create('user-1', dto);

      expect(result).toBeDefined();
      expect(prisma.note.create).toHaveBeenCalled();
    });

    it('should create a note without projectId', async () => {
      const dto: CreateNoteDto = {
        title: 'Personal Note',
        content: '{"blocks":[]}',
      };
      prisma.note.create.mockResolvedValue({
        ...mockNote,
        projectId: null,
        creator: { id: 'user-1', email: 'john@example.com', firstName: 'John', lastName: 'Doe', avatar: null },
        project: null,
        _count: { comments: 0, children: 0 },
      });

      const result = await service.create('user-1', dto);

      expect(result).toBeDefined();
      expect(prisma.project.findUnique).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user has no project access', async () => {
      const dto: CreateNoteDto = {
        title: 'Note',
        projectId: 'project-1',
      };
      prisma.project.findUnique.mockResolvedValue({
        ...mockProject,
        workspace: { members: [] },
      });

      await expect(service.create('user-1', dto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAllByUser', () => {
    it('should return all notes for a user', async () => {
      prisma.note.findMany.mockResolvedValue([mockNote]);

      const result = await service.findAllByUser('user-1');

      expect(result).toHaveLength(1);
      expect(prisma.note.findMany).toHaveBeenCalledWith({
        where: { createdBy: 'user-1' },
        include: expect.objectContaining({
          project: expect.any(Object),
          _count: expect.any(Object),
        }),
        orderBy: { updatedAt: 'desc' },
      });
    });
  });

  describe('findAllByProject', () => {
    it('should return notes for a project when user has access', async () => {
      prisma.project.findUnique.mockResolvedValue(mockProject);
      prisma.note.findMany.mockResolvedValue([mockNote]);

      const result = await service.findAllByProject('project-1', 'user-1');

      expect(result).toHaveLength(1);
    });

    it('should throw ForbiddenException when user has no access', async () => {
      prisma.project.findUnique.mockResolvedValue({
        ...mockProject,
        workspace: { members: [] },
      });

      await expect(service.findAllByProject('project-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findById', () => {
    it('should return note when user is the creator', async () => {
      prisma.note.findUnique.mockResolvedValue({
        ...mockNote,
        creator: { id: 'user-1', email: 'john@example.com', firstName: 'John', lastName: 'Doe', avatar: null },
        project: { id: 'project-1', name: 'Test Project', color: '#3B82F6' },
        parent: null,
        children: [],
        blocks: [],
        comments: [],
        _count: { comments: 0, children: 0, attachments: 0 },
      });

      const result = await service.findById('note-1', 'user-1');

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when note not found', async () => {
      prisma.note.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not the creator', async () => {
      prisma.note.findUnique.mockResolvedValue({
        ...mockNote,
        createdBy: 'user-2',
        creator: { id: 'user-2' },
        project: null,
        parent: null,
        children: [],
        blocks: [],
        comments: [],
        _count: { comments: 0, children: 0, attachments: 0 },
      });

      await expect(service.findById('note-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update note when user is the creator', async () => {
      const dto: UpdateNoteDto = { title: 'Updated Note' };
      prisma.note.findUnique
        .mockResolvedValueOnce({
          ...mockNote,
          creator: { id: 'user-1' },
          project: null,
          parent: null,
          children: [],
          blocks: [],
          comments: [],
          _count: { comments: 0, children: 0, attachments: 0 },
        });
      prisma.note.update.mockResolvedValue({
        ...mockNote,
        title: 'Updated Note',
        creator: { id: 'user-1', email: 'john@example.com', firstName: 'John', lastName: 'Doe', avatar: null },
        project: null,
        _count: { comments: 0, children: 0 },
      });

      const result = await service.update('note-1', 'user-1', dto);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when note not found', async () => {
      const dto: UpdateNoteDto = { title: 'Updated' };
      prisma.note.findUnique.mockResolvedValue(null);

      await expect(service.update('nonexistent', 'user-1', dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete note when user is the creator', async () => {
      prisma.note.findUnique
        .mockResolvedValueOnce({
          ...mockNote,
          creator: { id: 'user-1' },
          project: null,
          parent: null,
          children: [],
          blocks: [],
          comments: [],
          _count: { comments: 0, children: 0, attachments: 0 },
        });
      prisma.note.delete.mockResolvedValue(mockNote);

      const result = await service.remove('note-1', 'user-1');

      expect(result).toEqual({ message: 'Note supprimée' });
    });

    it('should throw NotFoundException when note not found', async () => {
      prisma.note.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });
});
