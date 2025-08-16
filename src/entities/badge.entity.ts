import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('badge')
export class Badge {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255, comment: 'badge name' })
  name: string;

  @Column({ name: 'description', type: 'text', comment: 'badge description' })
  description: string;

  @Column({ name: 'award_count', type: 'int', default: 0, comment: 'award count' })
  awardCount: number;

  @Column({ name: 'icon', type: 'varchar', length: 255, comment: 'badge icon' })
  icon: string;

  @Column({ name: 'status', type: 'int', default: 1, comment: 'badge status: 1=active, 2=inactive' })
  status: number;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;
}
