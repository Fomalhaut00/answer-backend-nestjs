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
import { Vote } from '../entities/vote.entity';
import { Tag } from '../entities/tag.entity';
import { TagRel } from '../entities/tag-rel.entity';
import { Notification } from '../entities/notification.entity';

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
    Vote,
    Tag,
    TagRel,
    Notification
  ],
  synchronize: true, // 开发环境可以使用，生产环境建议关闭
  logging: true,
};