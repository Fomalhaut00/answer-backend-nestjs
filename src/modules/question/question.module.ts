import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../../entities/question.entity';
import { User } from '../../entities/user.entity';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { AdminQuestionController } from './admin-question.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Question, User])],
  providers: [QuestionService],
  controllers: [QuestionController, AdminQuestionController],
  exports: [QuestionService],
})
export class QuestionModule {}