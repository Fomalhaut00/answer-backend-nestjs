import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at: Date;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @Column({ type: 'bigint', name: 'trigger_user_id', default: 0 })
  triggerUserId: number;

  @Column({ type: 'bigint', name: 'object_id', default: 0 })
  objectId: number;

  @Column({ type: 'bigint', name: 'original_object_id', default: 0 })
  originalObjectId: number;

  @Column({ type: 'int', name: 'activity_type' })
  activityType: number;

  @Column({ type: 'smallint', default: 0 })
  cancelled: number;

  @Column({ type: 'int', default: 0 })
  rank: number;

  @Column({ type: 'smallint', name: 'has_rank', default: 0 })
  hasRank: number;

  @Column({ type: 'bigint', name: 'revision_id', default: 0 })
  revisionId: number;
} 