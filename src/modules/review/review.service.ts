import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities/review.entity';
import { GetUnreviewedPostPageDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  // 获取待审核内容分页
  async getUnreviewedPostPage(getUnreviewedPostPageDto: GetUnreviewedPostPageDto) {
    const { page = 1, page_size = 20, object_type } = getUnreviewedPostPageDto;
    const skip = (page - 1) * page_size;

    const queryBuilder = this.reviewRepository.createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.status = :status', { status: 1 }); // 1=pending

    if (object_type) {
      queryBuilder.andWhere('review.objectType = :objectType', { objectType: object_type });
    }

    const [reviews, total] = await queryBuilder
      .skip(skip)
      .take(page_size)
      .orderBy('review.createdAt', 'DESC')
      .getManyAndCount();

    return {
      reviews: reviews.map(review => ({
        review_id: review.id,
        object_id: review.objectId,
        object_type: review.objectType,
        user_info: {
          user_id: review.user?.id,
          username: review.user?.username,
          display_name: review.user?.displayName
        },
        status: review.status,
        reason: review.reason,
        created_at: review.createdAt
      })),
      total,
      page,
      page_size,
      total_pages: Math.ceil(total / page_size)
    };
  }

  // 更新审核状态
  async updateReview(updateReviewDto: UpdateReviewDto, reviewerId: string) {
    const { review_id, action, reason } = updateReviewDto;

    const review = await this.reviewRepository.findOne({ where: { id: review_id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    review.status = action === 'approve' ? 2 : 3; // 2=approved, 3=rejected
    review.reason = reason || '';
    // 这里可以添加审核者ID字段
    await this.reviewRepository.save(review);

    return {
      message: `Review ${action}d successfully`,
      review_id: review.id,
      status: review.status
    };
  }

  // 创建审核记录
  async createReview(objectId: string, objectType: string, userId: string) {
    const review = this.reviewRepository.create({
      objectId,
      objectType,
      userId,
      status: 1 // pending
    });

    await this.reviewRepository.save(review);
    return review;
  }
}
