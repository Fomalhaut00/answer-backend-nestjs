import { 
  Controller, 
  Get, 
  Put, 
  Delete,
  Body, 
  Query,
  Param,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { RequireRoles } from '../../decorators/roles.decorator';
import {
  AdminUserPageDto,
  UpdateUserStatusDto,
  AdminQuestionPageDto,
  AdminAnswerPageDto,
  SystemConfigDto,
  UpdateUserRoleDto
} from './dto/admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@RequireRoles('admin', 'moderator')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 系统统计
  @Get('dashboard/stats')
  @RequireRoles('admin')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // 用户管理
  @Get('users')
  async getUsers(@Query() adminUserPageDto: AdminUserPageDto) {
    return this.adminService.getUsers(adminUserPageDto);
  }

  @Put('users/:userId/status')
  @RequireRoles('admin')
  async updateUserStatus(
    @Param('userId') userId: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
    @Request() req
  ) {
    return this.adminService.updateUserStatus(userId, updateUserStatusDto, req.user.sub);
  }

  // 用户角色管理 - 与Go项目API路径一致: PUT /user/role
  @Put('user/role')
  @RequireRoles('admin')
  async updateUserRole(
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Request() req
  ) {
    return this.adminService.updateUserRole(updateUserRoleDto, req.user.sub);
  }

  // 角色列表 - 与Go项目API路径一致: GET /roles
  @Get('roles')
  async getRoles() {
    return this.adminService.getRoles();
  }

  @Get('users/:userId')
  async getUserDetail(@Param('userId') userId: string) {
    return this.adminService.getUserDetail(userId);
  }

  // 内容管理
  @Get('questions')
  async getQuestions(@Query() adminQuestionPageDto: AdminQuestionPageDto) {
    return this.adminService.getQuestions(adminQuestionPageDto);
  }

  @Get('answers')
  async getAnswers(@Query() adminAnswerPageDto: AdminAnswerPageDto) {
    return this.adminService.getAnswers(adminAnswerPageDto);
  }

  @Put('questions/:questionId/status')
  async updateQuestionStatus(
    @Param('questionId') questionId: string,
    @Body() body: { status: string; reason?: string },
    @Request() req
  ) {
    return this.adminService.updateQuestionStatus(questionId, body, req.user.sub);
  }

  @Put('answers/:answerId/status')
  async updateAnswerStatus(
    @Param('answerId') answerId: string,
    @Body() body: { status: string; reason?: string },
    @Request() req
  ) {
    return this.adminService.updateAnswerStatus(answerId, body, req.user.sub);
  }

  // 系统配置
  @Get('config')
  @RequireRoles('admin')
  async getSystemConfig() {
    return this.adminService.getSystemConfig();
  }

  @Put('config')
  @RequireRoles('admin')
  @HttpCode(HttpStatus.OK)
  async updateSystemConfig(@Body() systemConfigDto: SystemConfigDto, @Request() req) {
    return this.adminService.updateSystemConfig(systemConfigDto, req.user.sub);
  }

  // 审核队列
  @Get('review/questions')
  async getQuestionReviewQueue(@Query() query: any) {
    return this.adminService.getQuestionReviewQueue(query);
  }

  @Get('review/answers')
  async getAnswerReviewQueue(@Query() query: any) {
    return this.adminService.getAnswerReviewQueue(query);
  }

  @Get('review/tags')
  async getTagReviewQueue(@Query() query: any) {
    return this.adminService.getTagReviewQueue(query);
  }

  // 举报管理
  @Get('reports')
  async getReports(@Query() query: any) {
    return this.adminService.getReports(query);
  }

  @Put('reports/:reportId/resolve')
  async resolveReport(
    @Param('reportId') reportId: string,
    @Body() body: { action: string; reason?: string },
    @Request() req
  ) {
    return this.adminService.resolveReport(reportId, body, req.user.sub);
  }
}
