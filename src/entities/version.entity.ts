import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('version')
export class Version {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'version_number', type: 'int', comment: 'version number' })
  versionNumber: number;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;
}
