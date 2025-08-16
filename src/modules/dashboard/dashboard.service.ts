import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';
import { Comment } from '../../entities/comment.entity';
import { Activity } from '../../entities/activity.entity';
import { DashboardInfoResponse } from './dto/dashboard.dto';

@Injectable()
export class DashboardService {
  private appStartTime: Date;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {
    this.appStartTime = new Date();
  }

  // 获取管理员仪表板信息
  async getDashboardInfo(): Promise<DashboardInfoResponse> {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // 并行获取所有统计数据
    const [
      userCount,
      newUserCount,
      questionCount,
      newQuestionCount,
      answerCount,
      newAnswerCount,
      commentCount,
      newCommentCount,
      voteCount,
      newVoteCount
    ] = await Promise.all([
      // 用户统计
      this.userRepository.count(),
      this.userRepository.count({
        where: {
          createdAt: todayStart as any
        }
      }),
      
      // 问题统计
      this.questionRepository.count(),
      this.questionRepository.count({
        where: {
          createdAt: todayStart as any
        }
      }),
      
      // 答案统计
      this.answerRepository.count(),
      this.answerRepository.count({
        where: {
          createdAt: todayStart as any
        }
      }),
      
      // 评论统计
      this.commentRepository.count(),
      this.commentRepository.count({
        where: {
          createdAt: todayStart as any
        }
      }),
      
      // 投票统计 (活动类型1-6为投票相关)
      this.activityRepository.count({
        where: {
          activityType: [1, 2, 3, 4, 5, 6] as any,
          cancelled: 0
        }
      }),
      this.activityRepository.count({
        where: {
          activityType: [1, 2, 3, 4, 5, 6] as any,
          cancelled: 0,
          created_at: todayStart as any
        }
      })
    ]);

    return {
      // 用户统计
      user_count: userCount,
      new_user_count: newUserCount,
      
      // 问题统计
      question_count: questionCount,
      new_question_count: newQuestionCount,
      
      // 答案统计
      answer_count: answerCount,
      new_answer_count: newAnswerCount,
      
      // 评论统计
      comment_count: commentCount,
      new_comment_count: newCommentCount,
      
      // 投票统计
      vote_count: voteCount,
      new_vote_count: newVoteCount,
      
      // 系统信息
      app_start_time: this.appStartTime,
      app_version: process.env.npm_package_version || '1.0.0',
      go_version: 'N/A (NestJS)', // NestJS版本
      database_version: 'PostgreSQL', // 数据库版本
      
      // 时间信息
      today_date: today.toISOString().split('T')[0],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  // 获取用户增长趋势（最近7天）
  async getUserGrowthTrend(): Promise<any[]> {
    const days = 7;
    const result: any[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dateEnd = new Date(dateStart);
      dateEnd.setDate(dateEnd.getDate() + 1);
      
      const [totalUsers, newUsers] = await Promise.all([
        this.userRepository.count({
          where: {
            createdAt: dateEnd as any
          }
        }),
        this.userRepository.count({
          where: {
            createdAt: dateStart as any
          }
        })
      ]);
      
      result.push({
        date: dateStart.toISOString().split('T')[0],
        user_count: totalUsers,
        new_users: newUsers
      });
    }
    
    return result;
  }

  // 获取内容增长趋势（最近7天）
  async getContentGrowthTrend(): Promise<any[]> {
    const days = 7;
    const result: any[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dateEnd = new Date(dateStart);
      dateEnd.setDate(dateEnd.getDate() + 1);
      
      const [questionCount, answerCount, commentCount] = await Promise.all([
        this.questionRepository.count({
          where: {
            createdAt: dateStart as any
          }
        }),
        this.answerRepository.count({
          where: {
            createdAt: dateStart as any
          }
        }),
        this.commentRepository.count({
          where: {
            createdAt: dateStart as any
          }
        })
      ]);
      
      result.push({
        date: dateStart.toISOString().split('T')[0],
        question_count: questionCount,
        answer_count: answerCount,
        comment_count: commentCount
      });
    }
    
    return result;
  }
}
