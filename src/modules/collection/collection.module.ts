import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionController, PersonalCollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { Collection } from '../../entities/collection.entity';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, Question, Answer]), RoleModule],
  controllers: [CollectionController, PersonalCollectionController],
  providers: [CollectionService],
  exports: [CollectionService],
})
export class CollectionModule {}
