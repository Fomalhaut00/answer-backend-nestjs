import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'object_id', type: 'int', comment: 'object id' })
  objectId: string;

  @Column({ name: 'object_type', type: 'varchar', length: 100, comment: 'object type: question, answer, tag' })
  objectType: string;

  @Column({ name: 'user_id', type: 'int', comment: 'reviewer user id' })
  userId: string;

  @Column({ name: 'status', type: 'int', default: 1, comment: 'review status: 1=pending, 2=approved, 3=rejected' })
  status: number;

  @Column({ name: 'reason', type: 'text', nullable: true, comment: 'review reason' })
  reason?: string;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
