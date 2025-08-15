import { IsString, IsOptional } from 'class-validator';

export class PostRenderDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  type?: string; // markdown, html
}
