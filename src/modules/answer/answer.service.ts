import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException,
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer, AnswerStatus } from '../../entities/answer.entity';
import { Question, QuestionStatus } from '../../entities/question.entity';
import { User } from '../../entities/user.entity';
import { 
  CreateAnswerDto,
  UpdateAnswerDto,
  AnswerPageDto,
  AcceptAnswerDto,
  PersonalAnswerPageDto,
  AnswerResponse,
  AnswerDetailResponse
} from './dto/answer.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: string, createAnswerDto: CreateAnswerDto): Promise<AnswerResponse> {
    // 验证用户是否存在
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 验证问题是否存在且可回答
    const question = await this.questionRepository.findOne({ 
      where: { id: createAnswerDto.question_id } 
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    if (question.status !== QuestionStatus.AVAILABLE) {
      throw new BadRequestException('Question is not available for answers');
    }

    // 创建答案
    const answer = this.answerRepository.create({
      userId,
      questionId: createAnswerDto.question_id,
      originalText: createAnswerDto.original_text,
      parsedText: createAnswerDto.original_text, // 在实际应用中应该解析markdown
      status: AnswerStatus.AVAILABLE,
      lastEditUserId: userId,
      adopted: 0,
      commentCount: 0,
      voteCount: 0,
      revisionId: 0,
    });

    const savedAnswer = await this.answerRepository.save(answer);

    // 更新问题的答案计数和最后答案信息
    await this.questionRepository.update(createAnswerDto.question_id, {
      answerCount: () => 'answer_count + 1',
      lastAnswerId: savedAnswer.id,
      postUpdateTime: new Date(),
    });

    // 更新用户答案计数
    await this.userRepository.increment({ id: userId }, 'answerCount', 1);

    return this.formatAnswerResponse(savedAnswer, user, question);
  }

  async getAnswerInfo(id: string, userId?: string): Promise<AnswerDetailResponse> {
    const answer = await this.answerRepository.findOne({ where: { id } });
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    // 获取答案作者信息
    const author = await this.userRepository.findOne({ where: { id: answer.userId } });

    // 获取问题信息
    const question = await this.questionRepository.findOne({ where: { id: answer.questionId } });

    const response = this.formatAnswerResponse(answer, author || undefined, question || undefined) as AnswerDetailResponse;
    
    // 添加详细信息
    response.description = answer.parsedText;
    response.mr_list = []; // 在实际应用中获取修订历史

    return response;
  }

  async update(userId: string, updateAnswerDto: UpdateAnswerDto): Promise<AnswerResponse> {
    const answer = await this.answerRepository.findOne({ 
      where: { id: updateAnswerDto.id } 
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    // 检查权限：只有作者或有编辑权限的用户可以编辑
    if (answer.userId !== userId) {
      // 在实际应用中，这里应该检查用户是否有编辑权限
      throw new ForbiddenException('You do not have permission to edit this answer');
    }

    // 更新答案
    await this.answerRepository.update(updateAnswerDto.id, {
      originalText: updateAnswerDto.original_text,
      parsedText: updateAnswerDto.original_text, // 在实际应用中应该解析markdown
      lastEditUserId: userId,
    });

    const updatedAnswer = await this.answerRepository.findOne({
      where: { id: updateAnswerDto.id }
    });

    if (!updatedAnswer) {
      throw new NotFoundException('Updated answer not found');
    }

    const author = await this.userRepository.findOne({ where: { id: updatedAnswer.userId } });
    const question = await this.questionRepository.findOne({ where: { id: updatedAnswer.questionId } });

    return this.formatAnswerResponse(updatedAnswer, author || undefined, question || undefined);
  }

  async remove(userId: string, id: string): Promise<{ message: string }> {
    const answer = await this.answerRepository.findOne({ where: { id } });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    // 检查权限：只有作者或有删除权限的用户可以删除
    if (answer.userId !== userId) {
      // 在实际应用中，这里应该检查用户是否有删除权限
      throw new ForbiddenException('You do not have permission to delete this answer');
    }

    // 软删除：更新状态为已删除
    await this.answerRepository.update(id, {
      status: AnswerStatus.DELETED,
    });

    // 更新问题的答案计数
    await this.questionRepository.update(answer.questionId, {
      answerCount: () => 'answer_count - 1',
      postUpdateTime: new Date(),
    });

    // 更新用户答案计数
    await this.userRepository.decrement({ id: answer.userId }, 'answerCount', 1);

    return { message: 'Answer deleted successfully' };
  }

  async recover(userId: string, id: string): Promise<{ message: string }> {
    const answer = await this.answerRepository.findOne({ where: { id } });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    // 检查权限
    if (answer.userId !== userId) {
      throw new ForbiddenException('You do not have permission to recover this answer');
    }

    // 恢复答案
    await this.answerRepository.update(id, {
      status: AnswerStatus.AVAILABLE,
    });

    // 更新问题的答案计数
    await this.questionRepository.update(answer.questionId, {
      answerCount: () => 'answer_count + 1',
      postUpdateTime: new Date(),
    });

    // 更新用户答案计数
    await this.userRepository.increment({ id: answer.userId }, 'answerCount', 1);

    return { message: 'Answer recovered successfully' };
  }

  async getAnswerPage(answerPageDto: AnswerPageDto) {
    const {
      page = 1,
      page_size = 20,
      order = 'default',
      question_id
    } = answerPageDto;

    const skip = (page - 1) * page_size;
    const queryBuilder = this.answerRepository.createQueryBuilder('answer')
      .leftJoinAndSelect('answer.user', 'user')
      .where('answer.question_id = :questionId', { questionId: question_id })
      .andWhere('answer.status = :status', { status: AnswerStatus.AVAILABLE });

    // 排序
    switch (order) {
      case 'updated':
        queryBuilder.orderBy('answer.updatedAt', 'DESC');
        break;
      case 'created':
        queryBuilder.orderBy('answer.createdAt', 'DESC');
        break;
      case 'vote':
        queryBuilder.orderBy('answer.voteCount', 'DESC');
        break;
      default:
        // 默认排序：被采纳的答案在前，然后按投票数排序
        queryBuilder.orderBy('answer.adopted', 'DESC')
          .addOrderBy('answer.voteCount', 'DESC')
          .addOrderBy('answer.createdAt', 'ASC');
    }

    const [answers, total] = await queryBuilder
      .skip(skip)
      .take(page_size)
      .getManyAndCount();

    // 获取问题信息
    const question = await this.questionRepository.findOne({ where: { id: question_id } });

    // 获取答案作者信息
    const answerResponses: AnswerResponse[] = [];
    for (const answer of answers) {
      const author = await this.userRepository.findOne({ where: { id: answer.userId } });
      answerResponses.push(this.formatAnswerResponse(answer, author || undefined, question || undefined));
    }

    return {
      answers: answerResponses,
      total,
      page,
      page_size
    };
  }

  async acceptAnswer(userId: string, acceptAnswerDto: AcceptAnswerDto): Promise<{ message: string }> {
    const { question_id, answer_id } = acceptAnswerDto;

    // 验证问题是否存在且用户是问题作者
    const question = await this.questionRepository.findOne({ where: { id: question_id } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    if (question.userId !== userId) {
      throw new ForbiddenException('Only question author can accept answers');
    }

    // 验证答案是否存在且属于该问题
    const answer = await this.answerRepository.findOne({ where: { id: answer_id } });
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }
    if (answer.questionId !== question_id) {
      throw new BadRequestException('Answer does not belong to this question');
    }

    // 如果已有被采纳的答案，先取消采纳
    if (question.acceptedAnswerId) {
      await this.answerRepository.update(question.acceptedAnswerId, { adopted: 0 });
    }

    // 采纳新答案
    await this.answerRepository.update(answer_id, { adopted: 1 });
    await this.questionRepository.update(question_id, {
      acceptedAnswerId: answer_id,
      postUpdateTime: new Date(),
    });

    return { message: 'Answer accepted successfully' };
  }

  async getPersonalAnswerPage(personalAnswerPageDto: PersonalAnswerPageDto) {
    const { username, page = 1, page_size = 20 } = personalAnswerPageDto;

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const skip = (page - 1) * page_size;
    const [answers, total] = await this.answerRepository.findAndCount({
      where: { userId: user.id, status: AnswerStatus.AVAILABLE },
      order: { createdAt: 'DESC' },
      skip,
      take: page_size
    });

    // 获取相关问题信息
    const questionIds = answers.map(a => a.questionId);
    const questions = await this.questionRepository.findByIds(questionIds);
    const questionMap = new Map(questions.map(q => [q.id, q]));

    return {
      answers: answers.map(a => this.formatAnswerResponse(a, user, questionMap.get(a.questionId))),
      total,
      page,
      page_size
    };
  }

  private formatAnswerResponse(answer: Answer, user?: User, question?: Question): AnswerResponse {
    return {
      id: answer.id,
      question_id: answer.questionId,
      original_text: answer.originalText,
      parsed_text: answer.parsedText,
      status: answer.status,
      adopted: answer.adopted,
      comment_count: answer.commentCount,
      vote_count: answer.voteCount,
      created_at: answer.createdAt,
      updated_at: answer.updatedAt,
      user_id: answer.userId,
      last_edit_user_id: answer.lastEditUserId,
      user_info: user ? {
        id: user.id,
        username: user.username,
        display_name: user.displayName,
        avatar: user.avatar,
        rank: user.rank,
        status: user.status
      } : null,
      update_user_info: null, // 在实际应用中应该获取最后编辑用户信息
      question_info: question ? {
        id: question.id,
        title: question.title,
        status: question.status
      } : null,
      vote_status: '', // 在实际应用中应该获取用户投票状态
      member_actions: [] // 在实际应用中应该获取用户可执行的操作
    };
  }
}
