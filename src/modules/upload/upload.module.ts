import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController, PostController } from './upload.controller';
import { UploadService } from './upload.service';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
    RoleModule
  ],
  controllers: [UploadController, PostController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
