import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  Request, 
  UseGuards, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { CollectionGroupService } from './collection-group.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { 
  CreateCollectionGroupDto, 
  UpdateCollectionGroupDto, 
  CollectionGroupPageDto 
} from './dto/collection-group.dto';

@Controller('personal/collection/group')
@UseGuards(JwtAuthGuard)
export class CollectionGroupController {
  constructor(private readonly collectionGroupService: CollectionGroupService) {}

  // 创建收藏分组
  @Post()
  @HttpCode(HttpStatus.OK)
  async createCollectionGroup(@Body() createDto: CreateCollectionGroupDto, @Request() req) {
    return this.collectionGroupService.createCollectionGroup(createDto, req.user.sub);
  }

  // 获取用户收藏分组列表
  @Get('page')
  async getCollectionGroupPage(@Query() query: CollectionGroupPageDto, @Request() req) {
    return this.collectionGroupService.getCollectionGroupPage(query, req.user.sub);
  }

  // 更新收藏分组
  @Put(':group_id')
  @HttpCode(HttpStatus.OK)
  async updateCollectionGroup(
    @Param('group_id') groupId: string,
    @Body() updateDto: UpdateCollectionGroupDto,
    @Request() req
  ) {
    return this.collectionGroupService.updateCollectionGroup(groupId, updateDto, req.user.sub);
  }

  // 删除收藏分组
  @Delete(':group_id')
  @HttpCode(HttpStatus.OK)
  async deleteCollectionGroup(@Param('group_id') groupId: string, @Request() req) {
    return this.collectionGroupService.deleteCollectionGroup(groupId, req.user.sub);
  }

  // 获取收藏分组详情
  @Get(':group_id')
  async getCollectionGroupDetail(@Param('group_id') groupId: string, @Request() req) {
    return this.collectionGroupService.getCollectionGroupDetail(groupId, req.user.sub);
  }
}
