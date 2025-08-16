import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  Min, 
  Max,
  IsIn
} from 'class-validator';
import { Type } from 'class-transformer';

// 个人排名分页查询DTO
export class PersonalRankPageDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  page_size?: number = 20;

  @IsOptional()
  @IsString()
  @IsIn(['reputation', 'question', 'answer', 'vote'])
  tab?: string = 'reputation'; // 排名类型：声誉、问题、答案、投票
}

// 用户排名响应DTO
export class UserRankResponse {
  user_id: string;
  username: string;
  display_name: string;
  avatar: string;
  reputation: number;
  question_count: number;
  answer_count: number;
  vote_count: number;
  rank: number;
  created_at: Date;
}

// 个人排名详情响应DTO
export class PersonalRankDetailResponse {
  user_id: string;
  username: string;
  display_name: string;
  avatar: string;
  reputation: number;
  question_count: number;
  answer_count: number;
  vote_count: number;
  accepted_answer_count: number;
  rank_reputation: number;
  rank_question: number;
  rank_answer: number;
  rank_vote: number;
  created_at: Date;
}

// 排名分页响应DTO
export class RankPageResponse {
  users: UserRankResponse[];
  total: number;
  page: number;
  page_size: number;
}

// 排名统计DTO
export class RankStatsResponse {
  total_users: number;
  total_reputation: number;
  total_questions: number;
  total_answers: number;
  total_votes: number;
}
