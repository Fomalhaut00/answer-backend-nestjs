import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity('user_role_rel')
export class UserRoleRel {
  @PrimaryGeneratedColumn('increment', { type: 'int'})
  id: number;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;

  @Column({ name: 'user_id', type: 'int', default: 0, comment: 'user id' })
  userId: string;

  @Column({ name: 'role_id', type: 'int', default: 0, comment: 'role id' })
  roleId: number;

  // 关联关系
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, { eager: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}