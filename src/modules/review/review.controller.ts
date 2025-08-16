import { Controller, Get, Put, Body, Query, Request, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { RequireRoles } from '../../decorators/roles.decorator';
import { GetUnreviewedPostPageDto, UpdateReviewDto } from './dto/review.dto';

@Controller('review')
@UseGuards(JwtAuthGuard, RolesGuard)
@RequireRoles('admin', 'moderator')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // 获取待审核内容分页
  @Get('pending/post/page')
  async getUnreviewedPostPage(@Query() getUnreviewedPostPageDto: GetUnreviewedPostPageDto) {
    return this.reviewService.getUnreviewedPostPage(getUnreviewedPostPageDto);
  }

  // 更新审核状态
  @Put('pending/post')
  @HttpCode(HttpStatus.OK)
  async updateReview(@Body() updateReviewDto: UpdateReviewDto, @Request() req) {
    return this.reviewService.updateReview(updateReviewDto, req.user.sub);
  }
}
