import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserProfile } from './entities/user-profile.entity';
import { UserProfilesService } from './user-profiles.service';
import { UserProfilesController } from './user-profiles.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile]),
    ConfigModule,
  ],
  controllers: [UsersController, UserProfilesController],
  providers: [UsersService, UserProfilesService],
  exports: [UsersService, UserProfilesService],
})
export class UsersModule {} 