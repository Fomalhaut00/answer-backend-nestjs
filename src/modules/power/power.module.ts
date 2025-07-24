import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PowerService } from './power.service';
import { PowerController } from './power.controller';
import { Power } from '../../entities/power.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Power])],
  controllers: [PowerController],
  providers: [PowerService],
  exports: [PowerService], // Export service for use in other modules
})
export class PowerModule {}