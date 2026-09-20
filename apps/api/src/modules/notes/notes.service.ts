import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateNoteDto) {
    if (dto.projectId) {
      await this.verifyProjectAccess(dto.projectId, userId);
    }

    return this.prisma.note.create({
      data: {
        title: dto.title,
        content: dto.content ? JSON.parse(dto.content) : {},
        contentMd: dto.contentMd,
        icon: dto.icon,
        cover: dto.cover,
        projectId: dto.projectId,
        parentId: dto.parentId,
        createdBy: userId,
      },
      include: {
        creator: {
          select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
        },
        project: { select: { id: true, name: true, color: true } },
        _count: { select: { comments: true, children: true } },
      },
    });
  }

  async findAllByUser(userId: string, workspaceId?: string) {
    return this.prisma.note.findMany({
      where: {
        createdBy: userId,
        ...(workspaceId && { project: { workspaceId } }),
      },
      include: {
        project: { select: { id: true, name: true, color: true } },
        _count: { select: { comments: true, children: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findAllByProject(projectId: string, userId: string) {
    await this.verifyProjectAccess(projectId, userId);

    return this.prisma.note.findMany({
      where: { projectId },
      include: {
        creator: {
          select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
        },
        _count: { select: { comments: true, children: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
        },
        project: { select: { id: true, name: true, color: true } },
        parent: { select: { id: true, title: true } },
        children: { select: { id: true, title: true } },
        blocks: { orderBy: { order: 'asc' } },
        comments: {
          include: {
            creator: {
              select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { comments: true, children: true, attachments: true } },
      },
    });

    if (!note) {
      throw new NotFoundException('Note non trouvée');
    }

    if (note.createdBy !== userId) {
      throw new ForbiddenException("Vous n'avez pas accès à cette note");
    }

    return note;
  }

  async update(id: string, userId: string, dto: UpdateNoteDto) {
    await this.findById(id, userId);

    return this.prisma.note.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.content !== undefined && { content: JSON.parse(dto.content) }),
        ...(dto.contentMd !== undefined && { contentMd: dto.contentMd }),
        ...(dto.icon !== undefined && { icon: dto.icon }),
        ...(dto.cover !== undefined && { cover: dto.cover }),
        ...(dto.projectId !== undefined && { projectId: dto.projectId || null }),
        ...(dto.published !== undefined && { published: dto.published }),
        ...(dto.archived !== undefined && { archived: dto.archived }),
      },
      include: {
        creator: {
          select: { id: true, email: true, firstName: true, lastName: true, avatar: true },
        },
        project: { select: { id: true, name: true, color: true } },
        _count: { select: { comments: true, children: true } },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findById(id, userId);
    await this.prisma.note.delete({ where: { id } });
    return { message: 'Note supprimée' };
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
}
