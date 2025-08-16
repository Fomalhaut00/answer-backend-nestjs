import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  Min, 
  Max,
  IsNotEmpty,
  IsIn,
  MaxLength
} from 'class-validator';
import { Type } from 'class-transformer';

// 创建原因DTO
export class CreateReasonDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  reason_type: string; // 原因类型：report, close, flag等

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string; // 原因标题

  @IsOptional()
  @IsString()
  @MaxLength(500)
  content?: string; // 原因详细描述

  @IsString()
  @IsNotEmpty()
  @IsIn(['question', 'answer', 'comment', 'user'])
  object_type: string; // 适用对象类型

  @IsOptional()
  @IsNumber()
  @Min(0)
  status?: number = 1; // 状态：1=启用，2=禁用
}

// 更新原因DTO
export class UpdateReasonDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  reason_type?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  content?: string;

  @IsOptional()
  @IsString()
  @IsIn(['question', 'answer', 'comment', 'user'])
  object_type?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  status?: number;
}

// 原因分页查询DTO
export class ReasonPageDto {
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
  reason_type?: string;

  @IsOptional()
  @IsString()
  @IsIn(['question', 'answer', 'comment', 'user'])
  object_type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status?: number;
}

// 原因响应DTO
export class ReasonResponse {
  id: string;
  reason_type: string;
  title: string;
  content?: string;
  object_type: string;
  status: number;
  created_at: Date;
  updated_at: Date;
}

// 原因分页响应DTO
export class ReasonPageResponse {
  reasons: ReasonResponse[];
  total: number;
  page: number;
  page_size: number;
}

// 原因列表响应DTO（简化版，用于前端选择）
export class ReasonListResponse {
  id: string;
  title: string;
  content?: string;
}
