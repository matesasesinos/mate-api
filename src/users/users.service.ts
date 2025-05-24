import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { EncryptionHelper } from '../utils/encryption.helper';
import { PaginationDto, OrderDirection } from '../common/dto/pagination.dto';
import { PaginationHelper, PaginatedResponse } from '../utils/pagination.helper';
import { ConfigService } from '@nestjs/config';
import { Role } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: Partial<User>): Promise<User> {
    if (!createUserDto.password) {
      throw new BadRequestException('Password is required');
    }

    // Check if user with email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Encrypt password using high security settings
    const hashedPassword = await EncryptionHelper.encryptHighSecurity(createUserDto.password);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.usersRepository.save(user);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponse<User>> {
    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    return PaginationHelper.paginate(this.usersRepository, paginationDto, {
      baseUrl: `${baseUrl}/api/users`,
      orderBy: 'createdAt',
      defaultOrder: OrderDirection.DESC,
      relations: {
        profile: true,
        roles: {
          permissions: true
        }
      },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile', 'roles', 'roles.permissions'],
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['profile', 'roles', 'roles.permissions'],
    });
    
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<User> {
    const user = await this.findOne(id);

    // If password is being updated, encrypt it
    if (updateUserDto.password) {
      updateUserDto.password = await EncryptionHelper.encryptHighSecurity(updateUserDto.password);
    }

    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    const isPasswordValid = await EncryptionHelper.verify(password, user.password);
    
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid credentials');
    }

    return user;
  }

  async assignRoles(userId: number, roleIds: number[]): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const roles = await this.rolesRepository.findByIds(roleIds);
    if (roles.length !== roleIds.length) {
      throw new NotFoundException('One or more roles not found');
    }

    user.roles = roles;
    return this.usersRepository.save(user);
  }

  async removeRoles(userId: number, roleIds: number[]): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Filter out the roles that need to be removed
    user.roles = user.roles.filter(role => !roleIds.includes(role.id));
    
    return this.usersRepository.save(user);
  }
} 