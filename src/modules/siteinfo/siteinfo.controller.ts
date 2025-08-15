import { Controller, Get, Put, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { SiteInfoService } from './siteinfo.service';
import { Public } from '../../decorators/public.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { RequireRoles } from '../../decorators/roles.decorator';
import {
  SiteInfoResponse,
  SiteLegalInfoResponse,
  GeneralConfigDto,
  InterfaceConfigDto,
  BrandingConfigDto,
  WriteConfigDto,
  LegalConfigDto,
  SeoConfigDto,
  LoginConfigDto,
  CustomCssHtmlConfigDto,
  ThemeConfigDto,
  UsersConfigDto,
  SmtpConfigDto,
  PrivilegesConfigDto
} from './dto/siteinfo.dto';

@Controller('siteinfo')
export class SiteInfoController {
  constructor(private readonly siteInfoService: SiteInfoService) {}

  // 公开接口 - 获取站点基本信息
  @Public()
  @Get()
  async getSiteInfo(): Promise<SiteInfoResponse> {
    return this.siteInfoService.getSiteInfo();
  }

  // 公开接口 - 获取法律信息
  @Public()
  @Get('legal')
  async getSiteLegalInfo(): Promise<SiteLegalInfoResponse> {
    return this.siteInfoService.getSiteLegalInfo();
  }
}

@Controller('admin/siteinfo')
@UseGuards(JwtAuthGuard, RolesGuard)
@RequireRoles('admin')
export class AdminSiteInfoController {
  constructor(private readonly siteInfoService: SiteInfoService) {}

  // 通用设置
  @Get('general')
  async getGeneral(): Promise<GeneralConfigDto> {
    return this.siteInfoService.getGeneral();
  }

  @Put('general')
  @HttpCode(HttpStatus.OK)
  async updateGeneral(@Body() generalConfig: GeneralConfigDto) {
    return this.siteInfoService.updateGeneral(generalConfig);
  }

  // 界面设置
  @Get('interface')
  async getInterface(): Promise<InterfaceConfigDto> {
    return this.siteInfoService.getInterface();
  }

  @Put('interface')
  @HttpCode(HttpStatus.OK)
  async updateInterface(@Body() interfaceConfig: InterfaceConfigDto) {
    return this.siteInfoService.updateInterface(interfaceConfig);
  }

  // 品牌设置
  @Get('branding')
  async getSiteBranding(): Promise<BrandingConfigDto> {
    return this.siteInfoService.getSiteBranding();
  }

  @Put('branding')
  @HttpCode(HttpStatus.OK)
  async updateBranding(@Body() brandingConfig: BrandingConfigDto) {
    return this.siteInfoService.updateBranding(brandingConfig);
  }

  // 写作设置
  @Get('write')
  async getSiteWrite(): Promise<WriteConfigDto> {
    return this.siteInfoService.getSiteWrite();
  }

  @Put('write')
  @HttpCode(HttpStatus.OK)
  async updateSiteWrite(@Body() writeConfig: WriteConfigDto) {
    return this.siteInfoService.updateSiteWrite(writeConfig);
  }

  // 法律设置
  @Get('legal')
  async getSiteLegal(): Promise<LegalConfigDto> {
    return this.siteInfoService.getSiteLegal();
  }

  @Put('legal')
  @HttpCode(HttpStatus.OK)
  async updateSiteLegal(@Body() legalConfig: LegalConfigDto) {
    return this.siteInfoService.updateSiteLegal(legalConfig);
  }

  // SEO设置
  @Get('seo')
  async getSeo(): Promise<SeoConfigDto> {
    return this.siteInfoService.getSeo();
  }

  @Put('seo')
  @HttpCode(HttpStatus.OK)
  async updateSeo(@Body() seoConfig: SeoConfigDto) {
    return this.siteInfoService.updateSeo(seoConfig);
  }

  // 登录设置
  @Get('login')
  async getSiteLogin(): Promise<LoginConfigDto> {
    return this.siteInfoService.getSiteLogin();
  }

  @Put('login')
  @HttpCode(HttpStatus.OK)
  async updateSiteLogin(@Body() loginConfig: LoginConfigDto) {
    return this.siteInfoService.updateSiteLogin(loginConfig);
  }

  // 自定义CSS/HTML
  @Get('custom-css-html')
  async getSiteCustomCssHTML(): Promise<CustomCssHtmlConfigDto> {
    return this.siteInfoService.getSiteCustomCssHTML();
  }

  @Put('custom-css-html')
  @HttpCode(HttpStatus.OK)
  async updateSiteCustomCssHTML(@Body() customConfig: CustomCssHtmlConfigDto) {
    return this.siteInfoService.updateSiteCustomCssHTML(customConfig);
  }

  // 主题设置
  @Get('theme')
  async getSiteTheme(): Promise<ThemeConfigDto> {
    return this.siteInfoService.getSiteTheme();
  }

  @Put('theme')
  @HttpCode(HttpStatus.OK)
  async saveSiteTheme(@Body() themeConfig: ThemeConfigDto) {
    return this.siteInfoService.saveSiteTheme(themeConfig);
  }

  // 用户设置
  @Get('users')
  async getSiteUsers(): Promise<UsersConfigDto> {
    return this.siteInfoService.getSiteUsers();
  }

  @Put('users')
  @HttpCode(HttpStatus.OK)
  async updateSiteUsers(@Body() usersConfig: UsersConfigDto) {
    return this.siteInfoService.updateSiteUsers(usersConfig);
  }
}

@Controller('admin/setting')
@UseGuards(JwtAuthGuard, RolesGuard)
@RequireRoles('admin')
export class AdminSettingController {
  constructor(private readonly siteInfoService: SiteInfoService) {}

  // SMTP设置
  @Get('smtp')
  async getSMTPConfig(): Promise<SmtpConfigDto> {
    return this.siteInfoService.getSMTPConfig();
  }

  @Put('smtp')
  @HttpCode(HttpStatus.OK)
  async updateSMTPConfig(@Body() smtpConfig: SmtpConfigDto) {
    return this.siteInfoService.updateSMTPConfig(smtpConfig);
  }

  // 权限设置 - 与Go项目完全一致的API路径
  @Get('privileges')
  async getPrivilegesConfig(): Promise<PrivilegesConfigDto> {
    return this.siteInfoService.getPrivilegesConfig();
  }

  @Put('privileges')
  @HttpCode(HttpStatus.OK)
  async updatePrivilegesConfig(@Body() privilegesConfig: PrivilegesConfigDto) {
    return this.siteInfoService.updatePrivilegesConfig(privilegesConfig);
  }
}
