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

  // 标签基本CRUD操作
  @Post()
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createTagDto: CreateTagDto) {
    return this.tagService.create(req.user?.sub, createTagDto);
  }

  @Get()
  async getTagInfo(@Query() tagInfoDto: TagInfoDto, @Request() req) {
    return this.tagService.getTagInfo(tagInfoDto.tag, req.user?.sub);
  }

  @Put()
  // @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(req.user?.sub, updateTagDto);
  }

  @Delete()
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Query('tag_id') tagId: string) {
    return this.tagService.remove(req.user?.sub, tagId);
  }

  @Post('recover')
  // @UseGuards(JwtAuthGuard)
  async recover(@Request() req, @Body() body: { tag_id: string }) {
    return this.tagService.recover(req.user?.sub, body.tag_id);
  }

  // 标签列表和搜索
  @Get('page')
  async getTagPage(@Query() tagPageDto: TagPageDto) {
    return this.tagService.getTagPage(tagPageDto);
  }

  @Get('question/tags')
  // @UseGuards(JwtAuthGuard)
  async searchTagLike(@Query() searchTagDto: SearchTagDto) {
    return this.tagService.searchTagLike(searchTagDto);
  }

  @Get('tags')
  async getTagsBySlugName(@Query('tag') tag: string) {
    return this.tagService.getTagsBySlugName(tag);
  }

  // 标签关注
  @Get('following')
  // @UseGuards(JwtAuthGuard)
  async getFollowingTags(@Request() req) {
    return this.tagService.getFollowingTags(req.user?.sub);
  }

  // 标签同义词
  @Get('synonyms')
  async getTagSynonyms(@Query('tag_id') tagId: string) {
    return this.tagService.getTagSynonyms(tagId);
  }

  @Put('synonym')
  // @UseGuards(JwtAuthGuard)
  async updateTagSynonym(@Request() req, @Body() tagSynonymDto: TagSynonymDto) {
    return this.tagService.updateTagSynonym(req.user?.sub, tagSynonymDto);
  }

  // 标签合并
  @Post('merge')
  // @UseGuards(JwtAuthGuard)
  async mergeTag(@Request() req, @Body() mergeTagDto: MergeTagDto) {
    return this.tagService.mergeTag(req.user?.sub, mergeTagDto);
  }
}
