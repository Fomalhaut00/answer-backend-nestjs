import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum QuestionStatus {
  AVAILABLE = 1,
  CLOSED = 2,
  DELETED = 10,
  PENDING = 11,
}

export enum QuestionPin {
  UNPIN = 1,
  PIN = 2,
}

export enum QuestionShow {
  SHOW = 1,
  HIDE = 2,
}

@Entity('question')
export class Question extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'invite_user_id', type: 'text', nullable: true })
  inviteUserId: string;

  @Column({ name: 'last_edit_user_id', default: '0' })
  lastEditUserId: string;

  @Column({ length: 150, default: '' })
  title: string;

  @Column({ name: 'original_text', type: 'mediumtext' })
  originalText: string;

  @Column({ name: 'parsed_text', type: 'mediumtext' })
  parsedText: string;

  @Column({ type: 'int', default: QuestionPin.UNPIN })
  pin: QuestionPin;

  @Column({ type: 'int', default: QuestionShow.SHOW })
  show: QuestionShow;

  @Column({ type: 'int', default: QuestionStatus.AVAILABLE })
  status: QuestionStatus;

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @Column({ name: 'unique_view_count', type: 'int', default: 0 })
  uniqueViewCount: number;

  @Column({ name: 'vote_count', type: 'int', default: 0 })
  voteCount: number;

  @Column({ name: 'answer_count', type: 'int', default: 0 })
  answerCount: number;

  @Column({ name: 'hot_score', type: 'int', default: 0 })
  hotScore: number;

  @Column({ name: 'collection_count', type: 'int', default: 0 })
  collectionCount: number;

  @Column({ name: 'follow_count', type: 'int', default: 0 })
  followCount: number;

  @Column({ name: 'accepted_answer_id', default: '0' })
  acceptedAnswerId: string;

  @Column({ name: 'last_answer_id', default: '0' })
  lastAnswerId: string;

  @Column({ name: 'post_update_time', type: 'timestamp', nullable: true })
  postUpdateTime: Date;

  @Column({ name: 'revision_id', default: '0' })
  revisionId: string;

  @Column({ name: 'linked_count', type: 'int', default: 0 })
  linkedCount: number;
} 