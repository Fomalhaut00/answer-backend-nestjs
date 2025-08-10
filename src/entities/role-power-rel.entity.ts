import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';
import { Power } from './power.entity';

@Entity('role_power_rel')
export class RolePowerRel {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'role_id', type: 'int' })
  roleId: number;

  @Column({ name: 'power_type', type: 'varchar', length: 200 })
  powerType: string;

  // 关联关系
  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Power, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'power_type', referencedColumnName: 'name' })
  power: Power;
}
