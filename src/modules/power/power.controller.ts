import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe
} from '@nestjs/common';
import { PowerService } from './power.service';
import { Power } from '../../entities/power.entity';
import { CreatePowerDto, UpdatePowerDto, QueryPowerDto } from './dto/power.dto';

@Controller('power')
export class PowerController {
  constructor(private readonly powerService: PowerService) {}

  @Get()
  async findAll(@Query() query: QueryPowerDto): Promise<Power[]> {
    if (Object.keys(query).length === 0) {
      return this.powerService.findAll();
    }
    return this.powerService.getPowerList(query);
  }

  @Get('type/:powerType')
  async findByPowerType(@Param('powerType') powerType: string): Promise<Power[]> {
    return this.powerService.findByPowerType(powerType);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Power> {
    return this.powerService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPowerDto: CreatePowerDto): Promise<Power> {
    return this.powerService.create(createPowerDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePowerDto: UpdatePowerDto,
  ): Promise<Power> {
    return this.powerService.update(id, updatePowerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.powerService.remove(id);
  }
}