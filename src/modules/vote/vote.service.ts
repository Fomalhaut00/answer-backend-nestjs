import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException,
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote, VoteType } from '../../entities/vote.entity';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';
import { Comment } from '../../entities/comment.entity';
import { User } from '../../entities/user.entity';
import { 
  VoteDto,
  UserVotesDto,
  VoteResponse,
  UserVoteResponse
} from './dto/vote.dto';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async voteUp(userId: string, voteDto: VoteDto): Promise<VoteResponse> {
    return this.vote(userId, voteDto, VoteType.VOTE_UP);
  }

  async voteDown(userId: string, voteDto: VoteDto): Promise<VoteResponse> {
    return this.vote(userId, voteDto, VoteType.VOTE_DOWN);
  }

  private async vote(userId: string, voteDto: VoteDto, voteType: VoteType): Promise<VoteResponse> {
    // 验证用户是否存在
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 确定对象类型和验证对象是否存在
    const { objectType, targetObject } = await this.getObjectTypeAndValidate(voteDto.object_id, voteDto.object_type);

    // 检查用户是否对自己的内容投票
    if (targetObject.userId === userId) {
      throw new BadRequestException('You cannot vote on your own content');
    }

    // 检查是否已经投过票
    const existingVote = await this.voteRepository.findOne({
      where: {
        userId,
        objectId: voteDto.object_id,
        objectType
      }
    });

    let voteCountChange = 0;
    let voteStatus = '';

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // 取消投票
        await this.voteRepository.remove(existingVote);
        voteCountChange = -voteType;
        voteStatus = '';
      } else {
        // 改变投票类型
        await this.voteRepository.update(existingVote.id, { voteType });
        voteCountChange = voteType * 2; // 从-1变为1或从1变为-1，变化量是2
        voteStatus = voteType === VoteType.VOTE_UP ? 'voted_up' : 'voted_down';
      }
    } else {
      // 新投票
      const newVote = this.voteRepository.create({
        userId,
        objectId: voteDto.object_id,
        objectType,
        voteType
      });
      await this.voteRepository.save(newVote);
      voteCountChange = voteType;
      voteStatus = voteType === VoteType.VOTE_UP ? 'voted_up' : 'voted_down';
    }

    // 更新对象的投票计数
    await this.updateObjectVoteCount(voteDto.object_id, objectType, voteCountChange);

    // 更新用户声誉（在实际应用中，这里应该有更复杂的声誉计算逻辑）
    if (voteCountChange !== 0) {
      const reputationChange = this.calculateReputationChange(objectType, voteType, voteCountChange);
      if (reputationChange !== 0) {
        await this.userRepository.increment({ id: targetObject.userId }, 'rank', reputationChange);
      }
    }

    // 获取更新后的投票计数
    const updatedObject = await this.getObjectById(voteDto.object_id, objectType);

    return {
      vote_count: updatedObject ? updatedObject.voteCount : 0,
      vote_status: voteStatus
    };
  }

  async getUserVotes(userId: string, userVotesDto: UserVotesDto) {
    const { page = 1, page_size = 20 } = userVotesDto;
    const skip = (page - 1) * page_size;

    const [votes, total] = await this.voteRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip,
      take: page_size
    });

    // 获取投票对象的详细信息
    const voteResponses: UserVoteResponse[] = [];
    
    for (const vote of votes) {
      const objectInfo = await this.getObjectInfo(vote.objectId, vote.objectType);
      voteResponses.push({
        object_id: vote.objectId,
        object_type: vote.objectType,
        vote_type: vote.voteType,
        created_at: vote.createdAt,
        object_info: objectInfo
      });
    }

    return {
      votes: voteResponses,
      total,
      page,
      page_size
    };
  }

  async getVoteStatus(objectId: string, userId?: string): Promise<VoteResponse> {
    // 获取对象类型和对象
    const { objectType, targetObject } = await this.getObjectTypeAndValidate(objectId);
    
    let voteStatus = '';
    if (userId) {
      const userVote = await this.voteRepository.findOne({
        where: { userId, objectId, objectType }
      });
      if (userVote) {
        voteStatus = userVote.voteType === VoteType.VOTE_UP ? 'voted_up' : 'voted_down';
      }
    }

    return {
      vote_count: targetObject.voteCount,
      vote_status: voteStatus
    };
  }

  private async getObjectTypeAndValidate(objectId: string, objectType?: string) {
    // 如果没有指定对象类型，尝试自动检测
    if (!objectType) {
      // 先尝试问题
      const question = await this.questionRepository.findOne({ where: { id: objectId } });
      if (question) {
        return { objectType: 'question', targetObject: question };
      }

      // 再尝试答案
      const answer = await this.answerRepository.findOne({ where: { id: objectId } });
      if (answer) {
        return { objectType: 'answer', targetObject: answer };
      }

      // 最后尝试评论
      const comment = await this.commentRepository.findOne({ where: { id: objectId } });
      if (comment) {
        return { objectType: 'comment', targetObject: comment };
      }

      throw new NotFoundException('Object not found');
    }

    // 根据指定的对象类型验证
    let targetObject;
    switch (objectType) {
      case 'question':
        targetObject = await this.questionRepository.findOne({ where: { id: objectId } });
        break;
      case 'answer':
        targetObject = await this.answerRepository.findOne({ where: { id: objectId } });
        break;
      case 'comment':
        targetObject = await this.commentRepository.findOne({ where: { id: objectId } });
        break;
      default:
        throw new BadRequestException('Invalid object type');
    }

    if (!targetObject) {
      throw new NotFoundException(`${objectType} not found`);
    }

    return { objectType, targetObject };
  }

  private async updateObjectVoteCount(objectId: string, objectType: string, voteCountChange: number) {
    switch (objectType) {
      case 'question':
        if (voteCountChange > 0) {
          await this.questionRepository.increment({ id: objectId }, 'voteCount', Math.abs(voteCountChange));
        } else {
          await this.questionRepository.decrement({ id: objectId }, 'voteCount', Math.abs(voteCountChange));
        }
        break;
      case 'answer':
        if (voteCountChange > 0) {
          await this.answerRepository.increment({ id: objectId }, 'voteCount', Math.abs(voteCountChange));
        } else {
          await this.answerRepository.decrement({ id: objectId }, 'voteCount', Math.abs(voteCountChange));
        }
        break;
      case 'comment':
        if (voteCountChange > 0) {
          await this.commentRepository.increment({ id: objectId }, 'voteCount', Math.abs(voteCountChange));
        } else {
          await this.commentRepository.decrement({ id: objectId }, 'voteCount', Math.abs(voteCountChange));
        }
        break;
    }
  }

  private async getObjectById(objectId: string, objectType: string) {
    switch (objectType) {
      case 'question':
        return await this.questionRepository.findOne({ where: { id: objectId } });
      case 'answer':
        return await this.answerRepository.findOne({ where: { id: objectId } });
      case 'comment':
        return await this.commentRepository.findOne({ where: { id: objectId } });
      default:
        throw new BadRequestException('Invalid object type');
    }
  }

  private async getObjectInfo(objectId: string, objectType: string) {
    switch (objectType) {
      case 'question':
        const question = await this.questionRepository.findOne({ where: { id: objectId } });
        return question ? {
          id: question.id,
          title: question.title,
          type: 'question'
        } : null;
      case 'answer':
        const answer = await this.answerRepository.findOne({ where: { id: objectId } });
        if (answer) {
          const question = await this.questionRepository.findOne({ where: { id: answer.questionId } });
          return {
            id: answer.id,
            question_id: answer.questionId,
            question_title: question?.title || '',
            type: 'answer'
          };
        }
        return null;
      case 'comment':
        const comment = await this.commentRepository.findOne({ where: { id: objectId } });
        return comment ? {
          id: comment.id,
          object_id: comment.objectId,
          type: 'comment'
        } : null;
      default:
        return null;
    }
  }

  private calculateReputationChange(objectType: string, voteType: VoteType, voteCountChange: number): number {
    // 声誉计算规则（参考Stack Overflow）
    if (voteCountChange === 0) return 0;

    const isUpvote = voteType === VoteType.VOTE_UP;
    const isNewVote = Math.abs(voteCountChange) === 1;
    const isVoteChange = Math.abs(voteCountChange) === 2;

    switch (objectType) {
      case 'question':
        if (isUpvote) {
          return isNewVote ? 5 : (isVoteChange ? 10 : -5); // +5 for upvote, +10 for change from down to up, -5 for cancel upvote
        } else {
          return isNewVote ? -2 : (isVoteChange ? -7 : 2); // -2 for downvote, -7 for change from up to down, +2 for cancel downvote
        }
      case 'answer':
        if (isUpvote) {
          return isNewVote ? 10 : (isVoteChange ? 20 : -10); // +10 for upvote, +20 for change, -10 for cancel
        } else {
          return isNewVote ? -2 : (isVoteChange ? -12 : 2); // -2 for downvote, -12 for change, +2 for cancel
        }
      case 'comment':
        // 评论投票通常不影响声誉，或者影响很小
        return 0;
      default:
        return 0;
    }
  }
}
