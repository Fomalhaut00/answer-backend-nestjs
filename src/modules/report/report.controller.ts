import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminOnly } from '../../decorators/public.decorator';
import { ReportService } from './report.service';

/**
 * 举报控制器
 * 对应Go项目中的举报功能
 */
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // ========== 需要认证的路由 (RegisterAnswerAPIRouter) ==========
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addReport(@Request() req, @Body() body: { object_id: string; reason: string; content?: string }) {
    return this.reportService.addReport(req.user.sub, body);
  }

  // ========== 管理员专用路由 ==========
  
  @AdminOnly()
  @Get('unreviewed/post')
  async getUnreviewedReportPostPage(@Query() query: any) {
    return this.reportService.getUnreviewedReportPostPage(query);
  }

  @AdminOnly()
  @Put('review')
  async reviewReport(@Body() body: { report_id: string; action: string }) {
    return this.reportService.reviewReport(body.report_id, body.action);
  }
}
