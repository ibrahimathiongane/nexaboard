import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import type { Prisma } from '@prisma/client';

export class CreateCalendarEventDto {
  @ApiProperty({ example: "Réunion d'équipe" })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'Réunion hebdomadaire' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 'Salle de réunion A' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  start!: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  end!: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  allDay?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  recurrence?: Prisma.InputJsonValue;

  @ApiPropertyOptional({ example: '#3B82F6' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  taskId?: string;

  @ApiProperty()
  @IsString()
  workspaceId!: string;
}
