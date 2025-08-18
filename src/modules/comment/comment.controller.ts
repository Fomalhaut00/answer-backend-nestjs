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

  // ========== 可选认证的路由 (RegisterUnAuthAnswerAPIRouter) ==========

  @OptionalAuth()
  @Get('page')
  async getCommentPage(@Query() commentPageDto: CommentPageDto, @Request() req) {
    return this.commentService.getCommentPage(commentPageDto, req.user?.sub);
  }

  @OptionalAuth()
  @Get()
  async getComment(@Query() getCommentDto: GetCommentDto, @Request() req) {
    return this.commentService.getComment(getCommentDto.id, req.user?.sub);
  }

  // ========== 需要认证的路由 (RegisterAnswerAPIRouter) ==========

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(req.user.sub, createCommentDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Query('comment_id') commentId: string) {
    return this.commentService.remove(req.user.sub, commentId);
  }

  @Put()
  async update(@Request() req, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(req.user.sub, updateCommentDto);
  }
}
