import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TagRelStatus {
  AVAILABLE = 1,
  DELETED = 10,
}

@Entity('tag_rel')
export class TagRel {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'object_id', type: 'int' })
  objectId: string;

  @Column({ name: 'tag_id', type: 'int' })
  tagId: string;

  @Column({ type: 'int', default: TagRelStatus.AVAILABLE })
  status: TagRelStatus;
}
