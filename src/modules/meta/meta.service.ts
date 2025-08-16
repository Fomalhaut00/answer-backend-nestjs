import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meta } from '../../entities/meta.entity';
import { GetReactionDto, AddOrUpdateReactionDto } from './dto/meta.dto';

@Injectable()
export class MetaService {
  constructor(
    @InjectRepository(Meta)
    private readonly metaRepository: Repository<Meta>,
  ) {}

  // 获取反应元数据
  async getReaction(getReactionDto: GetReactionDto, userId?: string) {
    const { object_id } = getReactionDto;
    
    // 获取反应汇总数据
    const reactionMeta = await this.metaRepository.findOne({
      where: {
        objectId: object_id,
        key: 'reaction_summary'
      }
    });

    if (!reactionMeta) {
      return {
        reactions: {},
        user_reaction: null,
        total_count: 0
      };
    }

    let reactionData;
    try {
      reactionData = JSON.parse(reactionMeta.value);
    } catch (error) {
      reactionData = {};
    }

    // 如果用户已登录，获取用户的反应
    let userReaction = null;
    if (userId) {
      const userReactionMeta = await this.metaRepository.findOne({
        where: {
          objectId: object_id,
          key: `user_reaction_${userId}`
        }
      });
      
      if (userReactionMeta) {
        try {
          userReaction = JSON.parse(userReactionMeta.value);
        } catch (error) {
          userReaction = null;
        }
      }
    }

    return {
      reactions: reactionData,
      user_reaction: userReaction,
      total_count: Object.values(reactionData).reduce((sum: number, count: any) => sum + (count || 0), 0)
    };
  }

  // 添加或更新反应
  async addOrUpdateReaction(addOrUpdateReactionDto: AddOrUpdateReactionDto, userId: string) {
    const { object_id, reaction_type, reaction_data } = addOrUpdateReactionDto;

    // 更新用户反应
    await this.addOrUpdateMeta(object_id, `user_reaction_${userId}`, JSON.stringify({
      type: reaction_type,
      data: reaction_data,
      created_at: new Date().toISOString()
    }));

    // 更新反应汇总
    const reactionSummary = await this.metaRepository.findOne({
      where: {
        objectId: object_id,
        key: 'reaction_summary'
      }
    });

    let summaryData = {};
    if (reactionSummary) {
      try {
        summaryData = JSON.parse(reactionSummary.value);
      } catch (error) {
        summaryData = {};
      }
    }

    // 更新计数
    summaryData[reaction_type] = (summaryData[reaction_type] || 0) + 1;

    await this.addOrUpdateMeta(object_id, 'reaction_summary', JSON.stringify(summaryData));

    return {
      message: 'Reaction updated successfully',
      reaction_type,
      total_count: Object.values(summaryData).reduce((sum: number, count: any) => sum + (count || 0), 0)
    };
  }

  // 通用的添加或更新Meta方法
  async addOrUpdateMeta(objectId: string, key: string, value: string) {
    let meta = await this.metaRepository.findOne({
      where: { objectId, key }
    });

    if (meta) {
      meta.value = value;
      await this.metaRepository.save(meta);
    } else {
      meta = this.metaRepository.create({
        objectId,
        key,
        value
      });
      await this.metaRepository.save(meta);
    }

    return meta;
  }

  // 获取Meta数据
  async getMetaByObjectIdAndKey(objectId: string, key: string) {
    return this.metaRepository.findOne({
      where: { objectId, key }
    });
  }

  // 获取对象的所有Meta数据
  async getMetaList(objectId: string) {
    return this.metaRepository.find({
      where: { objectId },
      order: { createdAt: 'DESC' }
    });
  }
}
