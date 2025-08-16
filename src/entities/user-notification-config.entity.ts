import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_notification_config')
export class UserNotificationConfig {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'user_id', type: 'int', comment: 'user id' })
  userId: string;

  @Column({ name: 'inbox', type: 'int', default: 1, comment: 'inbox notification: 1=on, 2=off' })
  inbox: number;

  @Column({ name: 'all_new_question', type: 'int', default: 1, comment: 'all new question: 1=on, 2=off' })
  allNewQuestion: number;

  @Column({ name: 'all_new_question_for_following_tags', type: 'int', default: 1, comment: 'new question for following tags: 1=on, 2=off' })
  allNewQuestionForFollowingTags: number;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
