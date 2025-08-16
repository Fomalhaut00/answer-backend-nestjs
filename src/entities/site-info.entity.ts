import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('site_info')
export class SiteInfo {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'type', type: 'varchar', length: 64, comment: 'site info type' })
  type: string;

  @Column({ name: 'content', type: 'text', comment: 'site info content' })
  content: string;

  @Column({ name: 'status', type: 'int', default: 1, comment: 'site info status: 1=normal, 2=deleted' })
  status: number;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;
}
