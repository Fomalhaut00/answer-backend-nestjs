import { IsOptional, IsBoolean, IsObject } from 'class-validator';

export class UserNotificationConfigDto {
  @IsOptional()
  @IsBoolean()
  inbox?: boolean;

  @IsOptional()
  @IsBoolean()
  all_new_question?: boolean;

  @IsOptional()
  @IsBoolean()
  all_new_question_for_following_tags?: boolean;

  @IsOptional()
  @IsBoolean()
  someone_answer?: boolean;

  @IsOptional()
  @IsBoolean()
  someone_comment?: boolean;

  @IsOptional()
  @IsBoolean()
  someone_reply?: boolean;

  @IsOptional()
  @IsBoolean()
  someone_vote_up?: boolean;

  @IsOptional()
  @IsBoolean()
  someone_vote_down?: boolean;

  @IsOptional()
  @IsBoolean()
  someone_accept?: boolean;

  @IsOptional()
  @IsBoolean()
  someone_follow?: boolean;

  @IsOptional()
  @IsBoolean()
  email?: boolean;
}

export class UpdateUserNotificationConfigDto {
  @IsOptional()
  @IsObject()
  config?: UserNotificationConfigDto;
}
