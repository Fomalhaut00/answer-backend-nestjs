import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUnreviewedPostPageDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page_size?: number = 20;

  @IsOptional()
  @IsString()
  object_type?: string; // question, answer, tag
}

export class UpdateReviewDto {
  @IsString()
  review_id: string;

  @IsString()
  action: string; // approve, reject

  @IsOptional()
  @IsString()
  reason?: string;
}
