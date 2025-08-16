import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('file_record')
export class FileRecord {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'user_id', type: 'int', comment: 'user id' })
  userId: string;

  @Column({ name: 'file_path', type: 'varchar', length: 255, comment: 'file path' })
  filePath: string;

  @Column({ name: 'file_name', type: 'varchar', length: 255, comment: 'file name' })
  fileName: string;

  @Column({ name: 'file_size', type: 'int', comment: 'file size in bytes' })
  fileSize: number;

  @Column({ name: 'file_type', type: 'varchar', length: 100, comment: 'file type' })
  fileType: string;

  @Column({ name: 'object_key', type: 'varchar', length: 255, nullable: true, comment: 'object storage key' })
  objectKey?: string;

  @Column({ name: 'status', type: 'int', default: 1, comment: 'file status: 1=active, 2=deleted' })
  status: number;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
