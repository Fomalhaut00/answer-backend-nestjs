import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { EmailLoginDto } from './dto/email-login.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login/email')
  async loginWithEmail(@Body() emailLoginDto: EmailLoginDto) {
    return this.userService.loginWithEmail(emailLoginDto);
  }

  @Post('register/email')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
} 