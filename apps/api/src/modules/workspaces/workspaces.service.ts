import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { MemberRole } from '@prisma/client';
import { CreateWorkspaceLabelDto } from './dto/create-workspace-label.dto';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateWorkspaceDto) {
    const slug = dto.slug || this.slugify(dto.name);

    const existing = await this.prisma.workspace.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException('Un espace de travail avec ce slug existe déjà');
    }

    return this.prisma.workspace.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
        settings: {
          create: {},
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
            },
          },
        },
        _count: {
          select: { members: true, projects: true },
        },
      },
    });
  }

  async findAllMembers(workspaceId: string, userId: string) {
    await this.verifyMembership(workspaceId, userId);

    return this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        owner: {
          select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
        },
        _count: {
          select: { members: true, projects: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDashboard(workspaceId: string, userId: string) {
    await this.verifyMembership(workspaceId, userId);

    const now = new Date();
    const [projects, activeTasks, totalNotes, upcomingEvents] = await Promise.all([
      this.prisma.project.findMany({
        where: { workspaceId, archived: false },
        include: {
          _count: { select: { tasks: true, notes: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({
        where: {
          project: { workspaceId },
          status: { in: ['TODO', 'IN_PROGRESS'] },
        },
      }),
      this.prisma.note.count({
        where: {
          project: { workspaceId: workspaceId },
        },
      }),
      this.prisma.calendarEvent.count({
        where: { workspaceId, start: { gte: now } },
      }),
    ]);

    return {
      stats: {
        activeTasks,
        activeProjects: projects.length,
        totalNotes,
        upcomingEvents,
      },
      recentProjects: projects.slice(0, 5),
    };
  }

  async findById(id: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
            },
          },
        },
        settings: true,
        _count: {
          select: { members: true, projects: true },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Espace de travail non trouvé');
    }

    await this.verifyMembership(id, userId);

    return workspace;
  }

  async update(id: string, userId: string, dto: UpdateWorkspaceDto) {
    await this.findById(id, userId);
    await this.requireAdminRole(id, userId);

    return this.prisma.workspace.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.avatar !== undefined && { avatar: dto.avatar }),
      },
      include: {
        _count: {
          select: { members: true, projects: true },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findById(id, userId);

    const membership = await this.prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId, workspaceId: id } },
    });
    if (!membership || membership.role !== 'OWNER') {
      throw new ForbiddenException('Seul le propriétaire peut supprimer cet espace');
    }

    await this.prisma.workspace.delete({ where: { id } });
    return { message: 'Espace de travail supprimé' };
  }

  async addMember(
    workspaceId: string,
    userId: string,
    email: string,
    role: MemberRole = MemberRole.MEMBER,
  ) {
    await this.findById(workspaceId, userId);
    await this.requireAdminRole(workspaceId, userId);

    const userToAdd = await this.prisma.user.findUnique({ where: { email } });
    if (!userToAdd) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const existingMember = await this.prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: userToAdd.id, workspaceId } },
    });
    if (existingMember) {
      throw new ConflictException('Cet utilisateur est déjà membre');
    }

    return this.prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: userToAdd.id,
        role,
      },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });
  }

  async removeMember(workspaceId: string, userId: string, memberId: string) {
    await this.findById(workspaceId, userId);
    await this.requireAdminRole(workspaceId, userId);

    const workspace = await this.prisma.workspace.findUnique({ where: { id: workspaceId } });
    if (workspace && workspace.ownerId === memberId) {
      throw new ForbiddenException('Le propriétaire ne peut pas être retiré');
    }

    await this.prisma.workspaceMember.delete({
      where: {
        userId_workspaceId: { userId: memberId, workspaceId },
      },
    });

    return { message: 'Membre retiré avec succès' };
  }

  async findAllLabels(workspaceId: string, userId: string) {
    await this.verifyMembership(workspaceId, userId);
    return this.prisma.label.findMany({
      where: { workspaceId },
      orderBy: { name: 'asc' },
    });
  }

  async createLabel(workspaceId: string, userId: string, dto: CreateWorkspaceLabelDto) {
    await this.requireAdminRole(workspaceId, userId);
    return this.prisma.label.create({
      data: {
        workspaceId,
        name: dto.name.trim(),
        color: dto.color ?? '#6B7280',
      },
    });
  }

  async removeLabel(workspaceId: string, userId: string, labelId: string) {
    await this.requireAdminRole(workspaceId, userId);
    const label = await this.prisma.label.findUnique({ where: { id: labelId } });
    if (!label || label.workspaceId !== workspaceId) {
      throw new NotFoundException('Label non trouvé');
    }
    await this.prisma.label.delete({ where: { id: labelId } });
    return { message: 'Label supprimé' };
  }

  private async verifyMembership(workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
    });
    if (!membership) {
      throw new ForbiddenException("Vous n'avez pas accès à cet espace de travail");
    }
    return membership;
  }

  private async requireAdminRole(workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
    });
    if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
      throw new ForbiddenException('Seuls les administrateurs peuvent effectuer cette action');
    }
    return membership;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}
