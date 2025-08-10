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

  // 答案基本CRUD操作
  @Post()
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.create(req.user?.sub, createAnswerDto);
  }

  @Get('info')
  async getAnswerInfo(@Query() answerInfoDto: AnswerInfoDto, @Request() req) {
    return this.answerService.getAnswerInfo(answerInfoDto.id, req.user?.sub);
  }

  @Put()
  // @UseGuards(JwtAuthGuard)
  async update(@Request() req, @Body() updateAnswerDto: UpdateAnswerDto) {
    return this.answerService.update(req.user?.sub, updateAnswerDto);
  }

  @Delete()
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Query('id') id: string) {
    return this.answerService.remove(req.user?.sub, id);
  }

  @Post('recover')
  // @UseGuards(JwtAuthGuard)
  async recover(@Request() req, @Body() body: { id: string }) {
    return this.answerService.recover(req.user?.sub, body.id);
  }

  // 答案列表
  @Get('page')
  async getAnswerPage(@Query() answerPageDto: AnswerPageDto) {
    return this.answerService.getAnswerPage(answerPageDto);
  }

  // 答案接受
  @Post('acceptance')
  // @UseGuards(JwtAuthGuard)
  async acceptAnswer(@Request() req, @Body() acceptAnswerDto: AcceptAnswerDto) {
    return this.answerService.acceptAnswer(req.user?.sub, acceptAnswerDto);
  }

  // 个人答案页面
  @Get('personal/answer/page')
  async getPersonalAnswerPage(@Query() personalAnswerPageDto: PersonalAnswerPageDto) {
    return this.answerService.getPersonalAnswerPage(personalAnswerPageDto);
  }
}
