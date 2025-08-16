import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('uniqid')
export class Uniqid {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'uniqid_type', type: 'int', comment: 'uniqid type' })
  uniqidType: number;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;
}
