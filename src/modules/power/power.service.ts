import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Power } from '../../entities/power.entity';
import { CreatePowerDto, UpdatePowerDto, QueryPowerDto } from './dto/power.dto';

@Injectable()
export class PowerService {
  constructor(
    @InjectRepository(Power)
    private readonly powerRepository: Repository<Power>,
  ) {}

  /**
   * Get power list based on query parameters
   * This corresponds to the GetPowerList method in the Go code
   */
  async getPowerList(query?: QueryPowerDto): Promise<Power[]> {
    try {
      const where: FindOptionsWhere<Power> = {};
      
      if (query) {
        if (query.name) {
          where.name = Like(`%${query.name}%`);
        }
        if (query.powerType) {
          where.powerType = Like(`%${query.powerType}%`);
        }
        if (query.description) {
          where.description = Like(`%${query.description}%`);
        }
      }

      const powerList = await this.powerRepository.find({
        where,
        order: { id: 'ASC' },
      });

      return powerList;
    } catch (error) {
      throw new InternalServerErrorException('Database error occurred while fetching power list', error.message);
    }
  }

  /**
   * Get all powers
   */
  async findAll(): Promise<Power[]> {
    try {
      return await this.powerRepository.find({
        order: { id: 'ASC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Database error occurred while fetching all powers', error.message);
    }
  }

  /**
   * Get power by ID
   */
  async findOne(id: number): Promise<Power> {
    try {
      const power = await this.powerRepository.findOne({ where: { id } });
      if (!power) {
        throw new NotFoundException(`Power with ID ${id} not found`);
      }
      return power;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Database error occurred while fetching power', error.message);
    }
  }

  /**
   * Get powers by power type
   */
  async findByPowerType(powerType: string): Promise<Power[]> {
    try {
      return await this.powerRepository.find({
        where: { powerType },
        order: { id: 'ASC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Database error occurred while fetching powers by type', error.message);
    }
  }

  /**
   * Create new power
   */
  async create(createPowerDto: CreatePowerDto): Promise<Power> {
    try {
      const power = this.powerRepository.create(createPowerDto);
      return await this.powerRepository.save(power);
    } catch (error) {
      throw new InternalServerErrorException('Database error occurred while creating power', error.message);
    }
  }

  /**
   * Update power
   */
  async update(id: number, updatePowerDto: UpdatePowerDto): Promise<Power> {
    try {
      const power = await this.findOne(id);
      Object.assign(power, updatePowerDto);
      return await this.powerRepository.save(power);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Database error occurred while updating power', error.message);
    }
  }

  /**
   * Delete power
   */
  async remove(id: number): Promise<void> {
    try {
      const power = await this.findOne(id);
      await this.powerRepository.remove(power);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Database error occurred while deleting power', error.message);
    }
  }
}