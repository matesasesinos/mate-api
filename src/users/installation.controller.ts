import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InstallationService } from './installation.service';
import { IsEmail, IsString, MinLength } from 'class-validator';

class InstallDto {
  @IsEmail()
  adminEmail: string;

  @IsString()
  @MinLength(8)
  adminPassword: string;
}

@ApiTags('Installation')
@Controller('install')
export class InstallationController {
  constructor(private readonly installationService: InstallationService) {}

  @Get()
  @ApiOperation({ summary: 'Check if application is installed' })
  @ApiResponse({ status: 200, description: 'Return installation status' })
  async checkInstallation() {
    const isInstalled = await this.installationService.isInstalled();
    return {
      success: true,
      data: {
        isInstalled,
      },
    };
  }

  @Post()
  @ApiOperation({ summary: 'Install the application' })
  @ApiResponse({ status: 201, description: 'Application installed successfully' })
  @ApiResponse({ status: 409, description: 'Application is already installed' })
  async install(@Body() installDto: InstallDto) {
    await this.installationService.install(
      installDto.adminEmail,
      installDto.adminPassword,
    );
    return {
      success: true,
      data: {
        message: 'Application installed successfully',
      },
    };
  }
} 