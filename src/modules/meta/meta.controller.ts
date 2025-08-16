import { Controller, Get, Put, Body, Query, Request, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { MetaService } from './meta.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Public } from '../../decorators/public.decorator';
import { GetReactionDto, AddOrUpdateReactionDto } from './dto/meta.dto';

@Controller('meta')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  // 获取反应元数据 (公开接口)
  @Public()
  @Get('reaction')
  async getReaction(@Query() getReactionDto: GetReactionDto, @Request() req) {
    return this.metaService.getReaction(getReactionDto, req.user?.sub);
  }

  // 添加或更新反应 (需要认证)
  @Put('reaction')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async addOrUpdateReaction(@Body() addOrUpdateReactionDto: AddOrUpdateReactionDto, @Request() req) {
    return this.metaService.addOrUpdateReaction(addOrUpdateReactionDto, req.user.sub);
  }
}
