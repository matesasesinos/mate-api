import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdatePermissionDto {
  @ApiProperty({ description: 'Name of the permission', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Description of the permission', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Whether the permission is active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 