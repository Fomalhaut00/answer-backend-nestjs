import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserRoleRel } from './user-role-rel.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn('increment', { type: 'int'})
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 200 })
  description: string;

  @OneToMany(() => UserRoleRel, userRoleRel => userRoleRel.role)
  userRoleRels: UserRoleRel[];
}