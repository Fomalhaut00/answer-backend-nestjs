import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Activity } from '../entities/activity.entity';
import { User } from '../entities/user.entity';
import { Question } from '../entities/question.entity';
import { Role } from '../entities/role.entity';
import { UserRoleRel } from '../entities/user-role-rel.entity';
import { Power } from '../entities/power.entity';
import { RolePowerRel } from '../entities/role-power-rel.entity';
import { Answer } from '../entities/answer.entity';
import { Comment } from '../entities/comment.entity';

import { Tag } from '../entities/tag.entity';
import { TagRel } from '../entities/tag-rel.entity';
import { Notification } from '../entities/notification.entity';
import { Config } from '../entities/config.entity';
import { Collection } from '../entities/collection.entity';
import { CollectionGroup } from '../entities/collection-group.entity';
import { Report } from '../entities/report.entity';
import { Meta } from '../entities/meta.entity';
import { Revision } from '../entities/revision.entity';
import { QuestionLink } from '../entities/question-link.entity';
import { Review } from '../entities/review.entity';
import { SiteInfo } from '../entities/site-info.entity';
import { Uniqid } from '../entities/uniqid.entity';
import { Version } from '../entities/version.entity';
import { UserExternalLogin } from '../entities/user-external-login.entity';
import { UserNotificationConfig } from '../entities/user-notification-config.entity';
import { Badge } from '../entities/badge.entity';
import { BadgeGroup } from '../entities/badge-group.entity';
import { BadgeAward } from '../entities/badge-award.entity';
import { PluginConfig } from '../entities/plugin-config.entity';
import { PluginUserConfig } from '../entities/plugin-user-config.entity';
import { PluginKVStorage } from '../entities/plugin-kv-storage.entity';
import { FileRecord } from '../entities/file-record.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'answer_db',
  entities: [
    User,
    Activity,
    Question,
    Role,
    UserRoleRel,
    Power,
    RolePowerRel,
    Answer,
    Comment,

    Tag,
    TagRel,
    Notification,
    Config,
    Collection,
    CollectionGroup,
    Report,
    Meta,
    Revision,
    QuestionLink,
    Review,
    SiteInfo,
    Uniqid,
    Version,
    UserExternalLogin,
    UserNotificationConfig,
    Badge,
    BadgeGroup,
    BadgeAward,
    PluginConfig,
    PluginUserConfig,
    PluginKVStorage,
    FileRecord,
  ],
  synchronize: true, // 开发环境可以使用，生产环境建议关闭
  logging: true,
};