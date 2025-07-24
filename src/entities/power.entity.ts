import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('power')
export class Power {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ length: 50, default: '' })
  name: string;

  @Column({ name: 'power_type', length: 100, default: '' })
  powerType: string;

  @Column({ length: 200, default: '' })
  description: string;
}