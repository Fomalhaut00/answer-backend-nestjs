import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from '../../entities/collection.entity';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';
import { CollectionSwitchDto, PersonalCollectionPageDto } from './dto/collection.dto';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  // 收藏开关 - 添加或取消收藏
  async collectionSwitch(collectionSwitchDto: CollectionSwitchDto, userId: string) {
    const { object_id, object_type } = collectionSwitchDto;

    // 检查是否已收藏
    const existingCollection = await this.collectionRepository.findOne({
      where: {
        userId,
        objectId: object_id,
        objectType: object_type
      }
    });

    if (existingCollection) {
      // 取消收藏
      await this.collectionRepository.remove(existingCollection);
      return {
        is_collected: false,
        message: 'Collection removed successfully'
      };
    } else {
      // 添加收藏
      const collection = this.collectionRepository.create({
        userId,
        objectId: object_id,
        objectType: object_type
      });
      await this.collectionRepository.save(collection);
      
      return {
        is_collected: true,
        message: 'Collection added successfully'
      };
    }
  }

  // 获取个人收藏分页
  async getPersonalCollectionPage(query: PersonalCollectionPageDto, userId: string) {
    const { page = 1, page_size = 20 } = query;
    const skip = (page - 1) * page_size;

    const [collections, total] = await this.collectionRepository.findAndCount({
      where: { userId },
      skip,
      take: page_size,
      order: { createdAt: 'DESC' }
    });

    // 获取收藏的对象详情
    const collectionDetails = await Promise.all(
      collections.map(async (collection) => {
        let objectDetail: any = null;

        if (collection.objectType === 'question') {
          objectDetail = await this.questionRepository.findOne({
            where: { id: collection.objectId },
            select: ['id', 'title', 'originalText', 'createdAt', 'viewCount', 'answerCount']
          });
        } else if (collection.objectType === 'answer') {
          objectDetail = await this.answerRepository.findOne({
            where: { id: collection.objectId },
            select: ['id', 'originalText', 'createdAt', 'voteCount'],
            relations: ['question']
          });
        }

        return {
          collection_id: collection.id,
          object_id: collection.objectId,
          object_type: collection.objectType,
          created_at: collection.createdAt,
          object_detail: objectDetail
        };
      })
    );

    return {
      collections: collectionDetails,
      total,
      page,
      page_size,
      total_pages: Math.ceil(total / page_size)
    };
  }

  // 检查是否已收藏
  async checkIsCollected(objectId: string, objectType: string, userId: string): Promise<boolean> {
    if (!userId) return false;
    
    const collection = await this.collectionRepository.findOne({
      where: {
        userId,
        objectId,
        objectType
      }
    });

    return !!collection;
  }
}
