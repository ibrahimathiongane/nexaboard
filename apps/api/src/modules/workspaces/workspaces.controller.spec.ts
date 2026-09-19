import { Test, TestingModule } from '@nestjs/testing';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('WorkspacesController', () => {
  let controller: WorkspacesController;
  let workspacesService: jest.Mocked<WorkspacesService>;

  const mockWorkspace = {
    id: 'ws-1',
    name: 'Test Workspace',
    slug: 'test-workspace',
    description: 'A test workspace',
    plan: 'FREE',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  const mockUser = { id: 'user-1', email: 'test@example.com' };

  beforeEach(async () => {
    const mockWorkspacesService = {
      create: jest.fn().mockResolvedValue(mockWorkspace),
      findAllForUser: jest.fn().mockResolvedValue([mockWorkspace]),
      findById: jest.fn().mockResolvedValue(mockWorkspace),
      update: jest.fn().mockResolvedValue({ ...mockWorkspace, name: 'Updated Workspace' }),
      remove: jest.fn().mockResolvedValue({ message: 'Espace supprimé' }),
      addMember: jest.fn().mockResolvedValue({ message: 'Membre ajouté' }),
      removeMember: jest.fn().mockResolvedValue({ message: 'Membre retiré' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspacesController],
      providers: [{ provide: WorkspacesService, useValue: mockWorkspacesService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<WorkspacesController>(WorkspacesController);
    workspacesService = module.get(WorkspacesService);
  });

  describe('create', () => {
    it('should create a workspace', async () => {
      const dto = { name: 'New Workspace', description: 'A new workspace' };

      const result = await controller.create(mockUser as any, dto);

      expect(result).toEqual(mockWorkspace);
      expect(workspacesService.create).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('findAll', () => {
    it('should return user workspaces', async () => {
      const result = await controller.findAll(mockUser as any);

      expect(result).toEqual([mockWorkspace]);
      expect(workspacesService.findAllForUser).toHaveBeenCalledWith('user-1');
    });
  });

  describe('findOne', () => {
    it('should return a workspace by id', async () => {
      const result = await controller.findOne('ws-1', mockUser as any);

      expect(result).toEqual(mockWorkspace);
      expect(workspacesService.findById).toHaveBeenCalledWith('ws-1', 'user-1');
    });
  });

  describe('update', () => {
    it('should update a workspace', async () => {
      const dto = { name: 'Updated Workspace' };

      const result = await controller.update('ws-1', mockUser as any, dto);

      expect(result).toEqual({ ...mockWorkspace, name: 'Updated Workspace' });
      expect(workspacesService.update).toHaveBeenCalledWith('ws-1', 'user-1', dto);
    });
  });

  describe('remove', () => {
    it('should delete a workspace', async () => {
      const result = await controller.remove('ws-1', mockUser as any);

      expect(result).toEqual({ message: 'Espace supprimé' });
      expect(workspacesService.remove).toHaveBeenCalledWith('ws-1', 'user-1');
    });
  });

  describe('addMember', () => {
    it('should add a member to workspace', async () => {
      const dto = { email: 'member@example.com', role: 'MEMBER' as const };
      const result = await controller.addMember('ws-1', mockUser as any, dto);

      expect(result).toEqual({ message: 'Membre ajouté' });
      expect(workspacesService.addMember).toHaveBeenCalledWith(
        'ws-1',
        'user-1',
        'member@example.com',
        'MEMBER',
      );
    });
  });

  describe('removeMember', () => {
    it('should remove a member from workspace', async () => {
      const result = await controller.removeMember('ws-1', 'member-1', mockUser as any);

      expect(result).toEqual({ message: 'Membre retiré' });
      expect(workspacesService.removeMember).toHaveBeenCalledWith('ws-1', 'user-1', 'member-1');
    });
  });
});
