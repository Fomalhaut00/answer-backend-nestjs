import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PermissionService } from '../modules/permission/permission.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // 检查用户权限
    const permissions = await this.permissionService.getPermission(user.sub, {
      actions: requiredPermissions,
    });

    // 检查是否所有必需的权限都满足
    for (const permission of requiredPermissions) {
      if (!permissions[permission]?.has_permission) {
        throw new ForbiddenException(
          `Insufficient permissions. Required: ${permission}. ${permissions[permission]?.tip || ''}`
        );
      }
    }

    return true;
  }
}
