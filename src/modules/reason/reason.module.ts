import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReasonController } from './reason.controller';
import { ReasonService } from './reason.service';
import { Config } from '../../entities/config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Config])
  ],
  controllers: [ReasonController],
  providers: [ReasonService],
  exports: [ReasonService],
})
export class ReasonModule {}
