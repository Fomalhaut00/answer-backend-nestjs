import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Question } from '../../entities/question.entity';
import { Answer } from '../../entities/answer.entity';
import { Comment } from '../../entities/comment.entity';
import { Vote } from '../../entities/vote.entity';
import { Role } from '../../entities/role.entity';
import { UserRoleRel } from '../../entities/user-role-rel.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Question, Answer, Comment, Vote, Role, UserRoleRel]),
    RoleModule
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
