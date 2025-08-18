import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../../entities/tag.entity';
import { TagRel } from '../../entities/tag-rel.entity';
import { User } from '../../entities/user.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TagsController } from './tags.controller';
import { QuestionTagsController } from './question-tags.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, TagRel, User])],
  providers: [TagService],
  controllers: [TagController, TagsController, QuestionTagsController],
  exports: [TagService],
})
export class TagModule {}
