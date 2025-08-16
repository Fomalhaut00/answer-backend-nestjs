import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionGroupController } from './collection-group.controller';
import { CollectionGroupService } from './collection-group.service';
import { CollectionGroup } from '../../entities/collection-group.entity';
import { Collection } from '../../entities/collection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollectionGroup, Collection])
  ],
  controllers: [CollectionGroupController],
  providers: [CollectionGroupService],
  exports: [CollectionGroupService],
})
export class CollectionGroupModule {}
