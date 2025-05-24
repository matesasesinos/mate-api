import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { User } from './entities/user.entity';
import { EncryptionHelper } from '../utils/encryption.helper';

@Injectable()
export class InstallationService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async isInstalled(): Promise<boolean> {
    const adminRole = await this.rolesRepository.findOne({
      where: { name: 'admin' },
    });
    return !!adminRole;
  }

  async install(adminEmail: string, adminPassword: string): Promise<void> {
    // Check if already installed
    if (await this.isInstalled()) {
      throw new ConflictException('Application is already installed');
    }

    // Create permissions
    const permissions = await this.createPermissions();

    // Create roles
    const roles = await this.createRoles(permissions);

    // Create admin user
    await this.createAdminUser(adminEmail, adminPassword, roles);
  }

  private async createPermissions(): Promise<Permission[]> {
    const permissions = [
      // User permissions
      { name: 'create:user', description: 'Create users' },
      { name: 'read:users', description: 'View all users' },
      { name: 'read:user', description: 'View a specific user' },
      { name: 'update:user', description: 'Update users' },
      { name: 'delete:user', description: 'Delete users' },
      
      // Role permissions
      { name: 'create:role', description: 'Create roles' },
      { name: 'read:roles', description: 'View all roles' },
      { name: 'read:role', description: 'View a specific role' },
      { name: 'update:role', description: 'Update roles' },
      { name: 'delete:role', description: 'Delete roles' },
      
      // Permission permissions
      { name: 'create:permission', description: 'Create permissions' },
      { name: 'read:permissions', description: 'View all permissions' },
      { name: 'read:permission', description: 'View a specific permission' },
      { name: 'update:permission', description: 'Update permissions' },
      { name: 'delete:permission', description: 'Delete permissions' },
    ];

    const createdPermissions: Permission[] = [];
    for (const permission of permissions) {
      const created = this.permissionsRepository.create(permission);
      createdPermissions.push(await this.permissionsRepository.save(created));
    }

    return createdPermissions;
  }

  private async createRoles(permissions: Permission[]): Promise<Role[]> {
    const roles = [
      {
        name: 'admin',
        description: 'Administrator with full access',
        permissions: permissions, // All permissions
      },
      {
        name: 'moderator',
        description: 'Moderator with limited access',
        permissions: permissions.filter(p => 
          p.name.startsWith('read:') || 
          p.name === 'update:user'
        ),
      },
      {
        name: 'user',
        description: 'Regular user with basic access',
        permissions: permissions.filter(p => 
          p.name === 'read:user'
        ),
      },
    ];

    const createdRoles: Role[] = [];
    for (const role of roles) {
      const created = this.rolesRepository.create(role);
      createdRoles.push(await this.rolesRepository.save(created));
    }

    return createdRoles;
  }

  private async createAdminUser(
    email: string,
    password: string,
    roles: Role[],
  ): Promise<void> {
    const adminRole = roles.find(r => r.name === 'admin');
    if (!adminRole) {
      throw new Error('Admin role not found');
    }

    const hashedPassword = await EncryptionHelper.encryptHighSecurity(password);
    
    const adminUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      name: 'Admin',
      lastname: 'User',
      roles: [adminRole],
      isActive: true,
    });

    await this.usersRepository.save(adminUser);
  }
} 