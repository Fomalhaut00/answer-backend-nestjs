import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TagStatus {
  AVAILABLE = 1,
  DELETED = 10,
}

@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'user_id', type: 'int' })
  userId: string;

  @Column({ name: 'slug_name', type: 'varchar', length: 35, unique: true })
  slugName: string;

  @Column({ name: 'display_name', type: 'varchar', length: 35 })
  displayName: string;

  @Column({ name: 'original_text', type: 'text' })
  originalText: string;

  @Column({ name: 'parsed_text', type: 'text' })
  parsedText: string;

  @Column({ name: 'follow_count', type: 'int', default: 0 })
  followCount: number;

  @Column({ name: 'question_count', type: 'int', default: 0 })
  questionCount: number;

  @Column({ type: 'int', default: TagStatus.AVAILABLE })
  status: TagStatus;

  @Column({ name: 'recommend', type: 'boolean', default: false })
  recommend: boolean;

  @Column({ name: 'reserved', type: 'boolean', default: false })
  reserved: boolean;

  @Column({ name: 'revision_id', type: 'int', default: 0 })
  revisionId: number;
}
