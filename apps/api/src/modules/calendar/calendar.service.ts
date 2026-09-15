import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateCalendarEventDto) {
    await this.verifyWorkspaceAccess(dto.workspaceId, userId);

    return this.prisma.calendarEvent.create({
      data: {
        title: dto.title,
        description: dto.description,
        location: dto.location,
        start: dto.start,
        end: dto.end,
        allDay: dto.allDay ?? false,
        recurrence: dto.recurrence,
        color: dto.color,
        taskId: dto.taskId,
        workspaceId: dto.workspaceId,
        userId,
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, avatar: true } },
        task: { select: { id: true, title: true, status: true } },
      },
    });
  }

  async findAllByUser(userId: string, start?: Date, end?: Date) {
    return this.prisma.calendarEvent.findMany({
      where: {
        userId,
        ...(start && end && {
          start: { gte: start },
          end: { lte: end },
        }),
      },
      include: {
        task: { select: { id: true, title: true, status: true } },
      },
      orderBy: { start: 'asc' },
    });
  }

  async findAllByWorkspace(workspaceId: string, userId: string, start?: Date, end?: Date) {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    return this.prisma.calendarEvent.findMany({
      where: {
        workspaceId,
        ...(start && end && {
          start: { gte: start },
          end: { lte: end },
        }),
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, avatar: true } },
        task: { select: { id: true, title: true, status: true } },
      },
      orderBy: { start: 'asc' },
    });
  }

  async findById(id: string, userId: string) {
    const event = await this.prisma.calendarEvent.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, avatar: true } },
        task: { select: { id: true, title: true, status: true } },
      },
    });

    if (!event) {
      throw new NotFoundException('Événement non trouvé');
    }

    if (event.userId !== userId) {
      const membership = await this.prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: { userId, workspaceId: event.workspaceId },
        },
      });

      if (!membership) {
        throw new ForbiddenException("Vous n'avez pas accès à cet événement");
      }
    }

    return event;
  }

  async update(id: string, userId: string, dto: UpdateCalendarEventDto) {
    await this.findById(id, userId);

    return this.prisma.calendarEvent.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.start && { start: dto.start }),
        ...(dto.end && { end: dto.end }),
        ...(dto.allDay !== undefined && { allDay: dto.allDay }),
        ...(dto.recurrence !== undefined && { recurrence: dto.recurrence }),
        ...(dto.color && { color: dto.color }),
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, avatar: true } },
        task: { select: { id: true, title: true, status: true } },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findById(id, userId);
    await this.prisma.calendarEvent.delete({ where: { id } });
    return { message: 'Événement supprimé' };
  }

  private async verifyWorkspaceAccess(workspaceId: string, userId: string) {
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
