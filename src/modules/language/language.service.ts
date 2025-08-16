import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Config } from '../../entities/config.entity';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>,
  ) {}
  // 获取语言映射配置
  async getLangMapping() {
    // 从数据库获取默认语言配置
    const defaultLangConfig = await this.configRepository.findOne({
      where: { key: 'default_language' }
    });

    const defaultLang = defaultLangConfig?.value || 'en-US';

    const languages = {
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
      'ar': 'العربية',
      'hi': 'हिन्दी',
      'th': 'ไทย',
      'vi': 'Tiếng Việt',
      'id': 'Bahasa Indonesia',
      'ms': 'Bahasa Melayu',
      'tr': 'Türkçe',
      'pl': 'Polski',
      'nl': 'Nederlands',
      'sv': 'Svenska',
      'da': 'Dansk',
      'no': 'Norsk',
      'fi': 'Suomi',
      'cs': 'Čeština',
      'sk': 'Slovenčina',
      'hu': 'Magyar',
      'ro': 'Română',
      'bg': 'Български',
      'hr': 'Hrvatski',
      'sr': 'Српски',
      'sl': 'Slovenščina',
      'et': 'Eesti',
      'lv': 'Latviešu',
      'lt': 'Lietuvių',
      'uk': 'Українська',
      'he': 'עברית',
      'fa': 'فارسی'
    };

    return {
      languages,
      default_language: defaultLang
    };
  }

  // 获取用户语言选项
  async getUserLangOptions() {
    const { languages, default_language } = await this.getLangMapping();
    return Object.entries(languages).map(([code, name]) => ({
      label: name,
      value: code,
      is_default: code === default_language
    }));
  }

  // 获取管理员语言选项
  async getAdminLangOptions() {
    const { languages, default_language } = await this.getLangMapping();
    return Object.entries(languages).map(([code, name]) => ({
      label: `${name} (${code})`,
      value: code,
      is_default: code === default_language,
      enabled: true // 管理员可以看到所有语言选项
    }));
  }

  // 设置默认语言（管理员功能）
  async setDefaultLanguage(languageCode: string): Promise<{ message: string }> {
    const { languages } = await this.getLangMapping();

    if (!languages[languageCode]) {
      throw new Error('Invalid language code');
    }

    // 更新或创建默认语言配置
    let config = await this.configRepository.findOne({
      where: { key: 'default_language' }
    });

    if (config) {
      config.value = languageCode;
    } else {
      config = this.configRepository.create({
        key: 'default_language',
        value: languageCode
      });
    }

    await this.configRepository.save(config);

    return { message: 'Default language updated successfully' };
  }

  // 获取当前默认语言
  async getDefaultLanguage(): Promise<{ language: string; name: string }> {
    const { languages, default_language } = await this.getLangMapping();

    return {
      language: default_language,
      name: languages[default_language] || 'English'
    };
  }

  // 检查语言代码是否有效
  async isValidLanguageCode(code: string): Promise<boolean> {
    const { languages } = await this.getLangMapping();
    return !!languages[code];
  }

  // 获取语言的本地化名称
  async getLanguageName(code: string): Promise<string> {
    const { languages } = await this.getLangMapping();
    return languages[code] || 'Unknown';
  }
}
