import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { UserRoleRel } from '../../entities/user-role-rel.entity';
import { RolePowerRel } from '../../entities/role-power-rel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserRoleRel, RolePowerRel])],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
