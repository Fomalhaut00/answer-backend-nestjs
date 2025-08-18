import {
  Controller,
  Post,
  Body,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CollectionService } from './collection.service';

/**
 * 收藏控制器
 * 对应Go项目中的收藏功能
 */
@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  // ========== 需要认证的路由 (RegisterAnswerAPIRouter) ==========
  
  @Post('switch')
  @HttpCode(HttpStatus.OK)
  async collectionSwitch(@Request() req, @Body() body: { object_id: string }) {
    return this.collectionService.collectionSwitch(req.user.sub, body.object_id);
  }
}
