import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';

@Injectable()
export class CombinedAuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    
    // Verificar API Key para todos los endpoints
    const apiKey = request.headers['api-x-key'];
    const validApiKey = this.configService.get<string>('API_KEY');
    
    if (!apiKey || apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    // Si es un endpoint público, solo necesitamos la API Key
    if (isPublic) {
      request.user = { type: 'api_key' };
      return true;
    }

    // Para endpoints protegidos, necesitamos el JWT token
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('JWT token is required for protected endpoints');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization type');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      // Obtener el usuario completo con sus roles y permisos
      const user = await this.usersService.findOne(payload.sub);
      
      request.user = {
        ...payload,
        type: 'jwt',
        roles: user.roles.map(role => role.name),
        permissions: user.roles.flatMap(role => 
          role.permissions.map(permission => permission.name)
        ),
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }
} 