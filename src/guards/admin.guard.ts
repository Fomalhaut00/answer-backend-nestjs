import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_ADMIN_KEY } from '../decorators/public.decorator';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isAdminRequired = this.reflector.getAllAndOverride<boolean>(
      IS_ADMIN_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isAdminRequired) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('需要管理员权限');
    }

    // 检查用户是否是管理员
    // 这里需要根据实际的用户角色系统来判断
    // 假设用户对象中有 role 字段或者 isAdmin 字段
    const isAdmin = user.role === 'admin' || user.isAdmin === true;

    if (!isAdmin) {
      throw new ForbiddenException('需要管理员权限');
    }

    return true;
  }
}
