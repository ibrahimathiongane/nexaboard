import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderTaskItem {
  @ApiProperty()
  @IsString()
  taskId!: string;

  @ApiProperty()
  @IsString()
  status!: string;

  @ApiProperty()
  @IsNumber()
  order!: number;
}

export class ReorderTasksDto {
  @ApiProperty({ type: [ReorderTaskItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderTaskItem)
  items!: ReorderTaskItem[];
}
