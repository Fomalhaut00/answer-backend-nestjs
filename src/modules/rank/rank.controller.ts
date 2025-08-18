import {
  Controller,
  Get,
  Query,
  Request,
} from '@nestjs/common';
import { OptionalAuth } from '../../decorators/public.decorator';
import { RankService } from './rank.service';

/**
 * 排名控制器
 * 对应Go项目中的排名功能
 */
@Controller()
export class RankController {
  constructor(private readonly rankService: RankService) {}

  // ========== 可选认证的路由 (RegisterUnAuthAnswerAPIRouter) ==========
  
  @OptionalAuth()
  @Get('personal/rank/page')
  async getRankPersonalWithPage(@Query() query: any, @Request() req) {
    return this.rankService.getRankPersonalWithPage(query, req.user?.sub);
  }
}
