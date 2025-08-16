import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_external_login')
export class UserExternalLogin {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'user_id', type: 'int', comment: 'user id' })
  userId: string;

  @Column({ name: 'provider', type: 'varchar', length: 100, comment: 'external login provider' })
  provider: string;

  @Column({ name: 'external_id', type: 'varchar', length: 128, comment: 'external user id' })
  externalId: string;

  @Column({ name: 'union_id', type: 'varchar', length: 128, nullable: true, comment: 'union id' })
  unionId?: string;

  @Column({ name: 'meta_info', type: 'text', nullable: true, comment: 'meta info' })
  metaInfo?: string;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
