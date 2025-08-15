import { Controller, Post, Get, Body, Query, Request, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CollectionSwitchDto, PersonalCollectionPageDto } from './dto/collection.dto';

@Controller('collection')
@UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  // 收藏开关 - 添加或取消收藏
  @Post('switch')
  @HttpCode(HttpStatus.OK)
  async collectionSwitch(@Body() collectionSwitchDto: CollectionSwitchDto, @Request() req) {
    return this.collectionService.collectionSwitch(collectionSwitchDto, req.user.sub);
  }
}

@Controller('personal')
@UseGuards(JwtAuthGuard)
export class PersonalCollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  // 个人收藏分页
  @Get('collection/page')
  async getPersonalCollectionPage(@Query() query: PersonalCollectionPageDto, @Request() req) {
    return this.collectionService.getPersonalCollectionPage(query, req.user.sub);
  }
}
