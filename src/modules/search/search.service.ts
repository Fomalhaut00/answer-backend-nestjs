import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Question, QuestionStatus } from '../../entities/question.entity';
import { Answer, AnswerStatus } from '../../entities/answer.entity';
import { User, UserStatus } from '../../entities/user.entity';
import { Tag, TagStatus } from '../../entities/tag.entity';
import { SearchDto, SearchResult, SearchResponse } from './dto/search.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async search(searchDto: SearchDto): Promise<SearchResult> {
    const { q, order = 'relevance', page = 1, size = 20 } = searchDto;
    const skip = (page - 1) * size;

    // 搜索问题
    const questions = await this.searchQuestions(q, order, skip, size);
    
    // 搜索答案
    const answers = await this.searchAnswers(q, order, skip, size);
    
    // 搜索用户
    const users = await this.searchUsers(q, skip, size);
    
    // 搜索标签
    const tags = await this.searchTags(q, skip, size);

    // 合并结果并排序
    const allResults: SearchResponse[] = [
      ...questions.map(q => ({
        object_type: 'question',
        object: {
          id: q.id,
          title: q.title,
          excerpt: q.originalText.substring(0, 200),
          vote_count: q.voteCount,
          answer_count: q.answerCount,
          created_at: q.createdAt,
          tags: [] // 在实际应用中应该获取标签
        }
      })),
      ...answers.map(a => ({
        object_type: 'answer',
        object: {
          id: a.id,
          question_id: a.questionId,
          excerpt: a.originalText.substring(0, 200),
          vote_count: a.voteCount,
          adopted: a.adopted,
          created_at: a.createdAt
        }
      })),
      ...users.map(u => ({
        object_type: 'user',
        object: {
          id: u.id,
          username: u.username,
          display_name: u.displayName,
          avatar: u.avatar,
          rank: u.rank,
          created_at: u.createdAt
        }
      })),
      ...tags.map(t => ({
        object_type: 'tag',
        object: {
          id: t.id,
          slug_name: t.slugName,
          display_name: t.displayName,
          excerpt: t.originalText.substring(0, 200),
          question_count: t.questionCount,
          created_at: t.createdAt
        }
      }))
    ];

    // 根据排序规则排序
    this.sortResults(allResults, order);

    // 分页
    const paginatedResults = allResults.slice(skip, skip + size);

    return {
      total: allResults.length,
      results: paginatedResults,
      page,
      size
    };
  }

  private async searchQuestions(query: string, order: string, _skip: number, size: number) {
    const queryBuilder = this.questionRepository.createQueryBuilder('question')
      .where('question.status = :status', { status: QuestionStatus.AVAILABLE })
      .andWhere('(question.title LIKE :query OR question.original_text LIKE :query)', 
        { query: `%${query}%` });

    switch (order) {
      case 'newest':
        queryBuilder.orderBy('question.created_at', 'DESC');
        break;
      case 'active':
        queryBuilder.orderBy('question.post_update_time', 'DESC');
        break;
      case 'score':
        queryBuilder.orderBy('question.vote_count', 'DESC');
        break;
      default:
        queryBuilder.orderBy('question.vote_count', 'DESC')
          .addOrderBy('question.created_at', 'DESC');
    }

    return queryBuilder.take(size).getMany();
  }

  private async searchAnswers(query: string, order: string, _skip: number, size: number) {
    const queryBuilder = this.answerRepository.createQueryBuilder('answer')
      .where('answer.status = :status', { status: AnswerStatus.AVAILABLE })
      .andWhere('answer.original_text LIKE :query', { query: `%${query}%` });

    switch (order) {
      case 'newest':
        queryBuilder.orderBy('answer.created_at', 'DESC');
        break;
      case 'score':
        queryBuilder.orderBy('answer.vote_count', 'DESC');
        break;
      default:
        queryBuilder.orderBy('answer.vote_count', 'DESC')
          .addOrderBy('answer.created_at', 'DESC');
    }

    return queryBuilder.take(size).getMany();
  }

  private async searchUsers(query: string, _skip: number, size: number) {
    return this.userRepository.find({
      where: [
        { username: Like(`%${query}%`), status: UserStatus.AVAILABLE },
        { displayName: Like(`%${query}%`), status: UserStatus.AVAILABLE }
      ],
      order: { rank: 'DESC' },
      take: size
    });
  }

  private async searchTags(query: string, _skip: number, size: number) {
    return this.tagRepository.find({
      where: [
        { slugName: Like(`%${query}%`), status: TagStatus.AVAILABLE },
        { displayName: Like(`%${query}%`), status: TagStatus.AVAILABLE },
        { originalText: Like(`%${query}%`), status: TagStatus.AVAILABLE }
      ],
      order: { questionCount: 'DESC' },
      take: size
    });
  }

  private sortResults(results: SearchResponse[], order: string) {
    switch (order) {
      case 'newest':
        results.sort((a, b) => 
          new Date(b.object.created_at).getTime() - new Date(a.object.created_at).getTime()
        );
        break;
      case 'score':
        results.sort((a, b) => {
          const aScore = a.object.vote_count || a.object.rank || a.object.question_count || 0;
          const bScore = b.object.vote_count || b.object.rank || b.object.question_count || 0;
          return bScore - aScore;
        });
        break;
      default:
        // 默认按相关性排序（这里简化为按分数排序）
        results.sort((a, b) => {
          const aScore = a.object.vote_count || a.object.rank || a.object.question_count || 0;
          const bScore = b.object.vote_count || b.object.rank || b.object.question_count || 0;
          return bScore - aScore;
        });
    }
  }
}
