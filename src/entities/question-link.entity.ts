import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity('question_link')
export class QuestionLink {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'question_id', type: 'int', comment: 'question id' })
  questionId: string;

  @Column({ name: 'linked_question_id', type: 'int', comment: 'linked question id' })
  linkedQuestionId: string;

  @Column({ name: 'link_type', type: 'varchar', length: 50, comment: 'link type: duplicate, related' })
  linkType: string;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'linked_question_id' })
  linkedQuestion: Question;
}
