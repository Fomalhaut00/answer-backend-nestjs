import { IsString, IsOptional, IsNotEmpty, Length } from 'class-validator';

export class CreatePowerDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  powerType: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  description: string;
}

export class UpdatePowerDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  powerType?: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  description?: string;
}

export class QueryPowerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  powerType?: string;

  @IsOptional()
  @IsString()
  description?: string;
}