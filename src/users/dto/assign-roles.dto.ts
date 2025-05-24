import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class AssignRolesDto {
  @ApiProperty({
    description: 'Array of role IDs to assign to the user',
    type: [Number],
    example: [1, 2]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  roleIds: number[];
} 