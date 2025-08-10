import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '../../entities/answer.entity';
import { Question } from '../../entities/question.entity';
import { User } from '../../entities/user.entity';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Question, User])],
  providers: [AnswerService],
  controllers: [AnswerController],
  exports: [AnswerService],
})
export class AnswerModule {}
