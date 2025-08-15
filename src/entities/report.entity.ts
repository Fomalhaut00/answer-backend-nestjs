import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('report')
export class Report {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'user_id', type: 'int', comment: 'reporter user id' })
  userId: string;

  @Column({ name: 'object_id', type: 'int', comment: 'reported object id' })
  objectId: string;

  @Column({ name: 'object_type', type: 'varchar', length: 100, comment: 'reported object type: question, answer, comment' })
  objectType: string;

  @Column({ name: 'report_type', type: 'varchar', length: 100, comment: 'report type: spam, abuse, copyright, other' })
  reportType: string;

  @Column({ type: 'text', comment: 'report content/reason' })
  content: string;

  @Column({ type: 'varchar', length: 50, default: 'pending', comment: 'report status: pending, approved, rejected' })
  status: string;

  @Column({ name: 'reviewer_id', type: 'int', nullable: true, comment: 'reviewer user id' })
  reviewerId?: string;

  @Column({ name: 'review_reason', type: 'text', nullable: true, comment: 'review reason' })
  reviewReason?: string;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true, comment: 'review time' })
  reviewedAt?: Date;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer?: User;
}
