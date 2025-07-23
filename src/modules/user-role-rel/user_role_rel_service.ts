import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserRoleRel } from '../../entities/user-role-rel.entity';
import { CreateUserRoleRelDto, UpdateUserRoleRelDto, QueryUserRoleRelDto } from './dto/user_role_rel_dto';

@Injectable()
export class UserRoleRelService {
  constructor(
    @InjectRepository(UserRoleRel)
    private readonly userRoleRelRepository: Repository<UserRoleRel>,
  ) {}

  // SaveUserRoleRel逻辑，支持upsert操作
  async saveUserRoleRel(userId: string, roleId: number): Promise<UserRoleRel> {
    return await this.userRoleRelRepository.manager.transaction(async (manager) => {
      const existingRel = await manager.findOne(UserRoleRel, {
        where: { userId },
      });

      if (existingRel) {
        // 如果存在，更新roleId
        existingRel.roleId = roleId;
        return await manager.save(UserRoleRel, existingRel);
      } else {
        // 如果不存在，创建新记录
        const newRel = manager.create(UserRoleRel, { userId, roleId });
        return await manager.save(UserRoleRel, newRel);
      }
    });
  }

  // GetUserRoleRelList逻辑
  async getUserRoleRelList(userIds: string[]): Promise<UserRoleRel[]> {
    if (!userIds || userIds.length === 0) {
      return [];
    }
    
    return await this.userRoleRelRepository.find({
      where: {
        userId: In(userIds),
      },
    });
  }

  // GetUserRoleRelListByRoleID逻辑
  async getUserRoleRelListByRoleId(roleIds: number[]): Promise<UserRoleRel[]> {
    if (!roleIds || roleIds.length === 0) {
      return [];
    }
    
    return await this.userRoleRelRepository.find({
      where: {
        roleId: In(roleIds),
      },
    });
  }

  // GetUserRoleRel逻辑，返回单个用户的角色关系
  async getUserRoleRel(userId: string): Promise<{ userRoleRel: UserRoleRel | null; exist: boolean }> {
    const userRoleRel = await this.userRoleRelRepository.findOne({
      where: { userId },
    });

    return {
      userRoleRel,
      exist: !!userRoleRel,
    };
  }

  // 保留原有的create方法，但使用字符串类型的userId
  async create(createUserRoleRelDto: CreateUserRoleRelDto): Promise<UserRoleRel> {
    // 检查是否已存在相同的用户角色关系
    const existingRel = await this.userRoleRelRepository.findOne({
      where: {
        userId: createUserRoleRelDto.userId,
        roleId: createUserRoleRelDto.roleId,
      },
    });

    if (existingRel) {
      throw new ConflictException('User role relationship already exists');
    }

    const userRoleRel = this.userRoleRelRepository.create(createUserRoleRelDto);
    return await this.userRoleRelRepository.save(userRoleRel);
  }

  async findAll(query: QueryUserRoleRelDto): Promise<{ data: UserRoleRel[]; total: number }> {
    const { page = 1, limit = 10, userId, roleId } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRoleRelRepository.createQueryBuilder('userRoleRel')
      .leftJoinAndSelect('userRoleRel.user', 'user')
      .leftJoinAndSelect('userRoleRel.role', 'role');

    if (userId) {
      queryBuilder.andWhere('userRoleRel.userId = :userId', { userId });
    }

    if (roleId) {
      queryBuilder.andWhere('userRoleRel.roleId = :roleId', { roleId });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('userRoleRel.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<UserRoleRel> {
    const userRoleRel = await this.userRoleRelRepository.findOne({
      where: { id },
      relations: ['user', 'role'],
    });

    if (!userRoleRel) {
      throw new NotFoundException(`User role relationship with ID ${id} not found`);
    }

    return userRoleRel;
  }

  // 修改为支持字符串类型的userId
  async findByUserId(userId: string): Promise<UserRoleRel[]> {
    return await this.userRoleRelRepository.find({
      where: { userId },
      relations: ['role'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByRoleId(roleId: number): Promise<UserRoleRel[]> {
    return await this.userRoleRelRepository.find({
      where: { roleId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateUserRoleRelDto: UpdateUserRoleRelDto): Promise<UserRoleRel> {
    const userRoleRel = await this.findOne(id);

    // 如果要更新的用户角色关系已存在，抛出冲突异常
    if (updateUserRoleRelDto.userId || updateUserRoleRelDto.roleId) {
      const existingRel = await this.userRoleRelRepository.findOne({
        where: {
          userId: updateUserRoleRelDto.userId || userRoleRel.userId,
          roleId: updateUserRoleRelDto.roleId || userRoleRel.roleId,
        },
      });

      if (existingRel && existingRel.id !== id) {
        throw new ConflictException('User role relationship already exists');
      }
    }

    Object.assign(userRoleRel, updateUserRoleRelDto);
    return await this.userRoleRelRepository.save(userRoleRel);
  }

  async remove(id: number): Promise<void> {
    const userRoleRel = await this.findOne(id);
    await this.userRoleRelRepository.remove(userRoleRel);
  }

  // 修改为支持字符串类型的userId
  async removeUserRole(userId: string, roleId: number): Promise<void> {
    const userRoleRel = await this.userRoleRelRepository.findOne({
      where: { userId, roleId },
    });

    if (!userRoleRel) {
      throw new NotFoundException(`User role relationship not found`);
    }

    await this.userRoleRelRepository.remove(userRoleRel);
  }

  async createBatch(createUserRoleRelDtos: CreateUserRoleRelDto[]): Promise<UserRoleRel[]> {
    const userRoleRels: UserRoleRel[] = [];

    for (const dto of createUserRoleRelDtos) {
      // 检查是否已存在
      const existingRel = await this.userRoleRelRepository.findOne({
        where: {
          userId: dto.userId,
          roleId: dto.roleId,
        },
      });

      if (!existingRel) {
        const userRoleRel = this.userRoleRelRepository.create(dto);
        userRoleRels.push(userRoleRel);
      }
    }

    if (userRoleRels.length > 0) {
      return await this.userRoleRelRepository.save(userRoleRels);
    }

    return [];
  }

  async removeBatch(ids: number[]): Promise<void> {
    await this.userRoleRelRepository.delete(ids);
  }

  // 获取用户的所有角色 - 修改为支持字符串类型的userId
  async getUserRoles(userId: string): Promise<any[]> {
    const userRoleRels = await this.userRoleRelRepository.find({
      where: { userId },
      relations: ['role'],
    });

    return userRoleRels.map(rel => rel.role);
  }

  // 获取拥有某个角色的所有用户
  async getRoleUsers(roleId: number): Promise<any[]> {
    const userRoleRels = await this.userRoleRelRepository.find({
      where: { roleId },
      relations: ['user'],
    });

    return userRoleRels.map(rel => rel.user);
  }
}