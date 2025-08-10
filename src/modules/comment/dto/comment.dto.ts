import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  Min, 
  Max,
  MaxLength
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  object_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(600)
  original_text: string;

  @IsOptional()
  @IsString()
  reply_user_id?: string;
}

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  comment_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(600)
  original_text: string;
}

export class CommentPageDto {
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
  @IsNotEmpty()
  object_id: string;

  @IsOptional()
  @IsString()
  query_cond?: string;
}

export class PersonalCommentPageDto {
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
  @IsNotEmpty()
  username: string;
}

export class GetCommentDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class CommentResponse {
  comment_id: string;
  object_id: string;
  question_id: string;
  original_text: string;
  parsed_text: string;
  vote_count: number;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  reply_user_id: string;
  user_info: any;
  reply_user_info: any;
  member_actions: any[];
  vote_status: string;
}
