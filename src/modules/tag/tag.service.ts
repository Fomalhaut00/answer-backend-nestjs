import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException,
  BadRequestException,
  ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Tag, TagStatus } from '../../entities/tag.entity';
import { TagRel, TagRelStatus } from '../../entities/tag-rel.entity';
import { User } from '../../entities/user.entity';
import { 
  CreateTagDto,
  UpdateTagDto,
  TagPageDto,
  SearchTagDto,
  TagSynonymDto,
  MergeTagDto,
  TagResponse,
  TagListResponse
} from './dto/tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(TagRel)
    private readonly tagRelRepository: Repository<TagRel>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: string, createTagDto: CreateTagDto): Promise<TagResponse> {
    // 验证用户是否存在
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 检查标签名是否已存在
    const existingTag = await this.tagRepository.findOne({
      where: { slugName: createTagDto.slug_name }
    });
    if (existingTag) {
      throw new ConflictException('Tag with this slug name already exists');
    }

    // 创建标签
    const tag = this.tagRepository.create({
      userId,
      slugName: createTagDto.slug_name,
      displayName: createTagDto.display_name,
      originalText: createTagDto.original_text,
      parsedText: createTagDto.original_text, // 在实际应用中应该解析markdown
      status: TagStatus.AVAILABLE,
      followCount: 0,
      questionCount: 0,
      recommend: false,
      reserved: false,
      revisionId: 0,
    });

    const savedTag = await this.tagRepository.save(tag);
    return this.formatTagResponse(savedTag, user);
  }

  async getTagInfo(tagSlugName: string, userId?: string): Promise<TagResponse> {
    const tag = await this.tagRepository.findOne({ 
      where: { slugName: tagSlugName, status: TagStatus.AVAILABLE } 
    });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    // 获取标签创建者信息
    const creator = await this.userRepository.findOne({ where: { id: tag.userId } });

    const response = this.formatTagResponse(tag, creator || undefined);
    
    // 检查用户是否关注了这个标签
    if (userId) {
      // 在实际应用中，这里应该检查用户是否关注了这个标签
      response.is_follower = false;
    }

    return response;
  }

  async update(userId: string, updateTagDto: UpdateTagDto): Promise<TagResponse> {
    const tag = await this.tagRepository.findOne({ 
      where: { id: updateTagDto.tag_id } 
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    // 检查权限：只有创建者或有编辑权限的用户可以编辑
    if (tag.userId !== userId) {
      // 在实际应用中，这里应该检查用户是否有编辑权限
      throw new ForbiddenException('You do not have permission to edit this tag');
    }

    // 检查新的slug name是否与其他标签冲突
    if (updateTagDto.slug_name !== tag.slugName) {
      const existingTag = await this.tagRepository.findOne({
        where: { slugName: updateTagDto.slug_name }
      });
      if (existingTag) {
        throw new ConflictException('Tag with this slug name already exists');
      }
    }

    // 更新标签
    await this.tagRepository.update(updateTagDto.tag_id, {
      slugName: updateTagDto.slug_name,
      displayName: updateTagDto.display_name,
      originalText: updateTagDto.original_text,
      parsedText: updateTagDto.original_text, // 在实际应用中应该解析markdown
    });

    const updatedTag = await this.tagRepository.findOne({
      where: { id: updateTagDto.tag_id }
    });

    if (!updatedTag) {
      throw new NotFoundException('Updated tag not found');
    }

    const creator = await this.userRepository.findOne({ where: { id: updatedTag.userId } });

    return this.formatTagResponse(updatedTag, creator || undefined);
  }

  async remove(userId: string, tagId: string): Promise<{ message: string }> {
    const tag = await this.tagRepository.findOne({ where: { id: tagId } });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    // 检查权限：只有创建者或有删除权限的用户可以删除
    if (tag.userId !== userId) {
      // 在实际应用中，这里应该检查用户是否有删除权限
      throw new ForbiddenException('You do not have permission to delete this tag');
    }

    // 检查标签是否被使用
    const tagRelCount = await this.tagRelRepository.count({
      where: { tagId, status: TagRelStatus.AVAILABLE }
    });
    if (tagRelCount > 0) {
      throw new BadRequestException('Cannot delete tag that is being used by questions');
    }

    // 软删除：更新状态为已删除
    await this.tagRepository.update(tagId, {
      status: TagStatus.DELETED,
    });

    return { message: 'Tag deleted successfully' };
  }

  async recover(userId: string, tagId: string): Promise<{ message: string }> {
    const tag = await this.tagRepository.findOne({ where: { id: tagId } });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    // 检查权限
    if (tag.userId !== userId) {
      throw new ForbiddenException('You do not have permission to recover this tag');
    }

    // 恢复标签
    await this.tagRepository.update(tagId, {
      status: TagStatus.AVAILABLE,
    });

    return { message: 'Tag recovered successfully' };
  }

  async getTagPage(tagPageDto: TagPageDto) {
    const {
      page = 1,
      page_size = 20,
      slug_name,
      query_cond
    } = tagPageDto;

    const skip = (page - 1) * page_size;
    const queryBuilder = this.tagRepository.createQueryBuilder('tag')
      .where('tag.status = :status', { status: TagStatus.AVAILABLE });

    // 按标签名筛选
    if (slug_name) {
      queryBuilder.andWhere('tag.slug_name = :slugName', { slugName: slug_name });
    }

    // 按查询条件筛选
    if (query_cond) {
      queryBuilder.andWhere(
        '(tag.slug_name LIKE :query OR tag.display_name LIKE :query OR tag.original_text LIKE :query)',
        { query: `%${query_cond}%` }
      );
    }

    const [tags, total] = await queryBuilder
      .orderBy('tag.question_count', 'DESC')
      .addOrderBy('tag.created_at', 'DESC')
      .skip(skip)
      .take(page_size)
      .getManyAndCount();

    return {
      tags: tags.map(tag => this.formatTagListResponse(tag)),
      total,
      page,
      page_size
    };
  }

  async searchTagLike(searchTagDto: SearchTagDto) {
    const { tag, limit = 20 } = searchTagDto;

    const tags = await this.tagRepository.find({
      where: [
        { slugName: Like(`%${tag}%`), status: TagStatus.AVAILABLE },
        { displayName: Like(`%${tag}%`), status: TagStatus.AVAILABLE }
      ],
      order: { questionCount: 'DESC' },
      take: limit
    });

    return {
      tags: tags.map(t => ({
        slug_name: t.slugName,
        display_name: t.displayName,
        recommend: t.recommend,
        reserved: t.reserved
      }))
    };
  }

  async getTagsBySlugName(tagSlugName: string) {
    const tags = await this.tagRepository.find({
      where: {
        slugName: Like(`%${tagSlugName}%`),
        status: TagStatus.AVAILABLE
      },
      order: { questionCount: 'DESC' },
      take: 10
    });

    return {
      tags: tags.map(tag => this.formatTagListResponse(tag))
    };
  }

  async getFollowingTags(userId: string) {
    // 在实际应用中，这里应该从用户关注标签表中获取数据
    // 暂时返回空数组
    return {
      tags: []
    };
  }

  async getTagSynonyms(tagId: string) {
    const tag = await this.tagRepository.findOne({ where: { id: tagId } });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    // 在实际应用中，这里应该从标签同义词表中获取数据
    // 暂时返回空数组
    return {
      synonyms: []
    };
  }

  async updateTagSynonym(userId: string, tagSynonymDto: TagSynonymDto) {
    const tag = await this.tagRepository.findOne({
      where: { id: tagSynonymDto.tag_id }
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    // 检查权限
    // 在实际应用中，这里应该检查用户是否有管理标签同义词的权限

    // 在实际应用中，这里应该更新标签同义词表
    return { message: 'Tag synonyms updated successfully' };
  }

  async mergeTag(userId: string, mergeTagDto: MergeTagDto) {
    const fromTag = await this.tagRepository.findOne({
      where: { id: mergeTagDto.from_tag_id }
    });
    const toTag = await this.tagRepository.findOne({
      where: { id: mergeTagDto.to_tag_id }
    });

    if (!fromTag || !toTag) {
      throw new NotFoundException('One or both tags not found');
    }

    // 检查权限
    // 在实际应用中，这里应该检查用户是否有合并标签的权限

    // 将所有使用fromTag的问题转移到toTag
    await this.tagRelRepository.update(
      { tagId: mergeTagDto.from_tag_id, status: TagRelStatus.AVAILABLE },
      { tagId: mergeTagDto.to_tag_id }
    );

    // 更新toTag的问题计数
    const newQuestionCount = fromTag.questionCount + toTag.questionCount;
    await this.tagRepository.update(mergeTagDto.to_tag_id, {
      questionCount: newQuestionCount
    });

    // 删除fromTag
    await this.tagRepository.update(mergeTagDto.from_tag_id, {
      status: TagStatus.DELETED
    });

    return { message: 'Tags merged successfully' };
  }

  private formatTagResponse(tag: Tag, user?: User): TagResponse {
    return {
      tag_id: tag.id,
      slug_name: tag.slugName,
      display_name: tag.displayName,
      original_text: tag.originalText,
      parsed_text: tag.parsedText,
      follow_count: tag.followCount,
      question_count: tag.questionCount,
      is_follower: false, // 在实际应用中应该检查用户是否关注
      created_at: tag.createdAt,
      updated_at: tag.updatedAt,
      user_info: user ? {
        id: user.id,
        username: user.username,
        display_name: user.displayName,
        avatar: user.avatar,
        rank: user.rank,
        status: user.status
      } : null,
      excerpt: tag.originalText.substring(0, 200), // 摘要
      member_actions: [] // 在实际应用中应该获取用户可执行的操作
    };
  }

  private formatTagListResponse(tag: Tag): TagListResponse {
    return {
      tag_id: tag.id,
      slug_name: tag.slugName,
      display_name: tag.displayName,
      recommend: tag.recommend,
      reserved: tag.reserved,
      question_count: tag.questionCount,
      excerpt: tag.originalText.substring(0, 200)
    };
  }
}
