import {
  Controller,
  Post,
  Body,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

/**
 * 上传控制器
 * 对应Go项目中的文件上传功能
 */
@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // ========== 需要认证的路由 (RegisterAnswerAPIRouter) ==========
  
  @Post('file')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(req.user.sub, file);
  }

  @Post('post/render')
  @HttpCode(HttpStatus.OK)
  async postRender(@Request() req, @Body() body: { content: string }) {
    return this.uploadService.postRender(req.user.sub, body.content);
  }
}
