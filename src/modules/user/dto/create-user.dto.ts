import { IsEmail, IsNotEmpty, MinLength, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  pass: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  display_name?: string;
} 