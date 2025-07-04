import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Warehouse } from 'src/entities/warehouse/warehouse';
import { Location } from 'src/entities/location/location';
import { WarehouseType } from 'src/entities/warehouse-type/warehouse-type';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { SearchWarehouseDto } from './dto/search-warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(WarehouseType)
    private readonly warehouseTypeRepository: Repository<WarehouseType>,
  ) {}

  async create(createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
    const existingWarehouseByName = await this.warehouseRepository.findOne({
      where: { name: createWarehouseDto.name },
    });
    if (existingWarehouseByName) {
      throw new ConflictException(
        `Skladište s imenom '${createWarehouseDto.name}' već postoji.`,
      );
    }

    if (createWarehouseDto.locationId) {
      const existingLocation = await this.locationRepository.findOne({
        where: { id: createWarehouseDto.locationId },
      });
      if (!existingLocation) {
        throw new BadRequestException(
          `Lokacija s ID-em ${createWarehouseDto.locationId} nije pronađena.`,
        );
      }
    }

    if (createWarehouseDto.warehouseTypeId) {
      const existingWarehouseType = await this.warehouseTypeRepository.findOne({
        where: { id: createWarehouseDto.warehouseTypeId },
      });
      if (!existingWarehouseType) {
        throw new BadRequestException(
          `Tip skladišta s ID-em ${createWarehouseDto.warehouseTypeId} nije pronađen.`,
        );
      }
    }

    const newWarehouse = this.warehouseRepository.create({
      ...createWarehouseDto,
    });

    return this.warehouseRepository.save(newWarehouse);
  }
}
