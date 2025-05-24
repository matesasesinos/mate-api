import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EncryptionHelper } from '../utils/encryption.helper';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles.map(role => role.name),
      permissions: user.roles.flatMap(role => 
        role.permissions.map(permission => permission.name)
      ),
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles.map(role => role.name),
        permissions: user.roles.flatMap(role => 
          role.permissions.map(permission => permission.name)
        ),
      },
    };
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('No user from google');
    }
    return {
      access_token: this.jwtService.sign({ email: req.user.email, sub: req.user.id }),
      user: req.user,
    };
  }

  async facebookLogin(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('No user from facebook');
    }
    return {
      access_token: this.jwtService.sign({ email: req.user.email, sub: req.user.id }),
      user: req.user,
    };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal that the user doesn't exist
      return;
    }

    const resetToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { expiresIn: '1h' },
    );

    // TODO: Send email with reset token
    console.log(`Reset token for ${email}: ${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOne(payload.sub);
      
      const hashedPassword = await EncryptionHelper.encryptHighSecurity(newPassword);
      await this.usersService.update(user.id, { password: hashedPassword });
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findOne(userId);
    const isPasswordValid = await EncryptionHelper.verify(currentPassword, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await EncryptionHelper.encryptHighSecurity(newPassword);
    await this.usersService.update(userId, { password: hashedPassword });
  }
} 