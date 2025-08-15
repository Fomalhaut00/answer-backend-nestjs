import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Tag } from '../../entities/tag.entity';
import { FollowDto, UpdateFollowTagsDto } from './dto/follow.dto';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  // 关注/取消关注
  async follow(followDto: FollowDto, userId: string) {
    const { object_id, object_type, action = 'follow' } = followDto;

    // 这里应该实现具体的关注逻辑
    // 由于没有Follow实体，暂时返回模拟数据
    return {
      is_followed: action === 'follow',
      message: `${action === 'follow' ? 'Followed' : 'Unfollowed'} successfully`
    };
  }

  // 更新关注的标签
  async updateFollowTags(updateFollowTagsDto: UpdateFollowTagsDto, userId: string) {
    const { tag_ids } = updateFollowTagsDto;

    // 验证标签是否存在
    const tags = await this.tagRepository.findByIds(tag_ids);
    
    if (tags.length !== tag_ids.length) {
      throw new Error('Some tags not found');
    }

    // 这里应该实现更新用户关注标签的逻辑
    return {
      message: 'Follow tags updated successfully',
      followed_tags: tags.map(tag => ({
        tag_id: tag.id,
        slug_name: tag.slugName,
        display_name: tag.displayName
      }))
    };
  }
}
