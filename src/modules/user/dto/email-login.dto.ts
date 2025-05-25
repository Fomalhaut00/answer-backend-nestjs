import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class EmailLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  pass: string;
} 