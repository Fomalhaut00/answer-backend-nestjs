import { 
  Controller, 
  Get, 
  Query,
  Request,
} from '@nestjs/common';
import { OptionalAuth } from '../../decorators/public.decorator';
import { TagService } from './tag.service';
import { 
  TagPageDto,
  TagInfoDto,
} from './dto/tag.dto';

/**
 * 标签查看相关控制器
 * 对应Go项目中的 /tags/* 路由
 */
@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagService) {}

  // ========== 可选认证的路由 (RegisterUnAuthAnswerAPIRouter) ==========
  
  @OptionalAuth()
  @Get('page')
  async getTagPage(@Query() tagPageDto: TagPageDto, @Request() req) {
    return this.tagService.getTagPage(tagPageDto, req.user?.sub);
  }

  @OptionalAuth()
  @Get('following')
  async getFollowingTags(@Query() query: any, @Request() req) {
    return this.tagService.getFollowingTags(query, req.user?.sub);
  }

  @OptionalAuth()
  @Get()
  async getTagsBySlugName(@Query() query: any, @Request() req) {
    return this.tagService.getTagsBySlugName(query, req.user?.sub);
  }
}
