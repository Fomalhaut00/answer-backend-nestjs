import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteDto, UserVotesDto } from './dto/vote.dto';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  // ========== 需要认证的路由 (RegisterAnswerAPIRouter) ==========

  @Post('up')
  @HttpCode(HttpStatus.OK)
  async voteUp(@Request() req, @Body() voteDto: VoteDto) {
    return this.voteService.voteUp(req.user.sub, voteDto);
  }

  @Post('down')
  @HttpCode(HttpStatus.OK)
  async voteDown(@Request() req, @Body() voteDto: VoteDto) {
    return this.voteService.voteDown(req.user.sub, voteDto);
  }
}
