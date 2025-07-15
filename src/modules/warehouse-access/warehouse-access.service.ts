import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { WarehouseAccess } from 'src/entities/warehouse-access/warehouse-access';
import { Employee } from 'src/entities/employee/employee';
import { Warehouse } from 'src/entities/warehouse/warehouse';
import { CreateWarehouseAccessDto } from './dto/create-warehouse-access.dto';
import { UpdateWarehouseAccessDto } from './dto/update-warehouse-access.dto';
import { SearchWarehouseAccessDto } from './dto/search-warehouse-access.dto';

@Injectable()
export class WarehouseAccessService {
  constructor(
    @InjectRepository(WarehouseAccess)
    private readonly warehouseAccessRepository: Repository<WarehouseAccess>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(
    createWarehouseAccessDto: CreateWarehouseAccessDto,
  ): Promise<WarehouseAccess> {
    const existingEmployee = await this.employeeRepository.findOne({
      where: { id: createWarehouseAccessDto.employeeId },
    });
    if (!existingEmployee) {
      throw new BadRequestException(
        `Zaposlenik s ID-em ${createWarehouseAccessDto.employeeId} nije pronađen.`,
      );
    }

    const existingWarehouse = await this.warehouseRepository.findOne({
      where: { id: createWarehouseAccessDto.warehouseId },
    });
    if (!existingWarehouse) {
      throw new BadRequestException(
        `Skladište s ID-em ${createWarehouseAccessDto.warehouseId} nije pronađeno.`,
      );
    }

    const existingAccess = await this.warehouseAccessRepository.findOne({
      where: {
        employeeId: createWarehouseAccessDto.employeeId,
        warehouseId: createWarehouseAccessDto.warehouseId,
      },
    });
    if (existingAccess) {
      throw new ConflictException(
        `Pristup za Zaposlenika ID ${createWarehouseAccessDto.employeeId} u Skladištu ID ${createWarehouseAccessDto.warehouseId} već postoji.`,
      );
    }

    const newWarehouseAccess = this.warehouseAccessRepository.create({
      ...createWarehouseAccessDto,
    });

    return this.warehouseAccessRepository.save(newWarehouseAccess);
  }
}
