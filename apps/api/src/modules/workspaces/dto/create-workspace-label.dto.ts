import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateWorkspaceLabelDto {
  @ApiProperty({ example: 'Bug' })
  @IsString()
  @MaxLength(50)
  name!: string;

  @ApiPropertyOptional({ example: '#EF4444' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  color?: string;
}
