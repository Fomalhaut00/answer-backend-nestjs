import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { UserRoleRel } from '../../entities/user-role-rel.entity';
import { RolePowerRel } from '../../entities/role-power-rel.entity';
import { GetPermissionDto, PermissionResponse, PERMISSIONS } from './dto/permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRoleRel)
    private userRoleRelRepository: Repository<UserRoleRel>,
    @InjectRepository(RolePowerRel)
    private rolePowerRelRepository: Repository<RolePowerRel>,
  ) {}

  async getPermission(userId: string, getPermissionDto: GetPermissionDto) {
    const { actions } = getPermissionDto;
    
    if (!userId) {
      // 未登录用户的权限检查
      return this.getGuestPermissions(actions);
    }

    // 获取用户信息
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 获取用户角色
    const userRole = await this.userRoleRelRepository.findOne({
      where: { userId },
      relations: ['role']
    });

    const permissions: Record<string, PermissionResponse> = {};
    
    for (const action of actions) {
      permissions[action] = await this.checkPermission(user, userRole?.role, action);
    }

    return permissions;
  }

  private async getGuestPermissions(actions: string[]): Promise<Record<string, PermissionResponse>> {
    const permissions: Record<string, PermissionResponse> = {};
    
    for (const action of actions) {
      // 游客只能查看，不能进行其他操作
      const hasPermission = this.isReadOnlyAction(action);
      permissions[action] = {
        has_permission: hasPermission,
        tip: hasPermission ? undefined : 'Please login to perform this action',
        rank: 0
      };
    }

    return permissions;
  }

  private async checkPermission(user: User, role: Role | undefined, action: string): Promise<PermissionResponse> {
    // 管理员拥有所有权限
    if (user.isAdmin) {
      return {
        has_permission: true,
        rank: user.rank
      };
    }

    // 根据用户等级和角色检查权限
    const hasRankPermission = this.checkUserRankPermission(user.rank, action);
    const hasRolePermission = await this.checkRolePermission(role, action);
    const hasPermission = hasRankPermission || hasRolePermission;

    const requiredRank = this.getRequiredRank(action);

    return {
      has_permission: hasPermission,
      tip: hasPermission ? undefined : `You need ${requiredRank} reputation to perform this action`,
      rank: requiredRank
    };
  }

  private checkUserRankPermission(userRank: number, action: string): boolean {
    const requiredRank = this.getRequiredRank(action);
    return userRank >= requiredRank;
  }

  private async checkRolePermission(role: Role | undefined, action: string): Promise<boolean> {
    if (!role) {
      return false;
    }

    // 管理员拥有所有权限
    if (role.name === 'admin') {
      return true;
    }

    // 查询角色权限关系表
    const rolePowerRel = await this.rolePowerRelRepository.findOne({
      where: {
        roleId: role.id,
        powerType: action
      }
    });

    return !!rolePowerRel;
  }

  private getRequiredRank(action: string): number {
    // 根据不同的操作返回所需的声誉值
    const rankRequirements: Record<string, number> = {
      [PERMISSIONS.QUESTION_ADD]: 1,
      [PERMISSIONS.QUESTION_EDIT]: 2000,
      [PERMISSIONS.QUESTION_DELETE]: 10000,
      [PERMISSIONS.QUESTION_CLOSE]: 3000,
      [PERMISSIONS.QUESTION_REOPEN]: 3000,
      [PERMISSIONS.QUESTION_VOTE_UP]: 15,
      [PERMISSIONS.QUESTION_VOTE_DOWN]: 125,
      [PERMISSIONS.QUESTION_PIN]: 10000,
      [PERMISSIONS.QUESTION_HIDE]: 10000,
      
      [PERMISSIONS.ANSWER_ADD]: 1,
      [PERMISSIONS.ANSWER_EDIT]: 2000,
      [PERMISSIONS.ANSWER_DELETE]: 10000,
      [PERMISSIONS.ANSWER_ACCEPT]: 1,
      [PERMISSIONS.ANSWER_VOTE_UP]: 15,
      [PERMISSIONS.ANSWER_VOTE_DOWN]: 125,
      
      [PERMISSIONS.COMMENT_ADD]: 50,
      [PERMISSIONS.COMMENT_EDIT]: 2000,
      [PERMISSIONS.COMMENT_DELETE]: 10000,
      [PERMISSIONS.COMMENT_VOTE_UP]: 15,
      
      [PERMISSIONS.REPORT_ADD]: 1,
      
      [PERMISSIONS.TAG_ADD]: 1500,
      [PERMISSIONS.TAG_EDIT]: 20000,
      [PERMISSIONS.TAG_DELETE]: 20000,
      [PERMISSIONS.TAG_SYNONYM]: 20000,
    };

    return rankRequirements[action] || 1;
  }

  private isReadOnlyAction(action: string): boolean {
    // 定义只读操作，游客可以执行
    const readOnlyActions = [
      'question.view',
      'answer.view',
      'comment.view',
      'tag.view',
      'user.view'
    ];

    return readOnlyActions.includes(action);
  }
}
