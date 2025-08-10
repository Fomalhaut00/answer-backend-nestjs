import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsArray, 
  IsNumber, 
  IsIn, 
  Min, 
  Max,
  MaxLength,
  IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  original_text: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsString()
  invite_user_id?: string;
}

export class UpdateQuestionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  original_text: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsString()
  edit_summary?: string;
}

export class QuestionPageDto {
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
  @IsIn(['newest', 'active', 'frequent', 'score', 'unanswered'])
  order?: string = 'newest';

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  in_days?: number;
}

export class QuestionOperationDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['close', 'reopen', 'pin', 'unpin', 'hide', 'show'])
  operation: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class QuestionInviteDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsArray()
  @IsString({ each: true })
  invite_user: string[];
}

export class QuestionLinkDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  link_object_id: string;
}

export class QuestionSearchDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  order?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  size?: number = 20;
}

export class QuestionResponse {
  id: string;
  title: string;
  original_text: string;
  parsed_text: string;
  status: number;
  view_count: number;
  unique_view_count: number;
  vote_count: number;
  answer_count: number;
  collection_count: number;
  follow_count: number;
  accepted_answer_id: string;
  last_answer_id: string;
  created_at: Date;
  updated_at: Date;
  post_update_time: Date;
  user_id: string;
  last_edit_user_id: string;
  tags: any[];
  user_info: any;
  update_user_info: any;
  last_answered_user_info: any;
  operated: any;
  similar_questions: any[];
  member_actions: any[];
}

export class QuestionDetailResponse extends QuestionResponse {
  description: string;
  mr_list: any[];
  vote_status: string;
  is_followed: boolean;
  collected: boolean;
}
