import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
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

    // Remove the role
    await this.roleRepository.remove(role);

    return { message: `Role with ID ${id} has been deleted` };
  }
}