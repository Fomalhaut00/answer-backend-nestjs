import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleService } from '../modules/role/role.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // 获取用户角色
    const userRole = await this.roleService.getUserRole(user.sub);
    
    if (!userRole.role) {
      throw new ForbiddenException('User has no role assigned');
    }

    // 检查用户是否具有所需角色
    const hasRole = requiredRoles.includes(userRole.role.name);
    
    if (!hasRole) {
      throw new ForbiddenException(
        `Insufficient role. Required: ${requiredRoles.join(', ')}. Current: ${userRole.role.name}`
      );
    }

    return true;
  }
}
