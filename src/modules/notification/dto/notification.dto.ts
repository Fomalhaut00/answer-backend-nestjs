import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  Min, 
  Max,
  IsIn,
  IsArray
} from 'class-validator';
import { Type } from 'class-transformer';

export class NotificationPageDto {
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
  @IsIn(['inbox', 'achievement'])
  type?: string = 'inbox';
}

export class ReadNotificationDto {
  @IsString()
  id: string;
}

export class ClearNotificationDto {
  @IsOptional()
  @IsString()
  @IsIn(['inbox', 'achievement', 'all'])
  type?: string = 'all';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ids?: string[];
}

export class NotificationResponse {
  id: string;
  content: string;
  type: number;
  is_read: number;
  msg_type: number;
  created_at: Date;
  updated_at: Date;
  object_info: any;
}

export class NotificationUnreadResponse {
  inbox: number;
  achievement: number;
  revision: number;
  can_revision: boolean;
}
