import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityPageDto, UserTimelineDto, VoteDto, UserVotesDto } from './dto/activity.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('timeline')
  async getUserTimeline(@Query() userTimelineDto: UserTimelineDto) {
    return this.activityService.getUserTimeline(userTimelineDto);
  }

  @Get('personal/page')
  // @UseGuards(JwtAuthGuard)
  async getPersonalActivityPage(@Request() req, @Query() activityPageDto: ActivityPageDto) {
    return this.activityService.getPersonalActivityPage(req.user?.sub, activityPageDto);
  }

  @Get('page')
  async getActivityPage(@Query() activityPageDto: ActivityPageDto) {
    return this.activityService.getActivityPage(activityPageDto);
  }
}

@Controller('vote')
export class VoteController {
  constructor(private readonly activityService: ActivityService) {}

  // 投票操作
  @Post('up')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async voteUp(@Request() req, @Body() voteDto: VoteDto) {
    return this.activityService.voteUp(req.user?.sub, voteDto);
  }

  @Post('down')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async voteDown(@Request() req, @Body() voteDto: VoteDto) {
    return this.activityService.voteDown(req.user?.sub, voteDto);
  }

  // 获取用户投票记录
  @Get('personal/vote/page')
  // @UseGuards(JwtAuthGuard)
  async getUserVotes(@Request() req, @Query() userVotesDto: UserVotesDto) {
    return this.activityService.getUserVotes(req.user?.sub, userVotesDto);
  }
}
