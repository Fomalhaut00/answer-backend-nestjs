import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { RankService } from './rank.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Public } from '../../decorators/public.decorator';
import { PersonalRankPageDto } from './dto/rank.dto';

@Controller()
export class RankController {
  constructor(private readonly rankService: RankService) {}

  // 获取个人排名分页 - 需要认证
  @Get('personal/rank/page')
  @UseGuards(JwtAuthGuard)
  async getPersonalRankPage(@Query() query: PersonalRankPageDto, @Request() req) {
    return this.rankService.getPersonalRankPage(query, req.user.sub);
  }

  // 获取用户排行榜 - 公开接口
  @Public()
  @Get('user/ranking')
  async getUserRanking(@Query() query: PersonalRankPageDto) {
    return this.rankService.getUserRanking(query);
  }

  // 获取用户排名详情 - 公开接口
  @Public()
  @Get('user/rank/detail')
  async getUserRankDetail(@Query('user_id') userId: string) {
    return this.rankService.getUserRankDetail(userId);
  }
}
