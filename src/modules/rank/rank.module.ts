import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankController } from './rank.controller';
import { RankService } from './rank.service';
import { User } from '../../entities/user.entity';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';
import { Activity } from '../../entities/activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Question, Answer, Activity])
  ],
  controllers: [RankController],
  providers: [RankService],
  exports: [RankService],
})
export class RankModule {}
