import {
  Controller,
  Get,
  Query,
  Request,
} from '@nestjs/common';
import { OptionalAuth } from '../../decorators/public.decorator';
import { UserService } from './user.service';

/**
 * 个人页面相关控制器
 * 对应Go项目中的 /personal/* 路由
 */
@Controller('personal')
export class PersonalController {
  constructor(private readonly userService: UserService) {}

  // ========== 可选认证的路由 ==========
  
  @OptionalAuth()
  @Get('user/info')
  async getPersonalUserInfo(@Query('username') username: string, @Request() req) {
    return this.userService.getPersonalUserInfo(username, req.user?.sub);
  }

  @OptionalAuth()
  @Get('qa/top')
  async getUserTop(@Query('username') username: string, @Request() req) {
    return this.userService.getUserTop(username, req.user?.sub);
  }

  @OptionalAuth()
  @Get('question/page')
  async getPersonalQuestionPage(@Query() query: any, @Request() req) {
    return this.userService.getPersonalQuestionPage(query, req.user?.sub);
  }

  @OptionalAuth()
  @Get('answer/page')
  async getPersonalAnswerPage(@Query() query: any, @Request() req) {
    return this.userService.getPersonalAnswerPage(query, req.user?.sub);
  }

  @OptionalAuth()
  @Get('comment/page')
  async getPersonalCommentPage(@Query() query: any, @Request() req) {
    return this.userService.getPersonalCommentPage(query, req.user?.sub);
  }

  @OptionalAuth()
  @Get('rank/page')
  async getPersonalRankPage(@Query() query: any, @Request() req) {
    return this.userService.getPersonalRankPage(query, req.user?.sub);
  }

  // ========== 需要认证的路由 ==========
  
  @Get('vote/page')
  async getPersonalVotePage(@Query() query: any, @Request() req) {
    return this.userService.getPersonalVotePage(query, req.user.sub);
  }

  @Get('collection/page')
  async getPersonalCollectionPage(@Query() query: any, @Request() req) {
    return this.userService.getPersonalCollectionPage(query, req.user.sub);
  }
}
