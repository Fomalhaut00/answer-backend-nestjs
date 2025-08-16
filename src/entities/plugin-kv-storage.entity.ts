import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('plugin_kv_storage')
export class PluginKVStorage {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ name: 'plugin_slug_name', type: 'varchar', length: 128, comment: 'plugin slug name' })
  pluginSlugName: string;

  @Column({ name: 'key', type: 'varchar', length: 128, comment: 'storage key' })
  key: string;

  @Column({ name: 'value', type: 'text', comment: 'storage value' })
  value: string;

  @CreateDateColumn({ name: 'created_at', comment: 'create time' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: 'update time' })
  updatedAt: Date;
}
