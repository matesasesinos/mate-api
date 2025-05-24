import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Si el usuario viene de una API Key, no tiene roles
    if (user.type === 'api_key') {
      return false;
    }

    // Verificar si el usuario tiene los roles requeridos
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
} 