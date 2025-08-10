import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { Public } from '../../decorators/public.decorator';
import { UserService } from './user.service';
import { EmailLoginDto } from './dto/email-login.dto';
import {
  CreateUserDto,
  UpdateUserInfoDto,
  UpdateUserInterfaceDto,
  ChangePasswordDto,
  ResetPasswordDto,
  UseResetPasswordDto,
  VerifyEmailDto,
  ChangeEmailDto,
  SearchUserDto
} from './dto/create-user.dto';
import {
  UserPageDto,
  UserRankingDto,
  UserStaffDto,
  UserActionRecordDto,
  GetUserInfoDto
} from './dto/user-query.dto';
import {
  UserNotificationConfigDto,
  UpdateUserNotificationConfigDto
} from './dto/user-notification.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 用户认证相关接口
  @Public()
  @Post('login/email')
  @HttpCode(HttpStatus.OK)
  async loginWithEmail(@Body() emailLoginDto: EmailLoginDto) {
    return this.userService.loginWithEmail(emailLoginDto);
  }

  @Public()
  @Post('register/email')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('logout')
  // @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    return this.userService.logout(req.user.sub);
  }

  // 用户信息相关接口
  @Public()
  @Get('info')
  async getUserInfo(@Query() query: GetUserInfoDto) {
    if (query.user_id) {
      return this.userService.getUserInfoByUserID(query.user_id);
    }
    if (query.username) {
      return this.userService.getUserInfoByUsername(query.username);
    }
    throw new Error('user_id or username is required');
  }

  @Put('info')
  // @UseGuards(JwtAuthGuard)
  async updateUserInfo(@Request() req, @Body() updateUserInfoDto: UpdateUserInfoDto) {
    return this.userService.updateUserInfo(req.user.sub, updateUserInfoDto);
  }

  @Put('interface')
  // @UseGuards(JwtAuthGuard)
  async updateUserInterface(@Request() req, @Body() updateUserInterfaceDto: UpdateUserInterfaceDto) {
    return this.userService.updateUserInterface(req.user.sub, updateUserInterfaceDto);
  }

  // 密码相关接口
  @Put('password')
  // @UseGuards(JwtAuthGuard)
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.sub, changePasswordDto);
  }

  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Post('password/replacement')
  @HttpCode(HttpStatus.OK)
  async useResetPassword(@Body() useResetPasswordDto: UseResetPasswordDto) {
    return this.userService.useResetPassword(useResetPasswordDto);
  }

  // 邮箱相关接口
  @Post('email/verification')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.userService.verifyEmail(verifyEmailDto);
  }

  @Post('email/verification/send')
  // @UseGuards(JwtAuthGuard)
  async sendVerificationEmail(@Request() req) {
    return this.userService.sendVerificationEmail(req.user.sub);
  }

  @Post('email/change/code')
  // @UseGuards(JwtAuthGuard)
  async sendChangeEmailCode(@Request() req, @Body() changeEmailDto: ChangeEmailDto) {
    return this.userService.sendChangeEmailCode(req.user.sub, changeEmailDto);
  }

  @Put('email')
  // @UseGuards(JwtAuthGuard)
  async changeEmail(@Request() req, @Body() changeEmailDto: ChangeEmailDto) {
    return this.userService.changeEmail(req.user.sub, changeEmailDto);
  }

  // 用户通知配置接口
  @Get('notification/config')
  // @UseGuards(JwtAuthGuard)
  async getUserNotificationConfig(@Request() req) {
    return this.userService.getUserNotificationConfig(req.user.sub);
  }

  @Put('notification/config')
  // @UseGuards(JwtAuthGuard)
  async updateUserNotificationConfig(@Request() req, @Body() updateConfigDto: UpdateUserNotificationConfigDto) {
    return this.userService.updateUserNotificationConfig(req.user.sub, updateConfigDto);
  }

  @Put('notification/unsubscribe')
  @HttpCode(HttpStatus.OK)
  async unsubscribeNotification(@Body() body: { code: string }) {
    return this.userService.unsubscribeNotification(body.code);
  }

  // 用户搜索和列表接口
  @Get('info/search')
  // @UseGuards(JwtAuthGuard)
  async searchUsers(@Query() searchUserDto: SearchUserDto) {
    return this.userService.searchUsers(searchUserDto);
  }

  @Get('ranking')
  async getUserRanking(@Query() userRankingDto: UserRankingDto) {
    return this.userService.getUserRanking(userRankingDto);
  }

  @Get('staff')
  async getUserStaff(@Query() userStaffDto: UserStaffDto) {
    return this.userService.getUserStaff(userStaffDto);
  }

  // 用户活动记录接口
  @Get('action/record')
  // @UseGuards(JwtAuthGuard)
  async getUserActionRecord(@Request() req, @Query() actionRecordDto: UserActionRecordDto) {
    return this.userService.getUserActionRecord(req.user.sub, actionRecordDto);
  }

  // 个人页面相关接口
  @Get('personal/user/info')
  async getPersonalUserInfo(@Query('username') username: string) {
    return this.userService.getPersonalUserInfo(username);
  }
}