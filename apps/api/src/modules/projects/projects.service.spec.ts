import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prisma: {
    project: { findUnique: jest.Mock; create: jest.Mock; findMany: jest.Mock; update: jest.Mock; delete: jest.Mock };
    workspaceMember: { findUnique: jest.Mock };
  };

  const mockProject = {
    id: 'project-1',
    name: 'Test Project',
    description: 'A test project',
    color: '#3B82F6',
    icon: 'folder',
    archived: false,
    workspaceId: 'ws-1',
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
      project: {
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
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  describe('create', () => {
    it('should create a project when user is workspace member', async () => {
      const dto: CreateProjectDto = { name: 'New Project', color: '#3B82F6' };
      prisma.workspaceMember.findUnique.mockResolvedValue(mockMembership);
      prisma.project.create.mockResolvedValue({
        ...mockProject,
        _count: { tasks: 0, notes: 0 },
      });

      const result = await service.create('ws-1', 'user-1', dto);

      expect(result).toBeDefined();
      expect(prisma.project.create).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not workspace member', async () => {
      const dto: CreateProjectDto = { name: 'New Project' };
      prisma.workspaceMember.findUnique.mockResolvedValue(null);

      await expect(service.create('ws-1', 'user-1', dto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAllByWorkspace', () => {
    it('should return projects when user is workspace member', async () => {
      prisma.workspaceMember.findUnique.mockResolvedValue(mockMembership);
      prisma.project.findMany.mockResolvedValue([{ ...mockProject, _count: { tasks: 0, notes: 0 } }]);

      const result = await service.findAllByWorkspace('ws-1', 'user-1');

      expect(result).toHaveLength(1);
      expect(prisma.project.findMany).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not workspace member', async () => {
      prisma.workspaceMember.findUnique.mockResolvedValue(null);

      await expect(service.findAllByWorkspace('ws-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findById', () => {
    it('should return project when user has access', async () => {
      prisma.project.findUnique.mockResolvedValue({
        ...mockProject,
        workspace: {
          members: [{ userId: 'user-1' }],
        },
        _count: { tasks: 0, notes: 0 },
      });

      const result = await service.findById('project-1', 'user-1');

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when project not found', async () => {
      prisma.project.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user has no access', async () => {
      prisma.project.findUnique.mockResolvedValue({
        ...mockProject,
        workspace: {
          members: [],
        },
        _count: { tasks: 0, notes: 0 },
      });

      await expect(service.findById('project-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update project when user has access', async () => {
      const dto: UpdateProjectDto = { name: 'Updated Project' };
      prisma.project.findUnique
        .mockResolvedValueOnce({
          ...mockProject,
          workspace: { members: [{ userId: 'user-1' }] },
          _count: { tasks: 0, notes: 0 },
        });
      prisma.project.update.mockResolvedValue({
        ...mockProject,
        name: 'Updated Project',
        _count: { tasks: 0, notes: 0 },
      });

      const result = await service.update('project-1', 'user-1', dto);

      expect(result).toBeDefined();
      expect(prisma.project.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when project not found', async () => {
      const dto: UpdateProjectDto = { name: 'Updated' };
      prisma.project.findUnique.mockResolvedValue(null);

      await expect(service.update('nonexistent', 'user-1', dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete project when user has access', async () => {
      prisma.project.findUnique
        .mockResolvedValueOnce({
          ...mockProject,
          workspace: { members: [{ userId: 'user-1' }] },
          _count: { tasks: 0, notes: 0 },
        });
      prisma.project.delete.mockResolvedValue(mockProject);

      const result = await service.remove('project-1', 'user-1');

      expect(result).toEqual({ message: 'Projet supprimé' });
      expect(prisma.project.delete).toHaveBeenCalledWith({ where: { id: 'project-1' } });
    });

    it('should throw NotFoundException when project not found', async () => {
      prisma.project.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });
});
