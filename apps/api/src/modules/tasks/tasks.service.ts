import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(projectId: string, userId: string, dto: CreateTaskDto) {
    const project = await this.verifyProjectAccess(projectId, userId);
    await this.verifyTaskReferences(project.workspaceId, dto.assigneeIds, dto.labelIds);

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || 'TODO',
        priority: dto.priority || 'MEDIUM',
        startDate: dto.startDate,
        dueDate: dto.dueDate,
        estimatedHours: dto.estimatedHours,
        points: dto.points,
        parentId: dto.parentId,
        projectId,
        createdBy: userId,
        assignees: dto.assigneeIds
          ? { create: dto.assigneeIds.map((id) => ({ userId: id })) }
          : undefined,
        labels: dto.labelIds ? { create: dto.labelIds.map((id) => ({ labelId: id })) } : undefined,
      },
      include: {
        assignees: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
            },
          },
        },
        labels: { include: { label: true } },
        subtasks: true,
        _count: { select: { comments: true, subtasks: true } },
      },
    });
  }

  async findAllForUser(userId: string, filters?: TaskFilterDto) {
    const where: Prisma.TaskWhereInput = {
      project: {
        workspace: {
          members: { some: { userId } },
        },
      },
      ...(filters?.status && { status: filters.status }),
      ...(filters?.priority && { priority: filters.priority }),
      ...(filters?.assigneeId && {
        assignees: { some: { userId: filters.assigneeId } },
      }),
      ...(filters?.workspaceId && {
        project: {
          workspaceId: filters.workspaceId,
          workspace: { members: { some: { userId } } },
        },
      }),
    };

    return this.prisma.task.findMany({
      where,
      include: {
        project: { select: { id: true, name: true, color: true } },
        assignees: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
            },
          },
        },
        labels: { include: { label: true } },
        _count: { select: { comments: true, subtasks: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findAllByProject(projectId: string, userId: string, filters?: TaskFilterDto) {
    await this.verifyProjectAccess(projectId, userId);

    const where: Prisma.TaskWhereInput = {
      projectId,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.priority && { priority: filters.priority }),
      ...(filters?.assigneeId && {
        assignees: { some: { userId: filters.assigneeId } },
      }),
    };

    return this.prisma.task.findMany({
      where,
      include: {
        assignees: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
            },
          },
        },
        labels: { include: { label: true } },
        subtasks: true,
        _count: { select: { comments: true, subtasks: true } },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findById(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            workspace: {
              include: { members: { where: { userId } } },
            },
          },
        },
        assignees: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
            },
          },
        },
        labels: { include: { label: true } },
        subtasks: true,
        comments: {
          include: {
            creator: {
              select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { comments: true, subtasks: true } },
      },
    });

    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }

    if (task.project.workspace.members.length === 0) {
      throw new ForbiddenException("Vous n'avez pas accès à cette tâche");
    }

    return task;
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    await this.findById(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status && {
          status: dto.status,
          completedAt: dto.status === 'DONE' ? new Date() : null,
        }),
        ...(dto.priority && { priority: dto.priority }),
        ...(dto.startDate !== undefined && { startDate: dto.startDate }),
        ...(dto.dueDate !== undefined && { dueDate: dto.dueDate }),
        ...(dto.estimatedHours !== undefined && { estimatedHours: dto.estimatedHours }),
        ...(dto.points !== undefined && { points: dto.points }),
        ...(dto.order !== undefined && { order: dto.order }),
      },
      include: {
        assignees: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
            },
          },
        },
        labels: { include: { label: true } },
        _count: { select: { comments: true, subtasks: true } },
      },
    });
  }

  async reorder(_userId: string, items: { taskId: string; status: string; order: number }[]) {
    const updates = items.map((item) =>
      this.prisma.task.update({
        where: { id: item.taskId },
        data: {
          status: item.status as any,
          order: item.order,
          ...(item.status === 'DONE' ? { completedAt: new Date() } : {}),
        },
      }),
    );

    await this.prisma.$transaction(updates);
    return { message: 'Tâches réordonnées' };
  }

  async remove(id: string, userId: string) {
    await this.findById(id, userId);
    await this.prisma.task.delete({ where: { id } });
    return { message: 'Tâche supprimée' };
  }

  async assign(taskId: string, userId: string, assigneeId: string) {
    const task = await this.findById(taskId, userId);
    await this.verifyTaskReferences(task.project.workspaceId, [assigneeId]);

    return this.prisma.taskAssignee.create({
      data: { taskId, userId: assigneeId },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, avatar: true } },
      },
    });
  }

  async unassign(taskId: string, userId: string, assigneeId: string) {
    await this.findById(taskId, userId);

    await this.prisma.taskAssignee.deleteMany({
      where: { taskId, userId: assigneeId },
    });

    return { message: 'Assignation retirée' };
  }

  async addLabel(taskId: string, userId: string, labelId: string) {
    const task = await this.findById(taskId, userId);
    await this.verifyTaskReferences(task.project.workspaceId, undefined, [labelId]);

    return this.prisma.taskLabel.create({
      data: { taskId, labelId },
      include: { label: true },
    });
  }

  async removeLabel(taskId: string, userId: string, labelId: string) {
    await this.findById(taskId, userId);

    await this.prisma.taskLabel.deleteMany({
      where: { taskId, labelId },
    });

    return { message: 'Label retiré' };
  }

  private async verifyProjectAccess(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        workspace: {
          include: { members: { where: { userId } } },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Projet non trouvé');
    }

    if (project.workspace.members.length === 0) {
      throw new ForbiddenException("Vous n'avez pas accès à ce projet");
    }

    return project;
  }

  private async verifyTaskReferences(
    workspaceId: string,
    assigneeIds?: string[],
    labelIds?: string[],
  ) {
    if (assigneeIds?.length) {
      const members = await this.prisma.workspaceMember.findMany({
        where: { workspaceId, userId: { in: assigneeIds } },
        select: { userId: true },
      });
      if (members.length !== new Set(assigneeIds).size) {
        throw new ForbiddenException(
          'Tous les assignés doivent appartenir à cet espace de travail',
        );
      }
    }

    if (labelIds?.length) {
      const labels = await this.prisma.label.findMany({
        where: { workspaceId, id: { in: labelIds } },
        select: { id: true },
      });
      if (labels.length !== new Set(labelIds).size) {
        throw new ForbiddenException('Tous les labels doivent appartenir à cet espace de travail');
      }
    }
  }
}
