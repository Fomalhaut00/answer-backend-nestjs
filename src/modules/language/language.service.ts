import { Injectable } from '@nestjs/common';

@Injectable()
export class LanguageService {
  // 获取语言映射配置
  async getLangMapping() {
    return {
      'en-US': 'English',
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      'ja': '日本語',
      'ko': '한국어',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'ru': 'Русский',
      'pt': 'Português',
      'it': 'Italiano',
      'ar': 'العربية'
    };
  }

  // 获取用户语言选项
  async getUserLangOptions() {
    const langMapping = await this.getLangMapping();
    return Object.entries(langMapping).map(([code, name]) => ({
      label: name,
      value: code
    }));
  }

  // 获取管理员语言选项
  async getAdminLangOptions() {
    // 管理员可能有更多语言选项或不同的格式
    const langMapping = await this.getLangMapping();
    return Object.entries(langMapping).map(([code, name]) => ({
      label: `${name} (${code})`,
      value: code,
      is_default: code === 'en-US'
    }));
  }
}
