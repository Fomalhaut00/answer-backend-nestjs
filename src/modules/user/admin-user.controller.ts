import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminOnly } from '../../decorators/public.decorator';
import { UserService } from './user.service';

/**
 * 管理员用户管理控制器
 * 对应Go项目中的管理员用户管理路由
 */
@Controller('admin')
@AdminOnly()
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  // ========== 管理员专用路由 ==========
  
  @Get('users/page')
  async getUserPage(@Query() query: any) {
    return this.userService.getUserPage(query);
  }

  @Put('user/status')
  async updateUserStatus(@Body() body: { user_id: string; status: string }) {
    return this.userService.updateUserStatus(body.user_id, body.status);
  }

  @Put('user/role')
  async updateUserRole(@Body() body: { user_id: string; role_id: string }) {
    return this.userService.updateUserRole(body.user_id, body.role_id);
  }

  @Get('user/activation')
  async getUserActivation(@Query('user_id') userId: string) {
    return this.userService.getUserActivation(userId);
  }

  @Post('user/activation')
  @HttpCode(HttpStatus.OK)
  async sendUserActivation(@Body() body: { user_id: string }) {
    return this.userService.sendUserActivation(body.user_id);
  }

  @Post('user')
  @HttpCode(HttpStatus.CREATED)
  async addUser(@Body() createUserDto: any) {
    return this.userService.adminCreateUser(createUserDto);
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  async addUsers(@Body() createUsersDto: any) {
    return this.userService.adminCreateUsers(createUsersDto);
  }

  @Put('user/password')
  async updateUserPassword(@Body() body: { user_id: string; password: string }) {
    return this.userService.adminUpdateUserPassword(body.user_id, body.password);
  }

  @Put('user/profile')
  async editUserProfile(@Body() body: { user_id: string; profile: any }) {
    return this.userService.adminEditUserProfile(body.user_id, body.profile);
  }

  @Delete('delete/permanently')
  async deletePermanently(@Body() body: { user_id: string }) {
    return this.userService.deletePermanently(body.user_id);
  }
}
