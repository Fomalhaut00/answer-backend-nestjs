import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum CommentStatus {
  AVAILABLE = 1,
  DELETED = 10,
}

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'user_id', type: 'int' })
  userId: string;

  @Column({ name: 'reply_user_id', type: 'int', default: 0 })
  replyUserId: string;

  @Column({ name: 'object_id', type: 'int' })
  objectId: string;

  @Column({ name: 'question_id', type: 'int' })
  questionId: string;

  @Column({ name: 'vote_count', type: 'int', default: 0 })
  voteCount: number;

  @Column({ type: 'int', default: CommentStatus.AVAILABLE })
  status: CommentStatus;

  @Column({ name: 'original_text', type: 'text' })
  originalText: string;

  @Column({ name: 'parsed_text', type: 'text' })
  parsedText: string;
}
