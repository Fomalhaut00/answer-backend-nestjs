import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Config } from '../../entities/config.entity';
import {
  ReasonReqDto,
  ReasonItemDto,
  ReasonListResponseDto
} from './dto/reason.dto';

@Injectable()
export class ReasonService {
  constructor(
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>,
  ) {}

  // 获取原因列表（对应Go的ListReasons方法）
  async getReasons(req: ReasonReqDto): Promise<ReasonListResponseDto> {
    const { object_type, action } = req;

    // 构建原因配置键，格式：{object_type}.{action}.reasons
    const reasonAction = `${object_type}.${action}.reasons`;

    // 从Config表获取原因键列表
    const reasonKeysConfig = await this.configRepository.findOne({
      where: { key: reasonAction }
    });

    if (!reasonKeysConfig) {
      return { reasons: [] };
    }

    let reasonKeys: string[] = [];
    try {
      reasonKeys = JSON.parse(reasonKeysConfig.value);
    } catch (error) {
      console.error('Failed to parse reason keys:', error);
      return { reasons: [] };
    }

    const reasons: ReasonItemDto[] = [];

    // 遍历每个原因键，获取详细配置
    for (const reasonKey of reasonKeys) {
      const reasonConfig = await this.configRepository.findOne({
        where: { key: reasonKey }
      });

      if (!reasonConfig) {
        continue;
      }

      try {
        const reasonData = JSON.parse(reasonConfig.value);

        const reasonItem: ReasonItemDto = {
          reason_key: reasonKey,
          reason_type: parseInt(reasonConfig.id), // 使用config的ID作为reason_type
          name: reasonData.name || '',
          description: reasonData.description || reasonData.desc || '',
          content_type: reasonData.content_type || 'text',
          placeholder: reasonData.placeholder || ''
        };

        reasons.push(reasonItem);
      } catch (error) {
        console.error(`Failed to parse reason config for key ${reasonKey}:`, error);
        continue;
      }
    }

    return { reasons };
  }

  // 初始化默认原因配置（对应Go项目的默认配置）
  async initializeDefaultReasons(): Promise<void> {
    const defaultConfigs = [
      // 问题关闭原因
      {
        key: 'question.close.reasons',
        value: JSON.stringify([
          'reason.question.close.duplicate',
          'reason.question.close.guideline',
          'reason.question.close.multiple',
          'reason.question.close.other'
        ])
      },
      {
        key: 'reason.question.close.duplicate',
        value: JSON.stringify({
          name: 'Duplicate',
          desc: 'This question has been asked before and already has an answer.',
          content_type: 'text',
          placeholder: 'Please provide the link to the original question.'
        })
      },
      {
        key: 'reason.question.close.guideline',
        value: JSON.stringify({
          name: 'A community-specific reason',
          desc: 'This question doesn\'t meet a community guideline.',
          content_type: 'text',
          placeholder: 'Please explain which guideline this question doesn\'t meet.'
        })
      },

      {
        key: 'reason.question.close.multiple',
        value: JSON.stringify({
          name: 'Needs more focus',
          desc: 'This question currently includes multiple questions in one.',
          content_type: 'text',
          placeholder: 'Please explain what makes this question unfocused.'
        })
      },
      {
        key: 'reason.question.close.other',
        value: JSON.stringify({
          name: 'Other',
          desc: 'This question doesn\'t meet our guidelines.',
          content_type: 'textarea',
          placeholder: 'Please explain in detail.'
        })
      },

      // 举报原因
      {
        key: 'question.flag.reasons',
        value: JSON.stringify([
          'reason.spam',
          'reason.rude_or_abusive',
          'reason.harassment',
          'reason.other'
        ])
      },
      {
        key: 'answer.flag.reasons',
        value: JSON.stringify([
          'reason.spam',
          'reason.rude_or_abusive',
          'reason.harassment',
          'reason.not_answer',
          'reason.other'
        ])
      },
      {
        key: 'reason.spam',
        value: JSON.stringify({
          name: 'Spam',
          desc: 'This post is an advertisement, or vandalism.',
          content_type: 'text',
          placeholder: ''
        })
      },
      {
        key: 'reason.rude_or_abusive',
        value: JSON.stringify({
          name: 'Rude or abusive',
          desc: 'A reasonable person would find this content inappropriate.',
          content_type: 'text',
          placeholder: ''
        })
      },
      {
        key: 'reason.harassment',
        value: JSON.stringify({
          name: 'Harassment, bigotry, or abuse',
          desc: 'This content targets a person or group.',
          content_type: 'text',
          placeholder: ''
        })
      },
      {
        key: 'reason.not_answer',
        value: JSON.stringify({
          name: 'Not an answer',
          desc: 'This was posted as an answer, but it does not attempt to answer the question.',
          content_type: 'text',
          placeholder: ''
        })
      },
      {
        key: 'reason.other',
        value: JSON.stringify({
          name: 'Other',
          desc: 'Something else that requires moderator attention.',
          content_type: 'textarea',
          placeholder: 'Please explain in detail.'
        })
      }
    ];

    // 检查并创建默认配置
    for (const config of defaultConfigs) {
      const existing = await this.configRepository.findOne({
        where: { key: config.key }
      });

      if (!existing) {
        const newConfig = this.configRepository.create({
          key: config.key,
          value: config.value
        });
        await this.configRepository.save(newConfig);
      }
    }
  }
}
