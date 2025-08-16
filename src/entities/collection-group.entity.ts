import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('collection_group')
export class CollectionGroup {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'user_id', type: 'int', comment: 'user id' })
  userId: string;

  @Column({ name: 'name', type: 'varchar', length: 50, comment: 'collection group name' })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 200, nullable: true, comment: 'collection group description' })
  description?: string;

  @Column({ name: 'default_group', type: 'int', default: 1, comment: 'is default group: 1=default, 2=custom' })
  defaultGroup: number;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
