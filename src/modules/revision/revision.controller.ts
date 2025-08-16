import { Controller, Get, Put, Body, Query, Request, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { RevisionService } from './revision.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { RequireRoles } from '../../decorators/roles.decorator';
import { Public } from '../../decorators/public.decorator';
import { 
  GetRevisionListDto, 
  GetUnreviewedRevisionListDto, 
  RevisionAuditDto,
  CheckCanUpdateRevisionDto 
} from './dto/revision.dto';

@Controller('revisions')
export class RevisionController {
  constructor(private readonly revisionService: RevisionService) {}

  // 获取修订列表 (公开接口)
  @Public()
  @Get()
  async getRevisionList(@Query() getRevisionListDto: GetRevisionListDto) {
    return this.revisionService.getRevisionList(getRevisionListDto);
  }

  // 获取未审核修订列表 (需要认证)
  @Get('unreviewed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'moderator')
  async getUnreviewedRevisionList(@Query() getUnreviewedRevisionListDto: GetUnreviewedRevisionListDto) {
    return this.revisionService.getUnreviewedRevisionList(getUnreviewedRevisionListDto);
  }

  // 审核修订 (管理员)
  @Put('audit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles('admin', 'moderator')
  @HttpCode(HttpStatus.OK)
  async revisionAudit(@Body() revisionAuditDto: RevisionAuditDto, @Request() req) {
    return this.revisionService.revisionAudit(revisionAuditDto, req.user.sub);
  }

  // 检查是否可以更新修订
  @Get('edit/check')
  @UseGuards(JwtAuthGuard)
  async checkCanUpdateRevision(@Query() checkCanUpdateRevisionDto: CheckCanUpdateRevisionDto, @Request() req) {
    return this.revisionService.checkCanUpdateRevision(checkCanUpdateRevisionDto, req.user.sub);
  }

  // 获取审核类型
  @Get('reviewing/type')
  @UseGuards(JwtAuthGuard)
  async getReviewingType() {
    return this.revisionService.getReviewingType();
  }
}
