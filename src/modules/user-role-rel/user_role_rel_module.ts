import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleRelController } from './user_role_rel_controller';
import { UserRoleRelService } from './user_role_rel_service';
import { UserRoleRel } from '../../entities//user-role-rel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoleRel])],
  controllers: [UserRoleRelController],
  providers: [UserRoleRelService],
  exports: [UserRoleRelService],
})
export class UserRoleRelModule {}