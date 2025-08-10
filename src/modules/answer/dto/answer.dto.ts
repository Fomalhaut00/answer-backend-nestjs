import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  Min, 
  Max,
  IsIn,
  IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty()
  question_id: string;

  @IsString()
  @IsNotEmpty()
  original_text: string;
}

export class UpdateAnswerDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  original_text: string;

  @IsOptional()
  @IsString()
  edit_summary?: string;
}

export class AnswerPageDto {
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
  @IsIn(['default', 'updated', 'created', 'vote'])
  order?: string = 'default';

  @IsString()
  @IsNotEmpty()
  question_id: string;
}

export class AcceptAnswerDto {
  @IsString()
  @IsNotEmpty()
  question_id: string;

  @IsString()
  @IsNotEmpty()
  answer_id: string;
}

export class AnswerInfoDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class PersonalAnswerPageDto {
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

export class AnswerResponse {
  id: string;
  question_id: string;
  original_text: string;
  parsed_text: string;
  status: number;
  adopted: number;
  comment_count: number;
  vote_count: number;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  last_edit_user_id: string;
  user_info: any;
  update_user_info: any;
  question_info: any;
  vote_status: string;
  member_actions: any[];
}

export class AnswerDetailResponse extends AnswerResponse {
  description: string;
  mr_list: any[];
}
