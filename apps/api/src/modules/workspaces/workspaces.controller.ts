import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/guards/current-user.decorator';
import type { CurrentUser as CurrentUserType } from '../auth/guards/current-user.decorator';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AddWorkspaceMemberDto } from './dto/add-workspace-member.dto';
import { CreateWorkspaceLabelDto } from './dto/create-workspace-label.dto';

@ApiTags('Workspaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un espace de travail' })
  async create(@CurrentUser() user: CurrentUserType, @Body() dto: CreateWorkspaceDto) {
    return this.workspacesService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: "Lister les espaces de travail de l'utilisateur" })
  async findAll(@CurrentUser() user: CurrentUserType) {
    return this.workspacesService.findAllForUser(user.id);
  }

  // ── Routes spécifiques AVANT les routes génériques ──────────────

  @Get(':id/dashboard')
  @ApiOperation({ summary: 'Obtenir les statistiques du dashboard' })
  async dashboard(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.workspacesService.getDashboard(id, user.id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: "Lister les membres de l'espace de travail" })
  async findMembers(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.workspacesService.findAllMembers(id, user.id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: "Ajouter un membre à l'espace de travail" })
  async addMember(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserType,
    @Body() dto: AddWorkspaceMemberDto,
  ) {
    return this.workspacesService.addMember(id, user.id, dto.email, dto.role);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: "Retirer un membre de l'espace de travail" })
  async removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.workspacesService.removeMember(id, user.id, memberId);
  }

  @Get(':id/labels')
  @ApiOperation({ summary: 'Lister les labels de l’espace de travail' })
  async findLabels(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.workspacesService.findAllLabels(id, user.id);
  }

  @Post(':id/labels')
  @ApiOperation({ summary: 'Créer un label dans l’espace de travail' })
  async createLabel(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserType,
    @Body() dto: CreateWorkspaceLabelDto,
  ) {
    return this.workspacesService.createLabel(id, user.id, dto);
  }

  @Delete(':id/labels/:labelId')
  @ApiOperation({ summary: 'Supprimer un label de l’espace de travail' })
  async removeLabel(
    @Param('id') id: string,
    @Param('labelId') labelId: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.workspacesService.removeLabel(id, user.id, labelId);
  }

  // ── Routes génériques APRÈS les routes spécifiques ──────────────

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un espace de travail' })
  async findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.workspacesService.findById(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un espace de travail' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserType,
    @Body() dto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un espace de travail' })
  async remove(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.workspacesService.remove(id, user.id);
  }
}
