import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Config } from '../../entities/config.entity';
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

@Injectable()
export class SiteInfoService {
  constructor(
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>,
  ) {}

  // 获取站点基本信息 (公开接口)
  async getSiteInfo(): Promise<SiteInfoResponse> {
    const configs = await this.getConfigsByKeys([
      'general.name',
      'general.site_url',
      'general.contact_email',
      'general.description',
      'general.short_description',
      'interface.language',
      'interface.time_zone',
      'branding.logo',
      'branding.mobile_logo',
      'branding.favicon'
    ]);

    return {
      general: {
        name: configs['general.name'] || 'Answer',
        site_url: configs['general.site_url'] || '',
        contact_email: configs['general.contact_email'] || '',
        description: configs['general.description'] || '',
        short_description: configs['general.short_description'] || ''
      },
      interface: {
        language: configs['interface.language'] || 'en-US',
        time_zone: configs['interface.time_zone'] || 'UTC'
      },
      branding: {
        logo: configs['branding.logo'] || '',
        mobile_logo: configs['branding.mobile_logo'] || '',
        favicon: configs['branding.favicon'] || ''
      }
    };
  }

  // 获取法律信息 (公开接口)
  async getSiteLegalInfo(): Promise<SiteLegalInfoResponse> {
    const configs = await this.getConfigsByKeys([
      'legal.terms_of_service_original_text',
      'legal.privacy_policy_original_text'
    ]);

    return {
      terms_of_service_original_text: configs['legal.terms_of_service_original_text'] || '',
      terms_of_service_parsed_text: configs['legal.terms_of_service_original_text'] || '',
      privacy_policy_original_text: configs['legal.privacy_policy_original_text'] || '',
      privacy_policy_parsed_text: configs['legal.privacy_policy_original_text'] || ''
    };
  }

  // 通用设置
  async getGeneral(): Promise<GeneralConfigDto> {
    const configs = await this.getConfigsByKeys([
      'general.name',
      'general.site_url',
      'general.contact_email',
      'general.description',
      'general.short_description'
    ]);

    return {
      name: configs['general.name'],
      site_url: configs['general.site_url'],
      contact_email: configs['general.contact_email'],
      description: configs['general.description'],
      short_description: configs['general.short_description']
    };
  }

  async updateGeneral(generalConfig: GeneralConfigDto) {
    await this.updateConfigs('general', generalConfig);
    return { message: 'General settings updated successfully' };
  }

  // 界面设置
  async getInterface(): Promise<InterfaceConfigDto> {
    const configs = await this.getConfigsByKeys([
      'interface.language',
      'interface.time_zone',
      'interface.default_avatar'
    ]);

    return {
      language: configs['interface.language'],
      time_zone: configs['interface.time_zone'],
      default_avatar: configs['interface.default_avatar']
    };
  }

  async updateInterface(interfaceConfig: InterfaceConfigDto) {
    await this.updateConfigs('interface', interfaceConfig);
    return { message: 'Interface settings updated successfully' };
  }

  // 品牌设置
  async getSiteBranding(): Promise<BrandingConfigDto> {
    const configs = await this.getConfigsByKeys([
      'branding.logo',
      'branding.mobile_logo',
      'branding.favicon',
      'branding.square_icon'
    ]);

    return {
      logo: configs['branding.logo'],
      mobile_logo: configs['branding.mobile_logo'],
      favicon: configs['branding.favicon'],
      square_icon: configs['branding.square_icon']
    };
  }

  async updateBranding(brandingConfig: BrandingConfigDto) {
    await this.updateConfigs('branding', brandingConfig);
    return { message: 'Branding settings updated successfully' };
  }

  // 写作设置
  async getSiteWrite(): Promise<WriteConfigDto> {
    const configs = await this.getConfigsByKeys([
      'write.recommend_tags',
      'write.required_tag',
      'write.reserved_tags',
      'write.reserved_tags_list'
    ]);

    return {
      recommend_tags: configs['write.recommend_tags'] === 'true',
      required_tag: configs['write.required_tag'] === 'true',
      reserved_tags: configs['write.reserved_tags'] === 'true',
      reserved_tags_list: configs['write.reserved_tags_list']
    };
  }

  async updateSiteWrite(writeConfig: WriteConfigDto) {
    await this.updateConfigs('write', writeConfig);
    return { message: 'Write settings updated successfully' };
  }

  // 法律设置
  async getSiteLegal(): Promise<LegalConfigDto> {
    const configs = await this.getConfigsByKeys([
      'legal.terms_of_service_original_text',
      'legal.privacy_policy_original_text'
    ]);

    return {
      terms_of_service_original_text: configs['legal.terms_of_service_original_text'],
      privacy_policy_original_text: configs['legal.privacy_policy_original_text']
    };
  }

  async updateSiteLegal(legalConfig: LegalConfigDto) {
    await this.updateConfigs('legal', legalConfig);
    return { message: 'Legal settings updated successfully' };
  }

  // SEO设置
  async getSeo(): Promise<SeoConfigDto> {
    const configs = await this.getConfigsByKeys([
      'seo.permalink',
      'seo.robots'
    ]);

    return {
      permalink: configs['seo.permalink'],
      robots: configs['seo.robots'] === 'true'
    };
  }

  async updateSeo(seoConfig: SeoConfigDto) {
    await this.updateConfigs('seo', seoConfig);
    return { message: 'SEO settings updated successfully' };
  }

  // 登录设置
  async getSiteLogin(): Promise<LoginConfigDto> {
    const configs = await this.getConfigsByKeys([
      'login.allow_new_registrations',
      'login.login_required',
      'login.allow_email_registrations',
      'login.allow_email_domains'
    ]);

    return {
      allow_new_registrations: configs['login.allow_new_registrations'] === 'true',
      login_required: configs['login.login_required'] === 'true',
      allow_email_registrations: configs['login.allow_email_registrations'],
      allow_email_domains: configs['login.allow_email_domains']
    };
  }

  async updateSiteLogin(loginConfig: LoginConfigDto) {
    await this.updateConfigs('login', loginConfig);
    return { message: 'Login settings updated successfully' };
  }

  // 自定义CSS/HTML
  async getSiteCustomCssHTML(): Promise<CustomCssHtmlConfigDto> {
    const configs = await this.getConfigsByKeys([
      'custom.css',
      'custom.head',
      'custom.header',
      'custom.footer',
      'custom.sidebar'
    ]);

    return {
      custom_css: configs['custom.css'],
      custom_head: configs['custom.head'],
      custom_header: configs['custom.header'],
      custom_footer: configs['custom.footer'],
      custom_sidebar: configs['custom.sidebar']
    };
  }

  async updateSiteCustomCssHTML(customConfig: CustomCssHtmlConfigDto) {
    await this.updateConfigs('custom', customConfig);
    return { message: 'Custom CSS/HTML updated successfully' };
  }

  // 主题设置
  async getSiteTheme(): Promise<ThemeConfigDto> {
    const configs = await this.getConfigsByKeys([
      'theme.theme',
      'theme.navbar_style',
      'theme.primary_color'
    ]);

    return {
      theme: configs['theme.theme'],
      navbar_style: configs['theme.navbar_style'],
      primary_color: configs['theme.primary_color']
    };
  }

  async saveSiteTheme(themeConfig: ThemeConfigDto) {
    await this.updateConfigs('theme', themeConfig);
    return { message: 'Theme settings saved successfully' };
  }

  // 用户设置
  async getSiteUsers(): Promise<UsersConfigDto> {
    const configs = await this.getConfigsByKeys([
      'users.allow_update_display_name',
      'users.allow_update_username',
      'users.allow_update_avatar',
      'users.allow_update_bio',
      'users.allow_update_website',
      'users.allow_update_location',
      'users.default_avatar',
      'users.gravatar_base_url'
    ]);

    return {
      allow_update_display_name: configs['users.allow_update_display_name'] === 'true',
      allow_update_username: configs['users.allow_update_username'] === 'true',
      allow_update_avatar: configs['users.allow_update_avatar'] === 'true',
      allow_update_bio: configs['users.allow_update_bio'] === 'true',
      allow_update_website: configs['users.allow_update_website'] === 'true',
      allow_update_location: configs['users.allow_update_location'] === 'true',
      default_avatar: configs['users.default_avatar'],
      gravatar_base_url: parseInt(configs['users.gravatar_base_url']) || 0
    };
  }

  async updateSiteUsers(usersConfig: UsersConfigDto) {
    await this.updateConfigs('users', usersConfig);
    return { message: 'Users settings updated successfully' };
  }

  // SMTP设置
  async getSMTPConfig(): Promise<SmtpConfigDto> {
    // 实现SMTP配置获取逻辑
    return {
      from_email: '',
      from_name: '',
      smtp_host: '',
      smtp_port: 587,
      smtp_username: '',
      smtp_password: '',
      smtp_authentication: 'plain',
      smtp_encryption: false
    };
  }

  async updateSMTPConfig(smtpConfig: SmtpConfigDto) {
    await this.updateConfigs('smtp', smtpConfig);
    return { message: 'SMTP settings updated successfully' };
  }

  // 权限设置
  async getPrivilegesConfig(): Promise<PrivilegesConfigDto> {
    // 实现权限配置获取逻辑
    return {
      level: 1,
      options: {}
    };
  }

  async updatePrivilegesConfig(privilegesConfig: PrivilegesConfigDto) {
    await this.updateConfigs('privileges', privilegesConfig);
    return { message: 'Privileges settings updated successfully' };
  }

  // 辅助方法
  private async getConfigsByKeys(keys: string[]): Promise<Record<string, string>> {
    const configs = await this.configRepository.find({
      where: keys.map(key => ({ key }))
    });

    const result: Record<string, string> = {};
    configs.forEach(config => {
      result[config.key] = config.value;
    });

    return result;
  }

  private async updateConfigs(prefix: string, data: any) {
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        const configKey = `${prefix}.${key}`;
        let config = await this.configRepository.findOne({ where: { key: configKey } });
        
        if (config) {
          config.value = String(value);
          await this.configRepository.save(config);
        } else {
          config = this.configRepository.create({
            key: configKey,
            value: String(value)
          });
          await this.configRepository.save(config);
        }
      }
    }
  }
}
