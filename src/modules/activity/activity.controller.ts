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

  // ========== 需要认证的路由 (RegisterAnswerAPIRouter) ==========

  @Get('timeline')
  async getObjectTimeline(@Query() query: any, @Request() req) {
    return this.activityService.getObjectTimeline(query, req.user.sub);
  }

  @Get('timeline/detail')
  async getObjectTimelineDetail(@Query() query: any, @Request() req) {
    return this.activityService.getObjectTimelineDetail(query, req.user.sub);
  }
}
