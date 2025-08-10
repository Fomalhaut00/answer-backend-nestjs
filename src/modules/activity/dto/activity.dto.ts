import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  Min, 
  Max,
  IsIn
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
