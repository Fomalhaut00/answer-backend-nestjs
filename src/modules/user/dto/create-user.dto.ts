import { IsEmail, IsNotEmpty, MinLength, IsString, IsOptional, IsUrl, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  pass: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  language?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  display_name?: string;
}

export class UpdateUserInfoDto {
  @IsString()
  @IsOptional()
  @MaxLength(30)
  display_name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1024)
  avatar?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  mobile?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @IsUrl()
  website?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  location?: string;
}

export class UpdateUserInterfaceDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  language?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  color_scheme?: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  old_pass: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  pass: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UseResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  pass: string;
}

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class ChangeEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  pass: string;
}

export class SearchUserDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsOptional()
  limit?: number = 20;
}