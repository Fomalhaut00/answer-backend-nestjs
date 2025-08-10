import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from '../../entities/notification.entity';
import { User } from '../../entities/user.entity';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';
import { Comment } from '../../entities/comment.entity';
import { 
  NotificationPageDto,
  ReadNotificationDto,
  ClearNotificationDto,
  NotificationResponse,
  NotificationUnreadResponse
} from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getNotificationPage(userId: string, notificationPageDto: NotificationPageDto) {
    const { page = 1, page_size = 20, type = 'inbox' } = notificationPageDto;
    const skip = (page - 1) * page_size;

    const notificationType = type === 'achievement' ? NotificationType.ACHIEVEMENT : NotificationType.INBOX;

    const [notifications, total] = await this.notificationRepository.findAndCount({
      where: { userId, type: notificationType },
      order: { createdAt: 'DESC' },
      skip,
      take: page_size
    });

    const notificationResponses: NotificationResponse[] = [];
    
    for (const notification of notifications) {
      const response = await this.formatNotificationResponse(notification);
      notificationResponses.push(response);
    }

    return {
      notifications: notificationResponses,
      total,
      page,
      page_size
    };
  }

  async getUnreadCount(userId: string): Promise<NotificationUnreadResponse> {
    const inboxCount = await this.notificationRepository.count({
      where: { 
        userId, 
        type: NotificationType.INBOX, 
        isRead: NotificationStatus.UNREAD 
      }
    });

    const achievementCount = await this.notificationRepository.count({
      where: { 
        userId, 
        type: NotificationType.ACHIEVEMENT, 
        isRead: NotificationStatus.UNREAD 
      }
    });

    return {
      inbox: inboxCount,
      achievement: achievementCount,
      revision: 0, // 在实际应用中应该从修订表中获取
      can_revision: false // 在实际应用中应该检查用户是否有修订权限
    };
  }

  async readNotification(userId: string, readNotificationDto: ReadNotificationDto) {
    const notification = await this.notificationRepository.findOne({
      where: { id: readNotificationDto.id }
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('You can only read your own notifications');
    }

    await this.notificationRepository.update(readNotificationDto.id, {
      isRead: NotificationStatus.READ
    });

    return { message: 'Notification marked as read' };
  }

  async readAllNotifications(userId: string, type?: string) {
    const updateConditions: any = { userId, isRead: NotificationStatus.UNREAD };

    if (type === 'inbox') {
      updateConditions.type = NotificationType.INBOX;
    } else if (type === 'achievement') {
      updateConditions.type = NotificationType.ACHIEVEMENT;
    }

    await this.notificationRepository.update(updateConditions, {
      isRead: NotificationStatus.READ
    });

    return { message: 'All notifications marked as read' };
  }

  async clearNotifications(userId: string, clearNotificationDto: ClearNotificationDto) {
    const { type = 'all', ids } = clearNotificationDto;

    if (ids && ids.length > 0) {
      // 删除指定的通知
      const notifications = await this.notificationRepository.find({
        where: { id: In(ids), userId }
      });

      if (notifications.length !== ids.length) {
        throw new NotFoundException('Some notifications not found or not owned by user');
      }

      await this.notificationRepository.delete({ id: In(ids), userId });
    } else {
      // 根据类型删除通知
      const deleteConditions: any = { userId };

      if (type === 'inbox') {
        deleteConditions.type = NotificationType.INBOX;
      } else if (type === 'achievement') {
        deleteConditions.type = NotificationType.ACHIEVEMENT;
      }

      await this.notificationRepository.delete(deleteConditions);
    }

    return { message: 'Notifications cleared successfully' };
  }

  // 创建通知的方法
  async createNotification(
    userId: string,
    content: string,
    objectId: string,
    type: NotificationType = NotificationType.INBOX,
    msgType: number = 1
  ) {
    const notification = this.notificationRepository.create({
      userId,
      content,
      objectId,
      type,
      msgType,
      isRead: NotificationStatus.UNREAD
    });

    return this.notificationRepository.save(notification);
  }

  // 批量创建通知
  async createBulkNotifications(notifications: Array<{
    userId: string;
    content: string;
    objectId: string;
    type?: NotificationType;
    msgType?: number;
  }>) {
    const notificationEntities = notifications.map(notif => 
      this.notificationRepository.create({
        userId: notif.userId,
        content: notif.content,
        objectId: notif.objectId,
        type: notif.type || NotificationType.INBOX,
        msgType: notif.msgType || 1,
        isRead: NotificationStatus.UNREAD
      })
    );

    return this.notificationRepository.save(notificationEntities);
  }

  private async formatNotificationResponse(notification: Notification): Promise<NotificationResponse> {
    // 获取对象信息
    let objectInfo: any = null;

    // 尝试从不同的表中获取对象信息
    const question = await this.questionRepository.findOne({ where: { id: notification.objectId } });
    if (question) {
      objectInfo = {
        type: 'question',
        id: question.id,
        title: question.title,
        excerpt: question.originalText.substring(0, 100)
      };
    } else {
      const answer = await this.answerRepository.findOne({ where: { id: notification.objectId } });
      if (answer) {
        objectInfo = {
          type: 'answer',
          id: answer.id,
          question_id: answer.questionId,
          excerpt: answer.originalText.substring(0, 100)
        };
      } else {
        const comment = await this.commentRepository.findOne({ where: { id: notification.objectId } });
        if (comment) {
          objectInfo = {
            type: 'comment',
            id: comment.id,
            object_id: comment.objectId,
            excerpt: comment.originalText.substring(0, 100)
          };
        }
      }
    }

    return {
      id: notification.id,
      content: notification.content,
      type: notification.type,
      is_read: notification.isRead,
      msg_type: notification.msgType,
      created_at: notification.createdAt,
      updated_at: notification.updatedAt,
      object_info: objectInfo
    };
  }
}
