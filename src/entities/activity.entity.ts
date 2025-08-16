import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('activity')
export class Activity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at: Date;

  @Column({ type: 'int', name: 'user_id' })
  userId: string;

  @Column({ type: 'int', name: 'trigger_user_id', default: 0 })
  triggerUserId: string;

  @Column({ type: 'int', name: 'object_id', default: 0 })
  objectId: string;

  @Column({ type: 'int', name: 'original_object_id', default: 0 })
  originalObjectId: string;

  @Column({ type: 'int', name: 'activity_type' })
  activityType: number;

  @Column({ type: 'smallint', default: 0 })
  cancelled: number;

  @Column({ type: 'int', default: 0 })
  rank: number;

  @Column({ type: 'smallint', name: 'has_rank', default: 0 })
  hasRank: number;

  @Column({ type: 'int', name: 'revision_id', default: 0 })
  revisionId: number;
} 