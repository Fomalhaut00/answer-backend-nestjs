import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserRoleRelDto {
  @IsNotEmpty({ message: 'User ID cannot be empty' })
  @IsString({ message: 'User ID must be a string' })
  userId: string;

  @IsNotEmpty({ message: 'Role ID cannot be empty' })
  @IsNumber({}, { message: 'Role ID must be a number' })
  @Min(1, { message: 'Role ID must be greater than 0' })
  roleId: number;
}

export class UpdateUserRoleRelDto {
  @IsOptional()
  @IsString({ message: 'User ID must be a string' })
  userId?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Role ID must be a number' })
  @Min(1, { message: 'Role ID must be greater than 0' })
  roleId?: number;
}

export class SaveUserRoleRelDto {
  @IsNotEmpty({ message: 'User ID cannot be empty' })
  @IsString({ message: 'User ID must be a string' })
  userId: string;

  @IsNotEmpty({ message: 'Role ID cannot be empty' })
  @IsNumber({}, { message: 'Role ID must be a number' })
  @Min(1, { message: 'Role ID must be greater than 0' })
  roleId: number;
}

export class QueryUserRoleRelDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be greater than 0' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be greater than 0' })
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: 'User ID must be a string' })
  userId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Role ID must be a number' })
  roleId?: number;
}