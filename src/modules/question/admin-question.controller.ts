import {
  Controller,
  Get,
  Put,
  Body,
  Query,
  Request,
} from '@nestjs/common';
import { AdminOnly } from '../../decorators/public.decorator';
import { QuestionService } from './question.service';

/**
 * 管理员问题管理控制器
 * 对应Go项目中的管理员问题管理路由
 */
@Controller('admin')
@AdminOnly()
export class AdminQuestionController {
  constructor(private readonly questionService: QuestionService) {}

  // ========== 管理员专用路由 ==========
  
  @Get('question/page')
  async getAdminQuestionPage(@Query() query: any) {
    return this.questionService.getAdminQuestionPage(query);
  }

  @Put('question/status')
  async updateQuestionStatus(@Body() body: { question_id: string; status: string }) {
    return this.questionService.adminUpdateQuestionStatus(body.question_id, body.status);
  }

  @Get('answer/page')
  async getAdminAnswerPage(@Query() query: any) {
    return this.questionService.getAdminAnswerPage(query);
  }
}
