import { IsString, IsArray, IsOptional } from 'class-validator';

export class FollowDto {
  @IsString()
  object_id: string;

  @IsString()
  object_type: string; // user, tag, question

  @IsOptional()
  @IsString()
  action?: string; // follow, unfollow
}

export class UpdateFollowTagsDto {
  @IsArray()
  @IsString({ each: true })
  tag_ids: string[];
}
