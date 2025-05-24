import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({ description: 'Name of the role', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Description of the role', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Whether the role is active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 