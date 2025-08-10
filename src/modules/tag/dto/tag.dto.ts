import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  Min, 
  Max,
  MaxLength,
  IsBoolean,
  IsArray
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(35)
  slug_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(35)
  display_name: string;

  @IsString()
  @IsNotEmpty()
  original_text: string;

  @IsOptional()
  @IsString()
  edit_summary?: string;
}

export class UpdateTagDto {
  @IsString()
  @IsNotEmpty()
  tag_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(35)
  slug_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(35)
  display_name: string;

  @IsString()
  @IsNotEmpty()
  original_text: string;

  @IsOptional()
  @IsString()
  edit_summary?: string;
}

export class TagPageDto {
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
  slug_name?: string;

  @IsOptional()
  @IsString()
  query_cond?: string;
}

export class SearchTagDto {
  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 20;
}

export class TagInfoDto {
  @IsString()
  @IsNotEmpty()
  tag: string;
}

export class TagSynonymDto {
  @IsString()
  @IsNotEmpty()
  tag_id: string;

  @IsString()
  @IsNotEmpty()
  synonym_tag_list: string;
}

export class MergeTagDto {
  @IsString()
  @IsNotEmpty()
  from_tag_id: string;

  @IsString()
  @IsNotEmpty()
  to_tag_id: string;
}

export class TagResponse {
  tag_id: string;
  slug_name: string;
  display_name: string;
  original_text: string;
  parsed_text: string;
  follow_count: number;
  question_count: number;
  is_follower: boolean;
  created_at: Date;
  updated_at: Date;
  user_info: any;
  excerpt: string;
  member_actions: any[];
}

export class TagListResponse {
  tag_id: string;
  slug_name: string;
  display_name: string;
  recommend: boolean;
  reserved: boolean;
  question_count: number;
  excerpt: string;
}
