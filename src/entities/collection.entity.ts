import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { CollectionGroup } from './collection-group.entity';

@Entity('collection')
export class Collection {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'user_id', type: 'int', comment: 'user id' })
  userId: string;

  @Column({ name: 'object_id', type: 'int', comment: 'object id' })
  objectId: string;

  @Column({ name: 'object_type', type: 'varchar', length: 100, comment: 'object type: question, answer' })
  objectType: string;

  @Column({ name: 'user_collection_group_id', type: 'int', nullable: true, comment: 'user collection group id' })
  collectionGroupId?: string;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => CollectionGroup, { nullable: true })
  @JoinColumn({ name: 'user_collection_group_id' })
  collectionGroup?: CollectionGroup;
}
