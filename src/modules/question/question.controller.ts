import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { QuestionService } from './question.service';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
  QuestionPageDto,
  QuestionOperationDto,
  QuestionInviteDto,
  QuestionLinkDto
} from './dto/question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  // 问题基本CRUD操作
  @Post()
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(req.user?.sub, createQuestionDto);
  }

  @Get('info')
  async getQuestion(@Query('id') id: string, @Request() req) {
    return this.questionService.getQuestion(id, req.user?.sub);
  }

  @Put()
  // @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(req.user?.sub, updateQuestionDto);
  }

  @Delete()
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Query('id') id: string) {
    return this.questionService.remove(req.user?.sub, id);
  }

  @Post('recover')
  // @UseGuards(JwtAuthGuard)
  async recover(@Request() req, @Body() body: { id: string }) {
    return this.questionService.recover(req.user?.sub, body.id);
  }

  // 问题列表和搜索
  @Get('page')
  async getQuestionPage(@Query() questionPageDto: QuestionPageDto) {
    return this.questionService.getQuestionPage(questionPageDto);
  }

  @Get('recommend/page')
  async getRecommendQuestionPage(@Query() questionPageDto: QuestionPageDto, @Request() req) {
    return this.questionService.getRecommendQuestionPage(questionPageDto, req.user?.sub);
  }

  @Get('similar/tag')
  async getSimilarQuestion(@Query('title') title: string) {
    return this.questionService.getSimilarQuestion(title);
  }

  // 问题操作
  @Put('operation')
  // @UseGuards(JwtAuthGuard)
  async questionOperation(@Request() req, @Body() operationDto: QuestionOperationDto) {
    return this.questionService.questionOperation(req.user?.sub, operationDto);
  }

  @Get('invite')
  async getQuestionInviteUserInfo(@Query('id') id: string) {
    return this.questionService.getQuestionInviteUserInfo(id);
  }

  @Post('invite')
  // @UseGuards(JwtAuthGuard)
  async inviteUserToAnswer(@Request() req, @Body() inviteDto: QuestionInviteDto) {
    return this.questionService.inviteUserToAnswer(req.user?.sub, inviteDto);
  }

  // 问题链接
  @Get('link')
  async getQuestionLink(@Query('id') id: string) {
    return this.questionService.getQuestionLink(id);
  }

  @Post('link')
  // @UseGuards(JwtAuthGuard)
  async linkQuestion(@Request() req, @Body() linkDto: QuestionLinkDto) {
    return this.questionService.linkQuestion(req.user?.sub, linkDto);
  }

  // 个人问题相关
  @Get('personal/qa/top')
  async getUserTop(@Query('username') username: string) {
    return this.questionService.getUserTop(username);
  }

  @Get('personal/question/page')
  async getPersonalQuestionPage(@Query() query: any) {
    return this.questionService.getPersonalQuestionPage(query);
  }

  @Get('personal/answer/page')
  async getPersonalAnswerPage(@Query() query: any) {
    return this.questionService.getPersonalAnswerPage(query);
  }
}