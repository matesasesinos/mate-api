import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserProfile } from './entities/user-profile.entity';
import { UserProfilesService } from './user-profiles.service';
import { UserProfilesController } from './user-profiles.controller';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { InstallationService } from './installation.service';
import { InstallationController } from './installation.controller';
import { CombinedAuthGuard } from '../auth/guards/combined-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, Role, Permission]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    UsersController,
    UserProfilesController,
    PermissionsController,
    RolesController,
    InstallationController,
  ],
  providers: [
    UsersService,
    UserProfilesService,
    PermissionsService,
    RolesService,
    InstallationService,
    CombinedAuthGuard,
  ],
  exports: [UsersService, UserProfilesService],
})
export class UsersModule {} 