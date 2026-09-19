import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: jest.Mocked<TasksService>;

  const mockTask = {
    id: 'task-1',
    title: 'Test Task',
    description: 'A test task',
    status: 'TODO',
    priority: 'MEDIUM',
    order: 0,
    startDate: null,
    dueDate: null,
    completedAt: null,
    estimatedHours: null,
    points: null,
    projectId: 'project-1',
    parentId: null,
    createdBy: 'user-1',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    assignees: [],
    labels: [],
    subtasks: [],
    _count: { comments: 0, subtasks: 0 },
  };

  const mockUser = { id: 'user-1', email: 'test@example.com' };

  beforeEach(async () => {
    const mockTasksService = {
      create: jest.fn().mockResolvedValue(mockTask),
      findAllByProject: jest.fn().mockResolvedValue([mockTask]),
      findById: jest.fn().mockResolvedValue(mockTask),
      update: jest.fn().mockResolvedValue({ ...mockTask, title: 'Updated Task' }),
      remove: jest.fn().mockResolvedValue({ message: 'Tâche supprimée' }),
      assign: jest.fn().mockResolvedValue({ taskId: 'task-1', userId: 'user-2' }),
      unassign: jest.fn().mockResolvedValue({ message: 'Assignation retirée' }),
      addLabel: jest.fn().mockResolvedValue({ taskId: 'task-1', labelId: 'label-1' }),
      removeLabel: jest.fn().mockResolvedValue({ message: 'Label retiré' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockTasksService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get(TasksService);
  });

  describe('create', () => {
    it('should create a task', async () => {
      const dto = { title: 'New Task' };

      const result = await controller.create('project-1', mockUser as any, dto);

      expect(result).toEqual(mockTask);
      expect(tasksService.create).toHaveBeenCalledWith('project-1', 'user-1', dto);
    });
  });

  describe('findAll', () => {
    it('should return tasks for a project', async () => {
      const filters = {};

      const result = await controller.findAll('project-1', mockUser as any, filters as any);

      expect(result).toEqual([mockTask]);
      expect(tasksService.findAllByProject).toHaveBeenCalledWith('project-1', 'user-1', filters);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const result = await controller.findOne('task-1', mockUser as any);

      expect(result).toEqual(mockTask);
      expect(tasksService.findById).toHaveBeenCalledWith('task-1', 'user-1');
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const dto = { title: 'Updated Task' };

      const result = await controller.update('task-1', mockUser as any, dto);

      expect(result).toEqual({ ...mockTask, title: 'Updated Task' });
      expect(tasksService.update).toHaveBeenCalledWith('task-1', 'user-1', dto);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      const result = await controller.remove('task-1', mockUser as any);

      expect(result).toEqual({ message: 'Tâche supprimée' });
      expect(tasksService.remove).toHaveBeenCalledWith('task-1', 'user-1');
    });
  });

  describe('assign', () => {
    it('should assign a user to a task', async () => {
      const result = await controller.assign('task-1', mockUser as any, 'user-2');

      expect(result).toEqual({ taskId: 'task-1', userId: 'user-2' });
      expect(tasksService.assign).toHaveBeenCalledWith('task-1', 'user-1', 'user-2');
    });
  });

  describe('unassign', () => {
    it('should unassign a user from a task', async () => {
      const result = await controller.unassign('task-1', 'user-2', mockUser as any);

      expect(result).toEqual({ message: 'Assignation retirée' });
      expect(tasksService.unassign).toHaveBeenCalledWith('task-1', 'user-1', 'user-2');
    });
  });

  describe('addLabel', () => {
    it('should add a label to a task', async () => {
      const result = await controller.addLabel('task-1', mockUser as any, 'label-1');

      expect(result).toEqual({ taskId: 'task-1', labelId: 'label-1' });
      expect(tasksService.addLabel).toHaveBeenCalledWith('task-1', 'user-1', 'label-1');
    });
  });

  describe('removeLabel', () => {
    it('should remove a label from a task', async () => {
      const result = await controller.removeLabel('task-1', 'label-1', mockUser as any);

      expect(result).toEqual({ message: 'Label retiré' });
      expect(tasksService.removeLabel).toHaveBeenCalledWith('task-1', 'user-1', 'label-1');
    });
  });
});
