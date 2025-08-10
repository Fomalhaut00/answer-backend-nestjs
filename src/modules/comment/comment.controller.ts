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
import { CommentService } from './comment.service';
import { 
  CreateCommentDto,
  UpdateCommentDto,
  CommentPageDto,
  PersonalCommentPageDto,
  GetCommentDto
} from './dto/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 评论基本CRUD操作
  @Post()
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(req.user?.sub, createCommentDto);
  }

  @Get()
  async getComment(@Query() getCommentDto: GetCommentDto, @Request() req) {
    return this.commentService.getComment(getCommentDto.id, req.user?.sub);
  }

  @Put()
  // @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(req.user?.sub, updateCommentDto);
  }

  @Delete()
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Query('comment_id') commentId: string) {
    return this.commentService.remove(req.user?.sub, commentId);
  }

  // 评论列表
  @Get('page')
  async getCommentPage(@Query() commentPageDto: CommentPageDto) {
    return this.commentService.getCommentPage(commentPageDto);
  }

  // 个人评论页面
  @Get('personal/comment/page')
  async getPersonalCommentPage(@Query() personalCommentPageDto: PersonalCommentPageDto) {
    return this.commentService.getPersonalCommentPage(personalCommentPageDto);
  }
}
