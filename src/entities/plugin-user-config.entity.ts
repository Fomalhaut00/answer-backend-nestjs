import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('plugin_user_config')
export class PluginUserConfig {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'user_id', type: 'int', comment: 'user id' })
  userId: string;

  @Column({ name: 'plugin_slug_name', type: 'varchar', length: 128, comment: 'plugin slug name' })
  pluginSlugName: string;

  @Column({ name: 'config_key', type: 'varchar', length: 128, comment: 'config key' })
  configKey: string;

  @Column({ name: 'config_value', type: 'text', comment: 'config value' })
  configValue: string;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
