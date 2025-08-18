import {
  Controller,
  Put,
  Body,
} from '@nestjs/common';
import { AdminOnly } from '../../decorators/public.decorator';
import { AnswerService } from './answer.service';

/**
 * 管理员答案管理控制器
 * 对应Go项目中的管理员答案管理路由
 */
@Controller('admin')
@AdminOnly()
export class AdminAnswerController {
  constructor(private readonly answerService: AnswerService) {}

  // ========== 管理员专用路由 ==========
  
  @Put('answer/status')
  async updateAnswerStatus(@Body() body: { answer_id: string; status: string }) {
    return this.answerService.adminUpdateAnswerStatus(body.answer_id, body.status);
  }
}
