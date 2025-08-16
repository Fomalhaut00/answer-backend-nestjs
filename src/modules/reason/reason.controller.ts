import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ReasonService } from './reason.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { RequireRoles } from '../../decorators/roles.decorator';
import { Public } from '../../decorators/public.decorator';
import { 
  CreateReasonDto, 
  UpdateReasonDto, 
  ReasonPageDto 
} from './dto/reason.dto';

@Controller('reason')
export class ReasonController {
  constructor(private readonly reasonService: ReasonService) {}

  // 获取原因列表 - 公开接口
  @Public()
  @Get('list')
  async getReasonList(@Query('object_type') objectType: string) {
    return this.reasonService.getReasonList(objectType);
  }

  // 获取原因分页 - 管理员接口
  @Get('page')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin')
  async getReasonPage(@Query() query: ReasonPageDto) {
    return this.reasonService.getReasonPage(query);
  }

  // 创建原因 - 管理员接口
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin')
  async createReason(@Body() createDto: CreateReasonDto) {
    return this.reasonService.createReason(createDto);
  }

  // 获取原因详情 - 管理员接口
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin')
  async getReasonDetail(@Param('id') id: string) {
    return this.reasonService.getReasonDetail(id);
  }

  // 更新原因 - 管理员接口
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin')
  async updateReason(@Param('id') id: string, @Body() updateDto: UpdateReasonDto) {
    return this.reasonService.updateReason(id, updateDto);
  }

  // 删除原因 - 管理员接口
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin')
  async deleteReason(@Param('id') id: string) {
    return this.reasonService.deleteReason(id);
  }
}
