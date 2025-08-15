import { IsString, IsOptional, IsBoolean, IsNumber, IsUrl, IsEmail } from 'class-validator';

// 公开接口响应
export class SiteInfoResponse {
  general: {
    name: string;
    site_url: string;
    contact_email: string;
    description: string;
    short_description: string;
  };
  interface: {
    language: string;
    time_zone: string;
  };
  branding: {
    logo: string;
    mobile_logo: string;
    favicon: string;
  };
}

export class SiteLegalInfoResponse {
  terms_of_service_original_text: string;
  terms_of_service_parsed_text: string;
  privacy_policy_original_text: string;
  privacy_policy_parsed_text: string;
}

// 通用设置
export class GeneralConfigDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  site_url?: string;

  @IsEmail()
  @IsOptional()
  contact_email?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  short_description?: string;
}

// 界面设置
export class InterfaceConfigDto {
  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  time_zone?: string;

  @IsString()
  @IsOptional()
  default_avatar?: string;
}

// 品牌设置
export class BrandingConfigDto {
  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  mobile_logo?: string;

  @IsString()
  @IsOptional()
  favicon?: string;

  @IsString()
  @IsOptional()
  square_icon?: string;
}

// 写作设置
export class WriteConfigDto {
  @IsBoolean()
  @IsOptional()
  recommend_tags?: boolean;

  @IsBoolean()
  @IsOptional()
  required_tag?: boolean;

  @IsBoolean()
  @IsOptional()
  reserved_tags?: boolean;

  @IsString()
  @IsOptional()
  reserved_tags_list?: string;
}

// 法律设置
export class LegalConfigDto {
  @IsString()
  @IsOptional()
  terms_of_service_original_text?: string;

  @IsString()
  @IsOptional()
  privacy_policy_original_text?: string;
}

// SEO设置
export class SeoConfigDto {
  @IsString()
  @IsOptional()
  permalink?: string;

  @IsBoolean()
  @IsOptional()
  robots?: boolean;
}

// 登录设置
export class LoginConfigDto {
  @IsBoolean()
  @IsOptional()
  allow_new_registrations?: boolean;

  @IsBoolean()
  @IsOptional()
  login_required?: boolean;

  @IsString()
  @IsOptional()
  allow_email_registrations?: string;

  @IsString()
  @IsOptional()
  allow_email_domains?: string;
}

// 自定义CSS/HTML设置
export class CustomCssHtmlConfigDto {
  @IsString()
  @IsOptional()
  custom_css?: string;

  @IsString()
  @IsOptional()
  custom_head?: string;

  @IsString()
  @IsOptional()
  custom_header?: string;

  @IsString()
  @IsOptional()
  custom_footer?: string;

  @IsString()
  @IsOptional()
  custom_sidebar?: string;
}

// 主题设置
export class ThemeConfigDto {
  @IsString()
  @IsOptional()
  theme?: string;

  @IsString()
  @IsOptional()
  navbar_style?: string;

  @IsString()
  @IsOptional()
  primary_color?: string;
}

// 用户设置
export class UsersConfigDto {
  @IsBoolean()
  @IsOptional()
  allow_update_display_name?: boolean;

  @IsBoolean()
  @IsOptional()
  allow_update_username?: boolean;

  @IsBoolean()
  @IsOptional()
  allow_update_avatar?: boolean;

  @IsBoolean()
  @IsOptional()
  allow_update_bio?: boolean;

  @IsBoolean()
  @IsOptional()
  allow_update_website?: boolean;

  @IsBoolean()
  @IsOptional()
  allow_update_location?: boolean;

  @IsString()
  @IsOptional()
  default_avatar?: string;

  @IsNumber()
  @IsOptional()
  gravatar_base_url?: number;
}

// SMTP设置
export class SmtpConfigDto {
  @IsString()
  @IsOptional()
  from_email?: string;

  @IsString()
  @IsOptional()
  from_name?: string;

  @IsString()
  @IsOptional()
  smtp_host?: string;

  @IsNumber()
  @IsOptional()
  smtp_port?: number;

  @IsString()
  @IsOptional()
  smtp_username?: string;

  @IsString()
  @IsOptional()
  smtp_password?: string;

  @IsString()
  @IsOptional()
  smtp_authentication?: string;

  @IsBoolean()
  @IsOptional()
  smtp_encryption?: boolean;

  @IsBoolean()
  @IsOptional()
  register_title?: boolean;

  @IsString()
  @IsOptional()
  register_body?: string;

  @IsString()
  @IsOptional()
  pass_reset_title?: string;

  @IsString()
  @IsOptional()
  pass_reset_body?: string;

  @IsString()
  @IsOptional()
  change_title?: string;

  @IsString()
  @IsOptional()
  change_body?: string;

  @IsString()
  @IsOptional()
  test_email_recipient?: string;
}

// 权限设置
export class PrivilegesConfigDto {
  @IsNumber()
  @IsOptional()
  level?: number;

  options?: {
    [key: string]: {
      level: number;
      [key: string]: any;
    };
  };
}
