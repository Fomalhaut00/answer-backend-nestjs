import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { OptionalAuth } from '../../decorators/public.decorator';
import { TagService } from './tag.service';
import { 
  CreateTagDto,
  UpdateTagDto,
  TagPageDto,
  SearchTagDto,
  TagInfoDto,
  TagSynonymDto,
  MergeTagDto
} from './dto/tag.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  // ========== 可选认证的路由 (RegisterUnAuthAnswerAPIRouter) ==========

  @OptionalAuth()
  @Get()
  async getTagInfo(@Query() tagInfoDto: TagInfoDto, @Request() req) {
    return this.tagService.getTagInfo(tagInfoDto.tag, req.user?.sub);
  }

  @OptionalAuth()
  @Get('synonyms')
  async getTagSynonyms(@Query() query: any, @Request() req) {
    return this.tagService.getTagSynonyms(query, req.user?.sub);
  }

  // ========== 需要认证的路由 (RegisterAnswerAPIRouter) ==========

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createTagDto: CreateTagDto) {
    return this.tagService.create(req.user.sub, createTagDto);
  }

  @Put()
  async update(@Request() req, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(req.user.sub, updateTagDto);
  }

  @Post('recover')
  async recover(@Request() req, @Body() body: { id: string }) {
    return this.tagService.recover(req.user.sub, body.id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Query('id') id: string) {
    return this.tagService.remove(req.user.sub, id);
  }

  @Put('synonym')
  async updateTagSynonym(@Request() req, @Body() synonymDto: TagSynonymDto) {
    return this.tagService.updateTagSynonym(req.user.sub, synonymDto);
  }

  @Post('merge')
  async mergeTag(@Request() req, @Body() mergeDto: MergeTagDto) {
    return this.tagService.mergeTag(req.user.sub, mergeDto);
  }

}
