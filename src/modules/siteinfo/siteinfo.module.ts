import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteInfoController, AdminSiteInfoController, AdminSettingController } from './siteinfo.controller';
import { SiteInfoService } from './siteinfo.service';
import { Config } from '../../entities/config.entity';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([Config]), RoleModule],
  controllers: [SiteInfoController, AdminSiteInfoController, AdminSettingController],
  providers: [SiteInfoService],
  exports: [SiteInfoService],
})
export class SiteInfoModule {}
