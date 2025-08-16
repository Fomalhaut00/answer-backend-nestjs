import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('badge_group')
export class BadgeGroup {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255, comment: 'badge group name' })
  name: string;

  @Column({ name: 'max', type: 'int', default: 1, comment: 'max badges in group' })
  max: number;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;
}
