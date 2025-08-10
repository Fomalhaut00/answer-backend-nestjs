import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AnswerStatus {
  AVAILABLE = 1,
  DELETED = 10,
  PENDING = 11,
}

@Entity('answer')
export class Answer {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'user_id', type: 'int' })
  userId: string;

  @Column({ name: 'question_id', type: 'int' })
  questionId: string;

  @Column({ name: 'last_edit_user_id', type: 'int', default: 0 })
  lastEditUserId: string;

  @Column({ name: 'original_text', type: 'text' })
  originalText: string;

  @Column({ name: 'parsed_text', type: 'text' })
  parsedText: string;

  @Column({ type: 'int', default: AnswerStatus.AVAILABLE })
  status: AnswerStatus;

  @Column({ type: 'int', default: 0 })
  adopted: number;

  @Column({ name: 'comment_count', type: 'int', default: 0 })
  commentCount: number;

  @Column({ name: 'vote_count', type: 'int', default: 0 })
  voteCount: number;

  @Column({ name: 'revision_id', type: 'int', default: 0 })
  revisionId: number;
}
