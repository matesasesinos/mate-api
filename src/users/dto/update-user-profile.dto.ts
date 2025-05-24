import { IsOptional, IsString, IsUrl, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserProfileDto {
  @ApiProperty({ 
    example: 'https://example.com/avatar.jpg',
    description: 'URL of the user\'s avatar image',
    required: false 
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  avatar?: string;

  @ApiProperty({ 
    example: '+1234567890',
    description: 'User\'s phone number',
    required: false 
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ 
    example: '+1234567890',
    description: 'User\'s mobile phone number',
    required: false 
  })
  @IsOptional()
  @IsString()
  phone_mobile?: string;

  @ApiProperty({ 
    example: '123 Main St',
    description: 'User\'s address',
    required: false 
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ 
    example: 'New York',
    description: 'User\'s city',
    required: false 
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ 
    example: 'NY',
    description: 'User\'s state',
    required: false 
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ 
    example: 'USA',
    description: 'User\'s country',
    required: false 
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ 
    example: 'alternative@email.com',
    description: 'User\'s alternative email address',
    required: false 
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  email_alternative?: string;

  @ApiProperty({ 
    example: {
      facebook: 'https://facebook.com/johndoe',
      twitter: 'https://twitter.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      instagram: 'https://instagram.com/johndoe'
    },
    description: 'User\'s social media links',
    required: false 
  })
  @IsOptional()
  @IsObject()
  socials?: Record<string, string>;
} 