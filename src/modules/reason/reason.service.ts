import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reason } from '../../entities/reason.entity';
import { 
  CreateReasonDto, 
  UpdateReasonDto, 
  ReasonPageDto,
  ReasonResponse,
  ReasonPageResponse,
  ReasonListResponse
} from './dto/reason.dto';

@Injectable()
export class ReasonService {
  constructor(
    @InjectRepository(Reason)
    private readonly reasonRepository: Repository<Reason>,
  ) {}

  // 获取原因列表（公开接口，用于前端选择）
  async getReasonList(objectType: string): Promise<ReasonListResponse[]> {
    const reasons = await this.reasonRepository.find({
      where: { 
        objectType,
        status: 1 // 只返回启用的原因
      },
      order: { createdAt: 'ASC' }
    });

    return reasons.map(reason => ({
      id: reason.id,
      title: reason.title,
      content: reason.content
    }));
  }

  // 获取原因分页（管理员接口）
  async getReasonPage(query: ReasonPageDto): Promise<ReasonPageResponse> {
    const { page = 1, page_size = 20, reason_type, object_type, status } = query;
    const skip = (page - 1) * page_size;

    const whereConditions: any = {};
    if (reason_type) whereConditions.reasonType = reason_type;
    if (object_type) whereConditions.objectType = object_type;
    if (status !== undefined) whereConditions.status = status;

    const [reasons, total] = await this.reasonRepository.findAndCount({
      where: whereConditions,
      order: { createdAt: 'DESC' },
      skip,
      take: page_size
    });

    const reasonResponses = reasons.map(reason => this.formatReasonResponse(reason));

    return {
      reasons: reasonResponses,
      total,
      page,
      page_size
    };
  }

  // 创建原因
  async createReason(createDto: CreateReasonDto): Promise<ReasonResponse> {
    const { reason_type, title, content, object_type, status = 1 } = createDto;

    // 检查是否已存在相同的原因
    const existingReason = await this.reasonRepository.findOne({
      where: { 
        reasonType: reason_type,
        title,
        objectType: object_type
      }
    });

    if (existingReason) {
      throw new BadRequestException('Reason with same type, title and object type already exists');
    }

    const reason = this.reasonRepository.create({
      reasonType: reason_type,
      title,
      content,
      objectType: object_type,
      status
    });

    const savedReason = await this.reasonRepository.save(reason);
    return this.formatReasonResponse(savedReason);
  }

  // 获取原因详情
  async getReasonDetail(id: string): Promise<ReasonResponse> {
    const reason = await this.reasonRepository.findOne({ where: { id } });
    if (!reason) {
      throw new NotFoundException('Reason not found');
    }

    return this.formatReasonResponse(reason);
  }

  // 更新原因
  async updateReason(id: string, updateDto: UpdateReasonDto): Promise<ReasonResponse> {
    const reason = await this.reasonRepository.findOne({ where: { id } });
    if (!reason) {
      throw new NotFoundException('Reason not found');
    }

    const { reason_type, title, content, object_type, status } = updateDto;

    // 检查是否与其他原因冲突
    if (reason_type || title || object_type) {
      const existingReason = await this.reasonRepository.findOne({
        where: { 
          reasonType: reason_type || reason.reasonType,
          title: title || reason.title,
          objectType: object_type || reason.objectType
        }
      });

      if (existingReason && existingReason.id !== id) {
        throw new BadRequestException('Reason with same type, title and object type already exists');
      }
    }

    // 更新字段
    if (reason_type) reason.reasonType = reason_type;
    if (title) reason.title = title;
    if (content !== undefined) reason.content = content;
    if (object_type) reason.objectType = object_type;
    if (status !== undefined) reason.status = status;

    const updatedReason = await this.reasonRepository.save(reason);
    return this.formatReasonResponse(updatedReason);
  }

  // 删除原因
  async deleteReason(id: string): Promise<{ message: string }> {
    const reason = await this.reasonRepository.findOne({ where: { id } });
    if (!reason) {
      throw new NotFoundException('Reason not found');
    }

    await this.reasonRepository.remove(reason);
    return { message: 'Reason deleted successfully' };
  }

  // 格式化原因响应
  private formatReasonResponse(reason: Reason): ReasonResponse {
    return {
      id: reason.id,
      reason_type: reason.reasonType,
      title: reason.title,
      content: reason.content,
      object_type: reason.objectType,
      status: reason.status,
      created_at: reason.createdAt,
      updated_at: reason.updatedAt
    };
  }

  // 初始化默认原因数据
  async initializeDefaultReasons(): Promise<void> {
    const defaultReasons = [
      // 举报原因
      { reasonType: 'report', title: 'Spam', content: 'This content is spam', objectType: 'question' },
      { reasonType: 'report', title: 'Inappropriate', content: 'This content is inappropriate', objectType: 'question' },
      { reasonType: 'report', title: 'Off-topic', content: 'This content is off-topic', objectType: 'question' },
      { reasonType: 'report', title: 'Spam', content: 'This content is spam', objectType: 'answer' },
      { reasonType: 'report', title: 'Inappropriate', content: 'This content is inappropriate', objectType: 'answer' },
      { reasonType: 'report', title: 'Low quality', content: 'This answer is low quality', objectType: 'answer' },
      
      // 关闭原因
      { reasonType: 'close', title: 'Duplicate', content: 'This question is a duplicate', objectType: 'question' },
      { reasonType: 'close', title: 'Too broad', content: 'This question is too broad', objectType: 'question' },
      { reasonType: 'close', title: 'Unclear', content: 'This question is unclear', objectType: 'question' },
      { reasonType: 'close', title: 'Off-topic', content: 'This question is off-topic', objectType: 'question' },
    ];

    for (const reasonData of defaultReasons) {
      const existing = await this.reasonRepository.findOne({
        where: {
          reasonType: reasonData.reasonType,
          title: reasonData.title,
          objectType: reasonData.objectType
        }
      });

      if (!existing) {
        const reason = this.reasonRepository.create(reasonData);
        await this.reasonRepository.save(reason);
      }
    }
  }
}
