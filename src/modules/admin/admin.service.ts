import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThan } from 'typeorm';
import { User, UserStatus } from '../../entities/user.entity';
import { Question, QuestionStatus } from '../../entities/question.entity';
import { Answer, AnswerStatus } from '../../entities/answer.entity';
import { Comment } from '../../entities/comment.entity';
import { Activity } from '../../entities/activity.entity';
import { Role } from '../../entities/role.entity';
import { UserRoleRel } from '../../entities/user-role-rel.entity';
import {
  AdminUserPageDto,
  UpdateUserStatusDto,
  AdminQuestionPageDto,
  AdminAnswerPageDto,
  SystemConfigDto,
  AdminStatsResponse,
  UpdateUserRoleDto
} from './dto/admin.dto';

@Injectable()
export class AdminService {
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
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRoleRel)
    private readonly userRoleRelRepository: Repository<UserRoleRel>,
  ) {}

  async getDashboardStats(): Promise<AdminStatsResponse> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalQuestions,
      totalAnswers,
      totalComments,
      totalVotes,
      activeUsersToday,
      newUsersToday,
      questionsToday,
      answersToday
    ] = await Promise.all([
      this.userRepository.count(),
      this.questionRepository.count(),
      this.answerRepository.count(),
      this.commentRepository.count(),
      this.activityRepository.count({ where: { activityType: [1, 2, 3, 4, 5, 6] as any } }),
      this.userRepository.count({ where: { lastLoginDate: MoreThan(today) } }),
      this.userRepository.count({ where: { createdAt: MoreThan(today) } }),
      this.questionRepository.count({ where: { createdAt: MoreThan(today) } }),
      this.answerRepository.count({ where: { createdAt: MoreThan(today) } })
    ]);

    return {
      total_users: totalUsers,
      total_questions: totalQuestions,
      total_answers: totalAnswers,
      total_comments: totalComments,
      total_votes: totalVotes,
      active_users_today: activeUsersToday,
      new_users_today: newUsersToday,
      questions_today: questionsToday,
      answers_today: answersToday
    };
  }

  async getUsers(adminUserPageDto: AdminUserPageDto) {
    const { page = 1, page_size = 20, query, status } = adminUserPageDto;
    const skip = (page - 1) * page_size;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (query) {
      queryBuilder.where(
        '(user.username LIKE :query OR user.email LIKE :query OR user.display_name LIKE :query)',
        { query: `%${query}%` }
      );
    }

    if (status) {
      const statusMap = {
        'normal': UserStatus.AVAILABLE,
        'suspended': UserStatus.SUSPENDED,
        'deleted': UserStatus.DELETED,
        'inactive': UserStatus.SUSPENDED
      };
      queryBuilder.andWhere('user.status = :status', { status: statusMap[status] });
    }

    const [users, total] = await queryBuilder
      .orderBy('user.created_at', 'DESC')
      .skip(skip)
      .take(page_size)
      .getManyAndCount();

    return {
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        display_name: user.displayName,
        rank: user.rank,
        status: user.status,
        created_at: user.createdAt,
        last_login_date: user.lastLoginDate,
        question_count: user.questionCount,
        answer_count: user.answerCount
      })),
      total,
      page,
      page_size
    };
  }

  async updateUserStatus(userId: string, updateUserStatusDto: UpdateUserStatusDto, adminId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const statusMap = {
      'normal': UserStatus.AVAILABLE,
      'suspended': UserStatus.SUSPENDED,
      'deleted': UserStatus.DELETED,
      'inactive': UserStatus.SUSPENDED
    };

    await this.userRepository.update(userId, {
      status: statusMap[updateUserStatusDto.status]
    });

    // 在实际应用中，这里应该记录管理员操作日志
    console.log(`Admin ${adminId} updated user ${userId} status to ${updateUserStatusDto.status}. Reason: ${updateUserStatusDto.reason}`);

    return { message: 'User status updated successfully' };
  }

  async getUserDetail(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 获取用户的详细统计信息
    const [questionCount, answerCount, commentCount] = await Promise.all([
      this.questionRepository.count({ where: { userId } }),
      this.answerRepository.count({ where: { userId } }),
      this.commentRepository.count({ where: { userId } })
    ]);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      display_name: user.displayName,
      avatar: user.avatar,
      bio: user.bio,
      website: user.website,
      location: user.location,
      rank: user.rank,
      status: user.status,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      last_login_date: user.lastLoginDate,
      question_count: questionCount,
      answer_count: answerCount,
      comment_count: commentCount,
      is_admin: user.isAdmin
    };
  }

  async getQuestions(adminQuestionPageDto: AdminQuestionPageDto) {
    const { page = 1, page_size = 20, query, status } = adminQuestionPageDto;
    const skip = (page - 1) * page_size;

    const queryBuilder = this.questionRepository.createQueryBuilder('question')
      .leftJoinAndSelect('question.user', 'user');

    if (query) {
      queryBuilder.where(
        '(question.title LIKE :query OR question.original_text LIKE :query)',
        { query: `%${query}%` }
      );
    }

    if (status) {
      const statusMap = {
        'available': QuestionStatus.AVAILABLE,
        'closed': QuestionStatus.CLOSED,
        'deleted': QuestionStatus.DELETED,
        'pending': QuestionStatus.PENDING
      };
      queryBuilder.andWhere('question.status = :status', { status: statusMap[status] });
    }

    const [questions, total] = await queryBuilder
      .orderBy('question.created_at', 'DESC')
      .skip(skip)
      .take(page_size)
      .getManyAndCount();

    // 获取问题作者信息
    const questionResponses: any[] = [];
    for (const question of questions) {
      const author = await this.userRepository.findOne({ where: { id: question.userId } });
      questionResponses.push({
        id: question.id,
        title: question.title,
        status: question.status,
        vote_count: question.voteCount,
        answer_count: question.answerCount,
        view_count: question.viewCount,
        created_at: question.createdAt,
        user_info: author ? {
          id: author.id,
          username: author.username,
          display_name: author.displayName
        } : null
      });
    }

    return {
      questions: questionResponses,
      total,
      page,
      page_size
    };
  }

  async getAnswers(adminAnswerPageDto: AdminAnswerPageDto) {
    const { page = 1, page_size = 20, query, status } = adminAnswerPageDto;
    const skip = (page - 1) * page_size;

    const queryBuilder = this.answerRepository.createQueryBuilder('answer')
      .leftJoinAndSelect('answer.user', 'user')
      .leftJoinAndSelect('answer.question', 'question');

    if (query) {
      queryBuilder.where('answer.original_text LIKE :query', { query: `%${query}%` });
    }

    if (status) {
      const statusMap = {
        'available': AnswerStatus.AVAILABLE,
        'deleted': AnswerStatus.DELETED,
        'pending': AnswerStatus.PENDING
      };
      queryBuilder.andWhere('answer.status = :status', { status: statusMap[status] });
    }

    const [answers, total] = await queryBuilder
      .orderBy('answer.created_at', 'DESC')
      .skip(skip)
      .take(page_size)
      .getManyAndCount();

    // 获取答案作者和问题信息
    const answerResponses: any[] = [];
    for (const answer of answers) {
      const author = await this.userRepository.findOne({ where: { id: answer.userId } });
      const question = await this.questionRepository.findOne({ where: { id: answer.questionId } });
      answerResponses.push({
        id: answer.id,
        question_id: answer.questionId,
        status: answer.status,
        vote_count: answer.voteCount,
        adopted: answer.adopted,
        created_at: answer.createdAt,
        user_info: author ? {
          id: author.id,
          username: author.username,
          display_name: author.displayName
        } : null,
        question_info: question ? {
          id: question.id,
          title: question.title
        } : null
      });
    }

    return {
      answers: answerResponses,
      total,
      page,
      page_size
    };
  }

  async updateQuestionStatus(questionId: string, body: { status: string; reason?: string }, adminId: string) {
    const question = await this.questionRepository.findOne({ where: { id: questionId } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const statusMap = {
      'available': QuestionStatus.AVAILABLE,
      'closed': QuestionStatus.CLOSED,
      'deleted': QuestionStatus.DELETED,
      'pending': QuestionStatus.PENDING
    };

    await this.questionRepository.update(questionId, {
      status: statusMap[body.status]
    });

    console.log(`Admin ${adminId} updated question ${questionId} status to ${body.status}. Reason: ${body.reason}`);

    return { message: 'Question status updated successfully' };
  }

  async updateAnswerStatus(answerId: string, body: { status: string; reason?: string }, adminId: string) {
    const answer = await this.answerRepository.findOne({ where: { id: answerId } });
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    const statusMap = {
      'available': AnswerStatus.AVAILABLE,
      'deleted': AnswerStatus.DELETED,
      'pending': AnswerStatus.PENDING
    };

    await this.answerRepository.update(answerId, {
      status: statusMap[body.status]
    });

    console.log(`Admin ${adminId} updated answer ${answerId} status to ${body.status}. Reason: ${body.reason}`);

    return { message: 'Answer status updated successfully' };
  }

  async getSystemConfig() {
    // 在实际应用中，这里应该从配置表或配置文件中获取系统配置
    // 暂时返回默认配置
    return {
      site_name: 'Answer Community',
      site_url: 'https://answer.example.com',
      contact_email: 'admin@example.com',
      allow_new_registrations: true,
      require_email_verification: true,
      min_reputation_to_vote: 15,
      min_reputation_to_comment: 50
    };
  }

  async updateSystemConfig(systemConfigDto: SystemConfigDto, adminId: string) {
    // 在实际应用中，这里应该更新配置表或配置文件
    console.log(`Admin ${adminId} updated system config:`, systemConfigDto);

    return { message: 'System configuration updated successfully' };
  }

  async getQuestionReviewQueue(query: any) {
    const { page = 1, page_size = 20 } = query;
    const skip = (page - 1) * page_size;

    // 获取需要审核的问题（状态为pending或被举报的）
    const [questions, total] = await this.questionRepository.findAndCount({
      where: { status: QuestionStatus.PENDING },
      order: { createdAt: 'ASC' },
      skip,
      take: page_size
    });

    // 获取问题作者信息
    const questionResponses: any[] = [];
    for (const question of questions) {
      const author = await this.userRepository.findOne({ where: { id: question.userId } });
      questionResponses.push({
        id: question.id,
        title: question.title,
        original_text: question.originalText,
        status: question.status,
        created_at: question.createdAt,
        user_info: author ? {
          id: author.id,
          username: author.username,
          display_name: author.displayName
        } : null
      });
    }

    return {
      questions: questionResponses,
      total,
      page,
      page_size
    };
  }

  async getAnswerReviewQueue(query: any) {
    const { page = 1, page_size = 20 } = query;
    const skip = (page - 1) * page_size;

    const [answers, total] = await this.answerRepository.findAndCount({
      where: { status: AnswerStatus.PENDING },
      order: { createdAt: 'ASC' },
      skip,
      take: page_size
    });

    // 获取答案作者信息
    const answerResponses: any[] = [];
    for (const answer of answers) {
      const author = await this.userRepository.findOne({ where: { id: answer.userId } });
      answerResponses.push({
        id: answer.id,
        question_id: answer.questionId,
        original_text: answer.originalText,
        status: answer.status,
        created_at: answer.createdAt,
        user_info: author ? {
          id: author.id,
          username: author.username,
          display_name: author.displayName
        } : null
      });
    }

    return {
      answers: answerResponses,
      total,
      page,
      page_size
    };
  }

  async getTagReviewQueue(query: any) {
    // 在实际应用中，这里应该获取需要审核的标签
    return {
      tags: [],
      total: 0,
      page: query.page || 1,
      page_size: query.page_size || 20
    };
  }

  async getReports(query: any) {
    // 在实际应用中，这里应该从举报表中获取举报记录
    return {
      reports: [],
      total: 0,
      page: query.page || 1,
      page_size: query.page_size || 20
    };
  }

  async resolveReport(reportId: string, body: { action: string; reason?: string }, adminId: string) {
    // 在实际应用中，这里应该处理举报
    console.log(`Admin ${adminId} resolved report ${reportId} with action ${body.action}. Reason: ${body.reason}`);

    return { message: 'Report resolved successfully' };
  }

  // ===== 用户角色管理 - 与Go项目API一致 =====

  async updateUserRole(updateUserRoleDto: UpdateUserRoleDto, operatorId: string) {
    const { user_id, role_id } = updateUserRoleDto;

    // 检查用户是否存在
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 检查角色是否存在
    const role = await this.roleRepository.findOne({ where: { id: role_id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // 用户不能修改自己的角色
    if (user_id === operatorId) {
      throw new ForbiddenException('Users cannot modify their own roles');
    }

    // 查找现有的用户角色关系
    const existingUserRole = await this.userRoleRelRepository.findOne({
      where: { userId: user_id }
    });

    if (existingUserRole) {
      // 更新现有角色
      existingUserRole.roleId = role_id;
      await this.userRoleRelRepository.save(existingUserRole);
    } else {
      // 创建新的用户角色关系
      const newUserRole = this.userRoleRelRepository.create({
        userId: user_id,
        roleId: role_id
      });
      await this.userRoleRelRepository.save(newUserRole);
    }

    return { message: 'User role updated successfully' };
  }

  async getRoles() {
    const roles = await this.roleRepository.find({
      select: ['id', 'name', 'description']
    });

    return roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description
    }));
  }
}
