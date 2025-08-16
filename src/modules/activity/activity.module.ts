import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../../entities/activity.entity';
import { User } from '../../entities/user.entity';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';
import { Comment } from '../../entities/comment.entity';
import { ActivityService } from './activity.service';
import { ActivityController, VoteController } from './activity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, User, Question, Answer, Comment])],
  providers: [ActivityService],
  controllers: [ActivityController, VoteController],
  exports: [ActivityService],
})
export class ActivityModule {}
