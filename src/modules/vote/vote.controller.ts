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

  // 投票操作
  @Post('up')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async voteUp(@Request() req, @Body() voteDto: VoteDto) {
    return this.voteService.voteUp(req.user?.sub, voteDto);
  }

  @Post('down')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async voteDown(@Request() req, @Body() voteDto: VoteDto) {
    return this.voteService.voteDown(req.user?.sub, voteDto);
  }

  // 获取用户投票记录
  @Get('personal/vote/page')
  // @UseGuards(JwtAuthGuard)
  async getUserVotes(@Request() req, @Query() userVotesDto: UserVotesDto) {
    return this.voteService.getUserVotes(req.user?.sub, userVotesDto);
  }

  // 获取对象的投票状态
  @Get('status')
  async getVoteStatus(@Query('object_id') objectId: string, @Request() req) {
    return this.voteService.getVoteStatus(objectId, req.user?.sub);
  }
}
