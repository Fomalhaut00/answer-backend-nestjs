import { 
  Controller, 
  Get, 
  Query, 
  Request,
  UseGuards 
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { GetPermissionDto } from './dto/permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  async getPermission(@Request() req, @Query() getPermissionDto: GetPermissionDto) {
    const userId = req.user?.sub;
    return this.permissionService.getPermission(userId, getPermissionDto);
  }
}
