import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException,
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Comment, CommentStatus } from '../../entities/comment.entity';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';
import { User } from '../../entities/user.entity';
import { 
  CreateCommentDto,
  UpdateCommentDto,
  CommentPageDto,
  PersonalCommentPageDto,
  CommentResponse
} from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: string, createCommentDto: CreateCommentDto): Promise<CommentResponse> {
    // 验证用户是否存在
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 验证评论对象是否存在（可能是问题或答案）
    let questionId = '';
    const question = await this.questionRepository.findOne({ 
      where: { id: createCommentDto.object_id } 
    });
    
    if (question) {
      questionId = question.id;
    } else {
      // 如果不是问题，检查是否是答案
      const answer = await this.answerRepository.findOne({ 
        where: { id: createCommentDto.object_id } 
      });
      if (answer) {
        questionId = answer.questionId;
      } else {
        throw new NotFoundException('Comment object not found');
      }
    }

    // 验证回复用户是否存在（如果有）
    let replyUser: User | undefined = undefined;
    if (createCommentDto.reply_user_id) {
      const foundReplyUser = await this.userRepository.findOne({
        where: { id: createCommentDto.reply_user_id }
      });
      if (!foundReplyUser) {
        throw new NotFoundException('Reply user not found');
      }
      replyUser = foundReplyUser;
    }

    // 创建评论
    const comment = this.commentRepository.create({
      userId,
      objectId: createCommentDto.object_id,
      questionId,
      originalText: createCommentDto.original_text,
      parsedText: createCommentDto.original_text, // 在实际应用中应该解析markdown
      status: CommentStatus.AVAILABLE,
      replyUserId: createCommentDto.reply_user_id || '0',
      voteCount: 0,
    });

    const savedComment = await this.commentRepository.save(comment);

    // 更新相关对象的评论计数
    if (question) {
      // 如果是对问题的评论，暂时不更新计数（Go项目中问题没有评论计数字段）
    } else {
      // 如果是对答案的评论，更新答案的评论计数
      await this.answerRepository.increment({ id: createCommentDto.object_id }, 'commentCount', 1);
    }

    return this.formatCommentResponse(savedComment, user, replyUser);
  }

  async getComment(id: string, userId?: string): Promise<CommentResponse> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // 获取评论作者信息
    const author = await this.userRepository.findOne({ where: { id: comment.userId } });

    // 获取回复用户信息（如果有）
    let replyUser: User | undefined = undefined;
    if (comment.replyUserId && comment.replyUserId !== '0') {
      const foundReplyUser = await this.userRepository.findOne({ where: { id: comment.replyUserId } });
      replyUser = foundReplyUser || undefined;
    }

    return this.formatCommentResponse(comment, author || undefined, replyUser);
  }

  async update(userId: string, updateCommentDto: UpdateCommentDto): Promise<CommentResponse> {
    const comment = await this.commentRepository.findOne({ 
      where: { id: updateCommentDto.comment_id } 
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // 检查权限：只有作者或有编辑权限的用户可以编辑
    if (comment.userId !== userId) {
      // 在实际应用中，这里应该检查用户是否有编辑权限
      throw new ForbiddenException('You do not have permission to edit this comment');
    }

    // 更新评论
    await this.commentRepository.update(updateCommentDto.comment_id, {
      originalText: updateCommentDto.original_text,
      parsedText: updateCommentDto.original_text, // 在实际应用中应该解析markdown
    });

    const updatedComment = await this.commentRepository.findOne({
      where: { id: updateCommentDto.comment_id }
    });

    if (!updatedComment) {
      throw new NotFoundException('Updated comment not found');
    }

    const author = await this.userRepository.findOne({ where: { id: updatedComment.userId } });

    let replyUser: User | undefined = undefined;
    if (updatedComment.replyUserId && updatedComment.replyUserId !== '0') {
      const foundReplyUser = await this.userRepository.findOne({ where: { id: updatedComment.replyUserId } });
      replyUser = foundReplyUser || undefined;
    }

    return this.formatCommentResponse(updatedComment, author || undefined, replyUser);
  }

  async remove(userId: string, commentId: string): Promise<{ message: string }> {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // 检查权限：只有作者或有删除权限的用户可以删除
    if (comment.userId !== userId) {
      // 在实际应用中，这里应该检查用户是否有删除权限
      throw new ForbiddenException('You do not have permission to delete this comment');
    }

    // 软删除：更新状态为已删除
    await this.commentRepository.update(commentId, {
      status: CommentStatus.DELETED,
    });

    // 更新相关对象的评论计数
    const question = await this.questionRepository.findOne({ 
      where: { id: comment.objectId } 
    });
    
    if (!question) {
      // 如果不是问题，可能是答案
      const answer = await this.answerRepository.findOne({ 
        where: { id: comment.objectId } 
      });
      if (answer) {
        await this.answerRepository.decrement({ id: comment.objectId }, 'commentCount', 1);
      }
    }

    return { message: 'Comment deleted successfully' };
  }

  async getCommentPage(commentPageDto: CommentPageDto) {
    const {
      page = 1,
      page_size = 20,
      object_id,
      query_cond
    } = commentPageDto;

    const skip = (page - 1) * page_size;
    const queryBuilder = this.commentRepository.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.replyUser', 'replyUser')
      .where('comment.object_id = :objectId', { objectId: object_id })
      .andWhere('comment.status = :status', { status: CommentStatus.AVAILABLE });

    // 如果有查询条件
    if (query_cond) {
      queryBuilder.andWhere('comment.original_text LIKE :query', { query: `%${query_cond}%` });
    }

    const [comments, total] = await queryBuilder
      .orderBy('comment.created_at', 'ASC')
      .skip(skip)
      .take(page_size)
      .getManyAndCount();

    // 获取用户信息
    const userIds = [...new Set([
      ...comments.map(c => c.userId),
      ...comments.filter(c => c.replyUserId && c.replyUserId !== '0').map(c => c.replyUserId)
    ])];

    const users = await this.userRepository.find({
      where: { id: In(userIds) }
    });
    const userMap = new Map(users.map(u => [u.id, u]));

    return {
      comments: comments.map(c => this.formatCommentResponse(
        c,
        userMap.get(c.userId) || undefined,
        c.replyUserId && c.replyUserId !== '0' ? userMap.get(c.replyUserId) || undefined : undefined
      )),
      total,
      page,
      page_size
    };
  }

  async getPersonalCommentPage(personalCommentPageDto: PersonalCommentPageDto) {
    const { username, page = 1, page_size = 20 } = personalCommentPageDto;

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const skip = (page - 1) * page_size;
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { userId: user.id, status: CommentStatus.AVAILABLE },
      order: { createdAt: 'DESC' },
      skip,
      take: page_size
    });

    // 获取回复用户信息
    const replyUserIds = comments
      .filter(c => c.replyUserId && c.replyUserId !== '0')
      .map(c => c.replyUserId);

    const replyUsers = replyUserIds.length > 0
      ? await this.userRepository.find({ where: { id: In(replyUserIds) } })
      : [];
    const replyUserMap = new Map(replyUsers.map(u => [u.id, u]));

    return {
      comments: comments.map(c => this.formatCommentResponse(
        c,
        user,
        c.replyUserId && c.replyUserId !== '0' ? replyUserMap.get(c.replyUserId) || undefined : undefined
      )),
      total,
      page,
      page_size
    };
  }

  private formatCommentResponse(comment: Comment, user?: User, replyUser?: User): CommentResponse {
    return {
      comment_id: comment.id,
      object_id: comment.objectId,
      question_id: comment.questionId,
      original_text: comment.originalText,
      parsed_text: comment.parsedText,
      vote_count: comment.voteCount,
      created_at: comment.createdAt,
      updated_at: comment.updatedAt,
      user_id: comment.userId,
      reply_user_id: comment.replyUserId,
      user_info: user ? {
        id: user.id,
        username: user.username,
        display_name: user.displayName,
        avatar: user.avatar,
        rank: user.rank,
        status: user.status
      } : null,
      reply_user_info: replyUser ? {
        id: replyUser.id,
        username: replyUser.username,
        display_name: replyUser.displayName,
        avatar: replyUser.avatar,
        rank: replyUser.rank,
        status: replyUser.status
      } : null,
      member_actions: [], // 在实际应用中应该获取用户可执行的操作
      vote_status: '' // 在实际应用中应该获取用户投票状态
    };
  }
}
