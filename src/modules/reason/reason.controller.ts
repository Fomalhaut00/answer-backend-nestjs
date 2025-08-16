import { Controller, Get, Query } from '@nestjs/common';
import { ReasonService } from './reason.service';
import { Public } from '../../decorators/public.decorator';
import { ReasonReqDto } from './dto/reason.dto';

@Controller('reason')
export class ReasonController {
  constructor(private readonly reasonService: ReasonService) {}

  // 获取原因列表 - 公开接口（对应Go的GetReasons接口）
  @Public()
  @Get()
  async getReasons(@Query() query: ReasonReqDto) {
    return this.reasonService.getReasons(query);
  }
}
