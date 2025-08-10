import { 
  Controller, 
  Get, 
  Query,
  Request,
  UseGuards
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityPageDto, UserTimelineDto } from './dto/activity.dto';

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
