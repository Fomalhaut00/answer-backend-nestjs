import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { RolePowerRelService } from './role-power-rel.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { RequireRoles } from '../../decorators/roles.decorator';
import { 
  CreateRolePowerRelDto,
  UpdateRolePowerRelDto,
  BatchCreateRolePowerRelDto,
  GetRolePowerListDto,
  GetUserPowerListDto
} from './dto/role-power-rel.dto';

@Controller('role-power-rel')
@UseGuards(JwtAuthGuard, RolesGuard)
@RequireRoles('admin')
export class RolePowerRelController {
  constructor(private readonly rolePowerRelService: RolePowerRelService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRolePowerRelDto: CreateRolePowerRelDto) {
    return this.rolePowerRelService.create(createRolePowerRelDto);
  }

  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  async batchCreate(@Body() batchCreateRolePowerRelDto: BatchCreateRolePowerRelDto) {
    return this.rolePowerRelService.batchCreate(batchCreateRolePowerRelDto);
  }

  @Get()
  async findAll() {
    return this.rolePowerRelService.findAll();
  }

  @Get('role/:roleId')
  async getRolePowerList(@Param('roleId') roleId: number) {
    return this.rolePowerRelService.getRolePowerList(roleId);
  }

  @Get('user/:userId/powers')
  async getUserPowerList(@Param('userId') userId: string) {
    return this.rolePowerRelService.getUserPowerList(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.rolePowerRelService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateRolePowerRelDto: UpdateRolePowerRelDto) {
    return this.rolePowerRelService.update(id, updateRolePowerRelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    return this.rolePowerRelService.remove(id);
  }

  @Delete('role/:roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeByRole(@Param('roleId') roleId: number) {
    return this.rolePowerRelService.removeByRole(roleId);
  }

  @Delete('role/:roleId/power/:powerType')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeByRoleAndPower(@Param('roleId') roleId: number, @Param('powerType') powerType: string) {
    return this.rolePowerRelService.removeByRoleAndPower(roleId, powerType);
  }
}
