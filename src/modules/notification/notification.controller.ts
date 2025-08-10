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

  @Get('page')
  // @UseGuards(JwtAuthGuard)
  async getNotificationPage(@Request() req, @Query() notificationPageDto: NotificationPageDto) {
    return this.notificationService.getNotificationPage(req.user?.sub, notificationPageDto);
  }

  @Get('unread')
  // @UseGuards(JwtAuthGuard)
  async getUnreadCount(@Request() req) {
    return this.notificationService.getUnreadCount(req.user?.sub);
  }

  @Put('read')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async readNotification(@Request() req, @Body() readNotificationDto: ReadNotificationDto) {
    return this.notificationService.readNotification(req.user?.sub, readNotificationDto);
  }

  @Put('read/all')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async readAllNotifications(@Request() req, @Body() body: { type?: string }) {
    return this.notificationService.readAllNotifications(req.user?.sub, body.type);
  }

  @Delete('clear')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearNotifications(@Request() req, @Body() clearNotificationDto: ClearNotificationDto) {
    return this.notificationService.clearNotifications(req.user?.sub, clearNotificationDto);
  }
}
