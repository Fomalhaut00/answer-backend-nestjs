import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum NotificationType {
  INBOX = 1,
  ACHIEVEMENT = 2,
}

export enum NotificationStatus {
  UNREAD = 1,
  READ = 2,
}

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'user_id', type: 'int' })
  userId: string;

  @Column({ name: 'object_id', type: 'int' })
  objectId: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'type', type: 'int', default: NotificationType.INBOX })
  type: NotificationType;

  @Column({ name: 'is_read', type: 'int', default: NotificationStatus.UNREAD })
  isRead: NotificationStatus;

  @Column({ name: 'msg_type', type: 'int', default: 1 })
  msgType: number;
}
