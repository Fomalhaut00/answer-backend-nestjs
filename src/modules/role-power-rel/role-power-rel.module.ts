import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePowerRel } from '../../entities/role-power-rel.entity';
import { Role } from '../../entities/role.entity';
import { Power } from '../../entities/power.entity';
import { UserRoleRel } from '../../entities/user-role-rel.entity';
import { RolePowerRelService } from './role-power-rel.service';
import { RolePowerRelController } from './role-power-rel.controller';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolePowerRel, Role, Power, UserRoleRel]),
    RoleModule
  ],
  providers: [RolePowerRelService],
  controllers: [RolePowerRelController],
  exports: [RolePowerRelService],
})
export class RolePowerRelModule {}
