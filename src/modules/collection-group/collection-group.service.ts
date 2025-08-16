import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionGroup } from '../../entities/collection-group.entity';
import { Collection } from '../../entities/collection.entity';
import { 
  CreateCollectionGroupDto, 
  UpdateCollectionGroupDto, 
  CollectionGroupPageDto,
  CollectionGroupResponse,
  CollectionGroupPageResponse,
  CollectionGroupDetailResponse
} from './dto/collection-group.dto';

@Injectable()
export class CollectionGroupService {
  constructor(
    @InjectRepository(CollectionGroup)
    private readonly collectionGroupRepository: Repository<CollectionGroup>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}

  // 创建收藏分组
  async createCollectionGroup(createDto: CreateCollectionGroupDto, userId: string): Promise<CollectionGroupResponse> {
    const { name, description, default_group = 0 } = createDto;

    // 检查分组名称是否已存在
    const existingGroup = await this.collectionGroupRepository.findOne({
      where: { userId, name }
    });

    if (existingGroup) {
      throw new BadRequestException('Collection group name already exists');
    }

    // 如果设置为默认分组，先取消其他默认分组
    if (default_group === 1) {
      await this.collectionGroupRepository.update(
        { userId, defaultGroup: 1 },
        { defaultGroup: 0 }
      );
    }

    const collectionGroup = this.collectionGroupRepository.create({
      userId,
      name,
      description,
      defaultGroup: default_group
    });

    const savedGroup = await this.collectionGroupRepository.save(collectionGroup);

    return this.formatCollectionGroupResponse(savedGroup);
  }

  // 获取用户收藏分组分页列表
  async getCollectionGroupPage(query: CollectionGroupPageDto, userId: string): Promise<CollectionGroupPageResponse> {
    const { page = 1, page_size = 20 } = query;
    const skip = (page - 1) * page_size;

    const [groups, total] = await this.collectionGroupRepository.findAndCount({
      where: { userId },
      order: { defaultGroup: 'DESC', createdAt: 'DESC' },
      skip,
      take: page_size
    });

    // 获取每个分组的收藏数量
    const groupsWithCount = await Promise.all(
      groups.map(async (group) => {
        const collectionCount = await this.collectionRepository.count({
          where: { userId, collectionGroupId: group.id }
        });
        return this.formatCollectionGroupResponse(group, collectionCount);
      })
    );

    return {
      groups: groupsWithCount,
      total,
      page,
      page_size
    };
  }

  // 更新收藏分组
  async updateCollectionGroup(groupId: string, updateDto: UpdateCollectionGroupDto, userId: string): Promise<CollectionGroupResponse> {
    const group = await this.collectionGroupRepository.findOne({
      where: { id: groupId, userId }
    });

    if (!group) {
      throw new NotFoundException('Collection group not found');
    }

    const { name, description, default_group } = updateDto;

    // 检查分组名称是否已存在（排除当前分组）
    if (name && name !== group.name) {
      const existingGroup = await this.collectionGroupRepository.findOne({
        where: { userId, name }
      });

      if (existingGroup) {
        throw new BadRequestException('Collection group name already exists');
      }
    }

    // 如果设置为默认分组，先取消其他默认分组
    if (default_group === 1) {
      await this.collectionGroupRepository.update(
        { userId, defaultGroup: 1 },
        { defaultGroup: 0 }
      );
    }

    // 更新分组信息
    if (name) group.name = name;
    if (description !== undefined) group.description = description;
    if (default_group !== undefined) group.defaultGroup = default_group;

    const updatedGroup = await this.collectionGroupRepository.save(group);
    
    return this.formatCollectionGroupResponse(updatedGroup);
  }

  // 删除收藏分组
  async deleteCollectionGroup(groupId: string, userId: string): Promise<{ message: string }> {
    const group = await this.collectionGroupRepository.findOne({
      where: { id: groupId, userId }
    });

    if (!group) {
      throw new NotFoundException('Collection group not found');
    }

    // 检查分组下是否有收藏
    const collectionCount = await this.collectionRepository.count({
      where: { userId, collectionGroupId: groupId }
    });

    if (collectionCount > 0) {
      // 将分组下的收藏移动到默认分组
      const defaultGroup = await this.getOrCreateDefaultGroup(userId);
      await this.collectionRepository.update(
        { userId, collectionGroupId: groupId },
        { collectionGroupId: defaultGroup.id }
      );
    }

    await this.collectionGroupRepository.remove(group);

    return { message: 'Collection group deleted successfully' };
  }

  // 获取收藏分组详情
  async getCollectionGroupDetail(groupId: string, userId: string): Promise<CollectionGroupDetailResponse> {
    const group = await this.collectionGroupRepository.findOne({
      where: { id: groupId, userId }
    });

    if (!group) {
      throw new NotFoundException('Collection group not found');
    }

    // 获取分组下的收藏列表
    const collections = await this.collectionRepository.find({
      where: { userId, collectionGroupId: groupId },
      order: { createdAt: 'DESC' },
      take: 10 // 只返回最近10个收藏
    });

    const collectionCount = await this.collectionRepository.count({
      where: { userId, collectionGroupId: groupId }
    });

    return {
      ...this.formatCollectionGroupResponse(group, collectionCount),
      collections
    };
  }

  // 获取或创建默认分组
  private async getOrCreateDefaultGroup(userId: string): Promise<CollectionGroup> {
    let defaultGroup = await this.collectionGroupRepository.findOne({
      where: { userId, defaultGroup: 1 }
    });

    if (!defaultGroup) {
      defaultGroup = this.collectionGroupRepository.create({
        userId,
        name: 'Default',
        description: 'Default collection group',
        defaultGroup: 1
      });
      defaultGroup = await this.collectionGroupRepository.save(defaultGroup);
    }

    return defaultGroup;
  }

  // 格式化收藏分组响应
  private formatCollectionGroupResponse(group: CollectionGroup, collectionCount?: number): CollectionGroupResponse {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      default_group: group.defaultGroup,
      collection_count: collectionCount || 0,
      created_at: group.createdAt,
      updated_at: group.updatedAt
    };
  }
}
