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
import { CalendarService } from './calendar.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

@ApiTags('Calendar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un événement' })
  async create(@CurrentUser() user: CurrentUserType, @Body() dto: CreateCalendarEventDto) {
    return this.calendarService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les événements de l\'utilisateur' })
  async findAll(
    @CurrentUser() user: CurrentUserType,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.calendarService.findAllByUser(
      user.id,
      start ? new Date(start) : undefined,
      end ? new Date(end) : undefined,
    );
  }

  @Get('workspace/:workspaceId')
  @ApiOperation({ summary: 'Lister les événements d\'un espace de travail' })
  async findAllByWorkspace(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser() user: CurrentUserType,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.calendarService.findAllByWorkspace(
      workspaceId,
      user.id,
      start ? new Date(start) : undefined,
      end ? new Date(end) : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un événement' })
  async findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.calendarService.findById(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un événement' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserType,
    @Body() dto: UpdateCalendarEventDto,
  ) {
    return this.calendarService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un événement' })
  async remove(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.calendarService.remove(id, user.id);
  }
}
