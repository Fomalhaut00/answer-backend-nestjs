import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsIn,
  IsNotEmpty
} from 'class-validator';
import { Type } from 'class-transformer';

export class ActivityPageDto {
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
  username?: string;

  @IsOptional()
  @IsString()
  @IsIn(['question', 'answer', 'comment', 'vote', 'follow'])
  activity_type?: string;
}

export class UserTimelineDto {
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

  @IsString()
  username: string;
}

export class ActivityResponse {
  id: string;
  user_id: string;
  trigger_user_id: string;
  object_id: string;
  activity_type: number;
  cancelled: number;
  rank: number;
  has_rank: number;
  created_at: Date;
  updated_at: Date;
  user_info: any;
  trigger_user_info: any;
  object_info: any;
}

export class TimelineResponse {
  object_type: string;
  activity_type: string;
  object: any;
  created_at: Date;
}

// 投票相关DTO
export class VoteDto {
  @IsString()
  @IsNotEmpty()
  object_id: string;

  @IsOptional()
  @IsString()
  @IsIn(['question', 'answer', 'comment'])
  object_type?: string;
}

export class UserVotesDto {
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
}

export class VoteResponse {
  vote_count: number;
  vote_status: string; // 'voted_up', 'voted_down', ''
}

export class UserVoteResponse {
  object_id: string;
  object_type: string;
  vote_type: number;
  created_at: Date;
  object_info: any;
}
