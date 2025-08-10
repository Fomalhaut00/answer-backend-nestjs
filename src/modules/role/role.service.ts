import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { User } from '../../entities/user.entity';
import { UserRoleRel } from '../../entities/user-role-rel.entity';
import { RolePowerRel } from '../../entities/role-power-rel.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolePageDto, UpdateUserRoleDto, GetRoleResp } from './dto/role-query.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserRoleRel)
    private userRoleRelRepository: Repository<UserRoleRel>,
    @InjectRepository(RolePowerRel)
    private rolePowerRelRepository: Repository<RolePowerRel>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    // Check if role with name already exists
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name }
    });
    if (existingRole) {
      throw new ConflictException('Role name already exists');
    }

    // Create new role
    const role = this.roleRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
    });

    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async getRoleMapping(): Promise<Record<number, Role>> {
    const roleList = await this.findAll();
    const roleMapping: Record<number, Role> = {};
    
    for (const role of roleList) {
      roleMapping[role.id] = role;
    }
    
    return roleMapping;
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Check if name is being updated and if it conflicts
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name }
      });
      if (existingRole) {
        throw new ConflictException('Role name already exists');
      }
    }

    // Update role
    await this.roleRepository.update(id, updateRoleDto);

    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // 检查是否有用户使用此角色
    const userCount = await this.userRoleRelRepository.count({ where: { roleId: id } });
    if (userCount > 0) {
      throw new ConflictException('Cannot delete role that is assigned to users');
    }

    // 删除角色相关的权限关系
    await this.rolePowerRelRepository.delete({ roleId: id });

    // Remove the role
    await this.roleRepository.remove(role);

    return { message: `Role with ID ${id} has been deleted` };
  }

  async getRoleList(): Promise<GetRoleResp[]> {
    const roles = await this.roleRepository.find({
      order: { id: 'ASC' }
    });

    return roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      created_at: role.createdAt,
      updated_at: role.updatedAt
    }));
  }

  async getRolePage(rolePageDto: RolePageDto) {
    const { page = 1, size = 20, query } = rolePageDto;
    const skip = (page - 1) * size;

    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (query) {
      queryBuilder.where(
        'role.name LIKE :query OR role.description LIKE :query',
        { query: `%${query}%` }
      );
    }

    const [roles, total] = await queryBuilder
      .orderBy('role.id', 'ASC')
      .skip(skip)
      .take(size)
      .getManyAndCount();

    return {
      roles: roles.map(role => ({
        id: role.id,
        name: role.name,
        description: role.description,
        created_at: role.createdAt,
        updated_at: role.updatedAt
      })),
      total,
      page,
      size
    };
  }

  async updateUserRole(userId: string, updateUserRoleDto: UpdateUserRoleDto, operatorId?: string) {
    // 检查用户是否存在
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 检查角色是否存在
    const role = await this.roleRepository.findOne({ where: { id: updateUserRoleDto.role_id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // 检查是否已存在用户角色关系
    const existingUserRole = await this.userRoleRelRepository.findOne({
      where: { userId }
    });

    if (existingUserRole) {
      // 更新现有关系
      await this.userRoleRelRepository.update(
        { userId },
        { roleId: updateUserRoleDto.role_id }
      );
    } else {
      // 创建新的用户角色关系
      const userRoleRel = this.userRoleRelRepository.create({
        userId,
        roleId: updateUserRoleDto.role_id
      });
      await this.userRoleRelRepository.save(userRoleRel);
    }

    return { message: 'User role updated successfully' };
  }

  async getUserRole(userId: string) {
    const userRole = await this.userRoleRelRepository.findOne({
      where: { userId },
      relations: ['role']
    });

    if (!userRole) {
      // 返回默认角色（假设ID为1的是默认角色）
      const defaultRole = await this.roleRepository.findOne({ where: { id: 1 } });
      return {
        user_id: userId,
        role_id: 1,
        role: defaultRole
      };
    }

    return {
      user_id: userId,
      role_id: userRole.roleId,
      role: userRole.role
    };
  }

  async getUsersByRole(roleId: number) {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const userRoles = await this.userRoleRelRepository.find({
      where: { roleId },
      relations: ['user']
    });

    return {
      role,
      users: userRoles.map(ur => ({
        id: ur.user.id,
        username: ur.user.username,
        display_name: ur.user.displayName,
        avatar: ur.user.avatar,
        created_at: ur.createdAt
      }))
    };
  }
}