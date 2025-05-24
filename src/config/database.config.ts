import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Activity } from '../entities/activity.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'answer_db',
  entities: [Activity],
  synchronize: true, // 开发环境可以使用，生产环境建议关闭
  logging: true,
}; 