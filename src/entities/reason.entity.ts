import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('reason')
export class Reason {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'reason_type', type: 'varchar', length: 100, comment: 'reason type: report, close, flag' })
  reasonType: string;

  @Column({ name: 'title', type: 'varchar', length: 200, comment: 'reason title' })
  title: string;

  @Column({ name: 'content', type: 'text', nullable: true, comment: 'reason content' })
  content?: string;

  @Column({ name: 'object_type', type: 'varchar', length: 100, comment: 'object type: question, answer, comment, user' })
  objectType: string;

  @Column({ name: 'status', type: 'int', default: 1, comment: 'status: 1=active, 2=inactive' })
  status: number;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;
}
