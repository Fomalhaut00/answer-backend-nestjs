import { Controller, Get, UseGuards } from '@nestjs/common';
import { LanguageService } from './language.service';
import { Public } from '../../decorators/public.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { RequireRoles } from '../../decorators/roles.decorator';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  // 公开接口 - 获取语言映射配置
  @Public()
  @Get('config')
  async getLangMapping() {
    return this.languageService.getLangMapping();
  }

  // 公开接口 - 获取用户语言选项
  @Public()
  @Get('options')
  async getUserLangOptions() {
    return this.languageService.getUserLangOptions();
  }

  // 管理员接口 - 获取管理员语言选项
  @Get('admin/options')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin')
  async getAdminLangOptions() {
    return this.languageService.getAdminLangOptions();
  }
}
