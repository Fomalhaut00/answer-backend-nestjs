import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { UserRoleRelService } from './user_role_rel_service';
import { CreateUserRoleRelDto, UpdateUserRoleRelDto, QueryUserRoleRelDto, SaveUserRoleRelDto } from './dto/user_role_rel_dto';

@Controller('user-role-rel')
export class UserRoleRelController {
  constructor(private readonly userRoleRelService: UserRoleRelService) {}

  // SaveUserRoleRel方法添加保存接口
  @Post('save')
  @HttpCode(HttpStatus.OK)
  async saveUserRoleRel(@Body() saveUserRoleRelDto: SaveUserRoleRelDto) {
    return await this.userRoleRelService.saveUserRoleRel(
      saveUserRoleRelDto.userId,
      saveUserRoleRelDto.roleId
    );
  }

  // GetUserRoleRelList方法添加批量获取接口
  @Post('list-by-user-ids')
  @HttpCode(HttpStatus.OK)
  async getUserRoleRelList(@Body() body: { userIds: string[] }) {
    return await this.userRoleRelService.getUserRoleRelList(body.userIds);
  }

  // GetUserRoleRelListByRoleID方法添加按角色ID批量获取接口
  @Post('list-by-role-ids')
  @HttpCode(HttpStatus.OK)
  async getUserRoleRelListByRoleId(@Body() body: { roleIds: number[] }) {
    return await this.userRoleRelService.getUserRoleRelListByRoleId(body.roleIds);
  }

  // GetUserRoleRel方法添加单个用户角色关系获取接口
  @Get('user-role/:userId')
  async getUserRoleRel(@Param('userId') userId: string) {
    return await this.userRoleRelService.getUserRoleRel(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserRoleRelDto: CreateUserRoleRelDto) {
    return await this.userRoleRelService.create(createUserRoleRelDto);
  }

  @Get()
  async findAll(@Query() query: QueryUserRoleRelDto) {
    return await this.userRoleRelService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.userRoleRelService.findOne(id);
  }

  // 修改为支持字符串类型的userId
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return await this.userRoleRelService.findByUserId(userId);
  }

  @Get('role/:roleId')
  async findByRoleId(@Param('roleId') roleId: number) {
    return await this.userRoleRelService.findByRoleId(roleId);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserRoleRelDto: UpdateUserRoleRelDto) {
    return await this.userRoleRelService.update(id, updateUserRoleRelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    return await this.userRoleRelService.remove(id);
  }

  // 修改为支持字符串类型的userId
  @Delete('user/:userId/role/:roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeUserRole(@Param('userId') userId: string, @Param('roleId') roleId: number) {
    return await this.userRoleRelService.removeUserRole(userId, roleId);
  }

  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  async createBatch(@Body() createUserRoleRelDtos: CreateUserRoleRelDto[]) {
    return await this.userRoleRelService.createBatch(createUserRoleRelDtos);
  }

  @Delete('batch')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeBatch(@Body() ids: number[]) {
    return await this.userRoleRelService.removeBatch(ids);
  }

  // 修改为支持字符串类型的userId
  @Get('user/:userId/roles')
  async getUserRoles(@Param('userId') userId: string) {
    return await this.userRoleRelService.getUserRoles(userId);
  }

  @Get('role/:roleId/users')
  async getRoleUsers(@Param('roleId') roleId: number) {
    return await this.userRoleRelService.getRoleUsers(roleId);
  }
}