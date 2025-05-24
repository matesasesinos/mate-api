import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserProfilesService } from './user-profiles.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfile } from './entities/user-profile.entity';
import { PaginationDto, OrderDirection } from '../common/dto/pagination.dto';

@ApiTags('user-profiles')
@ApiBearerAuth()
@Controller('user-profiles')
export class UserProfilesController {
  constructor(private readonly userProfilesService: UserProfilesService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a new user profile' })
  @ApiResponse({ status: 201, description: 'Profile successfully created.', type: UserProfile })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'Profile already exists for this user.' })
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createUserProfileDto: CreateUserProfileDto,
  ) {
    return this.userProfilesService.create(userId, createUserProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user profiles' })
  @ApiResponse({ status: 200, description: 'Return all profiles.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'per_page', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ 
    name: 'order', 
    required: false, 
    enum: OrderDirection,
    description: 'Sort order (ASC or DESC, default: DESC)' 
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userProfilesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user profile by id' })
  @ApiResponse({ status: 200, description: 'Return the profile.', type: UserProfile })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userProfilesService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get a user profile by user id' })
  @ApiResponse({ status: 200, description: 'Return the profile.', type: UserProfile })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.userProfilesService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user profile' })
  @ApiResponse({ status: 200, description: 'Profile successfully updated.', type: UserProfile })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userProfilesService.update(id, updateUserProfileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user profile' })
  @ApiResponse({ status: 200, description: 'Profile successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userProfilesService.remove(id);
  }
} 