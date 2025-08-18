import { 
  Controller, 
  Get, 
  Put, 
  Delete,
  Body, 
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { 
  NotificationPageDto,
  ReadNotificationDto,
  ClearNotificationDto
} from './dto/notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // ========== 需要认证的路由 (RegisterAnswerAPIRouter) ==========

  @Get('status')
  async getRedDot(@Request() req) {
    return this.notificationService.getRedDot(req.user.sub);
  }

  @Put('status')
  @HttpCode(HttpStatus.OK)
  async clearRedDot(@Request() req) {
    return this.notificationService.clearRedDot(req.user.sub);
  }

  @Get('page')
  async getNotificationPage(@Request() req, @Query() notificationPageDto: NotificationPageDto) {
    return this.notificationService.getNotificationPage(req.user.sub, notificationPageDto);
  }

  @Put('read/state/all')
  @HttpCode(HttpStatus.OK)
  async clearUnRead(@Request() req) {
    return this.notificationService.clearUnRead(req.user.sub);
  }

  @Put('read/state')
  @HttpCode(HttpStatus.OK)
  async clearIDUnRead(@Request() req, @Body() body: { id: string }) {
    return this.notificationService.clearIDUnRead(req.user.sub, body.id);
  }
}
