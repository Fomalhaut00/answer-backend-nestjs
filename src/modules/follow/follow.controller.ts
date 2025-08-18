import {
  Controller,
  Post,
  Put,
  Body,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FollowService } from './follow.service';

/**
 * 关注控制器
 * 对应Go项目中的关注功能
 */
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  // ========== 需要认证的路由 (RegisterAnswerAPIRouter) ==========
  
  @Post()
  @HttpCode(HttpStatus.OK)
  async follow(@Request() req, @Body() body: { object_id: string; is_cancel?: boolean }) {
    return this.followService.follow(req.user.sub, body.object_id, body.is_cancel);
  }

  @Put('tags')
  @HttpCode(HttpStatus.OK)
  async updateFollowTags(@Request() req, @Body() body: { tag_ids: string[] }) {
    return this.followService.updateFollowTags(req.user.sub, body.tag_ids);
  }
}
