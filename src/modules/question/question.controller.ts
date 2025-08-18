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
import { OptionalAuth, AdminOnly } from '../../decorators/public.decorator';
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

  // ========== 可选认证的路由 (RegisterUnAuthAnswerAPIRouter) ==========

  @OptionalAuth()
  @Get('info')
  async getQuestion(@Query('id') id: string, @Request() req) {
    return this.questionService.getQuestion(id, req.user?.sub);
  }

  @OptionalAuth()
  @Get('invite')
  async getQuestionInviteUserInfo(@Query('id') id: string) {
    return this.questionService.getQuestionInviteUserInfo(id);
  }

  @OptionalAuth()
  @Get('page')
  async getQuestionPage(@Query() questionPageDto: QuestionPageDto, @Request() req) {
    return this.questionService.getQuestionPage(questionPageDto, req.user?.sub);
  }

  @OptionalAuth()
  @Get('recommend/page')
  async getRecommendQuestionPage(@Query() questionPageDto: QuestionPageDto, @Request() req) {
    return this.questionService.getRecommendQuestionPage(questionPageDto, req.user?.sub);
  }

  @OptionalAuth()
  @Get('similar/tag')
  async getSimilarQuestion(@Query('title') title: string) {
    return this.questionService.getSimilarQuestion(title);
  }

  @OptionalAuth()
  @Get('link')
  async getQuestionLink(@Query('id') id: string) {
    return this.questionService.getQuestionLink(id);
  }

  // ========== 需要认证的路由 (RegisterAnswerAPIRouter) ==========

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(req.user.sub, createQuestionDto);
  }

  @Post('answer')
  @HttpCode(HttpStatus.CREATED)
  async addQuestionByAnswer(@Request() req, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.addQuestionByAnswer(req.user.sub, createQuestionDto);
  }

  @Put()
  async update(@Request() req, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(req.user.sub, updateQuestionDto);
  }

  @Put('invite')
  async updateQuestionInviteUser(@Request() req, @Body() inviteDto: QuestionInviteDto) {
    return this.questionService.updateQuestionInviteUser(req.user.sub, inviteDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Query('id') id: string) {
    return this.questionService.remove(req.user.sub, id);
  }

  @Put('status')
  async closeQuestion(@Request() req, @Body() body: { id: string; status: string }) {
    return this.questionService.closeQuestion(req.user.sub, body.id, body.status);
  }

  @Put('operation')
  async questionOperation(@Request() req, @Body() operationDto: QuestionOperationDto) {
    return this.questionService.questionOperation(req.user.sub, operationDto);
  }

  @Put('reopen')
  async reopenQuestion(@Request() req, @Body() body: { id: string }) {
    return this.questionService.reopenQuestion(req.user.sub, body.id);
  }

  @Get('similar')
  async getSimilarQuestions(@Query() query: any, @Request() req) {
    return this.questionService.getSimilarQuestions(query, req.user.sub);
  }

  @Post('recover')
  async recover(@Request() req, @Body() body: { id: string }) {
    return this.questionService.recover(req.user.sub, body.id);
  }

}