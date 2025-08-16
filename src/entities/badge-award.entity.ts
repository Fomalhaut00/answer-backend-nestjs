import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Badge } from './badge.entity';

@Entity('badge_award')
export class BadgeAward {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'user_id', type: 'int', comment: 'user id' })
  userId: string;

  @Column({ name: 'badge_id', type: 'int', comment: 'badge id' })
  badgeId: string;

  @Column({ name: 'award_key', type: 'varchar', length: 255, comment: 'award key' })
  awardKey: string;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Badge)
  @JoinColumn({ name: 'badge_id' })
  badge: Badge;
}
