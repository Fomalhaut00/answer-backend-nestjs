import { Injectable } from '@nestjs/common';
import { PostRenderDto } from './dto/upload.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  // 文件上传
  async uploadFile(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // 生成文件名
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}_${userId}${ext}`;
    
    // 这里应该实现实际的文件存储逻辑
    // 可以存储到本地、云存储等
    const uploadPath = path.join(process.cwd(), 'uploads', filename);
    
    // 确保上传目录存在
    const uploadDir = path.dirname(uploadPath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 保存文件
    fs.writeFileSync(uploadPath, file.buffer);

    return {
      message: 'File uploaded successfully',
      file_info: {
        original_name: file.originalname,
        filename: filename,
        size: file.size,
        mimetype: file.mimetype,
        url: `/uploads/${filename}`
      }
    };
  }

  // 内容渲染
  async postRender(postRenderDto: PostRenderDto, userId: string) {
    const { content, type = 'markdown' } = postRenderDto;

    // 这里应该实现内容渲染逻辑
    // 比如Markdown转HTML、内容过滤等
    let renderedContent = content;

    if (type === 'markdown') {
      // 简单的Markdown处理示例
      renderedContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    }

    return {
      content: renderedContent,
      type: type,
      rendered_at: new Date().toISOString()
    };
  }
}
