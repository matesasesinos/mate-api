import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
      callbackURL: `${configService.get<string>('BASE_URL')}/api/auth/facebook/callback`,
      scope: ['email', 'public_profile'],
      profileFields: ['id', 'emails', 'name', 'picture'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
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