import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';
import { MemberRole } from '@prisma/client';

export class AddWorkspaceMemberDto {
  @ApiProperty({ example: 'member@example.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ enum: MemberRole, default: MemberRole.MEMBER })
  @IsEnum(MemberRole)
  role: MemberRole = MemberRole.MEMBER;
}
