import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('revision')
export class Revision {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'object_id', type: 'int', comment: 'object id' })
  objectId: string;

  @Column({ name: 'object_type', type: 'varchar', length: 100, comment: 'object type: question, answer, tag' })
  objectType: string;

  @Column({ name: 'title', type: 'varchar', length: 255, comment: 'revision title' })
  title: string;

  @Column({ name: 'content', type: 'text', comment: 'revision content' })
  content: string;

  @Column({ name: 'log', type: 'varchar', length: 255, nullable: true, comment: 'revision log' })
  log?: string;

  @Column({ name: 'user_id', type: 'int', comment: 'user id' })
  userId: string;

  @Column({ name: 'status', type: 'int', default: 1, comment: 'revision status: 1=normal, 2=deleted' })
  status: number;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
