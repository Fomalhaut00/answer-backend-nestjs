import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('meta')
export class Meta {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'object_id', type: 'int', comment: 'object id' })
  @Index()
  objectId: string;

  @Column({ name: 'key', type: 'varchar', length: 100, comment: 'meta key' })
  key: string;

  @Column({ name: 'value', type: 'text', comment: 'meta value' })
  value: string;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;
}
