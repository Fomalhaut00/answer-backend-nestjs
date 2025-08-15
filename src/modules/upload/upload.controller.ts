import { 
  Controller, 
  Post, 
  Body, 
  Request, 
  UseGuards, 
  UseInterceptors, 
  UploadedFile,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { PostRenderDto } from './dto/upload.dto';

@Controller('file')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // 文件上传
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.uploadService.uploadFile(file, req.user.sub);
  }
}

@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly uploadService: UploadService) {}

  // 内容渲染
  @Post('render')
  @HttpCode(HttpStatus.OK)
  async postRender(@Body() postRenderDto: PostRenderDto, @Request() req) {
    return this.uploadService.postRender(postRenderDto, req.user.sub);
  }
}
