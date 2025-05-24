import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Si el usuario viene de una API Key, no tiene permisos
    if (user.type === 'api_key') {
      return false;
    }

    // Verificar si el usuario tiene los permisos requeridos
    return requiredPermissions.some((permission) => 
      user.permissions?.includes(permission)
    );
  }
} 