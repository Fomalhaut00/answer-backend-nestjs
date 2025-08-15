import { Controller, Post, Get, Put, Body, Query, Request, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { RequireRoles } from '../../decorators/roles.decorator';
import { AddReportDto, UnreviewedReportPageDto, ReviewReportDto } from './dto/report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // 添加举报
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addReport(@Body() addReportDto: AddReportDto, @Request() req) {
    return this.reportService.addReport(addReportDto, req.user.sub);
  }

  // 获取未审核举报分页 (管理员)
  @Get('unreviewed/post')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'moderator')
  async getUnreviewedReportPostPage(@Query() query: UnreviewedReportPageDto) {
    return this.reportService.getUnreviewedReportPostPage(query);
  }

  // 审核举报 (管理员)
  @Put('review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'moderator')
  @HttpCode(HttpStatus.OK)
  async reviewReport(@Body() reviewReportDto: ReviewReportDto, @Request() req) {
    return this.reportService.reviewReport(reviewReportDto, req.user.sub);
  }
}
