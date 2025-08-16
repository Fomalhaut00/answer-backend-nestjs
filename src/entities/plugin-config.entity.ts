import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('plugin_config')
export class PluginConfig {
  @PrimaryGeneratedColumn('increment')
  id: string;

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
}
