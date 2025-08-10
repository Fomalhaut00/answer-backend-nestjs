import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from '../../entities/role.entity';
import { User } from '../../entities/user.entity';
import { UserRoleRel } from '../../entities/user-role-rel.entity';
import { RolePowerRel } from '../../entities/role-power-rel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, UserRoleRel, RolePowerRel])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}