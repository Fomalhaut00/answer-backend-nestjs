import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  Min, 
  Max,
  IsIn
} from 'class-validator';
import { Type } from 'class-transformer';

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
