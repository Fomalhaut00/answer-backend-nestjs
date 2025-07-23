import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Activity } from '../entities/activity.entity';
import { User } from '../entities/user.entity';
import { Question } from '../entities/question.entity';
import { Role } from '../entities/role.entity';
import { UserRoleRel } from '../entities/user-role-rel.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Aaa123456',
  database: 'answer_db',
  entities: [User, Activity, Question, Role, UserRoleRel],
  synchronize: true, // 开发环境可以使用，生产环境建议关闭
  logging: true,
}; 