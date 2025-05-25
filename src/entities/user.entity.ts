import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum UserStatus {
  AVAILABLE = 1,
  SUSPENDED = 9,
  DELETED = 10,
}

export enum EmailStatus {
  AVAILABLE = 1,
  TO_BE_VERIFIED = 2,
}

@Entity('user')
export class User extends BaseEntity {
  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 255, select: false })
  pass: string;

  @Column({ name: 'e_mail', length: 100 })
  email: string;

  @Column({ name: 'mail_status', type: 'int', default: EmailStatus.TO_BE_VERIFIED })
  mailStatus: EmailStatus;

  @Column({ name: 'notice_status', type: 'int', default: 2 })
  noticeStatus: number;

  @Column({ name: 'follow_count', type: 'int', default: 0 })
  followCount: number;

  @Column({ name: 'answer_count', type: 'int', default: 0 })
  answerCount: number;

  @Column({ name: 'question_count', type: 'int', default: 0 })
  questionCount: number;

  @Column({ type: 'int', default: 0 })
  rank: number;

  @Column({ type: 'int', default: UserStatus.AVAILABLE })
  status: UserStatus;

  @Column({ name: 'authority_group', type: 'int', default: 1 })
  authorityGroup: number;

  @Column({ name: 'display_name', length: 30, default: '' })
  displayName: string;

  @Column({ length: 1024, default: '' })
  avatar: string;

  @Column({ length: 20 })
  mobile: string;

  @Column({ type: 'text' })
  bio: string;

  @Column({ name: 'bio_html', type: 'text' })
  bioHTML: string;

  @Column({ length: 255, default: '' })
  website: string;

  @Column({ length: 100, default: '' })
  location: string;

  @Column({ name: 'ip_info', length: 255, default: '' })
  ipInfo: string;

  @Column({ name: 'is_admin', type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ length: 100, default: '' })
  language: string;

  @Column({ name: 'color_scheme', length: 100, default: '' })
  colorScheme: string;

  @Column({ name: 'suspended_at', type: 'timestamp', nullable: true })
  suspendedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ name: 'last_login_date', type: 'timestamp', nullable: true })
  lastLoginDate: Date;
} 