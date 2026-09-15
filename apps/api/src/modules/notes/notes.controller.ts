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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/guards/current-user.decorator';
import type { CurrentUser as CurrentUserType } from '../auth/guards/current-user.decorator';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une note' })
  async create(@CurrentUser() user: CurrentUserType, @Body() dto: CreateNoteDto) {
    return this.notesService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les notes de l\'utilisateur' })
  @ApiQuery({ name: 'projectId', required: false })
  async findAll(
    @CurrentUser() user: CurrentUserType,
    @Query('projectId') projectId?: string,
  ) {
    if (projectId) {
      return this.notesService.findAllByProject(projectId, user.id);
    }
    return this.notesService.findAllByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une note' })
  async findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.notesService.findById(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier une note' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserType,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une note' })
  async remove(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.notesService.remove(id, user.id);
  }
}
