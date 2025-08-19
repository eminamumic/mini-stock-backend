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

  async getAllWarehouses(): Promise<Warehouse[]> {
    return this.warehouseRepository.find({
      relations: ['location', 'warehouseType'],
    });
  }

  async getWarehouseById(id: number): Promise<Warehouse | null> {
    return this.warehouseRepository.findOne({
      where: { id },
      relations: ['location', 'warehouseType'],
    });
  }

  async search(searchCriteria: SearchWarehouseDto): Promise<Warehouse[]> {
    const whereClause: FindOptionsWhere<Warehouse> = {};

    if (searchCriteria.id) {
      whereClause.id = parseInt(searchCriteria.id, 10);
    }
    if (searchCriteria.name) {
      whereClause.name = Like(`%${searchCriteria.name}%`);
    }
    if (searchCriteria.locationId) {
      whereClause.locationId = parseInt(searchCriteria.locationId, 10);
    }
    if (searchCriteria.warehouseTypeId) {
      whereClause.warehouseTypeId = parseInt(
        searchCriteria.warehouseTypeId,
        10,
      );
    }
    if (searchCriteria.createdAt) {
      whereClause.createdAt = new Date(searchCriteria.createdAt);
    }
    if (searchCriteria.isActive !== undefined) {
      whereClause.isActive =
        String(searchCriteria.isActive).toLowerCase() === 'true';
    }

    return this.warehouseRepository.find({
      where: whereClause,
      relations: ['location', 'warehouseType'],
    });
  }

  async update(
    id: number,
    updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<Warehouse | null> {
    const warehouseToUpdate = await this.warehouseRepository.findOne({
      where: { id },
    });

    if (!warehouseToUpdate) {
      return null;
    }

    if (
      updateWarehouseDto.name &&
      updateWarehouseDto.name !== warehouseToUpdate.name
    ) {
      const existingWarehouseByName = await this.warehouseRepository.findOne({
        where: { name: updateWarehouseDto.name },
      });
      if (existingWarehouseByName && existingWarehouseByName.id !== id) {
        throw new ConflictException(
          `Skladište s imenom '${updateWarehouseDto.name}' već postoji.`,
        );
      }
    }

    if (
      updateWarehouseDto.locationId !== undefined &&
      updateWarehouseDto.locationId !== null &&
      updateWarehouseDto.locationId !== warehouseToUpdate.locationId
    ) {
      const existingLocation = await this.locationRepository.findOne({
        where: { id: updateWarehouseDto.locationId },
      });
      if (!existingLocation) {
        throw new BadRequestException(
          `Lokacija s ID-em ${updateWarehouseDto.locationId} nije pronađena.`,
        );
      }
    }

    if (
      updateWarehouseDto.warehouseTypeId !== undefined &&
      updateWarehouseDto.warehouseTypeId !== null &&
      updateWarehouseDto.warehouseTypeId !== warehouseToUpdate.warehouseTypeId
    ) {
      const existingWarehouseType = await this.warehouseTypeRepository.findOne({
        where: { id: updateWarehouseDto.warehouseTypeId },
      });
      if (!existingWarehouseType) {
        throw new BadRequestException(
          `Tip skladišta s ID-em ${updateWarehouseDto.warehouseTypeId} nije pronađen.`,
        );
      }
    }

    this.warehouseRepository.merge(warehouseToUpdate, {
      ...updateWarehouseDto,
    });

    return this.warehouseRepository.save(warehouseToUpdate);
  }

  async delete(id: number): Promise<boolean> {
    const deleteResult = await this.warehouseRepository.delete(id);
    return deleteResult.affected !== 0;
  }

  async getDistinctLocations(): Promise<Location[]> {
    const warehouses = await this.warehouseRepository.find({
      relations: ['location'],
    });
    const uniqueLocations = Array.from(
      new Set(warehouses.map((w) => w.locationId)),
    )
      .map((id) => warehouses.find((w) => w.locationId === id)?.location)
      .filter((location) => location !== undefined);
    return uniqueLocations;
  }

  async getDistinctWarehouseTypes(): Promise<WarehouseType[]> {
    const warehouses = await this.warehouseRepository.find({
      relations: ['warehouseType'],
    });
    const uniqueWarehouseTypes = Array.from(
      new Set(warehouses.map((w) => w.warehouseTypeId)),
    )
      .map(
        (id) => warehouses.find((w) => w.warehouseTypeId === id)?.warehouseType,
      )
      .filter((type) => type !== undefined);
    return uniqueWarehouseTypes;
  }

  async getDistinctIsActive(): Promise<boolean[]> {
    const warehouses = await this.warehouseRepository.find({
      select: ['isActive'],
    });
    const uniqueStatuses = Array.from(
      new Set(warehouses.map((w) => w.isActive)),
    );
    return uniqueStatuses;
  }
}
