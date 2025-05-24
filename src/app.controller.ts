import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-db')
  async testDatabase() {
    try {
      // 测试数据库连接
      const result = await this.dataSource.query('SELECT NOW()');
      return {
        status: 'success',
        connected: true,
        timestamp: result[0].now,
        message: '数据库连接成功！'
      };
    } catch (error) {
      return {
        status: 'error',
        connected: false,
        message: '数据库连接失败：' + error.message
      };
    }
  }
}
