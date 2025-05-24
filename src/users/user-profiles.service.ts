import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PaginationDto, OrderDirection } from '../common/dto/pagination.dto';
import { PaginationHelper, PaginatedResponse } from '../utils/pagination.helper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserProfilesService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfilesRepository: Repository<UserProfile>,
    private configService: ConfigService,
  ) {}

  async create(userId: number, createUserProfileDto: CreateUserProfileDto): Promise<UserProfile> {
    // Check if profile already exists for this user
    const existingProfile = await this.userProfilesRepository.findOne({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException('Profile already exists for this user');
    }

    const profile = this.userProfilesRepository.create({
      userId,
      ...createUserProfileDto,
    });

    return await this.userProfilesRepository.save(profile);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponse<UserProfile>> {
    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    return PaginationHelper.paginate(this.userProfilesRepository, paginationDto, {
      baseUrl: `${baseUrl}/api/user-profiles`,
      orderBy: 'createdAt',
      defaultOrder: OrderDirection.DESC,
      relations: { user: true },
    });
  }

  async findOne(id: number): Promise<UserProfile> {
    const profile = await this.userProfilesRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    return profile;
  }

  async findByUserId(userId: number): Promise<UserProfile> {
    const profile = await this.userProfilesRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user ID ${userId} not found`);
    }

    return profile;
  }

  async update(id: number, updateUserProfileDto: UpdateUserProfileDto): Promise<UserProfile> {
    const profile = await this.findOne(id);
    Object.assign(profile, updateUserProfileDto);
    return await this.userProfilesRepository.save(profile);
  }

  async remove(id: number): Promise<void> {
    const profile = await this.findOne(id);
    await this.userProfilesRepository.remove(profile);
  }
} 