import { 
  Controller, 
  Get, 
  Query,
  Request,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { SearchTagDto } from './dto/tag.dto';

/**
 * 问题标签搜索控制器
 * 对应Go项目中的 /question/tags 路由
 */
@Controller('question')
export class QuestionTagsController {
  constructor(private readonly tagService: TagService) {}

  // ========== 需要认证的路由 (RegisterAnswerAPIRouter) ==========
  
  @Get('tags')
  async searchTagLike(@Query() searchTagDto: SearchTagDto, @Request() req) {
    return this.tagService.searchTagLike(searchTagDto, req.user.sub);
  }
}
