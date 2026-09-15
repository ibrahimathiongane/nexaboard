import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/guards/current-user.decorator';
import type { CurrentUser as CurrentUserType } from '../auth/guards/current-user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post('projects/:projectId/tasks')
  @ApiOperation({ summary: 'Créer une tâche dans un projet' })
  async create(
    @Param('projectId') projectId: string,
    @CurrentUser() user: CurrentUserType,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(projectId, user.id, dto);
  }

  @Get('projects/:projectId/tasks')
  @ApiOperation({ summary: 'Lister les tâches d\'un projet' })
  async findAll(
    @Param('projectId') projectId: string,
    @CurrentUser() user: CurrentUserType,
    @Query() filters: TaskFilterDto,
  ) {
    return this.tasksService.findAllByProject(projectId, user.id, filters);
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Lister toutes les tâches de l\'utilisateur' })
  async findMine(
    @CurrentUser() user: CurrentUserType,
    @Query() filters: TaskFilterDto,
  ) {
    return this.tasksService.findAllForUser(user.id, filters);
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Obtenir une tâche' })
  async findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.tasksService.findById(id, user.id);
  }

  @Patch('tasks/:id')
  @ApiOperation({ summary: 'Modifier une tâche' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserType,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, user.id, dto);
  }

  @Delete('tasks/:id')
  @ApiOperation({ summary: 'Supprimer une tâche' })
  async remove(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.tasksService.remove(id, user.id);
  }

  @Post('tasks/:id/assign')
  @ApiOperation({ summary: 'Assigner une tâche' })
  async assign(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserType,
    @Body('userId') assigneeId: string,
  ) {
    return this.tasksService.assign(id, user.id, assigneeId);
  }

  @Delete('tasks/:id/assign/:assigneeId')
  @ApiOperation({ summary: 'Retirer l\'assignation d\'une tâche' })
  async unassign(
    @Param('id') id: string,
    @Param('assigneeId') assigneeId: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.tasksService.unassign(id, user.id, assigneeId);
  }

  @Post('tasks/:id/labels')
  @ApiOperation({ summary: 'Ajouter un label à une tâche' })
  async addLabel(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserType,
    @Body('labelId') labelId: string,
  ) {
    return this.tasksService.addLabel(id, user.id, labelId);
  }

  @Delete('tasks/:id/labels/:labelId')
  @ApiOperation({ summary: 'Retirer un label d\'une tâche' })
  async removeLabel(
    @Param('id') id: string,
    @Param('labelId') labelId: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.tasksService.removeLabel(id, user.id, labelId);
  }
}
