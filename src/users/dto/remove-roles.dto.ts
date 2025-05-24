import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class RemoveRolesDto {
  @ApiProperty({
    description: 'Array of role IDs to remove from the user',
    type: [Number],
    example: [1, 2]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  roleIds: number[];
} 