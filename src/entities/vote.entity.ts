import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum VoteType {
  VOTE_UP = 1,
  VOTE_DOWN = -1,
}

@Entity('vote')
export class Vote {
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

  @Column({ name: 'vote_type', type: 'int' })
  voteType: VoteType;

  @Column({ name: 'object_type', type: 'varchar', length: 100 })
  objectType: string; // 'question', 'answer', 'comment'
}
