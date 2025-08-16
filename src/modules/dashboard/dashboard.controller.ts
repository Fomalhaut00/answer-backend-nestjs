import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { RequireRoles } from '../../decorators/roles.decorator';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@RequireRoles('admin')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // 获取管理员仪表板信息
  @Get('info')
  async getDashboardInfo() {
    return this.dashboardService.getDashboardInfo();
  }
}
