import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReasonController } from './reason.controller';
import { ReasonService } from './reason.service';
import { Reason } from '../../entities/reason.entity';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reason]),
    RoleModule
  ],
  controllers: [ReasonController],
  providers: [ReasonService],
  exports: [ReasonService],
})
export class ReasonModule {}
