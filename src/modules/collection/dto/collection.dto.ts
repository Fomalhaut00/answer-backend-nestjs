import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CollectionSwitchDto {
  @IsString()
  object_id: string;

  @IsString()
  object_type: string; // question, answer
}

export class PersonalCollectionPageDto {
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
}
