import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Revision } from '../../entities/revision.entity';
import { 
  GetRevisionListDto, 
  GetUnreviewedRevisionListDto, 
  RevisionAuditDto,
  CheckCanUpdateRevisionDto 
} from './dto/revision.dto';

@Injectable()
export class RevisionService {
  constructor(
    @InjectRepository(Revision)
    private readonly revisionRepository: Repository<Revision>,
  ) {}

  // 获取修订列表
  async getRevisionList(getRevisionListDto: GetRevisionListDto) {
    const { object_id } = getRevisionListDto;

    const revisions = await this.revisionRepository.find({
      where: { objectId: object_id, status: 1 },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });

    return {
      revisions: revisions.map(revision => ({
        revision_id: revision.id,
        object_id: revision.objectId,
        object_type: revision.objectType,
        title: revision.title,
        content: revision.content,
        log: revision.log,
        user_info: {
          user_id: revision.user?.id,
          username: revision.user?.username,
          display_name: revision.user?.displayName
        },
        created_at: revision.createdAt,
        status: revision.status
      }))
    };
  }

  // 获取未审核修订列表
  async getUnreviewedRevisionList(getUnreviewedRevisionListDto: GetUnreviewedRevisionListDto) {
    const { page = 1, page_size = 20, object_type } = getUnreviewedRevisionListDto;
    const skip = (page - 1) * page_size;

    const queryBuilder = this.revisionRepository.createQueryBuilder('revision')
      .leftJoinAndSelect('revision.user', 'user')
      .where('revision.status = :status', { status: 1 }); // 假设1是待审核状态

    if (object_type) {
      queryBuilder.andWhere('revision.objectType = :objectType', { objectType: object_type });
    }

    const [revisions, total] = await queryBuilder
      .skip(skip)
      .take(page_size)
      .orderBy('revision.createdAt', 'DESC')
      .getManyAndCount();

    return {
      revisions: revisions.map(revision => ({
        revision_id: revision.id,
        object_id: revision.objectId,
        object_type: revision.objectType,
        title: revision.title,
        content: revision.content,
        log: revision.log,
        user_info: {
          user_id: revision.user?.id,
          username: revision.user?.username,
          display_name: revision.user?.displayName
        },
        created_at: revision.createdAt,
        status: revision.status
      })),
      total,
      page,
      page_size,
      total_pages: Math.ceil(total / page_size)
    };
  }

  // 审核修订
  async revisionAudit(revisionAuditDto: RevisionAuditDto, reviewerId: string) {
    const { revision_id, action, reason } = revisionAuditDto;

    const revision = await this.revisionRepository.findOne({ where: { id: revision_id } });
    if (!revision) {
      throw new NotFoundException('Revision not found');
    }

    // 更新修订状态
    revision.status = action === 'approve' ? 2 : 3; // 2=approved, 3=rejected
    // 这里可以添加审核者信息和原因的字段
    await this.revisionRepository.save(revision);

    return {
      message: `Revision ${action}d successfully`,
      revision_id: revision.id,
      status: revision.status
    };
  }

  // 检查是否可以更新修订
  async checkCanUpdateRevision(checkCanUpdateRevisionDto: CheckCanUpdateRevisionDto, userId: string) {
    const { object_id, object_type } = checkCanUpdateRevisionDto;

    // 检查是否有未审核的修订
    const existingRevision = await this.revisionRepository.findOne({
      where: {
        objectId: object_id,
        objectType: object_type,
        status: 1 // 待审核状态
      }
    });

    return {
      can_edit: !existingRevision,
      message: existingRevision ? 'There is a pending revision for this object' : 'Can edit'
    };
  }

  // 获取审核类型
  async getReviewingType() {
    return {
      reviewing_types: [
        { type: 'question', name: 'Question' },
        { type: 'answer', name: 'Answer' },
        { type: 'tag', name: 'Tag' }
      ]
    };
  }

  // 添加修订记录
  async addRevision(objectId: string, objectType: string, title: string, content: string, userId: string, log?: string) {
    const revision = this.revisionRepository.create({
      objectId,
      objectType,
      title,
      content,
      log: log || '',
      userId,
      status: 1 // 待审核
    });

    await this.revisionRepository.save(revision);
    return revision;
  }
}
