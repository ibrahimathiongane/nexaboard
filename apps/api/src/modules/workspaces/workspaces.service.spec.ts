import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

describe('WorkspacesService', () => {
  let service: WorkspacesService;
  let prisma: {
    workspace: {
      findUnique: jest.Mock;
      create: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    workspaceMember: { findUnique: jest.Mock; create: jest.Mock; delete: jest.Mock };
    workspaceSettings: { create: jest.Mock };
    user: { findUnique: jest.Mock };
  };

  const mockWorkspace = {
    id: 'ws-1',
    name: 'Test Workspace',
    slug: 'test-workspace',
    description: 'A test workspace',
    avatar: null,
    ownerId: 'user-1',
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
      workspace: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      workspaceMember: {
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
      workspaceSettings: {
        create: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkspacesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<WorkspacesService>(WorkspacesService);
  });

  describe('create', () => {
    it('should create a workspace with auto-generated slug', async () => {
      const dto: CreateWorkspaceDto = { name: 'My Workspace' };
      prisma.workspace.findUnique.mockResolvedValue(null);
      prisma.workspace.create.mockResolvedValue({
        ...mockWorkspace,
        members: [
          {
            userId: 'user-1',
            role: 'OWNER',
            user: {
              id: 'user-1',
              email: 'john@example.com',
              firstName: 'John',
              lastName: 'Doe',
              avatar: null,
            },
          },
        ],
        _count: { members: 1, projects: 0 },
      });
      prisma.workspaceSettings.create.mockResolvedValue({});

      const result = await service.create('user-1', dto);

      expect(prisma.workspace.findUnique).toHaveBeenCalledWith({ where: { slug: 'my-workspace' } });
      expect(prisma.workspace.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should create a workspace with provided slug', async () => {
      const dto: CreateWorkspaceDto = { name: 'My Workspace', slug: 'custom-slug' };
      prisma.workspace.findUnique.mockResolvedValue(null);
      prisma.workspace.create.mockResolvedValue({
        ...mockWorkspace,
        slug: 'custom-slug',
        members: [],
        _count: { members: 0, projects: 0 },
      });
      prisma.workspaceSettings.create.mockResolvedValue({});

      await service.create('user-1', dto);

      expect(prisma.workspace.findUnique).toHaveBeenCalledWith({ where: { slug: 'custom-slug' } });
    });

    it('should throw ConflictException when slug already exists', async () => {
      const dto: CreateWorkspaceDto = { name: 'My Workspace' };
      prisma.workspace.findUnique.mockResolvedValue(mockWorkspace);

      await expect(service.create('user-1', dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAllForUser', () => {
    it('should return workspaces where user is member', async () => {
      prisma.workspace.findMany.mockResolvedValue([mockWorkspace]);

      const result = await service.findAllForUser('user-1');

      expect(result).toEqual([mockWorkspace]);
      expect(prisma.workspace.findMany).toHaveBeenCalledWith({
        where: { members: { some: { userId: 'user-1' } } },
        include: expect.objectContaining({
          owner: expect.any(Object),
          _count: expect.any(Object),
        }),
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findById', () => {
    it('should return workspace when user is member', async () => {
      prisma.workspace.findUnique.mockResolvedValue({
        ...mockWorkspace,
        owner: {
          id: 'user-1',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          avatar: null,
        },
        members: [{ userId: 'user-1', role: 'OWNER', user: { id: 'user-1' } }],
        settings: {},
        _count: { members: 1, projects: 0 },
      });
      prisma.workspaceMember.findUnique.mockResolvedValue(mockMembership);

      const result = await service.findById('ws-1', 'user-1');

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when workspace not found', async () => {
      prisma.workspace.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not member', async () => {
      prisma.workspace.findUnique.mockResolvedValue({
        ...mockWorkspace,
        owner: { id: 'user-2' },
        members: [{ userId: 'user-1' }],
        settings: {},
        _count: { members: 1, projects: 0 },
      });
      prisma.workspaceMember.findUnique.mockResolvedValue(null);

      await expect(service.findById('ws-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update workspace when user is admin', async () => {
      const dto: UpdateWorkspaceDto = { name: 'Updated Name' };
      prisma.workspace.findUnique
        .mockResolvedValueOnce({
          ...mockWorkspace,
          owner: { id: 'user-1' },
          members: [{ userId: 'user-1' }],
          settings: {},
          _count: { members: 1, projects: 0 },
        })
        .mockResolvedValueOnce(mockMembership);
      prisma.workspaceMember.findUnique.mockResolvedValue(mockMembership);
      prisma.workspace.update.mockResolvedValue({ ...mockWorkspace, name: 'Updated Name' });

      const result = await service.update('ws-1', 'user-1', dto);

      expect(prisma.workspace.update).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw ForbiddenException when user is not admin', async () => {
      const dto: UpdateWorkspaceDto = { name: 'Updated Name' };
      prisma.workspace.findUnique
        .mockResolvedValueOnce({
          ...mockWorkspace,
          owner: { id: 'user-1' },
          members: [{ userId: 'user-2' }],
          settings: {},
          _count: { members: 1, projects: 0 },
        })
        .mockResolvedValueOnce(null);
      prisma.workspaceMember.findUnique.mockResolvedValue(null);

      await expect(service.update('ws-1', 'user-2', dto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete workspace when user is owner', async () => {
      prisma.workspace.findUnique.mockResolvedValueOnce({
        ...mockWorkspace,
        owner: { id: 'user-1' },
        members: [{ userId: 'user-1' }],
        settings: {},
        _count: { members: 1, projects: 0 },
      });
      prisma.workspaceMember.findUnique.mockResolvedValue(mockMembership);
      prisma.workspace.delete.mockResolvedValue(mockWorkspace);

      const result = await service.remove('ws-1', 'user-1');

      expect(prisma.workspace.delete).toHaveBeenCalledWith({ where: { id: 'ws-1' } });
      expect(result).toEqual({ message: 'Espace de travail supprimé' });
    });

    it('should throw ForbiddenException when user is not owner', async () => {
      prisma.workspace.findUnique.mockResolvedValueOnce({
        ...mockWorkspace,
        owner: { id: 'user-1' },
        members: [{ userId: 'user-2' }],
        settings: {},
        _count: { members: 1, projects: 0 },
      });
      prisma.workspaceMember.findUnique.mockResolvedValue({
        ...mockMembership,
        userId: 'user-2',
        role: 'MEMBER',
      });

      await expect(service.remove('ws-1', 'user-2')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('addMember', () => {
    it('should add a member to workspace', async () => {
      prisma.workspace.findUnique.mockResolvedValueOnce({
        ...mockWorkspace,
        owner: { id: 'user-1' },
        members: [{ userId: 'user-1' }],
        settings: {},
        _count: { members: 1, projects: 0 },
      });
      // findById → verifyMembership (call 1), requireAdminRole (call 2), existing member check (call 3)
      prisma.workspaceMember.findUnique
        .mockResolvedValueOnce(mockMembership) // findById → verifyMembership
        .mockResolvedValueOnce(mockMembership) // requireAdminRole
        .mockResolvedValueOnce(null); // existing member check
      prisma.user.findUnique.mockResolvedValue({ id: 'user-2', email: 'jane@example.com' });
      prisma.workspaceMember.create.mockResolvedValue({
        id: 'mem-2',
        userId: 'user-2',
        workspaceId: 'ws-1',
        role: 'MEMBER',
        user: {
          id: 'user-2',
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          avatar: null,
        },
      });

      const result = await service.addMember('ws-1', 'user-1', 'jane@example.com');

      expect(result).toBeDefined();
      expect(prisma.workspaceMember.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user to add not found', async () => {
      prisma.workspace.findUnique.mockResolvedValueOnce({
        ...mockWorkspace,
        owner: { id: 'user-1' },
        members: [{ userId: 'user-1' }],
        settings: {},
        _count: { members: 1, projects: 0 },
      });
      // findById → verifyMembership (call 1), requireAdminRole (call 2)
      prisma.workspaceMember.findUnique
        .mockResolvedValueOnce(mockMembership) // findById → verifyMembership
        .mockResolvedValueOnce(mockMembership); // requireAdminRole
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.addMember('ws-1', 'user-1', 'unknown@example.com')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when user is already member', async () => {
      prisma.workspace.findUnique.mockResolvedValueOnce({
        ...mockWorkspace,
        owner: { id: 'user-1' },
        members: [{ userId: 'user-1' }],
        settings: {},
        _count: { members: 1, projects: 0 },
      });
      // findById → verifyMembership (call 1), requireAdminRole (call 2), existing member check (call 3)
      prisma.workspaceMember.findUnique
        .mockResolvedValueOnce(mockMembership) // findById → verifyMembership
        .mockResolvedValueOnce(mockMembership) // requireAdminRole
        .mockResolvedValueOnce({ id: 'mem-2', userId: 'user-2', workspaceId: 'ws-1' }); // existing member
      prisma.user.findUnique.mockResolvedValue({ id: 'user-2', email: 'jane@example.com' });

      await expect(service.addMember('ws-1', 'user-1', 'jane@example.com')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('removeMember', () => {
    it('should remove a member from workspace', async () => {
      prisma.workspace.findUnique
        .mockResolvedValueOnce({
          ...mockWorkspace,
          owner: { id: 'user-1' },
          members: [{ userId: 'user-1' }],
          settings: {},
          _count: { members: 1, projects: 0 },
        })
        .mockResolvedValueOnce(mockWorkspace); // owner check
      prisma.workspaceMember.findUnique.mockResolvedValue(mockMembership);
      prisma.workspaceMember.delete.mockResolvedValue({});

      const result = await service.removeMember('ws-1', 'user-1', 'user-2');

      expect(result).toEqual({ message: 'Membre retiré avec succès' });
    });

    it('should throw ForbiddenException when trying to remove owner', async () => {
      prisma.workspace.findUnique
        .mockResolvedValueOnce({
          ...mockWorkspace,
          owner: { id: 'user-1' },
          members: [{ userId: 'user-1' }],
          settings: {},
          _count: { members: 1, projects: 0 },
        })
        .mockResolvedValueOnce(mockWorkspace); // owner check
      prisma.workspaceMember.findUnique.mockResolvedValue(mockMembership);

      await expect(service.removeMember('ws-1', 'user-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
