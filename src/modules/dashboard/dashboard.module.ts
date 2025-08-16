import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../../entities/user.entity';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';
import { Comment } from '../../entities/comment.entity';
import { Activity } from '../../entities/activity.entity';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Question, Answer, Comment, Activity]),
    RoleModule
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
