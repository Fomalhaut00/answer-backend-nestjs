import { Controller, Post, Put, Body, Request, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { FollowDto, UpdateFollowTagsDto } from './dto/follow.dto';

@Controller('follow')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  // 关注/取消关注
  @Post()
  @HttpCode(HttpStatus.OK)
  async follow(@Body() followDto: FollowDto, @Request() req) {
    return this.followService.follow(followDto, req.user.sub);
  }

  // 更新关注的标签
  @Put('tags')
  @HttpCode(HttpStatus.OK)
  async updateFollowTags(@Body() updateFollowTagsDto: UpdateFollowTagsDto, @Request() req) {
    return this.followService.updateFollowTags(updateFollowTagsDto, req.user.sub);
  }
}
