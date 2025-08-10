import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  Min, 
  Max,
  IsIn
} from 'class-validator';
import { Type } from 'class-transformer';

export class SearchDto {
  @IsString()
  q: string;

  @IsOptional()
  @IsString()
  @IsIn(['newest', 'active', 'score', 'relevance'])
  order?: string = 'relevance';

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
  size?: number = 20;
}

export class SearchResponse {
  object_type: string;
  object: any;
}

export class SearchResult {
  total: number;
  results: SearchResponse[];
  page: number;
  size: number;
}
