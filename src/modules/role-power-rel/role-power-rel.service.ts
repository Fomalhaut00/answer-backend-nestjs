import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RolePowerRel } from '../../entities/role-power-rel.entity';
import { Role } from '../../entities/role.entity';
import { Power } from '../../entities/power.entity';
import { UserRoleRel } from '../../entities/user-role-rel.entity';
import { 
  CreateRolePowerRelDto,
  UpdateRolePowerRelDto,
  BatchCreateRolePowerRelDto,
  RolePowerRelResponse
} from './dto/role-power-rel.dto';

@Injectable()
export class RolePowerRelService {
  constructor(
    @InjectRepository(RolePowerRel)
    private readonly rolePowerRelRepository: Repository<RolePowerRel>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Power)
    private readonly powerRepository: Repository<Power>,
    @InjectRepository(UserRoleRel)
    private readonly userRoleRelRepository: Repository<UserRoleRel>,
  ) {}

  async create(createRolePowerRelDto: CreateRolePowerRelDto): Promise<RolePowerRelResponse> {
    const { roleId, powerType } = createRolePowerRelDto;

    // 验证角色是否存在
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // 验证权限是否存在
    const power = await this.powerRepository.findOne({ where: { name: powerType } });
    if (!power) {
      throw new NotFoundException('Power not found');
    }

    // 检查是否已存在相同的角色权限关系
    const existingRel = await this.rolePowerRelRepository.findOne({
      where: { roleId, powerType }
    });
    if (existingRel) {
      throw new ConflictException('Role power relation already exists');
    }

    // 创建角色权限关系
    const rolePowerRel = this.rolePowerRelRepository.create({
      roleId,
      powerType
    });

    const savedRel = await this.rolePowerRelRepository.save(rolePowerRel);
    return this.formatResponse(savedRel, role, power);
  }

  async batchCreate(batchCreateRolePowerRelDto: BatchCreateRolePowerRelDto): Promise<RolePowerRelResponse[]> {
    const { roleId, powerTypes } = batchCreateRolePowerRelDto;

    // 验证角色是否存在
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // 验证所有权限是否存在
    const powers = await this.powerRepository.find({
      where: { name: In(powerTypes) }
    });
    if (powers.length !== powerTypes.length) {
      throw new NotFoundException('Some powers not found');
    }

    // 获取已存在的关系
    const existingRels = await this.rolePowerRelRepository.find({
      where: { roleId, powerType: In(powerTypes) }
    });
    const existingPowerTypes = existingRels.map(rel => rel.powerType);

    // 过滤出需要创建的权限类型
    const newPowerTypes = powerTypes.filter(pt => !existingPowerTypes.includes(pt));

    if (newPowerTypes.length === 0) {
      throw new ConflictException('All role power relations already exist');
    }

    // 批量创建角色权限关系
    const rolePowerRels = newPowerTypes.map(powerType => 
      this.rolePowerRelRepository.create({ roleId, powerType })
    );

    const savedRels = await this.rolePowerRelRepository.save(rolePowerRels);
    
    // 创建权限映射
    const powerMap = new Map(powers.map(p => [p.name, p]));
    
    return savedRels.map(rel => this.formatResponse(rel, role, powerMap.get(rel.powerType)));
  }

  async findAll(): Promise<RolePowerRelResponse[]> {
    const rolePowerRels = await this.rolePowerRelRepository.find({
      relations: ['role', 'power']
    });

    return rolePowerRels.map(rel => this.formatResponse(rel, rel.role, rel.power));
  }

  async findOne(id: number): Promise<RolePowerRelResponse> {
    const rolePowerRel = await this.rolePowerRelRepository.findOne({
      where: { id },
      relations: ['role', 'power']
    });

    if (!rolePowerRel) {
      throw new NotFoundException('Role power relation not found');
    }

    return this.formatResponse(rolePowerRel, rolePowerRel.role, rolePowerRel.power);
  }

  async getRolePowerList(roleId: number): Promise<string[]> {
    const rolePowerRels = await this.rolePowerRelRepository.find({
      where: { roleId },
      select: ['powerType']
    });

    return rolePowerRels.map(rel => rel.powerType);
  }

  async getUserPowerList(userId: string): Promise<string[]> {
    // 获取用户角色
    const userRole = await this.userRoleRelRepository.findOne({
      where: { userId }
    });

    if (!userRole) {
      return []; // 用户没有角色，返回空权限列表
    }

    // 获取角色权限
    return this.getRolePowerList(userRole.roleId);
  }

  async update(id: number, updateRolePowerRelDto: UpdateRolePowerRelDto): Promise<RolePowerRelResponse> {
    const rolePowerRel = await this.rolePowerRelRepository.findOne({ where: { id } });
    if (!rolePowerRel) {
      throw new NotFoundException('Role power relation not found');
    }

    // 如果更新了roleId，验证新角色是否存在
    if (updateRolePowerRelDto.roleId && updateRolePowerRelDto.roleId !== rolePowerRel.roleId) {
      const role = await this.roleRepository.findOne({ where: { id: updateRolePowerRelDto.roleId } });
      if (!role) {
        throw new NotFoundException('Role not found');
      }
    }

    // 如果更新了powerType，验证新权限是否存在
    if (updateRolePowerRelDto.powerType && updateRolePowerRelDto.powerType !== rolePowerRel.powerType) {
      const power = await this.powerRepository.findOne({ where: { name: updateRolePowerRelDto.powerType } });
      if (!power) {
        throw new NotFoundException('Power not found');
      }
    }

    // 检查更新后是否会产生重复
    if (updateRolePowerRelDto.roleId || updateRolePowerRelDto.powerType) {
      const newRoleId = updateRolePowerRelDto.roleId || rolePowerRel.roleId;
      const newPowerType = updateRolePowerRelDto.powerType || rolePowerRel.powerType;
      
      const existingRel = await this.rolePowerRelRepository.findOne({
        where: { roleId: newRoleId, powerType: newPowerType }
      });
      
      if (existingRel && existingRel.id !== id) {
        throw new ConflictException('Role power relation already exists');
      }
    }

    await this.rolePowerRelRepository.update(id, updateRolePowerRelDto);

    const updatedRel = await this.rolePowerRelRepository.findOne({
      where: { id },
      relations: ['role', 'power']
    });

    if (!updatedRel) {
      throw new NotFoundException('Updated role power relation not found');
    }

    return this.formatResponse(updatedRel, updatedRel.role, updatedRel.power);
  }

  async remove(id: number): Promise<void> {
    const result = await this.rolePowerRelRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Role power relation not found');
    }
  }

  async removeByRole(roleId: number): Promise<void> {
    await this.rolePowerRelRepository.delete({ roleId });
  }

  async removeByRoleAndPower(roleId: number, powerType: string): Promise<void> {
    const result = await this.rolePowerRelRepository.delete({ roleId, powerType });
    if (result.affected === 0) {
      throw new NotFoundException('Role power relation not found');
    }
  }

  private formatResponse(rolePowerRel: RolePowerRel, role?: Role, power?: Power): RolePowerRelResponse {
    return {
      id: rolePowerRel.id,
      roleId: rolePowerRel.roleId,
      powerType: rolePowerRel.powerType,
      createdAt: rolePowerRel.createdAt,
      updatedAt: rolePowerRel.updatedAt,
      role: role ? {
        id: role.id,
        name: role.name,
        description: role.description
      } : undefined,
      power: power ? {
        name: power.name,
        description: power.description
      } : undefined
    };
  }
}
