import {
  Controller,
  Get,
  Query,
  Request
} from '@nestjs/common';
import { OptionalAuth } from '../../decorators/public.decorator';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // ========== 可选认证的路由 (RegisterUnAuthAnswerAPIRouter) ==========

  @OptionalAuth()
  @Get()
  async search(@Query() searchDto: SearchDto, @Request() req) {
    return this.searchService.search(searchDto, req.user?.sub);
  }

  @OptionalAuth()
  @Get('desc')
  async searchDesc(@Query() query: any, @Request() req) {
    return this.searchService.searchDesc(query, req.user?.sub);
  }
}
