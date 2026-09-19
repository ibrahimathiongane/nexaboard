import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let projectsService: jest.Mocked<ProjectsService>;

  const mockProject = {
    id: 'project-1',
    name: 'Test Project',
    description: 'A test project',
    color: '#3B82F6',
    icon: 'folder',
    workspaceId: 'ws-1',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  const mockUser = { id: 'user-1', email: 'test@example.com' };

  beforeEach(async () => {
    const mockProjectsService = {
      create: jest.fn().mockResolvedValue(mockProject),
      findAllByWorkspace: jest.fn().mockResolvedValue([mockProject]),
      findById: jest.fn().mockResolvedValue(mockProject),
      update: jest.fn().mockResolvedValue({ ...mockProject, name: 'Updated Project' }),
      remove: jest.fn().mockResolvedValue({ message: 'Projet supprimé' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [{ provide: ProjectsService, useValue: mockProjectsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProjectsController>(ProjectsController);
    projectsService = module.get(ProjectsService);
  });

  describe('create', () => {
    it('should create a project', async () => {
      const dto = { name: 'New Project', description: 'A new project' };

      const result = await controller.create('ws-1', mockUser as any, dto);

      expect(result).toEqual(mockProject);
      expect(projectsService.create).toHaveBeenCalledWith('ws-1', 'user-1', dto);
    });
  });

  describe('findAll', () => {
    it('should return projects for a workspace', async () => {
      const result = await controller.findAll('ws-1', mockUser as any);

      expect(result).toEqual([mockProject]);
      expect(projectsService.findAllByWorkspace).toHaveBeenCalledWith('ws-1', 'user-1');
    });
  });

  describe('findOne', () => {
    it('should return a project by id', async () => {
      const result = await controller.findOne('project-1', mockUser as any);

      expect(result).toEqual(mockProject);
      expect(projectsService.findById).toHaveBeenCalledWith('project-1', 'user-1');
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const dto = { name: 'Updated Project' };

      const result = await controller.update('project-1', mockUser as any, dto);

      expect(result).toEqual({ ...mockProject, name: 'Updated Project' });
      expect(projectsService.update).toHaveBeenCalledWith('project-1', 'user-1', dto);
    });
  });

  describe('remove', () => {
    it('should delete a project', async () => {
      const result = await controller.remove('project-1', mockUser as any);

      expect(result).toEqual({ message: 'Projet supprimé' });
      expect(projectsService.remove).toHaveBeenCalledWith('project-1', 'user-1');
    });
  });
});
