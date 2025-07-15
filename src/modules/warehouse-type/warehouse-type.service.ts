import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { WarehouseType } from 'src/entities/warehouse-type/warehouse-type';
import { CreateWarehouseTypeDto } from './dto/create-warehouse-type.dto';
import { UpdateWarehouseTypeDto } from './dto/update-warehouse-type.dto';
import { SearchWarehouseTypeDto } from './dto/search-warehouse-type.dto';

@Injectable()
export class WarehouseTypeService {
  constructor(
    @InjectRepository(WarehouseType)
    private readonly warehouseTypeRepository: Repository<WarehouseType>,
  ) {}

  create(
    createWarehouseTypeDto: CreateWarehouseTypeDto,
  ): Promise<WarehouseType> {
    const newWarehouseType = this.warehouseTypeRepository.create({
      ...createWarehouseTypeDto,
    });
    return this.warehouseTypeRepository.save(newWarehouseType);
  }
}
