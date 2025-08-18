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
import { Public, OptionalAuth, AdminOnly } from '../../decorators/public.decorator';
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

  // ========== 必须未认证的路由 (RegisterMustUnAuthAnswerAPIRouter) ==========

  @Public()
  @Post('login/email')
  @HttpCode(HttpStatus.OK)
  async loginWithEmail(@Body() emailLoginDto: EmailLoginDto) {
    return this.userService.loginWithEmail(emailLoginDto);
  }

  @Public()
  @Post('register/email')
  @HttpCode(HttpStatus.CREATED)
  async registerWithEmail(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Public()
  @Post('email/verification')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.userService.verifyEmail(verifyEmailDto);
  }

  @Public()
  @Put('email')
  @HttpCode(HttpStatus.OK)
  async changeEmailVerify(@Body() changeEmailDto: ChangeEmailDto) {
    return this.userService.changeEmail(null, changeEmailDto);
  }

  @Public()
  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Public()
  @Post('password/replacement')
  @HttpCode(HttpStatus.OK)
  async useResetPassword(@Body() useResetPasswordDto: UseResetPasswordDto) {
    return this.userService.useResetPassword(useResetPasswordDto);
  }

  @Public()
  @Put('notification/unsubscribe')
  @HttpCode(HttpStatus.OK)
  async unsubscribeNotification(@Body() body: { code: string }) {
    return this.userService.unsubscribeNotification(body.code);
  }

  // ========== 可选认证的路由 (RegisterUnAuthAnswerAPIRouter) ==========

  @OptionalAuth()
  @Get('info')
  async getUserInfo(@Query() query: GetUserInfoDto, @Request() req) {
    if (query.user_id) {
      return this.userService.getUserInfoByUserID(query.user_id, req.user?.sub);
    }
    if (query.username) {
      return this.userService.getUserInfoByUsername(query.username, req.user?.sub);
    }
    throw new Error('user_id or username is required');
  }

  @OptionalAuth()
  @Get('ranking')
  async getUserRanking(@Query() userRankingDto: UserRankingDto) {
    return this.userService.getUserRanking(userRankingDto);
  }

  @OptionalAuth()
  @Get('staff')
  async getUserStaff(@Query() userStaffDto: UserStaffDto) {
    return this.userService.getUserStaff(userStaffDto);
  }

  // ========== 任何状态用户的路由 (RegisterAuthUserWithAnyStatusAnswerAPIRouter) ==========

  @Get('logout')
  async logout(@Request() req) {
    return this.userService.logout(req.user.sub);
  }

  @Post('email/change/code')
  async sendChangeEmailCode(@Request() req, @Body() changeEmailDto: ChangeEmailDto) {
    return this.userService.sendChangeEmailCode(req.user.sub, changeEmailDto);
  }

  @Post('email/verification/send')
  async sendVerificationEmail(@Request() req) {
    return this.userService.sendVerificationEmail(req.user.sub);
  }

  // ========== 需要认证的路由 (RegisterAnswerAPIRouter) ==========

  @Put('password')
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.sub, changePasswordDto);
  }

  @Put('info')
  async updateUserInfo(@Request() req, @Body() updateUserInfoDto: UpdateUserInfoDto) {
    return this.userService.updateUserInfo(req.user.sub, updateUserInfoDto);
  }

  @Put('interface')
  async updateUserInterface(@Request() req, @Body() updateUserInterfaceDto: UpdateUserInterfaceDto) {
    return this.userService.updateUserInterface(req.user.sub, updateUserInterfaceDto);
  }

  @Get('notification/config')
  async getUserNotificationConfig(@Request() req) {
    return this.userService.getUserNotificationConfig(req.user.sub);
  }

  @Put('notification/config')
  async updateUserNotificationConfig(@Request() req, @Body() updateConfigDto: UpdateUserNotificationConfigDto) {
    return this.userService.updateUserNotificationConfig(req.user.sub, updateConfigDto);
  }

  @Get('info/search')
  async searchUsers(@Query() searchUserDto: SearchUserDto) {
    return this.userService.searchUsers(searchUserDto);
  }

  @OptionalAuth()
  @Get('action/record')
  async getUserActionRecord(@Request() req, @Query() actionRecordDto: UserActionRecordDto) {
    return this.userService.getUserActionRecord(req.user?.sub, actionRecordDto);
  }

}