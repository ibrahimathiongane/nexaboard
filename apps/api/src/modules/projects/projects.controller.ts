import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/guards/current-user.decorator';
import type { CurrentUser as CurrentUserType } from '../auth/guards/current-user.decorator';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post('workspaces/:workspaceId/projects')
  @ApiOperation({ summary: 'Créer un projet dans un espace de travail' })
  async create(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser() user: CurrentUserType,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectsService.create(workspaceId, user.id, dto);
  }

  @Get('workspaces/:workspaceId/projects')
  @ApiOperation({ summary: "Lister les projets d'un espace de travail" })
  async findAll(@Param('workspaceId') workspaceId: string, @CurrentUser() user: CurrentUserType) {
    return this.projectsService.findAllByWorkspace(workspaceId, user.id);
  }

  @Get('projects/:id')
  @ApiOperation({ summary: 'Obtenir un projet' })
  async findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.projectsService.findById(id, user.id);
  }

  @Patch('projects/:id')
  @ApiOperation({ summary: 'Modifier un projet' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserType,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, user.id, dto);
  }

  @Delete('projects/:id')
  @ApiOperation({ summary: 'Supprimer un projet' })
  async remove(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.projectsService.remove(id, user.id);
  }
}
