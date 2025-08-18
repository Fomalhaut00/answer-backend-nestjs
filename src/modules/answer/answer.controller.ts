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
import { AnswerService } from './answer.service';
import { 
  CreateAnswerDto,
  UpdateAnswerDto,
  AnswerPageDto,
  AcceptAnswerDto,
  AnswerInfoDto,
  PersonalAnswerPageDto
} from './dto/answer.dto';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  // ========== 可选认证的路由 (RegisterUnAuthAnswerAPIRouter) ==========

  @OptionalAuth()
  @Get('info')
  async getAnswerInfo(@Query() answerInfoDto: AnswerInfoDto, @Request() req) {
    return this.answerService.getAnswerInfo(answerInfoDto.id, req.user?.sub);
  }

  @OptionalAuth()
  @Get('page')
  async getAnswerPage(@Query() answerPageDto: AnswerPageDto, @Request() req) {
    return this.answerService.getAnswerPage(answerPageDto, req.user?.sub);
  }

  // ========== 需要认证的路由 (RegisterAnswerAPIRouter) ==========

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.create(req.user.sub, createAnswerDto);
  }

  @Put()
  async update(@Request() req, @Body() updateAnswerDto: UpdateAnswerDto) {
    return this.answerService.update(req.user.sub, updateAnswerDto);
  }

  @Post('acceptance')
  async acceptAnswer(@Request() req, @Body() acceptAnswerDto: AcceptAnswerDto) {
    return this.answerService.acceptAnswer(req.user.sub, acceptAnswerDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Query('id') id: string) {
    return this.answerService.remove(req.user.sub, id);
  }

  @Post('recover')
  async recover(@Request() req, @Body() body: { id: string }) {
    return this.answerService.recover(req.user.sub, body.id);
  }
}
