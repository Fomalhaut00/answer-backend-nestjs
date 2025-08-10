import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';
import { User } from '../../entities/user.entity';
import { Tag } from '../../entities/tag.entity';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Answer, User, Tag])],
  providers: [SearchService],
  controllers: [SearchController],
  exports: [SearchService],
})
export class SearchModule {}
