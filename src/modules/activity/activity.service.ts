import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../../entities/activity.entity';
import { User } from '../../entities/user.entity';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';
import { Comment } from '../../entities/comment.entity';
import { 
  ActivityPageDto, 
  UserTimelineDto, 
  ActivityResponse, 
  TimelineResponse 
} from './dto/activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getUserTimeline(userTimelineDto: UserTimelineDto) {
    const { username, page = 1, page_size = 20 } = userTimelineDto;
    
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const skip = (page - 1) * page_size;
    
    // 获取用户的活动记录
    const [activities, total] = await this.activityRepository.findAndCount({
      where: { userId: user.id },
      order: { created_at: 'DESC' },
      skip,
      take: page_size
    });

    // 转换为时间线格式
    const timeline: TimelineResponse[] = [];

    for (const activity of activities) {
      const timelineItem = await this.convertActivityToTimeline(activity);
      if (timelineItem) {
        timeline.push(timelineItem);
      }
    }

    return {
      timeline,
      total,
      page,
      page_size
    };
  }

  async getPersonalActivityPage(userId: string, activityPageDto: ActivityPageDto) {
    const { page = 1, page_size = 20, activity_type } = activityPageDto;
    const skip = (page - 1) * page_size;

    const queryBuilder = this.activityRepository.createQueryBuilder('activity')
      .where('activity.user_id = :userId', { userId });

    if (activity_type) {
      // 根据活动类型筛选
      const activityTypeMap = {
        'question': [1], // 假设1是发布问题
        'answer': [2], // 假设2是发布答案
        'comment': [3], // 假设3是发布评论
        'vote': [4, 5], // 假设4是点赞，5是点踩
        'follow': [6] // 假设6是关注
      };
      
      const types = activityTypeMap[activity_type] || [];
      if (types.length > 0) {
        queryBuilder.andWhere('activity.activity_type IN (:...types)', { types });
      }
    }

    const [activities, total] = await queryBuilder
      .orderBy('activity.created_at', 'DESC')
      .skip(skip)
      .take(page_size)
      .getManyAndCount();

    const activityResponses: ActivityResponse[] = [];
    
    for (const activity of activities) {
      const response = await this.formatActivityResponse(activity);
      activityResponses.push(response);
    }

    return {
      activities: activityResponses,
      total,
      page,
      page_size
    };
  }

  async getActivityPage(activityPageDto: ActivityPageDto) {
    const { page = 1, page_size = 20, username, activity_type } = activityPageDto;
    const skip = (page - 1) * page_size;

    const queryBuilder = this.activityRepository.createQueryBuilder('activity');

    if (username) {
      const user = await this.userRepository.findOne({ where: { username } });
      if (user) {
        queryBuilder.where('activity.user_id = :userId', { userId: user.id });
      }
    }

    if (activity_type) {
      const activityTypeMap = {
        'question': [1],
        'answer': [2],
        'comment': [3],
        'vote': [4, 5],
        'follow': [6]
      };
      
      const types = activityTypeMap[activity_type] || [];
      if (types.length > 0) {
        queryBuilder.andWhere('activity.activity_type IN (:...types)', { types });
      }
    }

    const [activities, total] = await queryBuilder
      .orderBy('activity.created_at', 'DESC')
      .skip(skip)
      .take(page_size)
      .getManyAndCount();

    const activityResponses: ActivityResponse[] = [];
    
    for (const activity of activities) {
      const response = await this.formatActivityResponse(activity);
      activityResponses.push(response);
    }

    return {
      activities: activityResponses,
      total,
      page,
      page_size
    };
  }

  private async convertActivityToTimeline(activity: Activity): Promise<TimelineResponse | null> {
    let objectType = '';
    let activityType = '';
    let object: any = null;

    // 根据活动类型确定对象类型和活动类型
    switch (activity.activityType) {
      case 1: // 发布问题
        objectType = 'question';
        activityType = 'created';
        object = await this.questionRepository.findOne({ where: { id: activity.objectId } });
        break;
      case 2: // 发布答案
        objectType = 'answer';
        activityType = 'created';
        object = await this.answerRepository.findOne({ where: { id: activity.objectId } });
        break;
      case 3: // 发布评论
        objectType = 'comment';
        activityType = 'created';
        object = await this.commentRepository.findOne({ where: { id: activity.objectId } });
        break;
      case 4: // 点赞
        activityType = 'voted_up';
        // 需要确定是对什么对象的投票
        break;
      case 5: // 点踩
        activityType = 'voted_down';
        break;
      default:
        return null;
    }

    if (!object && [1, 2, 3].includes(activity.activityType)) {
      return null;
    }

    return {
      object_type: objectType,
      activity_type: activityType,
      object: object ? {
        id: object.id,
        title: object.title || '',
        excerpt: object.originalText ? object.originalText.substring(0, 200) : '',
        created_at: object.createdAt || object.created_at
      } : null,
      created_at: activity.created_at
    };
  }

  private async formatActivityResponse(activity: Activity): Promise<ActivityResponse> {
    // 获取用户信息
    const user = await this.userRepository.findOne({ where: { id: activity.userId } });
    
    // 获取触发用户信息（如果有）
    let triggerUser: User | undefined = undefined;
    if (activity.triggerUserId && activity.triggerUserId !== '0') {
      const foundTriggerUser = await this.userRepository.findOne({ where: { id: activity.triggerUserId } });
      triggerUser = foundTriggerUser || undefined;
    }

    // 获取对象信息
    let objectInfo: any = null;
    switch (activity.activityType) {
      case 1: // 问题
        objectInfo = await this.questionRepository.findOne({ where: { id: activity.objectId } });
        break;
      case 2: // 答案
        objectInfo = await this.answerRepository.findOne({ where: { id: activity.objectId } });
        break;
      case 3: // 评论
        objectInfo = await this.commentRepository.findOne({ where: { id: activity.objectId } });
        break;
    }

    return {
      id: activity.id.toString(),
      user_id: activity.userId,
      trigger_user_id: activity.triggerUserId,
      object_id: activity.objectId,
      activity_type: activity.activityType,
      cancelled: activity.cancelled,
      rank: activity.rank,
      has_rank: activity.hasRank,
      created_at: activity.created_at,
      updated_at: activity.updated_at,
      user_info: user ? {
        id: user.id,
        username: user.username,
        display_name: user.displayName,
        avatar: user.avatar,
        rank: user.rank
      } : null,
      trigger_user_info: triggerUser ? {
        id: triggerUser.id,
        username: triggerUser.username,
        display_name: triggerUser.displayName,
        avatar: triggerUser.avatar,
        rank: triggerUser.rank
      } : null,
      object_info: objectInfo
    };
  }

  // 创建活动记录的方法
  async createActivity(
    userId: string,
    activityType: number,
    objectId: string,
    triggerUserId?: string,
    rank: number = 0
  ) {
    const activity = this.activityRepository.create({
      userId,
      activityType,
      objectId,
      triggerUserId: triggerUserId || '0',
      rank,
      hasRank: rank > 0 ? 1 : 0,
      cancelled: 0
    });

    return this.activityRepository.save(activity);
  }
}
