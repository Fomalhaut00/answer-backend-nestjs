import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserRoleRelController } from './user_role_rel_controller'; // 已移除，功能整合到AdminController
import { UserRoleRelService } from './user_role_rel_service';
import { UserRoleRel } from '../../entities//user-role-rel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoleRel])],
  controllers: [], // 移除独立的controller，功能已整合到AdminController
  providers: [UserRoleRelService],
  exports: [UserRoleRelService],
})
export class UserRoleRelModule {}