import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRevisionListDto {
  @IsString()
  object_id: string;
}

export class GetUnreviewedRevisionListDto {
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

export class RevisionAuditDto {
  @IsString()
  revision_id: string;

  @IsString()
  action: string; // approve, reject

  @IsOptional()
  @IsString()
  reason?: string;
}

export class CheckCanUpdateRevisionDto {
  @IsString()
  object_id: string;

  @IsString()
  object_type: string; // question, answer, tag
}
