import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  Min, 
  Max,
  IsNotEmpty,
  MaxLength
} from 'class-validator';
import { Type } from 'class-transformer';

// 创建收藏分组DTO
export class CreateCollectionGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  default_group?: number; // 0=非默认, 1=默认分组
}

// 更新收藏分组DTO
export class UpdateCollectionGroupDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  default_group?: number;
}

// 收藏分组分页查询DTO
export class CollectionGroupPageDto {
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
}

// 收藏分组响应DTO
export class CollectionGroupResponse {
  id: string;
  name: string;
  description?: string;
  default_group: number;
  collection_count: number;
  created_at: Date;
  updated_at: Date;
}

// 收藏分组分页响应DTO
export class CollectionGroupPageResponse {
  groups: CollectionGroupResponse[];
  total: number;
  page: number;
  page_size: number;
}

// 收藏分组详情响应DTO
export class CollectionGroupDetailResponse extends CollectionGroupResponse {
  collections: any[]; // 分组下的收藏列表
}
