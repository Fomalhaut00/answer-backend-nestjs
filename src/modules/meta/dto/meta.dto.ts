import { IsString, IsOptional, IsObject } from 'class-validator';

export class GetReactionDto {
  @IsString()
  object_id: string;
}

export class AddOrUpdateReactionDto {
  @IsString()
  object_id: string;

  @IsString()
  reaction_type: string; // like, dislike, love, etc.

  @IsOptional()
  @IsObject()
  reaction_data?: any; // 额外的反应数据
}
