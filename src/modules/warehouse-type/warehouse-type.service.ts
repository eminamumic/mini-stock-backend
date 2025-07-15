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

  async getAllWarehouseTypes(): Promise<WarehouseType[]> {
    return this.warehouseTypeRepository.find();
  }

  async getWarehouseTypeById(id: number): Promise<WarehouseType | null> {
    return this.warehouseTypeRepository.findOne({ where: { id } });
  }

  async search(
    searchCriteria: SearchWarehouseTypeDto,
  ): Promise<WarehouseType[]> {
    const whereClause: FindOptionsWhere<WarehouseType> = {};

    if (searchCriteria.id) {
      whereClause.id = parseInt(searchCriteria.id, 10);
    }
    if (searchCriteria.typeName) {
      whereClause.typeName = Like(`%${searchCriteria.typeName}%`);
    }
    if (searchCriteria.description) {
      whereClause.description = Like(`%${searchCriteria.description}%`);
    }
    if (searchCriteria.requiresTempControl !== undefined) {
      whereClause.requiresTempControl =
        String(searchCriteria.requiresTempControl).toLowerCase() === 'true';
    }
    if (searchCriteria.minTemperatureC) {
      whereClause.minTemperatureC = parseFloat(searchCriteria.minTemperatureC);
    }
    if (searchCriteria.maxTemperatureC) {
      whereClause.maxTemperatureC = parseFloat(searchCriteria.maxTemperatureC);
    }

    return this.warehouseTypeRepository.find({
      where: whereClause,
    });
  }

  async update(
    id: number,
    updateWarehouseTypeDto: UpdateWarehouseTypeDto,
  ): Promise<WarehouseType | null> {
    const warehouseTypeToUpdate = await this.warehouseTypeRepository.findOne({
      where: { id },
    });

    if (!warehouseTypeToUpdate) {
      return null;
    }

    if (
      updateWarehouseTypeDto.typeName &&
      updateWarehouseTypeDto.typeName !== warehouseTypeToUpdate.typeName
    ) {
      const existingTypeByName = await this.warehouseTypeRepository.findOne({
        where: { typeName: updateWarehouseTypeDto.typeName },
      });
      if (existingTypeByName && existingTypeByName.id !== id) {
        throw new ConflictException(
          `Warehouse type with name '${updateWarehouseTypeDto.typeName}' already exists.`,
        );
      }
    }

    this.warehouseTypeRepository.merge(warehouseTypeToUpdate, {
      ...updateWarehouseTypeDto,
    });

    return this.warehouseTypeRepository.save(warehouseTypeToUpdate);
  }

  async delete(id: number): Promise<boolean> {
    const deleteResult = await this.warehouseTypeRepository.delete(id);
    return deleteResult.affected !== 0;
  }
}
