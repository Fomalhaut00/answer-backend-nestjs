import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Question, QuestionStatus, QuestionPin, QuestionShow } from '../../entities/question.entity';
import { User } from '../../entities/user.entity';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
  QuestionPageDto,
  QuestionOperationDto,
  QuestionInviteDto,
  QuestionLinkDto,
  QuestionResponse,
  QuestionDetailResponse
} from './dto/question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: string, createQuestionDto: CreateQuestionDto): Promise<QuestionResponse> {
    // 验证用户是否存在
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 创建问题
    const question = this.questionRepository.create({
      userId,
      title: createQuestionDto.title,
      originalText: createQuestionDto.original_text,
      parsedText: createQuestionDto.original_text, // 在实际应用中应该解析markdown
      status: QuestionStatus.AVAILABLE,
      pin: QuestionPin.UNPIN,
      show: QuestionShow.SHOW,
      viewCount: 0,
      uniqueViewCount: 0,
      voteCount: 0,
      answerCount: 0,
      collectionCount: 0,
      followCount: 0,
      acceptedAnswerId: '',
      lastAnswerId: '',
      lastEditUserId: userId,
      postUpdateTime: new Date(),
      // 在实际应用中，这里应该处理标签关联
      // tags: createQuestionDto.tags
    });

    const savedQuestion = await this.questionRepository.save(question);

    // 更新用户问题计数
    await this.userRepository.increment({ id: userId }, 'questionCount', 1);

    return this.formatQuestionResponse(savedQuestion, user);
  }

  async getQuestion(id: string, userId?: string): Promise<QuestionDetailResponse> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['user'] // 在实际应用中需要配置关联关系
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // 增加浏览量
    await this.questionRepository.increment({ id }, 'viewCount', 1);
    if (userId) {
      // 在实际应用中，这里应该检查是否是唯一浏览并更新uniqueViewCount
    }

    // 获取问题作者信息
    const author = await this.userRepository.findOne({ where: { id: question.userId } });

    const response = this.formatQuestionResponse(question, author || undefined) as QuestionDetailResponse;

    // 添加详细信息
    response.description = question.parsedText;
    response.mr_list = []; // 在实际应用中获取修订历史
    response.vote_status = ''; // 在实际应用中获取用户投票状态
    response.is_followed = false; // 在实际应用中检查是否关注
    response.collected = false; // 在实际应用中检查是否收藏

    return response;
  }

  async update(userId: string, updateQuestionDto: UpdateQuestionDto): Promise<QuestionResponse> {
    const question = await this.questionRepository.findOne({
      where: { id: updateQuestionDto.id }
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // 检查权限：只有作者或有编辑权限的用户可以编辑
    if (question.userId !== userId) {
      // 在实际应用中，这里应该检查用户是否有编辑权限
      throw new ForbiddenException('You do not have permission to edit this question');
    }

    // 更新问题
    await this.questionRepository.update(updateQuestionDto.id, {
      title: updateQuestionDto.title,
      originalText: updateQuestionDto.original_text,
      parsedText: updateQuestionDto.original_text, // 在实际应用中应该解析markdown
      lastEditUserId: userId,
      postUpdateTime: new Date(),
    });

    const updatedQuestion = await this.questionRepository.findOne({
      where: { id: updateQuestionDto.id }
    });

    if (!updatedQuestion) {
      throw new NotFoundException('Updated question not found');
    }

    const author = await this.userRepository.findOne({ where: { id: updatedQuestion.userId } });

    return this.formatQuestionResponse(updatedQuestion, author || undefined);
  }

  async remove(userId: string, id: string): Promise<{ message: string }> {
    const question = await this.questionRepository.findOne({ where: { id } });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // 检查权限：只有作者或有删除权限的用户可以删除
    if (question.userId !== userId) {
      // 在实际应用中，这里应该检查用户是否有删除权限
      throw new ForbiddenException('You do not have permission to delete this question');
    }

    // 软删除：更新状态为已删除
    await this.questionRepository.update(id, {
      status: QuestionStatus.DELETED,
      postUpdateTime: new Date(),
    });

    // 更新用户问题计数
    await this.userRepository.decrement({ id: question.userId }, 'questionCount', 1);

    return { message: 'Question deleted successfully' };
  }

  async recover(userId: string, id: string): Promise<{ message: string }> {
    const question = await this.questionRepository.findOne({ where: { id } });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // 检查权限
    if (question.userId !== userId) {
      throw new ForbiddenException('You do not have permission to recover this question');
    }

    // 恢复问题
    await this.questionRepository.update(id, {
      status: QuestionStatus.AVAILABLE,
      postUpdateTime: new Date(),
    });

    // 更新用户问题计数
    await this.userRepository.increment({ id: question.userId }, 'questionCount', 1);

    return { message: 'Question recovered successfully' };
  }

  async getQuestionPage(questionPageDto: QuestionPageDto) {
    const {
      page = 1,
      page_size = 20,
      order = 'newest',
      tag,
      username,
      in_days
    } = questionPageDto;

    const skip = (page - 1) * page_size;
    const queryBuilder = this.questionRepository.createQueryBuilder('question')
      .leftJoinAndSelect('question.user', 'user')
      .where('question.status = :status', { status: QuestionStatus.AVAILABLE });

    // 按标签筛选
    if (tag) {
      // 在实际应用中，这里应该通过标签关联表查询
      queryBuilder.andWhere('question.tags LIKE :tag', { tag: `%${tag}%` });
    }

    // 按用户筛选
    if (username) {
      queryBuilder.andWhere('user.username = :username', { username });
    }

    // 按时间范围筛选
    if (in_days) {
      const date = new Date();
      date.setDate(date.getDate() - in_days);
      queryBuilder.andWhere('question.createdAt >= :date', { date });
    }

    // 排序
    switch (order) {
      case 'newest':
        queryBuilder.orderBy('question.createdAt', 'DESC');
        break;
      case 'active':
        queryBuilder.orderBy('question.postUpdateTime', 'DESC');
        break;
      case 'frequent':
        queryBuilder.orderBy('question.viewCount', 'DESC');
        break;
      case 'score':
        queryBuilder.orderBy('question.voteCount', 'DESC');
        break;
      case 'unanswered':
        queryBuilder.andWhere('question.answerCount = 0')
          .orderBy('question.createdAt', 'DESC');
        break;
      default:
        queryBuilder.orderBy('question.createdAt', 'DESC');
    }

    const [questions, total] = await queryBuilder
      .skip(skip)
      .take(page_size)
      .getManyAndCount();

    // 获取问题作者信息
    const questionResponses: QuestionResponse[] = [];
    for (const question of questions) {
      const author = await this.userRepository.findOne({ where: { id: question.userId } });
      questionResponses.push(this.formatQuestionResponse(question, author || undefined));
    }

    return {
      questions: questionResponses,
      total,
      page,
      page_size
    };
  }

  async getRecommendQuestionPage(questionPageDto: QuestionPageDto, userId?: string) {
    // 在实际应用中，这里应该根据用户的兴趣标签推荐问题
    // 暂时返回最新的问题
    console.log('Getting recommended questions for user:', userId);
    return this.getQuestionPage(questionPageDto);
  }

  async getSimilarQuestion(title: string) {
    const questions = await this.questionRepository.find({
      where: {
        title: Like(`%${title}%`),
        status: QuestionStatus.AVAILABLE
      },
      take: 5,
      order: { createdAt: 'DESC' }
    });

    return {
      questions: questions.map(q => ({
        id: q.id,
        title: q.title,
        vote_count: q.voteCount,
        answer_count: q.answerCount
      }))
    };
  }

  async questionOperation(userId: string, operationDto: QuestionOperationDto) {
    const question = await this.questionRepository.findOne({
      where: { id: operationDto.id }
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // 在实际应用中，这里应该检查用户是否有相应的操作权限
    console.log('User', userId, 'performing operation:', operationDto.operation);
    const updateData: Partial<Question> = {};

    switch (operationDto.operation) {
      case 'close':
        updateData.status = QuestionStatus.CLOSED;
        break;
      case 'reopen':
        updateData.status = QuestionStatus.AVAILABLE;
        break;
      case 'pin':
        updateData.pin = QuestionPin.PIN;
        break;
      case 'unpin':
        updateData.pin = QuestionPin.UNPIN;
        break;
      case 'hide':
        updateData.show = QuestionShow.HIDE;
        break;
      case 'show':
        updateData.show = QuestionShow.SHOW;
        break;
      default:
        throw new BadRequestException('Invalid operation');
    }

    updateData.postUpdateTime = new Date();
    await this.questionRepository.update(operationDto.id, updateData);

    return { message: `Question ${operationDto.operation} successfully` };
  }

  async getQuestionInviteUserInfo(id: string) {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // 在实际应用中，这里应该返回可以邀请的用户列表
    // 暂时返回空列表
    return {
      invite_user_info: []
    };
  }

  async inviteUserToAnswer(userId: string, inviteDto: QuestionInviteDto) {
    const question = await this.questionRepository.findOne({
      where: { id: inviteDto.id }
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // 在实际应用中，这里应该发送邀请通知给指定用户
    // 暂时返回成功消息
    console.log('User', userId, 'inviting users to answer question:', inviteDto.id);
    return { message: 'Invitation sent successfully' };
  }

  async getQuestionLink(id: string) {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // 在实际应用中，这里应该从问题链接表中获取相关问题
    return {
      question_link_list: []
    };
  }

  async linkQuestion(userId: string, linkDto: QuestionLinkDto) {
    const question = await this.questionRepository.findOne({
      where: { id: linkDto.id }
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const linkedQuestion = await this.questionRepository.findOne({
      where: { id: linkDto.link_object_id }
    });

    if (!linkedQuestion) {
      throw new NotFoundException('Linked question not found');
    }

    // 在实际应用中，这里应该在问题链接表中创建关联
    console.log('User', userId, 'linking questions:', linkDto.id, 'to', linkDto.link_object_id);
    return { message: 'Questions linked successfully' };
  }

  async getUserTop(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 获取用户的热门问题和答案
    const questions = await this.questionRepository.find({
      where: { userId: user.id, status: QuestionStatus.AVAILABLE },
      order: { voteCount: 'DESC' },
      take: 5
    });

    return {
      question_info: questions.map(q => this.formatQuestionResponse(q, user)),
      answer_info: [] // 在实际应用中应该获取用户的热门答案
    };
  }

  async getPersonalQuestionPage(query: any) {
    const { username, page = 1, page_size = 20 } = query;

    if (!username) {
      throw new BadRequestException('Username is required');
    }

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const skip = (page - 1) * page_size;
    const [questions, total] = await this.questionRepository.findAndCount({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
      skip,
      take: page_size
    });

    return {
      questions: questions.map(q => this.formatQuestionResponse(q, user)),
      total,
      page,
      page_size
    };
  }

  async getPersonalAnswerPage(query: any) {
    // 在实际应用中，这里应该从答案表中获取用户的答案
    // 暂时返回空数据
    return {
      answers: [],
      total: 0,
      page: query.page || 1,
      page_size: query.page_size || 20
    };
  }

  private formatQuestionResponse(question: Question, user?: User): QuestionResponse {
    return {
      id: question.id,
      title: question.title,
      original_text: question.originalText,
      parsed_text: question.parsedText,
      status: question.status,
      view_count: question.viewCount,
      unique_view_count: question.uniqueViewCount,
      vote_count: question.voteCount,
      answer_count: question.answerCount,
      collection_count: question.collectionCount,
      follow_count: question.followCount,
      accepted_answer_id: question.acceptedAnswerId,
      last_answer_id: question.lastAnswerId,
      created_at: question.createdAt,
      updated_at: question.updatedAt,
      post_update_time: question.postUpdateTime,
      user_id: question.userId,
      last_edit_user_id: question.lastEditUserId,
      tags: [], // 在实际应用中应该获取标签信息
      user_info: user ? {
        id: user.id,
        username: user.username,
        display_name: user.displayName,
        avatar: user.avatar,
        rank: user.rank,
        status: user.status
      } : null,
      update_user_info: null, // 在实际应用中应该获取最后编辑用户信息
      last_answered_user_info: null, // 在实际应用中应该获取最后回答用户信息
      operated: null, // 在实际应用中应该获取操作信息
      similar_questions: [], // 在实际应用中应该获取相似问题
      member_actions: [] // 在实际应用中应该获取用户可执行的操作
    };
  }
}
