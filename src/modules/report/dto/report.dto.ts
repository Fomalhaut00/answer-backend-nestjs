import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddReportDto {
  @IsString()
  object_id: string;

  @IsString()
  object_type: string; // question, answer, comment

  @IsString()
  report_type: string; // spam, abuse, copyright, other

  @IsOptional()
  @IsString()
  content?: string; // 举报说明
}

export class UnreviewedReportPageDto {
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
  object_type?: string;
}

export class ReviewReportDto {
  @IsString()
  report_id: string;

  @IsString()
  action: string; // approve, reject

  @IsOptional()
  @IsString()
  reason?: string;
}
