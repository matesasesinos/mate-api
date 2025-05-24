import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${configService.get<string>('BASE_URL')}/api/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      name: name.givenName,
      lastname: name.familyName,
      avatar: photos[0].value,
    };

    // Find or create user
    let dbUser = await this.usersService.findByEmail(user.email).catch(() => null);
    if (!dbUser) {
      // Create user with random password
      const randomPassword = Math.random().toString(36).slice(-8);
      dbUser = await this.usersService.create({
        ...user,
        password: randomPassword,
      });
    }

    done(null, dbUser);
  }
} 