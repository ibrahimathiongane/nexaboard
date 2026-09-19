import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: {
    task: {
      findUnique: jest.Mock;
      create: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    taskAssignee: { create: jest.Mock; deleteMany: jest.Mock };
    taskLabel: { create: jest.Mock; deleteMany: jest.Mock };
    project: { findUnique: jest.Mock };
    workspaceMember: { findMany: jest.Mock };
    label: { findMany: jest.Mock };
  };

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
      task: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      taskAssignee: {
        create: jest.fn(),
        deleteMany: jest.fn(),
      },
      taskLabel: {
        create: jest.fn(),
        deleteMany: jest.fn(),
      },
      project: {
        findUnique: jest.fn(),
      },
      workspaceMember: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      label: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('create', () => {
    it('should create a task when user has project access', async () => {
      const dto: CreateTaskDto = { title: 'New Task' };
      prisma.project.findUnique.mockResolvedValue(mockProject);
      prisma.task.create.mockResolvedValue({
        ...mockTask,
        assignees: [],
        labels: [],
        subtasks: [],
        _count: { comments: 0, subtasks: 0 },
      });

      const result = await service.create('project-1', 'user-1', dto);

      expect(result).toBeDefined();
      expect(prisma.task.create).toHaveBeenCalled();
    });

    it('should create task with assignees and labels', async () => {
      const dto: CreateTaskDto = {
        title: 'Task with extras',
        assigneeIds: ['user-2', 'user-3'],
        labelIds: ['label-1'],
      };
      prisma.project.findUnique.mockResolvedValue(mockProject);
      prisma.workspaceMember.findMany.mockResolvedValue([
        { userId: 'user-2' },
        { userId: 'user-3' },
      ]);
      prisma.label.findMany.mockResolvedValue([{ id: 'label-1' }]);
      prisma.task.create.mockResolvedValue({
        ...mockTask,
        title: 'Task with extras',
        assignees: [
          {
            userId: 'user-2',
            user: {
              id: 'user-2',
              email: 'jane@example.com',
              firstName: 'Jane',
              lastName: 'Smith',
              avatar: null,
            },
          },
        ],
        labels: [{ label: { id: 'label-1', name: 'Bug' } }],
        subtasks: [],
        _count: { comments: 0, subtasks: 0 },
      });

      const result = await service.create('project-1', 'user-1', dto);

      expect(result).toBeDefined();
      const createCall = prisma.task.create.mock.calls[0][0];
      expect(createCall.data.assignees).toBeDefined();
      expect(createCall.data.labels).toBeDefined();
    });

    it('should throw NotFoundException when project not found', async () => {
      const dto: CreateTaskDto = { title: 'New Task' };
      prisma.project.findUnique.mockResolvedValue(null);

      await expect(service.create('nonexistent', 'user-1', dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user has no access', async () => {
      const dto: CreateTaskDto = { title: 'New Task' };
      prisma.project.findUnique.mockResolvedValue({
        ...mockProject,
        workspace: { members: [] },
      });

      await expect(service.create('project-1', 'user-1', dto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAllByProject', () => {
    it('should return tasks when user has access', async () => {
      prisma.project.findUnique.mockResolvedValue(mockProject);
      prisma.task.findMany.mockResolvedValue([
        {
          ...mockTask,
          assignees: [],
          labels: [],
          subtasks: [],
          _count: { comments: 0, subtasks: 0 },
        },
      ]);

      const result = await service.findAllByProject('project-1', 'user-1');

      expect(result).toHaveLength(1);
    });

    it('should return filtered tasks', async () => {
      const filters: TaskFilterDto = { status: 'DONE', priority: 'HIGH' };
      prisma.project.findUnique.mockResolvedValue(mockProject);
      prisma.task.findMany.mockResolvedValue([]);

      await service.findAllByProject('project-1', 'user-1', filters);

      const findCall = prisma.task.findMany.mock.calls[0][0];
      expect(findCall.where.status).toBe('DONE');
      expect(findCall.where.priority).toBe('HIGH');
    });

    it('should throw ForbiddenException when user has no access', async () => {
      prisma.project.findUnique.mockResolvedValue({
        ...mockProject,
        workspace: { members: [] },
      });

      await expect(service.findAllByProject('project-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findById', () => {
    it('should return task when user has access', async () => {
      prisma.task.findUnique.mockResolvedValue({
        ...mockTask,
        project: mockProject,
        assignees: [],
        labels: [],
        subtasks: [],
        comments: [],
        _count: { comments: 0, subtasks: 0 },
      });

      const result = await service.findById('task-1', 'user-1');

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when task not found', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user has no access', async () => {
      prisma.task.findUnique.mockResolvedValue({
        ...mockTask,
        project: {
          workspace: { members: [] },
        },
        assignees: [],
        labels: [],
        subtasks: [],
        comments: [],
        _count: { comments: 0, subtasks: 0 },
      });

      await expect(service.findById('task-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update task when user has access', async () => {
      const dto: UpdateTaskDto = { title: 'Updated Task' };
      prisma.task.findUnique.mockResolvedValueOnce({
        ...mockTask,
        project: mockProject,
        assignees: [],
        labels: [],
        subtasks: [],
        comments: [],
        _count: { comments: 0, subtasks: 0 },
      });
      prisma.task.update.mockResolvedValue({
        ...mockTask,
        title: 'Updated Task',
        assignees: [],
        labels: [],
        _count: { comments: 0, subtasks: 0 },
      });

      const result = await service.update('task-1', 'user-1', dto);

      expect(result).toBeDefined();
    });

    it('should set completedAt when status changes to DONE', async () => {
      const dto: UpdateTaskDto = { status: 'DONE' };
      prisma.task.findUnique.mockResolvedValueOnce({
        ...mockTask,
        project: mockProject,
        assignees: [],
        labels: [],
        subtasks: [],
        comments: [],
        _count: { comments: 0, subtasks: 0 },
      });
      prisma.task.update.mockResolvedValue({
        ...mockTask,
        status: 'DONE',
        completedAt: new Date(),
        assignees: [],
        labels: [],
        _count: { comments: 0, subtasks: 0 },
      });

      await service.update('task-1', 'user-1', dto);

      const updateCall = prisma.task.update.mock.calls[0][0];
      expect(updateCall.data.status).toBe('DONE');
      expect(updateCall.data.completedAt).toBeInstanceOf(Date);
    });

    it('should set completedAt to null when status changes from DONE', async () => {
      const dto: UpdateTaskDto = { status: 'TODO' };
      prisma.task.findUnique.mockResolvedValueOnce({
        ...mockTask,
        status: 'DONE',
        project: mockProject,
        assignees: [],
        labels: [],
        subtasks: [],
        comments: [],
        _count: { comments: 0, subtasks: 0 },
      });
      prisma.task.update.mockResolvedValue({
        ...mockTask,
        status: 'TODO',
        completedAt: null,
        assignees: [],
        labels: [],
        _count: { comments: 0, subtasks: 0 },
      });

      await service.update('task-1', 'user-1', dto);

      const updateCall = prisma.task.update.mock.calls[0][0];
      expect(updateCall.data.status).toBe('TODO');
      expect(updateCall.data.completedAt).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete task when user has access', async () => {
      prisma.task.findUnique.mockResolvedValueOnce({
        ...mockTask,
        project: mockProject,
        assignees: [],
        labels: [],
        subtasks: [],
        comments: [],
        _count: { comments: 0, subtasks: 0 },
      });
      prisma.task.delete.mockResolvedValue(mockTask);

      const result = await service.remove('task-1', 'user-1');

      expect(result).toEqual({ message: 'Tâche supprimée' });
    });

    it('should throw NotFoundException when task not found', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('assign', () => {
    it('should assign user to task', async () => {
      prisma.task.findUnique.mockResolvedValueOnce({
        ...mockTask,
        project: mockProject,
        assignees: [],
        labels: [],
        subtasks: [],
        comments: [],
        _count: { comments: 0, subtasks: 0 },
      });
      prisma.taskAssignee.create.mockResolvedValue({
        taskId: 'task-1',
        userId: 'user-2',
        user: {
          id: 'user-2',
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          avatar: null,
        },
      });
      prisma.workspaceMember.findMany.mockResolvedValue([{ userId: 'user-2' }]);

      const result = await service.assign('task-1', 'user-1', 'user-2');

      expect(result).toBeDefined();
      expect(prisma.taskAssignee.create).toHaveBeenCalled();
    });
  });

  describe('unassign', () => {
    it('should unassign user from task', async () => {
      prisma.task.findUnique.mockResolvedValueOnce({
        ...mockTask,
        project: mockProject,
        assignees: [],
        labels: [],
        subtasks: [],
        comments: [],
        _count: { comments: 0, subtasks: 0 },
      });
      prisma.taskAssignee.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.unassign('task-1', 'user-1', 'user-2');

      expect(result).toEqual({ message: 'Assignation retirée' });
    });
  });

  describe('addLabel', () => {
    it('should add label to task', async () => {
      prisma.task.findUnique.mockResolvedValueOnce({
        ...mockTask,
        project: mockProject,
        assignees: [],
        labels: [],
        subtasks: [],
        comments: [],
        _count: { comments: 0, subtasks: 0 },
      });
      prisma.taskLabel.create.mockResolvedValue({
        taskId: 'task-1',
        labelId: 'label-1',
        label: { id: 'label-1', name: 'Bug' },
      });
      prisma.label.findMany.mockResolvedValue([{ id: 'label-1' }]);

      const result = await service.addLabel('task-1', 'user-1', 'label-1');

      expect(result).toBeDefined();
      expect(prisma.taskLabel.create).toHaveBeenCalled();
    });
  });

  describe('removeLabel', () => {
    it('should remove label from task', async () => {
      prisma.task.findUnique.mockResolvedValueOnce({
        ...mockTask,
        project: mockProject,
        assignees: [],
        labels: [],
        subtasks: [],
        comments: [],
        _count: { comments: 0, subtasks: 0 },
      });
      prisma.taskLabel.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.removeLabel('task-1', 'user-1', 'label-1');

      expect(result).toEqual({ message: 'Label retiré' });
    });
  });
});
