import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolePageDto, UpdateUserRoleDto } from './dto/role-query.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { AdminGuard } from '../auth/admin.guard';

@Controller('role')
// @UseGuards(JwtAuthGuard, AdminGuard) // 需要管理员权限
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  async findAll(@Query() query?: RolePageDto) {
    if (query && Object.keys(query).length > 0) {
      return this.roleService.getRolePage(query);
    }
    return this.roleService.findAll();
  }

  @Get('list')
  async getRoleList() {
    return this.roleService.getRoleList();
  }

  @Get('mapping')
  async getRoleMapping() {
    return this.roleService.getRoleMapping();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }

  // 用户角色管理接口
  @Put('user/:userId')
  // @UseGuards(JwtAuthGuard, AdminGuard)
  async updateUserRole(
    @Param('userId') userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Request() req
  ) {
    return this.roleService.updateUserRole(userId, updateUserRoleDto, req.user?.sub);
  }

  @Get('user/:userId')
  async getUserRole(@Param('userId') userId: string) {
    return this.roleService.getUserRole(userId);
  }

  @Get('users/by-role/:roleId')
  async getUsersByRole(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.roleService.getUsersByRole(roleId);
  }
}