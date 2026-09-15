import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(workspaceId: string, userId: string, dto: CreateProjectDto) {
    await this.verifyMembership(workspaceId, userId);

    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        color: dto.color,
        icon: dto.icon,
        workspaceId,
      },
      include: {
        _count: {
          select: { tasks: true, notes: true },
        },
      },
    });
  }

  async findAllByWorkspace(workspaceId: string, userId: string) {
    await this.verifyMembership(workspaceId, userId);

    return this.prisma.project.findMany({
      where: { workspaceId },
      include: {
        _count: {
          select: { tasks: true, notes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        workspace: {
          include: {
            members: { where: { userId } },
          },
        },
        _count: {
          select: { tasks: true, notes: true },
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

  async update(id: string, userId: string, dto: UpdateProjectDto) {
    await this.findById(id, userId);

    return this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.color && { color: dto.color }),
        ...(dto.icon !== undefined && { icon: dto.icon }),
        ...(dto.archived !== undefined && { archived: dto.archived }),
      },
      include: {
        _count: {
          select: { tasks: true, notes: true },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findById(id, userId);

    await this.prisma.project.delete({ where: { id } });
    return { message: 'Projet supprimé' };
  }

  private async verifyMembership(workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: { userId, workspaceId },
      },
    });

    if (!membership) {
      throw new ForbiddenException("Vous n'avez pas accès à cet espace de travail");
    }

    return membership;
  }
}
