import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from '../../entities/vote.entity';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';
import { Comment } from '../../entities/comment.entity';
import { User } from '../../entities/user.entity';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Question, Answer, Comment, User])],
  providers: [VoteService],
  controllers: [VoteController],
  exports: [VoteService],
})
export class VoteModule {}
