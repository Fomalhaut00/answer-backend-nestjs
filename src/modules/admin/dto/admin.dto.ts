import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  Min, 
  Max,
  IsIn,
  IsBoolean,
  IsEmail
} from 'class-validator';
import { Type } from 'class-transformer';

export class AdminUserPageDto {
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
  query?: string;

  @IsOptional()
  @IsString()
  @IsIn(['normal', 'suspended', 'deleted', 'inactive'])
  status?: string;
}

export class UpdateUserStatusDto {
  @IsString()
  user_id: string;

  @IsString()
  @IsIn(['normal', 'suspended', 'deleted', 'inactive'])
  status: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class AdminQuestionPageDto {
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
  query?: string;

  @IsOptional()
  @IsString()
  @IsIn(['available', 'closed', 'deleted', 'pending'])
  status?: string;
}

export class AdminAnswerPageDto {
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
  query?: string;

  @IsOptional()
  @IsString()
  @IsIn(['available', 'deleted', 'pending'])
  status?: string;
}

export class SystemConfigDto {
  @IsOptional()
  @IsString()
  site_name?: string;

  @IsOptional()
  @IsString()
  site_url?: string;

  @IsOptional()
  @IsString()
  contact_email?: string;

  @IsOptional()
  @IsBoolean()
  allow_new_registrations?: boolean;

  @IsOptional()
  @IsBoolean()
  require_email_verification?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  min_reputation_to_vote?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  min_reputation_to_comment?: number;
}

export class AdminStatsResponse {
  total_users: number;
  total_questions: number;
  total_answers: number;
  total_comments: number;
  total_votes: number;
  active_users_today: number;
  new_users_today: number;
  questions_today: number;
  answers_today: number;
}
